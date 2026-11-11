import { useCallback, useEffect, useRef, useState } from 'react'
import Brand from '../components/Brand'
import { ArrowUp, ArrowUpRight, BarChart3, Bell, Building2, Check, ChevronDown, ChevronLeft, ChevronRight, ClipboardList, FileText, Home, Leaf, LogOut, Mail, MessageSquareQuote, Search, Upload, Users } from '../components/icons'
import { seedContent } from '../data/content'
import { supabase } from '../lib/supabase'
import SearchableSelect from '../components/SearchableSelect'
import { useToast } from '../components/ToastProvider'

export default function AdminPage({ content, setContent, goTo }) {
  const { showToast } = useToast()
  const [tab, setTab] = useState('Overview')
  const [draft, setDraft] = useState(content)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [mobileProfileMenuOpen, setMobileProfileMenuOpen] = useState(false)
  const [testimonialTab, setTestimonialTab] = useState('add')
  const [requestSearch, setRequestSearch] = useState('')
  const [confirmAction, setConfirmAction] = useState(null)
  const [requests, setRequests] = useState([])
  const [requestsLoading, setRequestsLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('soiraoya-admin-notifications-read') || '[]')
      return Array.isArray(saved) ? saved : []
    } catch (error) {
      console.error('Could not read notification state', error)
      return []
    }
  })
  const notificationsRef = useRef(null)

  useEffect(() => {
    setDraft(content)
  }, [content])

  const loadRequests = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) throw new Error('Your admin session has expired. Please sign in again.')
      const response = await fetch('/api/admin/requests', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.message || 'Could not load consultation requests.')
      setRequests(result.requests || [])
    } catch (error) {
      console.error('Could not load consultation requests', error)
      showToast(error.message || 'Could not load consultation requests.', 'error')
    } finally {
      setRequestsLoading(false)
    }
  }, [showToast])

  useEffect(() => { void loadRequests() }, [loadRequests])

  const loadNotifications = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) throw new Error('Your admin session has expired. Please sign in again.')
      const response = await fetch('/api/admin/notifications', {
        headers: { Authorization: 'Bearer ' + session.access_token },
      })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.message || 'Could not load dashboard notifications.')
      setNotifications(result.notifications || [])
    } catch (error) {
      console.error('Could not load dashboard notifications', error)
      showToast(error.message || 'Could not load dashboard notifications.', 'error')
    }
  }, [showToast])

  useEffect(() => {
    void loadNotifications()
    const interval = window.setInterval(() => void loadNotifications(), 60000)
    return () => window.clearInterval(interval)
  }, [loadNotifications])

  useEffect(() => {
    if (!notificationsOpen) return undefined
    const closeOnOutsideClick = (event) => {
      if (!notificationsRef.current?.contains(event.target)) setNotificationsOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setNotificationsOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [notificationsOpen])

  const unreadNotifications = notifications.filter((item) => !readNotificationIds.includes(item.id))

  const markNotificationsRead = (ids) => {
    const updated = [...new Set([...readNotificationIds, ...ids])].slice(-500)
    setReadNotificationIds(updated)
    try {
      localStorage.setItem('soiraoya-admin-notifications-read', JSON.stringify(updated))
    } catch (error) {
      console.error('Could not save notification state', error)
      showToast('Notifications were marked read for this session only.', 'error')
    }
  }

  const openNotification = (notification) => {
    markNotificationsRead([notification.id])
    setNotificationsOpen(false)
    if (notification.type === 'testimonial') setTestimonialTab('sent')
    setTab(notification.type === 'request' ? 'Consult requests' : notification.type === 'testimonial' ? 'Testimonials' : 'Newsletter')
    setSidebarExpanded(false)
  }

  const markRequestContacted = async (requestId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) throw new Error('Your admin session has expired. Please sign in again.')
      const response = await fetch('/api/admin/requests', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status: 'contacted' }),
      })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.message || 'Could not update this request.')
      setRequests((current) => current.map((item) => item.id === requestId ? result.request : item))
      void loadNotifications()
      showToast('Request marked as contacted.', 'success')
    } catch (error) {
      console.error('Could not mark request as contacted', error)
      showToast(error.message || 'Could not update this request.', 'error')
    }
  }

  const syncLandingContent = async (nextDraft) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('Your admin session has expired. Please sign in again.')

      const { error } = await supabase.from('site_settings').upsert({
        key: 'landing_content',
        value: nextDraft,
      }, { onConflict: 'key' })
      if (error) throw error
      showToast('Landing page changes saved.', 'success')
    } catch (error) {
      console.error('Failed to sync landing page content', error)
      showToast(error.message || 'Could not save landing page changes.', 'error')
    }
  }

  const persistDraft = (nextDraft) => {
    setDraft(nextDraft)
    setContent(nextDraft)
    localStorage.setItem('soiraoya-content', JSON.stringify(nextDraft))
    void syncLandingContent(nextDraft)
  }

  const save = () => { persistDraft(draft); setTab('Overview') }
  const handleTabSelect = (label) => {
    setTab(label)
    setSidebarExpanded(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      setMobileProfileMenuOpen(false)
      goTo('/login')
    }
  }

  const tabs = [['Overview', ClipboardList], ['Consult requests', MessageSquareQuote], ['Landing page', FileText], ['Testimonials', Users], ['Newsletter', Mail]]
  const openConfirm = (action) => setConfirmAction(action)
  const closeConfirm = () => setConfirmAction(null)
  const completeConfirm = () => {
    confirmAction?.onConfirm?.()
    closeConfirm()
  }

  return <div className="admin-shell">
    <aside className={`admin-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="sidebar-toggle" type="button" onClick={() => setSidebarExpanded((current) => !current)} aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}>
        {sidebarExpanded ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
      </button>
      <Brand admin goTo={goTo} />
      <div className="admin-nav">{tabs.map(([label, Icon]) => <button className={tab === label ? 'active' : ''} onClick={() => handleTabSelect(label)} key={label}>
        <span className="nav-item-icon"><Icon size={17} />{label === 'Consult requests' && requests.filter((item) => item.status === 'new').length > 0 && <b className="nav-count">{requests.filter((item) => item.status === 'new').length}</b>}</span>
        <span>{label}</span>
      </button>)}</div>
      <div className="sidebar-bottom">
        <button type="button" className="sidebar-logout" onClick={handleLogout} aria-label="Logout"><LogOut size={16} /><span>Logout</span></button>
        <div className="profile"><span>OI</span><div><b>Iraoya</b><small>Principal partner</small></div><ChevronDown size={14} /></div>
      </div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar">
        <div className="mobile-admin-brand"><Brand admin mobile goTo={goTo} /></div>
        <div className="admin-breadcrumb">S.O.Iraoya / <b>{tab}</b></div>
        <div className="admin-actions">
          <div className="admin-notifications" ref={notificationsRef}>
            <button type="button" className="notification-trigger" aria-label={`Notifications${unreadNotifications.length ? `, ${unreadNotifications.length} unread` : ''}`} aria-expanded={notificationsOpen} onClick={() => {
              const opening = !notificationsOpen
              setNotificationsOpen(opening)
              if (opening) void loadNotifications()
            }}>
              <Bell size={18} />
              {unreadNotifications.length > 0 && <span className="notification-count">{unreadNotifications.length > 99 ? '99+' : unreadNotifications.length}</span>}
            </button>
            {notificationsOpen && <section className="notification-panel" aria-label="Dashboard notifications">
              <div className="notification-panel-heading">
                <div><strong>Notifications</strong><small>{unreadNotifications.length ? `${unreadNotifications.length} unread` : 'You’re all caught up'}</small></div>
                <div className="notification-panel-actions">
                  <button type="button" onClick={() => void loadNotifications()}>Refresh</button>
                  {unreadNotifications.length > 0 && <button type="button" onClick={() => markNotificationsRead(unreadNotifications.map((item) => item.id))}>Mark all read</button>}
                </div>
              </div>
              <div className="notification-list">
                {notifications.length === 0
                  ? <p className="notification-empty">No recent activity to show.</p>
                  : notifications.map((item) => <button type="button" className={`notification-item ${readNotificationIds.includes(item.id) ? '' : 'unread'}`} key={item.id} onClick={() => openNotification(item)}>
                    <span className={`notification-item-icon ${item.type}`} aria-hidden="true">{item.type === 'request' ? <MessageSquareQuote size={15} /> : item.type === 'testimonial' ? <Users size={15} /> : <Mail size={15} />}</span>
                    <span className="notification-item-copy"><strong>{item.title}</strong><small>{item.detail}</small><time dateTime={item.createdAt}>{formatNotificationDate(item.createdAt)}</time></span>
                    {!readNotificationIds.includes(item.id) && <span className="notification-unread-dot" aria-label="Unread" />}
                  </button>)}
              </div>
            </section>}
          </div>
          <div className="mobile-profile-menu-wrap">
            <button type="button" className="avatar mobile-user-trigger" aria-label="User menu" onClick={() => setMobileProfileMenuOpen((current) => !current)}><span>OI</span><ChevronDown size={11} /></button>
            {mobileProfileMenuOpen && <div className="profile-dropdown mobile-dropdown"><div className="mobile-profile-summary"><span className="profile-badge">OI</span><div><b>Iraoya</b><small>Principal partner</small></div></div><button type="button" onClick={handleLogout}>Logout</button></div>}
          </div>
        </div>
      </header>
      {tab === 'Overview' && <Overview setTab={setTab} requests={requests} requestsLoading={requestsLoading} markRequestContacted={markRequestContacted} />}
      {tab === 'Consult requests' && <Requests requests={requests} requestsLoading={requestsLoading} requestSearch={requestSearch} setRequestSearch={setRequestSearch} markRequestContacted={markRequestContacted} refreshRequests={loadRequests} />}
      {tab === 'Landing page' && <LandingEditor draft={draft} setDraft={setDraft} save={save} persistDraft={persistDraft} openConfirm={openConfirm} />}
      {tab === 'Testimonials' && <Testimonials key={testimonialTab} draft={draft} persistDraft={persistDraft} openConfirm={openConfirm} initialTab={testimonialTab} />}
      {tab === 'Newsletter' && <NewsletterPanel />}
    </main>
    <nav className="mobile-admin-tabs" aria-label="Admin navigation">{tabs.map(([label, Icon]) => {
      const mobileLabel = ({ Overview: 'Home', 'Consult requests': 'Requests', 'Landing page': 'Site', Testimonials: 'Reviews', Newsletter: 'News' })[label]
      return <button type="button" aria-label={label} title={label} aria-current={tab === label ? 'page' : undefined} onClick={() => handleTabSelect(label)} key={label}>
        <Icon size={16} />
        <span className="mobile-admin-tab-label">{mobileLabel}</span>
      </button>
    })}</nav>
    <ConfirmDialog action={confirmAction} onCancel={closeConfirm} onConfirm={completeConfirm} />
  </div>
}

const blankCampaign = () => ({ subject: '', previewText: '', body: '', scheduledAt: '', imageUrl: '' })
function formatNotificationDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

const localDateTimeValue = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 16)
}

function NewsletterPanel() {
  const { showToast } = useToast()
  const [campaigns, setCampaigns] = useState([])
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [campaign, setCampaign] = useState(blankCampaign)
  const [editingId, setEditingId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const loadCampaigns = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) throw new Error('Your admin session has expired. Please sign in again.')
      const response = await fetch('/api/newsletter/campaigns', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.message || 'Could not load newsletter campaigns.')
      setCampaigns(result.campaigns)
      setSubscriberCount(result.subscriberCount)
    } catch (error) {
      console.error('Could not load newsletter campaigns', error)
      showToast(error.message || 'Could not load newsletter campaigns.', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => { void loadCampaigns() }, [loadCampaigns])

  const updateCampaign = (field, value) => setCampaign((current) => ({ ...current, [field]: value }))
  const saveCampaign = async (action) => {
    setIsSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) throw new Error('Your admin session has expired. Please sign in again.')
      const response = await fetch('/api/newsletter/campaigns', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          campaignId: editingId,
          subject: campaign.subject,
          previewText: campaign.previewText,
          body: campaign.body,
          imageUrl: campaign.imageUrl,
          scheduledAt: campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString() : '',
        }),
      })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.message || 'Could not save this campaign.')
      showToast(action === 'save' ? 'Newsletter draft saved.' : action === 'send-now' ? 'Newsletter queued for the next daily delivery run.' : 'Newsletter scheduled.', 'success')
      setCampaign(blankCampaign())
      setEditingId(null)
      await loadCampaigns()
    } catch (error) {
      console.error('Could not save newsletter campaign', error)
      showToast(error.message || 'Could not save this campaign.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const cancelCampaign = async (campaignId) => {
    if (!window.confirm('Cancel this newsletter campaign?')) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) throw new Error('Your admin session has expired. Please sign in again.')
      const response = await fetch('/api/newsletter/campaigns', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel', campaignId }),
      })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.message || 'Could not cancel this campaign.')
      showToast('Newsletter campaign cancelled.', 'success')
      await loadCampaigns()
    } catch (error) {
      console.error('Could not cancel newsletter campaign', error)
      showToast(error.message || 'Could not cancel this campaign.', 'error')
    }
  }

  const editCampaign = (item) => {
    setEditingId(item.id)
    setCampaign({
      subject: item.subject,
      previewText: item.preview_text || '',
      body: item.body,
      scheduledAt: localDateTimeValue(item.scheduled_at),
      imageUrl: item.image_url || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const uploadNewsletterImage = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Choose a JPG, PNG or WebP image.', 'error')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Newsletter images must be 5 MB or smaller.', 'error')
      return
    }

    setIsUploadingImage(true)
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
      const path = `newsletters/${Date.now()}-${safeName}`
      const { data, error } = await supabase.storage.from('public-images').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })
      if (error) throw error
      const { data: publicData } = supabase.storage.from('public-images').getPublicUrl(data.path)
      setCampaign((current) => ({ ...current, imageUrl: publicData.publicUrl }))
      showToast('Newsletter image uploaded.', 'success')
    } catch (error) {
      console.error('Newsletter image upload failed', error)
      showToast(error.message || 'Could not upload newsletter image.', 'error')
    } finally {
      setIsUploadingImage(false)
    }
  }

  return <div className="admin-content newsletter-admin">
    <div className="admin-heading"><div><p className="eyebrow">Email marketing</p><h1>Newsletter</h1><p className="admin-subtitle">Write, schedule and manage updates for your opted-in audience.</p></div></div>
    <div className="newsletter-admin-stats">
      <div className="panel"><span>Confirmed subscribers</span><strong>{subscriberCount}</strong><small>Only confirmed addresses receive campaigns.</small></div>
      <div className="panel"><span>Scheduled campaigns</span><strong>{campaigns.filter((item) => item.status === 'scheduled' || item.status === 'sending').length}</strong><small>Sent in batches by the scheduled delivery service.</small></div>
    </div>
    <section className="panel newsletter-composer">
      <div className="panel-head"><div><p className="eyebrow">{editingId ? 'Edit campaign' : 'Create campaign'}</p><h2>{editingId ? 'Update newsletter' : 'Compose a newsletter'}</h2></div></div>
      <form className="newsletter-composer-form" onSubmit={(event) => { event.preventDefault(); void saveCampaign('save') }}>
        <label className="field-group"><span className="field-label">Email subject</span><input className="field-input" required minLength={3} maxLength={150} value={campaign.subject} onChange={(event) => updateCampaign('subject', event.target.value)} placeholder="Property perspectives from S.O. Iraoya" /></label>
        <label className="field-group"><span className="field-label">Inbox preview <span>(optional)</span></span><input className="field-input" maxLength={180} value={campaign.previewText} onChange={(event) => updateCampaign('previewText', event.target.value)} placeholder="A short line shown beside the subject" /></label>
        <label className="field-group"><span className="field-label">Newsletter content</span><textarea className="field-input" required minLength={3} maxLength={20000} rows="10" value={campaign.body} onChange={(event) => updateCampaign('body', event.target.value)} placeholder="Write the newsletter. Separate paragraphs with a blank line." /></label>
        <div className="field-group newsletter-image-field">
          <span className="field-label">Newsletter image <span>(optional · JPG, PNG or WebP, max 5 MB)</span></span>
          <label className="newsletter-image-upload"><Upload size={17} />{isUploadingImage ? 'Uploading image…' : campaign.imageUrl ? 'Replace image' : 'Add image'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={isUploadingImage} onChange={uploadNewsletterImage} /></label>
          {campaign.imageUrl && <div className="newsletter-image-selected"><img src={campaign.imageUrl} alt="Selected newsletter" /><button type="button" className="text-link danger" onClick={() => updateCampaign('imageUrl', '')}>Remove image</button></div>}
        </div>
        <label className="field-group"><span className="field-label">Do not send before</span><input className="field-input" type="datetime-local" value={campaign.scheduledAt} onChange={(event) => updateCampaign('scheduledAt', event.target.value)} /></label>
        <div className="newsletter-composer-actions">
          <button type="submit" className="button button-dark" disabled={isSaving || isUploadingImage}>{isSaving ? 'Saving…' : 'Save draft'}</button>
          <button type="button" className="button button-dark" disabled={isSaving || isUploadingImage || !campaign.scheduledAt} onClick={() => void saveCampaign('schedule')}>{isSaving ? 'Saving…' : 'Schedule newsletter'}</button>
          <button type="button" className="quiet-button" disabled={isSaving || isUploadingImage} onClick={() => void saveCampaign('send-now')}>Queue for next run <ArrowUpRight size={15} /></button>
          {editingId && <button type="button" className="text-link" onClick={() => { setEditingId(null); setCampaign(blankCampaign()) }}>Discard edit</button>}
        </div>
        <div className="newsletter-preview-section">
          <div className="newsletter-preview-heading"><span className="eyebrow">Live email preview</span><span className="newsletter-preview-label">Recipient view</span></div>
          <div className="newsletter-email-preview">
            <div className="newsletter-preview-envelope">
              <p><strong>Subject:</strong> {campaign.subject || 'Your newsletter subject'}</p>
              <p><strong>Preview:</strong> {campaign.previewText || 'Inbox preview text appears here.'}</p>
            </div>
            <header><img src="https://soiraoyaconsulting.org/image/logo2.png" alt="S.O. Iraoya Consulting" /></header>
            <div className="newsletter-email-preview-content">
              <h3>{campaign.subject || 'Newsletter headline'}</h3>
              {campaign.imageUrl && <img className="newsletter-preview-image" src={campaign.imageUrl} alt="Newsletter preview" />}
              {(campaign.body || 'Your newsletter content will appear here. Separate paragraphs with a blank line.').split(/\n\s*\n/).map((paragraph, index) => <p className="newsletter-preview-paragraph" key={`${index}-${paragraph}`}>{paragraph}</p>)}
            </div>
            <footer>
              <strong>S.O. Iraoya Consulting</strong><br />
              Estate Surveyors &amp; Valuers<br />
              <a href="https://soiraoyaconsulting.org">soiraoyaconsulting.org</a> · <a href="mailto:soiraoyaconsults@gmail.com">soiraoyaconsults@gmail.com</a><br />
              <a href="tel:+2349074091408">+234 907 409 1408</a><br />
              <strong>Head Office</strong><br />
              Suite 30, Dolphin Plaza, Ikoyi, Lagos, Nigeria<br />
              <strong>Lekki/Ajah Office</strong><br />
              Suite H272, Ikota Shopping Complex, Lagos, Nigeria
              <p><a className="newsletter-preview-whatsapp" href="https://wa.me/2349074091408">Chat with us on WhatsApp</a></p>
              <div className="newsletter-email-preview-socials" aria-label="Social media links">
                <a href="https://www.facebook.com" aria-label="Facebook">f</a>
                <a href="https://www.instagram.com" aria-label="Instagram">◎</a>
                <a href="https://www.linkedin.com/in/soiraoya-consulting-983372445/" aria-label="LinkedIn">in</a>
                <a href="https://www.youtube.com" aria-label="YouTube">▶</a>
              </div>
              <span className="newsletter-preview-unsubscribe">Unsubscribe from this newsletter</span><br />
              <a href="https://soiraoyaconsulting.org/privacy-policy">Privacy policy</a> · <a href="https://soiraoyaconsulting.org/data-usage-policy">Data usage policy</a>
            </footer>
          </div>
        </div>
      </form>
      <p className="newsletter-composer-note">On the Vercel Hobby plan, delivery runs at 00:00 UTC daily. Campaigns are sent in batches of 50; each additional batch waits for the next daily run. Scheduled campaigns are sent on the first run after their selected time. Newsletter links include a working unsubscribe action.</p>
    </section>
    <section className="panel newsletter-campaign-list">
      <div className="panel-head"><div><p className="eyebrow">Campaign history</p><h2>Recent newsletters</h2></div><button type="button" className="quiet-button" onClick={() => void loadCampaigns()}>Refresh</button></div>
      {isLoading ? <p className="empty-list-note">Loading newsletter campaigns…</p> : campaigns.length === 0 ? <p className="empty-list-note">No campaigns yet. Save a draft or schedule your first newsletter.</p> : <div className="newsletter-campaign-items">
        {campaigns.map((item) => <article className="newsletter-campaign-item" key={item.id}>
          <div className="newsletter-campaign-info"><strong>{item.subject}</strong><span className={`status ${item.status === 'sent' ? '' : 'muted'}`}>{item.status}</span><small>{item.status === 'sent' ? `Sent ${item.sent_count} · Failed ${item.failed_count}` : item.status === 'scheduled' || item.status === 'sending' ? `${item.status === 'sending' ? 'Sending' : 'Scheduled'} · ${item.scheduled_at ? new Date(item.scheduled_at).toLocaleString() : ''}` : `Created ${new Date(item.created_at).toLocaleDateString()}`}</small></div>
          <div className="newsletter-campaign-actions">{['draft', 'scheduled'].includes(item.status) && <><button type="button" className="text-link" onClick={() => editCampaign(item)}>Edit</button><button type="button" className="text-link danger" onClick={() => void cancelCampaign(item.id)}>Cancel</button></>}</div>
        </article>)}
      </div>}
    </section>
  </div>
}

const emptyGalleryItem = () => ({ title: '', location: '', type: 'Residential', listingType: 'For Sale', price: '', description: '', image: '' })

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Image upload failed'))
    reader.readAsDataURL(file)
  })
}

function Overview({ setTab, requests, requestsLoading, markRequestContacted }) {
  const { showToast } = useToast()
  const [subscriberCount, setSubscriberCount] = useState(null)
  const now = new Date()
  const hour = now.getHours()
  const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const greeting = period === 'morning' ? 'Good morning' : period === 'afternoon' ? 'Good afternoon' : 'Good evening'
  const formattedDate = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  useEffect(() => {
    let active = true
    const loadSubscriberCount = async () => {
      const { count, error } = await supabase.from('newsletter_subscribers')
        .select('id', { count: 'exact', head: true }).eq('status', 'active')
      if (error) {
        console.error('Could not load active newsletter subscriber count', error)
        showToast(error.message || 'Could not load subscriber count.', 'error')
      } else if (active) {
        setSubscriberCount(count || 0)
      }
    }
    void loadSubscriberCount()
    return () => { active = false }
  }, [showToast])

  const newRequests = requests.filter((request) => request.status === 'new').length
  return <div className="admin-content">
    <div className="admin-heading"><div><p className="eyebrow">{formattedDate} · {formattedTime}</p><h1>{greeting}, Iraoya.</h1><p className="admin-subtitle">Live activity from consultation requests and newsletter subscribers.</p></div><button className="button button-dark" onClick={() => setTab('Consult requests')}><MessageSquareQuote size={17} /> View requests</button></div>
    <div className="stat-grid">
      <div><span>New requests</span><b>{requestsLoading ? '—' : newRequests}</b><small>Awaiting follow-up</small></div>
      <div><span>All requests</span><b>{requestsLoading ? '—' : requests.length}</b><small>Most recent 200</small></div>
      <div><span>Confirmed subscribers</span><b>{subscriberCount === null ? '—' : subscriberCount}</b><small>Newsletter opt-ins</small></div>
    </div>
    <div className="dashboard-grid dashboard-grid-live"><div className="panel"><div className="panel-head"><div><p className="eyebrow">Inbox</p><h2>Recent consult requests</h2></div><button className="quiet-button" onClick={() => setTab('Consult requests')}>View all <ArrowUpRight size={14} /></button></div><RequestList requests={requests} loading={requestsLoading} markRequestContacted={markRequestContacted} limit={5} /></div></div>
  </div>
}
function defaultWhatsAppMessage(request) {
  const name = request.name?.trim().split(/\s+/)[0] || 'there'
  return `Hello ${name}, this is S.O. Iraoya Consulting. Thank you for your enquiry about ${request.request || 'our services'}${request.property_location ? ` for your property in ${request.property_location}` : ''}. We would be happy to discuss how we can help. Please let us know a convenient time to speak.`
}

function whatsAppUrl(phone, message) {
  const digits = String(phone || '').replace(/\D/g, '')
  const internationalNumber = digits.startsWith('0') ? `234${digits.slice(1)}` : digits
  if (!internationalNumber) return ''
  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(message)}`
}

function RequestList({ requests, loading, markRequestContacted, query = '', limit }) {
  const [expandedId, setExpandedId] = useState(null)
  const [messages, setMessages] = useState({})
  const filteredRequests = requests.filter((request) => {
    const searchValue = query.trim().toLowerCase()
    return !searchValue || [
      request.name, request.email, request.phone, request.organisation,
      request.request, request.category, request.status, request.location,
      request.property_location, request.property_type, request.message,
    ].some((value) => String(value || '').toLowerCase().includes(searchValue))
  }).slice(0, limit || requests.length)

  if (loading) return <p className="empty-list-note">Loading saved consultation requests…</p>
  if (filteredRequests.length === 0) return <p className="empty-list-note">{query ? 'No requests match this search.' : 'No consultation requests have been received yet.'}</p>

  return <div className="request-list">{filteredRequests.map((request) => {
    const expanded = expandedId === request.id
    const message = messages[request.id] ?? defaultWhatsAppMessage(request)
    const initials = String(request.name || '?').trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    const waHref = whatsAppUrl(request.phone, message)
    return <article className={`request-record ${expanded ? 'is-expanded' : ''}`} key={request.id}>
      <button type="button" className="request-row" aria-expanded={expanded} onClick={() => setExpandedId(expanded ? null : request.id)}>
        <span className="request-avatar">{initials}</span>
        <span className="request-row-summary"><b>{request.name}</b><small>{request.request || 'Consultation request'}</small></span>
        <span className={`status ${request.status === 'contacted' ? '' : 'muted'}`}>{request.status === 'contacted' ? 'Contacted' : 'New'}</span>
        <small className="request-date">{new Date(request.created_at).toLocaleDateString()}</small>
        <ChevronDown size={16} />
      </button>
      {expanded && <div className="request-details">
        <div className="request-details-grid">
          <div><span>Email</span>{request.email ? <a href={`mailto:${request.email}`}>{request.email}</a> : <b>Not provided</b>}</div>
          <div><span>Phone / WhatsApp</span>{request.phone ? <a href={`tel:${request.phone}`}>{request.phone}</a> : <b>Not provided</b>}</div>
          <div><span>Organisation</span><b>{request.organisation || 'Not provided'}</b></div>
          <div><span>Client category</span><b>{request.category || 'Not provided'}</b></div>
          <div><span>Location</span><b>{request.location || 'Not provided'}</b></div>
          <div><span>Property</span><b>{[request.property_type, request.property_location].filter(Boolean).join(' · ') || 'Not provided'}</b></div>
          <div><span>Number of properties</span><b>{request.property_count || 'Not provided'}</b></div>
          <div><span>Received</span><b>{new Date(request.created_at).toLocaleString()}</b></div>
        </div>
        <div className="request-client-message"><span>Client message</span><p>{request.message || 'No additional message provided.'}</p></div>
        <label className="request-whatsapp-label">WhatsApp message (you can edit before sending)
          <textarea rows="4" value={message} onChange={(event) => setMessages((current) => ({ ...current, [request.id]: event.target.value }))} />
        </label>
        <div className="request-contact-actions">
          {waHref
            ? <a className="button button-dark" href={waHref} target="_blank" rel="noreferrer">Contact via WhatsApp <ArrowUpRight size={15} /></a>
            : <span className="request-missing-phone">Add a phone number before contacting via WhatsApp.</span>}
          {request.status !== 'contacted' && <button type="button" className="quiet-button" onClick={() => markRequestContacted(request.id)}>Mark as contacted <Check size={15} /></button>}
          {request.status === 'contacted' && <span className="request-contacted-date">Marked contacted {request.contacted_at ? new Date(request.contacted_at).toLocaleDateString() : ''}</span>}
        </div>
      </div>}
    </article>
  })}</div>
}

function Requests({ requests, requestsLoading, requestSearch, setRequestSearch, markRequestContacted, refreshRequests }) {
  const newCount = requests.filter((request) => request.status === 'new').length
  return <div className="admin-content"><div className="admin-heading"><div><p className="eyebrow">Inbox · {newCount} new</p><h1>Consult requests</h1><p className="admin-subtitle">Saved enquiries, client details and follow-up status.</p></div><button type="button" className="quiet-button" onClick={() => void refreshRequests()}>Refresh <ArrowUpRight size={15} /></button></div><div className="request-list-toolbar"><div className="search-field"><Search size={16} /><input value={requestSearch} onChange={(event) => setRequestSearch(event.target.value)} placeholder="Search saved requests" aria-label="Search consultation requests" /></div><div className="request-search-summary">{requestsLoading ? 'Loading requests…' : `${requests.length} saved · Newest first`}</div></div><div className="panel request-panel"><RequestList requests={requests} loading={requestsLoading} markRequestContacted={markRequestContacted} query={requestSearch} /></div></div>
}
function ConfirmDialog({ action, onCancel, onConfirm }) {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 420)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <>{showBackToTop && <button type="button" className="admin-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" title="Back to top"><ArrowUp size={19} /></button>}{action && <div className="confirm-dialog-backdrop" role="presentation" onMouseDown={onCancel}>
    <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
      <p className="eyebrow">Please confirm</p>
      <h2 id="confirm-dialog-title">{action.title}</h2>
      <p>{action.message}</p>
      <div className="confirm-dialog-actions"><button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button><button type="button" className={`button ${action.confirmLabel === 'Delete' ? 'button-danger' : 'button-dark'}`} onClick={onConfirm}>{action.confirmLabel || 'Confirm'}</button></div>
    </div>
  </div>}</>
}
function LandingEditor({ draft, setDraft, save, persistDraft, openConfirm }) {
  const [galleryDraft, setGalleryDraft] = useState(emptyGalleryItem())
  const [heroDraft, setHeroDraft] = useState({ title: '', tagline: '', image: '', active: true })
  const [aboutDraft, setAboutDraft] = useState({ label: 'About us', title: '', text: '', image: '', points: '' })
  const [serviceDraft, setServiceDraft] = useState({ title: '', text: '', icon: 'BarChart3' })
  const [investDraft, setInvestDraft] = useState({ title: '', text: '', image: '', focus: '' })
  const [faqDraft, setFaqDraft] = useState({ question: '', answer: '' })
  const [landingTab, setLandingTab] = useState('editor')
  const [editingItem, setEditingItem] = useState(null)

  const serviceIconMap = {
    BarChart3,
    Building2,
    Home,
    Leaf,
  }

  useEffect(() => {
    if (landingTab !== 'editor' || !editingItem) return
    document.getElementById(`${editingItem.type}-editor`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [editingItem, landingTab])

  const startEditing = (type, index) => {
    const item = draft[type]?.[index]
    if (!item) return

    setEditingItem({ type, index })
    setLandingTab('editor')

    if (type === 'heroSlides') {
      setHeroDraft({ title: item.title || '', tagline: item.tagline || '', image: item.image || '', active: item.active !== false })
    } else if (type === 'gallery') {
      setGalleryDraft({ ...emptyGalleryItem(), ...item, image: item.image || '' })
    } else if (type === 'services') {
      const icon = typeof item.icon === 'string'
        ? item.icon
        : Object.entries(serviceIconMap).find(([, Icon]) => Icon === item.icon)?.[0] || 'BarChart3'
      setServiceDraft({ title: item.title || '', text: item.text || '', icon })
    } else if (type === 'faqs') {
      setFaqDraft({ question: item.question || '', answer: item.answer || '' })
    } else if (type === 'aboutSlides') {
      setAboutDraft({
        label: item.label || 'About us',
        title: item.title || '',
        text: item.text || '',
        image: item.image || '',
        points: Array.isArray(item.points) ? item.points.join(', ') : item.points || '',
      })
    } else if (type === 'investOpportunities') {
      setInvestDraft({
        title: item.title || '',
        text: item.text || '',
        image: item.image || '',
        focus: Array.isArray(item.focus) ? item.focus.join(', ') : item.focus || '',
      })
    }
  }

  const cancelEditing = () => {
    setEditingItem(null)
    setHeroDraft({ title: '', tagline: '', image: '', active: true })
    setGalleryDraft(emptyGalleryItem())
    setServiceDraft({ title: '', text: '', icon: 'BarChart3' })
    setFaqDraft({ question: '', answer: '' })
    setAboutDraft({ label: 'About us', title: '', text: '', image: '', points: '' })
    setInvestDraft({ title: '', text: '', image: '', focus: '' })
  }

  const saveCollectionItem = (key, prepared, resetDraft) => {
    const items = draft[key] || []
    const nextItems = editingItem?.type === key
      ? items.map((item, index) => index === editingItem.index ? { ...item, ...prepared } : item)
      : [prepared, ...items]
    persistDraft({ ...draft, [key]: nextItems })
    resetDraft()
    setEditingItem(null)
  }

  const uploadToBucket = async (file) => {
    if (!file) return ''

    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`
    const { data, error } = await supabase.storage.from('public-images').upload(safeName, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error) {
      throw error
    }

    const { data: publicData } = supabase.storage.from('public-images').getPublicUrl(data.path)
    return publicData.publicUrl
  }

  const handleHeroUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const image = await uploadToBucket(file)
      setHeroDraft((current) => ({ ...current, image }))
    } catch (error) {
      console.error('Hero image upload failed', error)
    }
  }

  const handleHeroSlideSubmit = (event) => {
    event.preventDefault()
    const title = heroDraft.title.trim() || draft.heroTitle || 'New hero message'
    const tagline = heroDraft.tagline.trim() || 'Perspective changes everything.'
    const image = heroDraft.image || '/image/hero/hero-1.jpg'
    const newSlide = { title, tagline, image, fallback: image, active: heroDraft.active !== false }
    if (editingItem?.type === 'heroSlides') {
      saveCollectionItem('heroSlides', newSlide, () => setHeroDraft({ title: '', tagline: '', image: '', active: true }))
    } else {
      persistDraft({ ...draft, heroTitle: draft.heroTitle || title, heroSlides: [newSlide, ...(draft.heroSlides || [])] })
      setHeroDraft({ title: '', tagline: '', image: '', active: true })
      setEditingItem(null)
    }
  }

  const toggleHeroSlide = (index, nextState) => {
    const nextSlides = (draft.heroSlides || []).map((slide, slideIndex) => slideIndex === index ? { ...slide, active: nextState } : slide)
    persistDraft({ ...draft, heroSlides: nextSlides })
  }

  const requestHeroToggle = (index, nextState) => {
    const slide = draft.heroSlides?.[index]
    openConfirm({
      title: nextState ? 'Publish hero slide?' : 'Unpublish hero slide?',
      message: nextState ? `Publish “${slide?.title || 'this slide'}” to the public landing page?` : `Hide “${slide?.title || 'this slide'}” from the public landing page?`,
      confirmLabel: nextState ? 'Publish' : 'Unpublish',
      onConfirm: () => toggleHeroSlide(index, nextState),
    })
  }

  const deleteHeroSlide = (index) => {
    const nextSlides = (draft.heroSlides || []).filter((_, slideIndex) => slideIndex !== index)
    persistDraft({ ...draft, heroSlides: nextSlides })
  }

  const deleteGalleryItem = (index) => {
    const nextGallery = (draft.gallery || []).filter((_, slideIndex) => slideIndex !== index)
    persistDraft({ ...draft, gallery: nextGallery })
  }

  const handleGallerySubmit = (event) => {
    event.preventDefault()
    if (!galleryDraft.title.trim()) return
    const prepared = { ...galleryDraft, image: galleryDraft.image || '/image/hero/hero-1.jpg' }
    saveCollectionItem('gallery', prepared, () => setGalleryDraft(emptyGalleryItem()))
  }

  const onGalleryImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const image = await uploadToBucket(file)
      setGalleryDraft((current) => ({ ...current, image }))
    } catch (error) {
      console.error('Gallery image upload failed', error)
    }
  }

  const handleAboutUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const image = await uploadToBucket(file)
      setAboutDraft((current) => ({ ...current, image }))
    } catch (error) {
      console.error('About image upload failed', error)
    }
  }

  const handleAboutSubmit = (event) => {
    event.preventDefault()
    if (!aboutDraft.title.trim()) return
    const prepared = {
      label: aboutDraft.label || 'About us',
      title: aboutDraft.title.trim(),
      text: aboutDraft.text.trim() || 'A clear perspective on what comes next.',
      image: aboutDraft.image || '/image/hero/hero-2.jpg',
      points: (aboutDraft.points || '')
        .split(',')
        .map((point) => point.trim())
        .filter(Boolean),
    }
    saveCollectionItem('aboutSlides', prepared, () => setAboutDraft({ label: 'About us', title: '', text: '', image: '', points: '' }))
  }

  const deleteAboutSlide = (index) => {
    const nextSlides = (draft.aboutSlides || []).filter((_, slideIndex) => slideIndex !== index)
    persistDraft({ ...draft, aboutSlides: nextSlides })
  }

  const requestDelete = (label, onConfirm) => {
    openConfirm({
      title: `Delete ${label}?`,
      message: `This action will remove this item from the public landing page. Do you want to continue?`,
      confirmLabel: 'Delete',
      onConfirm,
    })
  }

  const handleServiceSubmit = (event) => {
    event.preventDefault()
    if (!serviceDraft.title.trim()) return
    const prepared = {
      title: serviceDraft.title.trim(),
      text: serviceDraft.text.trim() || 'A clear service offering tailored to your clients.',
      icon: serviceDraft.icon || 'BarChart3',
    }
    saveCollectionItem('services', prepared, () => setServiceDraft({ title: '', text: '', icon: 'BarChart3' }))
  }

  const deleteServiceCard = (index) => {
    const nextServices = (draft.services || []).filter((_, serviceIndex) => serviceIndex !== index)
    persistDraft({ ...draft, services: nextServices })
  }

  const requestDeleteService = (index) => {
    const item = draft.services?.[index]
    requestDelete(item?.title || 'service card', () => deleteServiceCard(index))
  }

  const handleInvestUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const image = await uploadToBucket(file)
      setInvestDraft((current) => ({ ...current, image }))
    } catch (error) {
      console.error('Investment image upload failed', error)
    }
  }

  const handleInvestSubmit = (event) => {
    event.preventDefault()
    if (!investDraft.title.trim()) return
    const prepared = {
      title: investDraft.title.trim(),
      text: investDraft.text.trim() || 'A compelling opportunity with clear fundamentals and a customer-first approach.',
      image: investDraft.image || '/image/hero/hero-6.jpg',
      focus: (investDraft.focus || '')
        .split(',')
        .map((point) => point.trim())
        .filter(Boolean),
    }
    saveCollectionItem('investOpportunities', prepared, () => setInvestDraft({ title: '', text: '', image: '', focus: '' }))
  }

  const deleteInvestCard = (index) => {
    const nextItems = (draft.investOpportunities || []).filter((_, opportunityIndex) => opportunityIndex !== index)
    persistDraft({ ...draft, investOpportunities: nextItems })
  }

  const requestDeleteInvest = (index) => {
    const item = draft.investOpportunities?.[index]
    requestDelete(item?.title || 'investment opportunity', () => deleteInvestCard(index))
  }

  const handleFaqSubmit = (event) => {
    event.preventDefault()
    if (!faqDraft.question.trim()) return
    const prepared = {
      question: faqDraft.question.trim(),
      answer: faqDraft.answer.trim() || 'This answer will help visitors understand the next step more clearly.',
    }
    saveCollectionItem('faqs', prepared, () => setFaqDraft({ question: '', answer: '' }))
  }

  const deleteFaqCard = (index) => {
    const nextFaqs = (draft.faqs || []).filter((_, faqIndex) => faqIndex !== index)
    persistDraft({ ...draft, faqs: nextFaqs })
  }

  const requestDeleteFaq = (index) => {
    const item = draft.faqs?.[index]
    requestDelete(item?.question || 'FAQ entry', () => deleteFaqCard(index))
  }

  const handleContactSubmit = (event) => {
    event.preventDefault()
    const updatedContact = {
      title: draft.contact?.title?.trim() || seedContent.contact.title,
      location: draft.contact?.location?.trim() || seedContent.contact.location,
      phone: draft.contact?.phone?.trim() || seedContent.contact.phone,
      email: draft.contact?.email?.trim() || seedContent.contact.email,
    }
    persistDraft({
      ...draft,
      contact: updatedContact,
    })
  }

  const renderServiceIcon = (service) => {
    const resolved = typeof service?.icon === 'function'
      ? service.icon
      : serviceIconMap[service?.icon] || serviceIconMap.BarChart3 || BarChart3
    const Icon = resolved || BarChart3
    return <Icon size={18} />
  }

  return (
    <div className="admin-content">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Content studio</p>
          <h1>Landing page</h1>
          <p className="admin-subtitle">Shape the story your clients meet first.</p>
        </div>
      </div>

      <div className="landing-editor-tabs" role="tablist" aria-label="Landing page tabs">
        {[
          ['editor', 'Publish editor'],
          ['content', 'Published content'],
          ['preview', 'Preview'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={landingTab === key}
            className={landingTab === key ? 'active' : ''}
            onClick={() => setLandingTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {landingTab === 'editor' && (
        <div className="editor-layout single-form-layout">
          <div className="panel editor-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Hero content</p>
                <h2>{editingItem?.type === 'heroSlides' ? 'Edit hero post' : 'Create a hero post'}</h2>
              </div>
              <span className="draft-badge">Draft</span>
            </div>

            <form id="heroSlides-editor" onSubmit={handleHeroSlideSubmit} className="content-form-card hero-slide-form">
              <div className="field-group">
                <label className="field-label">Title</label>
                <input
                  className="field-input"
                  value={heroDraft.title}
                  onChange={(event) => setHeroDraft({ ...heroDraft, title: event.target.value })}
                  placeholder="A better next step starts here"
                />
              </div>

              <div className="field-group">
                <label className="field-label">Tagline</label>
                <input
                  className="field-input"
                  value={heroDraft.tagline}
                  onChange={(event) => setHeroDraft({ ...heroDraft, tagline: event.target.value })}
                  placeholder="Perspective changes everything."
                />
              </div>

              <div className="field-group">
                <label className="field-label">Image</label>
                <label className="upload-dropzone">
                  <input type="file" accept="image/*" onChange={handleHeroUpload} />
                  <span className="upload-dropzone-copy">
                    <Upload size={18} />
                    <strong>Drag & drop hero image</strong>
                    <small>or click to browse</small>
                  </span>
                </label>
                {heroDraft.image && <div className="gallery-image-preview" style={{ backgroundImage: `url(${heroDraft.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
              </div>

              <div className="hero-slide-form-actions">
                <label className="checkbox-row">
                  <input type="checkbox" checked={heroDraft.active !== false} onChange={(event) => setHeroDraft({ ...heroDraft, active: event.target.checked })} />
                  Publish immediately
                </label>
                <div className="admin-edit-actions">
                  {editingItem?.type === 'heroSlides' && <button type="button" className="button button-quiet" onClick={cancelEditing}>Cancel</button>}
                  <button type="submit" className="button button-dark">{editingItem?.type === 'heroSlides' ? 'Save changes' : 'Publish'}</button>
                </div>
              </div>
            </form>
          </div>

          <div className="panel editor-panel gallery-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Property gallery</p>
                <h2>{editingItem?.type === 'gallery' ? 'Edit gallery post' : 'Create a gallery post'}</h2>
              </div>
              <span className="draft-badge">Draft</span>
            </div>

            <form id="gallery-editor" onSubmit={handleGallerySubmit} className="content-form-card gallery-form">
              <div className="field-group">
                <label className="field-label">Title</label>
                <input className="field-input" value={galleryDraft.title} onChange={(event) => setGalleryDraft({ ...galleryDraft, title: event.target.value })} placeholder="Ikoyi Residential Properties" />
              </div>

              <div className="field-group">
                <label className="field-label">Location</label>
                <input className="field-input" value={galleryDraft.location} onChange={(event) => setGalleryDraft({ ...galleryDraft, location: event.target.value })} placeholder="Ikoyi, Lagos" />
              </div>

              <div className="field-group field-grid two-up">
                <div>
                  <label className="field-label">Type</label>
                  <input className="field-input" value={galleryDraft.type} onChange={(event) => setGalleryDraft({ ...galleryDraft, type: event.target.value })} placeholder="Residential" />
                </div>
                <div>
                  <label className="field-label">Price</label>
                  <input className="field-input" value={galleryDraft.price} onChange={(event) => setGalleryDraft({ ...galleryDraft, price: event.target.value })} placeholder="₦185m" />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Listing type</label>
                <SearchableSelect className="admin-listing-select" value={galleryDraft.listingType} onChange={(value) => setGalleryDraft({ ...galleryDraft, listingType: value })} ariaLabel="Listing type" options={[{ value: 'For Sale', label: 'For Sale' }, { value: 'For Rent', label: 'For Rent' }]} />
              </div>

              <div className="field-group">
                <label className="field-label">Description</label>
                <textarea className="field-input" rows="3" value={galleryDraft.description} onChange={(event) => setGalleryDraft({ ...galleryDraft, description: event.target.value })} placeholder="A warm, well-located asset with strong appeal..." />
              </div>

              <div className="field-group">
                <label className="field-label">Image</label>
                <label className="upload-dropzone small">
                  <input type="file" accept="image/*" onChange={onGalleryImage} />
                  <span className="upload-dropzone-copy">
                    <Upload size={18} />
                    <strong>Upload gallery image</strong>
                    <small>PNG, JPG or WebP</small>
                  </span>
                </label>
                {galleryDraft.image && (
                  <div className="gallery-image-preview" style={{ backgroundImage: `url(${galleryDraft.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                )}
              </div>

              <div className="admin-edit-actions">
                {editingItem?.type === 'gallery' && <button type="button" className="button button-quiet" onClick={cancelEditing}>Cancel</button>}
                <button type="submit" className="button button-dark">{editingItem?.type === 'gallery' ? 'Save changes' : 'Publish'}</button>
              </div>
            </form>
          </div>

          <div className="panel editor-panel service-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">What we do</p>
                <h2>{editingItem?.type === 'services' ? 'Edit service card' : 'Create a service card'}</h2>
              </div>
              <span className="draft-badge">Draft</span>
            </div>

            <form id="services-editor" onSubmit={handleServiceSubmit} className="content-form-card service-form">
              <div className="field-group">
                <label className="field-label">Title</label>
                <input className="field-input" value={serviceDraft.title} onChange={(event) => setServiceDraft({ ...serviceDraft, title: event.target.value })} placeholder="Development Strategy" />
              </div>

              <div className="field-group">
                <label className="field-label">Summary</label>
                <textarea className="field-input" rows="3" value={serviceDraft.text} onChange={(event) => setServiceDraft({ ...serviceDraft, text: event.target.value })} placeholder="From site selection to delivery, we guide the route from ambition to asset." />
              </div>

              <div className="field-group">
                <label className="field-label">Icon</label>
                <SearchableSelect className="field-input" value={serviceDraft.icon} onChange={(value) => setServiceDraft({ ...serviceDraft, icon: value })} ariaLabel="Service icon" options={[{ value: 'BarChart3', label: 'Valuation' }, { value: 'Building2', label: 'Development' }, { value: 'Home', label: 'Property management' }, { value: 'Leaf', label: 'Investment analysis' }]} />
              </div>

              <div className="admin-edit-actions">
                {editingItem?.type === 'services' && <button type="button" className="button button-quiet" onClick={cancelEditing}>Cancel</button>}
                <button type="submit" className="button button-dark">{editingItem?.type === 'services' ? 'Save changes' : 'Publish'}</button>
              </div>
            </form>
          </div>

          <div className="panel editor-panel faq-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">FAQ</p>
                <h2>{editingItem?.type === 'faqs' ? 'Edit FAQ entry' : 'Create an FAQ entry'}</h2>
              </div>
              <span className="draft-badge">Draft</span>
            </div>

            <form id="faqs-editor" onSubmit={handleFaqSubmit} className="content-form-card faq-form">
              <div className="field-group">
                <label className="field-label">Question</label>
                <input className="field-input" value={faqDraft.question} onChange={(event) => setFaqDraft({ ...faqDraft, question: event.target.value })} placeholder="How do you support acquisition decisions?" />
              </div>

              <div className="field-group">
                <label className="field-label">Answer</label>
                <textarea className="field-input" rows="3" value={faqDraft.answer} onChange={(event) => setFaqDraft({ ...faqDraft, answer: event.target.value })} placeholder="We review market, risk, opportunity, and asset quality before advising on a clear, evidence-based path." />
              </div>

              <div className="admin-edit-actions">
                {editingItem?.type === 'faqs' && <button type="button" className="button button-quiet" onClick={cancelEditing}>Cancel</button>}
                <button type="submit" className="button button-dark">{editingItem?.type === 'faqs' ? 'Save changes' : 'Publish'}</button>
              </div>
            </form>
          </div>

          <div className="panel editor-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">About us</p>
                <h2>{editingItem?.type === 'aboutSlides' ? 'Edit about slide' : 'Create an about slide'}</h2>
              </div>
              <span className="draft-badge">Draft</span>
            </div>

            <form id="aboutSlides-editor" onSubmit={handleAboutSubmit} className="content-form-card hero-slide-form">
              <div className="field-group">
                <label className="field-label">Label</label>
                <input className="field-input" value={aboutDraft.label} onChange={(event) => setAboutDraft({ ...aboutDraft, label: event.target.value })} placeholder="About us" />
              </div>

              <div className="field-group">
                <label className="field-label">Title</label>
                <input className="field-input" value={aboutDraft.title} onChange={(event) => setAboutDraft({ ...aboutDraft, title: event.target.value })} placeholder="Our Vision" />
              </div>

              <div className="field-group">
                <label className="field-label">Text</label>
                <textarea className="field-input" rows="3" value={aboutDraft.text} onChange={(event) => setAboutDraft({ ...aboutDraft, text: event.target.value })} placeholder="To deliver clear, independent, and commercially useful real-estate advice." />
              </div>

              <div className="field-group">
                <label className="field-label">Points</label>
                <input className="field-input" value={aboutDraft.points} onChange={(event) => setAboutDraft({ ...aboutDraft, points: event.target.value })} placeholder="Client-centred advice, Practical market intelligence" />
              </div>

              <div className="field-group">
                <label className="field-label">Image</label>
                <label className="upload-dropzone small">
                  <input type="file" accept="image/*" onChange={handleAboutUpload} />
                  <span className="upload-dropzone-copy">
                    <Upload size={18} />
                    <strong>Upload about image</strong>
                    <small>PNG, JPG or WebP</small>
                  </span>
                </label>
                {aboutDraft.image && <div className="gallery-image-preview" style={{ backgroundImage: `url(${aboutDraft.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
              </div>

              <div className="admin-edit-actions">
                {editingItem?.type === 'aboutSlides' && <button type="button" className="button button-quiet" onClick={cancelEditing}>Cancel</button>}
                <button type="submit" className="button button-dark">{editingItem?.type === 'aboutSlides' ? 'Save changes' : 'Publish'}</button>
              </div>
            </form>
          </div>

          <div className="panel editor-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Invest with us</p>
                <h2>{editingItem?.type === 'investOpportunities' ? 'Edit opportunity' : 'Create an opportunity'}</h2>
              </div>
              <span className="draft-badge">Draft</span>
            </div>

            <form id="investOpportunities-editor" onSubmit={handleInvestSubmit} className="content-form-card hero-slide-form">
              <div className="field-group">
                <label className="field-label">Title</label>
                <input className="field-input" value={investDraft.title} onChange={(event) => setInvestDraft({ ...investDraft, title: event.target.value })} placeholder="Build with a clearer view." />
              </div>

              <div className="field-group">
                <label className="field-label">Text</label>
                <textarea className="field-input" rows="3" value={investDraft.text} onChange={(event) => setInvestDraft({ ...investDraft, text: event.target.value })} placeholder="Development opportunities assessed with market intelligence and a long-term perspective." />
              </div>

              <div className="field-group">
                <label className="field-label">Highlights</label>
                <input className="field-input" value={investDraft.focus} onChange={(event) => setInvestDraft({ ...investDraft, focus: event.target.value })} placeholder="Development appraisal, Market positioning, Risk assessment" />
              </div>

              <div className="field-group">
                <label className="field-label">Image</label>
                <label className="upload-dropzone small">
                  <input type="file" accept="image/*" onChange={handleInvestUpload} />
                  <span className="upload-dropzone-copy">
                    <Upload size={18} />
                    <strong>Upload opportunity image</strong>
                    <small>PNG, JPG or WebP</small>
                  </span>
                </label>
                {investDraft.image && <div className="gallery-image-preview" style={{ backgroundImage: `url(${investDraft.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
              </div>

              <div className="admin-edit-actions">
                {editingItem?.type === 'investOpportunities' && <button type="button" className="button button-quiet" onClick={cancelEditing}>Cancel</button>}
                <button type="submit" className="button button-dark">{editingItem?.type === 'investOpportunities' ? 'Save changes' : 'Publish'}</button>
              </div>
            </form>
          </div>

          <div className="panel editor-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Contact</p>
                <h2>Update contact block</h2>
              </div>
              <span className="draft-badge">Draft</span>
            </div>

            <form onSubmit={handleContactSubmit} className="content-form-card faq-form">
              <div className="field-group">
                <label className="field-label">Section title</label>
                <input className="field-input" value={draft.contact?.title || seedContent.contact.title} onChange={(event) => setDraft((current) => ({ ...current, contact: { ...current.contact, title: event.target.value } }))} placeholder="Let’s talk property" />
              </div>

              <div className="field-group">
                <label className="field-label">Office addresses (separate offices with |)</label>
                <input className="field-input" value={draft.contact?.location || seedContent.contact.location} onChange={(event) => setDraft((current) => ({ ...current, contact: { ...current.contact, location: event.target.value } }))} placeholder={seedContent.contact.location} />
              </div>

              <div className="field-group field-grid two-up">
                <div>
                  <label className="field-label">Phone</label>
                  <input className="field-input" value={draft.contact?.phone || seedContent.contact.phone} onChange={(event) => setDraft((current) => ({ ...current, contact: { ...current.contact, phone: event.target.value } }))} placeholder="0907 409 1408" />
                </div>
                <div>
                  <label className="field-label">Email</label>
                  <input className="field-input" type="email" value={draft.contact?.email || seedContent.contact.email} onChange={(event) => setDraft((current) => ({ ...current, contact: { ...current.contact, email: event.target.value } }))} placeholder="soiraoyaconsults@gmail.com" />
                </div>
              </div>

              <button type="submit" className="button button-dark">Publish</button>
            </form>
          </div>
        </div>
      )}

      {landingTab === 'content' && (
        <div className="published-content-grid" style={{ marginTop: 18 }}>
          <div className="panel editor-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Published</p>
                <h2>Hero posts</h2>
              </div>
              <span className="live-badge"><span></span> Live</span>
            </div>

            <div className="hero-slide-list">
              {(draft.heroSlides || []).length === 0 ? <p className="empty-list-note">No published hero content yet.</p> : (draft.heroSlides || []).map((slide, index) => (
                <div className={`hero-slide-row ${slide.active === false ? 'inactive' : ''}`} key={`${slide.title || 'hero'}-${index}`}>
                  <div className="hero-slide-thumb" style={{ backgroundImage: `url(${slide.image || '/image/hero/hero-1.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div className="hero-slide-meta">
                    <b>{slide.title || 'Untitled hero slide'}</b>
                    <small>{slide.tagline || 'No tagline yet'}</small>
                    <span className={slide.active === false ? 'status muted' : 'status'}>{slide.active === false ? 'Unpublished' : 'Published'}</span>
                  </div>
                  <div className="hero-slide-actions">
                    <button type="button" className="text-link" onClick={() => startEditing('heroSlides', index)}>Edit</button>
                    <button type="button" className="text-link" onClick={() => requestHeroToggle(index, slide.active === false)}>{slide.active === false ? 'Publish' : 'Unpublish'}</button>
                    <button type="button" className="text-link danger" onClick={() => requestDelete('hero slide', () => deleteHeroSlide(index))}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel editor-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Published</p>
                <h2>Gallery posts</h2>
              </div>
              <span className="live-badge"><span></span> Live</span>
            </div>

            <div className="hero-slide-list">
              {((draft.gallery || []).length === 0) ? <p className="empty-list-note">No published gallery items yet.</p> : (draft.gallery || []).map((item, index) => (
                <div className="hero-slide-row" key={`${item.title || 'gallery'}-${index}`}>
                  <div className="hero-slide-thumb" style={{ backgroundImage: `url(${item.image || '/image/hero/hero-1.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div className="hero-slide-meta">
                    <b>{item.title || 'Untitled property'}</b>
                    <small>{item.location || 'Location not set'} · {item.type || 'Property'}</small>
                    <span className="status">Published</span>
                  </div>
                  <div className="hero-slide-actions">
                    <button type="button" className="text-link" onClick={() => startEditing('gallery', index)}>Edit</button>
                    <button type="button" className="text-link danger" onClick={() => requestDelete(item?.title || 'gallery item', () => deleteGalleryItem(index))}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel editor-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Published</p>
                <h2>Service cards</h2>
              </div>
              <span className="live-badge"><span></span> Live</span>
            </div>

            <div className="hero-slide-list">
              {((draft.services || []).length === 0) ? <p className="empty-list-note">No published service cards yet.</p> : (draft.services || []).map((service, index) => (
                <div className="hero-slide-row" key={`${service.title || 'service'}-${index}`}>
                  <div className="hero-slide-thumb service-list-icon">{renderServiceIcon(service)}</div>
                  <div className="hero-slide-meta">
                    <b>{service.title || 'Untitled service'}</b>
                    <small>{service.text || 'No summary yet.'}</small>
                    <span className="status">Published</span>
                  </div>
                  <div className="hero-slide-actions">
                    <button type="button" className="text-link" onClick={() => startEditing('services', index)}>Edit</button>
                    <button type="button" className="text-link danger" onClick={() => requestDeleteService(index)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel editor-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Published</p>
                <h2>FAQ entries</h2>
              </div>
              <span className="live-badge"><span></span> Live</span>
            </div>

            <div className="hero-slide-list">
              {((draft.faqs || []).length === 0) ? <p className="empty-list-note">No published FAQ entries yet.</p> : (draft.faqs || []).map((item, index) => (
                <div className="hero-slide-row faq-item-row" key={`${item.question || 'faq'}-${index}`}>
                  <div className="hero-slide-thumb service-list-icon">?</div>
                  <div className="hero-slide-meta">
                    <b>{item.question || 'Untitled question'}</b>
                    <small>{item.answer || 'No answer yet.'}</small>
                    <span className="status">Published</span>
                  </div>
                  <div className="hero-slide-actions">
                    <button type="button" className="text-link" onClick={() => startEditing('faqs', index)}>Edit</button>
                    <button type="button" className="text-link danger" onClick={() => requestDeleteFaq(index)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel editor-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Published</p>
                <h2>About slides</h2>
              </div>
              <span className="live-badge"><span></span> Live</span>
            </div>

            <div className="hero-slide-list">
              {((draft.aboutSlides || []).length === 0) ? <p className="empty-list-note">No published about slides yet.</p> : (draft.aboutSlides || []).map((slide, index) => (
                <div className="hero-slide-row" key={`${slide.title || 'about'}-${index}`}>
                  <div className="hero-slide-thumb" style={{ backgroundImage: `url(${slide.image || '/image/hero/hero-2.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div className="hero-slide-meta">
                    <b>{slide.title || 'Untitled about slide'}</b>
                    <small>{slide.text || 'No summary yet.'}</small>
                    <span className="status">Published</span>
                  </div>
                  <div className="hero-slide-actions">
                    <button type="button" className="text-link" onClick={() => startEditing('aboutSlides', index)}>Edit</button>
                    <button type="button" className="text-link danger" onClick={() => requestDelete(slide?.title || 'about slide', () => deleteAboutSlide(index))}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel editor-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Published</p>
                <h2>Investment opportunities</h2>
              </div>
              <span className="live-badge"><span></span> Live</span>
            </div>

            <div className="hero-slide-list">
              {((draft.investOpportunities || []).length === 0) ? <p className="empty-list-note">No published investment opportunities yet.</p> : (draft.investOpportunities || []).map((item, index) => (
                <div className="hero-slide-row" key={`${item.title || 'invest'}-${index}`}>
                  <div className="hero-slide-thumb" style={{ backgroundImage: `url(${item.image || '/image/hero/hero-6.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div className="hero-slide-meta">
                    <b>{item.title || 'Untitled opportunity'}</b>
                    <small>{item.text || 'No summary yet.'}</small>
                    <span className="status">Published</span>
                  </div>
                  <div className="hero-slide-actions">
                    <button type="button" className="text-link" onClick={() => startEditing('investOpportunities', index)}>Edit</button>
                    <button type="button" className="text-link danger" onClick={() => requestDeleteInvest(index)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel editor-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Published</p>
                <h2>Testimonial posts</h2>
              </div>
              <span className="live-badge"><span></span> Live</span>
            </div>

            <div className="hero-slide-list">
              {((draft.testimonials || []).filter((testimonial) => testimonial.status !== 'pending').length === 0) ? <p className="empty-list-note">No published testimonials yet.</p> : (draft.testimonials || []).filter((testimonial) => testimonial.status !== 'pending').map((testimonial, index) => (
                <div className="hero-slide-row testimonial-published-row" key={`${testimonial.name || 'testimonial'}-${testimonial.id || index}`}>
                  <div className="hero-slide-thumb service-list-icon">{testimonial.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'TC'}</div>
                  <div className="hero-slide-meta">
                    <b>{testimonial.name || 'Anonymous client'}</b>
                    <small>{testimonial.role || 'Client'} · {testimonial.rating || 5}/5</small>
                    <small>{testimonial.quote || 'No testimonial text yet.'}</small>
                    <span className="status">Published</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel editor-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Published</p>
                <h2>Contact details</h2>
              </div>
              <span className="live-badge"><span></span> Live</span>
            </div>

            <div className="hero-slide-list">
              <div className="hero-slide-row">
                <div className="hero-slide-thumb service-list-icon">☎</div>
                <div className="hero-slide-meta">
                  <b>{draft.contact?.title || 'Let’s talk property'}</b>
                  <small>{draft.contact?.location || seedContent.contact.location} · {draft.contact?.phone || seedContent.contact.phone} · {draft.contact?.email || seedContent.contact.email}</small>
                  <span className="status">Published</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {landingTab === 'preview' && (
        <div className="panel preview-panel" style={{ marginTop: 18 }}>
          <div className="panel-head">
            <div>
              <p className="eyebrow">Preview</p>
              <h2>Landing page</h2>
            </div>
            <span className="live-badge"><span></span> Public</span>
          </div>
          <div className="mini-preview preview-landing-card">
            <p className="eyebrow">Independent real-estate advisory <span>Since 2002</span></p>
            <h3>{draft.heroTitle || 'A better next step starts here'}</h3>
            <p>{draft.heroText || 'Perspective changes everything.'}</p>
            <div className="mini-image" style={{ backgroundImage: `url(${(draft.heroSlides && draft.heroSlides[0]?.image) || '/image/hero/hero-1.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          </div>
        </div>
      )}

    </div>
  )
}
function Testimonials({ draft, persistDraft, openConfirm, initialTab = 'add' }) {
  const { showToast } = useToast()
  const [tab, setTab] = useState(initialTab)
  const [sentTestimonials, setSentTestimonials] = useState([])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', role: '', rating: '5', quote: '' })

  const loadSentTestimonials = async () => {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    if (error) {
      showToast(error.message || 'Could not load sent testimonials.', 'error')
      return
    }
    setSentTestimonials(data || [])
  }

  useEffect(() => { void loadSentTestimonials() }, [])

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const addTestimonial = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.quote.trim()) return
    const testimonial = { name: form.name.trim(), email: form.email.trim() || null, role: form.role.trim() || 'Client', quote: form.quote.trim(), rating: Number(form.rating), status: 'published' }
    persistDraft({ ...draft, testimonials: [testimonial, ...(draft.testimonials || [])] })
    setForm({ name: '', email: '', role: '', rating: '5', quote: '' })
    showToast('Testimonial published to the landing page.', 'success')
  }

  const publishTestimonial = async (testimonial) => {
    const { error } = await supabase.from('testimonials').update({ status: 'published' }).eq('id', testimonial.id)
    if (error) {
      showToast(error.message || 'Could not publish testimonial.', 'error')
      return
    }
    persistDraft({ ...draft, testimonials: [testimonial, ...(draft.testimonials || [])].map((item) => item.id === testimonial.id ? { ...item, status: 'published' } : item) })
    setSentTestimonials((current) => current.map((item) => item.id === testimonial.id ? { ...item, status: 'published' } : item))
    setSelected(null)
    showToast('Testimonial published to the landing page.', 'success')
  }

  const deleteTestimonial = async (testimonial) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', testimonial.id)
    if (error) {
      showToast(error.message || 'Could not delete testimonial.', 'error')
      return
    }
    setSentTestimonials((current) => current.filter((item) => item.id !== testimonial.id))
    showToast('Testimonial deleted.', 'success')
  }

  return <div className="admin-content"><div className="admin-heading"><div><p className="eyebrow">Social proof</p><h1>Testimonials</h1><p className="admin-subtitle">Add approved voices or review client submissions.</p></div></div><div className="landing-editor-tabs testimonial-admin-tabs" role="tablist" aria-label="Testimonials tabs"><button type="button" role="tab" aria-selected={tab === 'add'} className={tab === 'add' ? 'active' : ''} onClick={() => setTab('add')}>Add testimonial</button><button type="button" role="tab" aria-selected={tab === 'sent'} className={tab === 'sent' ? 'active' : ''} onClick={() => setTab('sent')}>Sent testimonials <span className="nav-count">{sentTestimonials.filter((item) => item.status === 'pending').length}</span></button></div>{tab === 'add' ? <div className="panel editor-panel testimonial-admin-form"><div className="panel-head"><div><p className="eyebrow">Publish directly</p><h2>Add testimonial</h2></div><span className="live-badge"><span></span> Live</span></div><form className="content-form-card" onSubmit={addTestimonial}><div className="field-group"><label className="field-label">Client name</label><input className="field-input" required value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="Amaka Okafor" /></div><div className="field-group"><label className="field-label">Email</label><input className="field-input" type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="client@company.com" /></div><div className="field-group"><label className="field-label">Role or company</label><input className="field-input" value={form.role} onChange={(event) => updateForm('role', event.target.value)} placeholder="Property investor" /></div><div className="field-group"><label className="field-label">Rating</label><SearchableSelect value={form.rating} onChange={(value) => updateForm('rating', value)} ariaLabel="Testimonial rating" options={[1, 2, 3, 4, 5].map((rating) => ({ value: String(rating), label: `${rating} star${rating === 1 ? '' : 's'}` }))} /></div><div className="field-group"><label className="field-label">Testimonial</label><textarea className="field-input" required rows="5" value={form.quote} onChange={(event) => updateForm('quote', event.target.value)} placeholder="Share the client's experience..." /></div><button type="submit" className="button button-dark">Publish testimonial <ArrowUpRight size={17} /></button></form></div> : <div className="testimonial-admin-list">{sentTestimonials.length === 0 ? <div className="panel empty-list-note">No sent testimonials yet.</div> : sentTestimonials.map((testimonial) => <article className={`panel testimonial-review-card ${testimonial.status === 'published' ? 'is-published' : ''}`} key={testimonial.id}><div className="testimonial-review-meta"><span className="testimonial-initials">{testimonial.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><h3>{testimonial.name}</h3><small>{testimonial.role || 'Client'} · {testimonial.rating}/5</small></div><span className={`status ${testimonial.status === 'published' ? '' : 'muted'}`}>{testimonial.status === 'published' ? 'Published' : 'Pending review'}</span></div><blockquote>“{testimonial.quote}”</blockquote><div className="hero-slide-actions"><button type="button" className="text-link" onClick={() => setSelected(testimonial)}>Preview</button>{testimonial.status !== 'published' && <button type="button" className="text-link" onClick={() => openConfirm({ title: 'Publish testimonial?', message: 'This testimonial will appear in the public landing-page slider.', confirmLabel: 'Publish', onConfirm: () => publishTestimonial(testimonial) })}>Publish</button>}<button type="button" className="text-link danger" onClick={() => openConfirm({ title: 'Delete testimonial?', message: 'This will permanently remove the submitted testimonial.', confirmLabel: 'Delete', onConfirm: () => deleteTestimonial(testimonial) })}>Delete</button></div></article>)}</div>}{selected && <div className="confirm-dialog-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><div className="confirm-dialog testimonial-preview-dialog" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><p className="eyebrow">Testimonial preview</p><h2>{selected.name}</h2><p>{selected.role || 'Client'} · {selected.rating}/5</p><blockquote>“{selected.quote}”</blockquote><button type="button" className="button button-dark" onClick={() => setSelected(null)}>Close preview</button></div></div>}</div>
}
