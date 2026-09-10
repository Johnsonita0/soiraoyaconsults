import { useEffect, useState } from 'react'
import Brand from '../components/Brand'
import { ArrowUpRight, BarChart3, Building2, Check, ChevronDown, ChevronLeft, ChevronRight, ClipboardList, FileText, Home, Leaf, LogOut, MessageSquareQuote, Plus, Search, Sparkles, Upload, Users } from '../components/icons'
import { seedRequests } from '../data/content'
import { supabase } from '../lib/supabase'
import SearchableSelect from '../components/SearchableSelect'
import { useToast } from '../components/ToastProvider'

export default function AdminPage({ content, setContent, goTo }) {
  const { showToast } = useToast()
  const [tab, setTab] = useState('Overview')
  const [draft, setDraft] = useState(content)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [mobileProfileMenuOpen, setMobileProfileMenuOpen] = useState(false)
  const [requestSearch, setRequestSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)

  useEffect(() => {
    setDraft(content)
  }, [content])

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

  const tabs = [['Overview', ClipboardList], ['Consult requests', MessageSquareQuote], ['Landing page', FileText], ['Testimonials', Users]]
  const handleSearchAction = () => {
    const nextState = !searchOpen
    setSearchOpen(nextState)
    if (nextState) {
      setTab('Consult requests')
      window.setTimeout(() => {
        document.getElementById('header-search-input')?.focus()
      }, 0)
    }
  }

  const openConfirm = (action) => setConfirmAction(action)
  const closeConfirm = () => setConfirmAction(null)
  const completeConfirm = () => {
    confirmAction?.onConfirm?.()
    closeConfirm()
  }

  return <div className="admin-shell"><aside className={`admin-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}><button className="sidebar-toggle" type="button" onClick={() => setSidebarExpanded((current) => !current)} aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}>{sidebarExpanded ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}</button><Brand admin goTo={goTo} /><div className="admin-nav">{tabs.map(([label, Icon]) => <button className={tab === label ? 'active' : ''} onClick={() => handleTabSelect(label)} key={label}><span className="nav-item-icon"><Icon size={17} />{label === 'Consult requests' && <b className="nav-count">3</b>}</span><span>{label}</span></button>)}</div><div className="sidebar-bottom"><button type="button" className="sidebar-logout" onClick={handleLogout} aria-label="Logout"><LogOut size={16} /><span>Logout</span></button><div className="profile"><span>OI</span><div><b>Iraoya</b><small>Principal partner</small></div><ChevronDown size={14} /></div></div></aside><main className="admin-main"><header className="admin-topbar"><div className="mobile-admin-brand"><Brand admin mobile goTo={goTo} /></div><div className="admin-breadcrumb">S.O.Iraoya / <b>{tab}</b></div><div className="admin-actions"><div className={`header-search-toggle ${searchOpen ? 'open' : ''}`}><button className="icon-button" aria-label="Toggle search" onClick={handleSearchAction}><Search size={18} /></button>{searchOpen && <input id="header-search-input" value={requestSearch} onChange={(event) => setRequestSearch(event.target.value)} placeholder="Search requests" aria-label="Search requests" />}</div><span className="notification-dot"></span><div className="mobile-profile-menu-wrap"><button type="button" className="avatar mobile-user-trigger" aria-label="User menu" onClick={() => setMobileProfileMenuOpen((current) => !current)}><span>OI</span><ChevronDown size={11} /></button>{mobileProfileMenuOpen && <div className="profile-dropdown mobile-dropdown"><div className="mobile-profile-summary"><span className="profile-badge">OI</span><div><b>Iraoya</b><small>Principal partner</small></div></div><button type="button" onClick={handleLogout}>Logout</button></div>}</div></div></header>{tab === 'Overview' && <Overview setTab={setTab} />}{tab === 'Consult requests' && <Requests requestSearch={requestSearch} setRequestSearch={setRequestSearch} />}{tab === 'Landing page' && <LandingEditor draft={draft} setDraft={setDraft} save={save} persistDraft={persistDraft} openConfirm={openConfirm} />}{tab === 'Testimonials' && <Testimonials draft={draft} persistDraft={persistDraft} openConfirm={openConfirm} />}</main><nav className="mobile-admin-tabs" aria-label="Admin navigation">{tabs.map(([label, Icon]) => <button className={tab === label ? 'active' : ''} onClick={() => handleTabSelect(label)} key={label}><Icon size={16} /><span>{label}</span></button>)}</nav><ConfirmDialog action={confirmAction} onCancel={closeConfirm} onConfirm={completeConfirm} /></div>
}

const emptyGalleryItem = () => ({ title: '', location: '', type: 'Residential', price: '', description: '', image: '' })

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Image upload failed'))
    reader.readAsDataURL(file)
  })
}

function Overview({ setTab }) {
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

  return <div className="admin-content"><div className="admin-heading"><div><p className="eyebrow">{formattedDate} • {formattedTime}</p><h1>{greeting}, Iraoya.</h1><p className="admin-subtitle">Here is what is happening across your advisory practice.</p></div><button className="button button-dark" onClick={() => setTab('Landing page')}><Plus size={17} /> New update</button></div><div className="stat-grid"><div><span>Open requests</span><b>03</b><small className="positive">+2 this week</small></div><div><span>Published stories</span><b>08</b><small>Across your landing page</small></div><div><span>Profile views</span><b>1,284</b><small className="positive">+18.4% this month</small></div></div><div className="dashboard-grid"><div className="panel"><div className="panel-head"><div><p className="eyebrow">Needs your attention</p><h2>Recent consult requests</h2></div><button className="quiet-button" onClick={() => setTab('Consult requests')}>View all <ArrowUpRight size={14} /></button></div><RequestList /></div><div className="panel activity-panel"><div className="panel-head"><div><p className="eyebrow">Live preview</p><h2>Landing page health</h2></div><span className="live-badge"><span></span> Live</span></div><div className="health-score"><div className="score-ring"><b>92</b><small>/100</small></div><div><b>Looking good</b><p>Your public site is current and performing well.</p></div></div><div className="health-row"><span><Check size={14} /> Hero content</span><span><Check size={14} /> Services</span><span><Check size={14} /> Contact flow</span></div></div></div></div>
}
function RequestList({ query = '' }) {
  const filteredRequests = seedRequests.filter((request) => {
    if (!query) return true
    const searchValue = query.toLowerCase()
    return [request.name, request.type, request.status, request.date].some((value) => String(value).toLowerCase().includes(searchValue))
  })

  return <div className="request-list">{filteredRequests.map((request) => <div className="request-row" key={request.name}><span className="request-avatar">{request.initials}</span><div><b>{request.name}</b><small>{request.type}</small></div><span className={`status status-${request.status.toLowerCase().replace(' ', '-')}`}>{request.status}</span><small className="request-date">{request.date}</small><ChevronRight size={16} /></div>)}</div> }
function Requests({ requestSearch }) {
  return <div className="admin-content"><div className="admin-heading"><div><p className="eyebrow">Inbox</p><h1>Consult requests</h1><p className="admin-subtitle">A clear view of the people asking for your expertise.</p></div><button className="button button-dark"><Plus size={17} /> Add request</button></div><div className="filter-bar"><button className="filter-button">All requests <ChevronDown size={15} /></button><button className="filter-button">Newest first <ChevronDown size={15} /></button></div><div className="panel request-panel"><RequestList query={requestSearch} /></div></div> }
function ConfirmDialog({ action, onCancel, onConfirm }) {
  if (!action) return null

  return <div className="confirm-dialog-backdrop" role="presentation" onMouseDown={onCancel}>
    <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
      <p className="eyebrow">Please confirm</p>
      <h2 id="confirm-dialog-title">{action.title}</h2>
      <p>{action.message}</p>
      <div className="confirm-dialog-actions"><button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button><button type="button" className={`button ${action.confirmLabel === 'Delete' ? 'button-danger' : 'button-dark'}`} onClick={onConfirm}>{action.confirmLabel || 'Confirm'}</button></div>
    </div>
  </div>
}
function LandingEditor({ draft, setDraft, save, persistDraft, openConfirm }) {
  const [galleryDraft, setGalleryDraft] = useState(emptyGalleryItem())
  const [heroDraft, setHeroDraft] = useState({ title: '', tagline: '', image: '', active: true })
  const [aboutDraft, setAboutDraft] = useState({ label: 'About us', title: '', text: '', image: '', points: '' })
  const [serviceDraft, setServiceDraft] = useState({ title: '', text: '', icon: 'BarChart3' })
  const [investDraft, setInvestDraft] = useState({ title: '', text: '', image: '', focus: '' })
  const [faqDraft, setFaqDraft] = useState({ question: '', answer: '' })
  const [contactDraft, setContactDraft] = useState({ title: '', location: '', phone: '', email: '' })
  const [landingTab, setLandingTab] = useState('editor')

  const serviceIconMap = {
    BarChart3,
    Building2,
    Home,
    Leaf,
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
    persistDraft({
      ...draft,
      heroTitle: draft.heroTitle || title,
      heroSlides: [newSlide, ...(draft.heroSlides || [])],
    })
    setHeroDraft({ title: '', tagline: '', image: '', active: true })
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
    persistDraft({ ...draft, gallery: [prepared, ...(draft.gallery || [])] })
    setGalleryDraft(emptyGalleryItem())
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
    persistDraft({ ...draft, aboutSlides: [prepared, ...(draft.aboutSlides || [])] })
    setAboutDraft({ label: 'About us', title: '', text: '', image: '', points: '' })
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
    persistDraft({ ...draft, services: [prepared, ...(draft.services || [])] })
    setServiceDraft({ title: '', text: '', icon: 'BarChart3' })
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
    persistDraft({ ...draft, investOpportunities: [prepared, ...(draft.investOpportunities || [])] })
    setInvestDraft({ title: '', text: '', image: '', focus: '' })
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
    persistDraft({ ...draft, faqs: [prepared, ...(draft.faqs || [])] })
    setFaqDraft({ question: '', answer: '' })
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
    if (!contactDraft.title.trim()) return
    persistDraft({
      ...draft,
      contact: {
        title: contactDraft.title.trim(),
        location: contactDraft.location.trim() || 'Suite 30, Dolphin Plaza, Ikoyi, Lagos',
        phone: contactDraft.phone.trim() || '0907 409 1408',
        email: contactDraft.email.trim() || 'info@soiraoyaconsulting.com.ng',
      },
    })
    setContactDraft({ title: '', location: '', phone: '', email: '' })
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
                <h2>Create a hero post</h2>
              </div>
              <span className="draft-badge">Draft</span>
            </div>

            <form onSubmit={handleHeroSlideSubmit} className="content-form-card hero-slide-form">
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
                <button type="submit" className="button button-dark">Publish</button>
              </div>
            </form>
          </div>

          <div className="panel editor-panel gallery-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Property gallery</p>
                <h2>Create a gallery post</h2>
              </div>
              <span className="draft-badge">Draft</span>
            </div>

            <form onSubmit={handleGallerySubmit} className="content-form-card gallery-form">
              <div className="field-group">
                <label className="field-label">Title</label>
                <input className="field-input" value={galleryDraft.title} onChange={(event) => setGalleryDraft({ ...galleryDraft, title: event.target.value })} placeholder="Ikoyi Garden Residence" />
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

              <button type="submit" className="button button-dark">Publish</button>
            </form>
          </div>

          <div className="panel editor-panel service-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">What we do</p>
                <h2>Create a service card</h2>
              </div>
              <span className="draft-badge">Draft</span>
            </div>

            <form onSubmit={handleServiceSubmit} className="content-form-card service-form">
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

              <button type="submit" className="button button-dark">Publish</button>
            </form>
          </div>

          <div className="panel editor-panel faq-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">FAQ</p>
                <h2>Create an FAQ entry</h2>
              </div>
              <span className="draft-badge">Draft</span>
            </div>

            <form onSubmit={handleFaqSubmit} className="content-form-card faq-form">
              <div className="field-group">
                <label className="field-label">Question</label>
                <input className="field-input" value={faqDraft.question} onChange={(event) => setFaqDraft({ ...faqDraft, question: event.target.value })} placeholder="How do you support acquisition decisions?" />
              </div>

              <div className="field-group">
                <label className="field-label">Answer</label>
                <textarea className="field-input" rows="3" value={faqDraft.answer} onChange={(event) => setFaqDraft({ ...faqDraft, answer: event.target.value })} placeholder="We review market, risk, opportunity, and asset quality before advising on a clear, evidence-based path." />
              </div>

              <button type="submit" className="button button-dark">Publish</button>
            </form>
          </div>

          <div className="panel editor-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">About us</p>
                <h2>Create an about slide</h2>
              </div>
              <span className="draft-badge">Draft</span>
            </div>

            <form onSubmit={handleAboutSubmit} className="content-form-card hero-slide-form">
              <div className="field-group">
                <label className="field-label">Label</label>
                <input className="field-input" value={aboutDraft.label} onChange={(event) => setAboutDraft({ ...aboutDraft, label: event.target.value })} placeholder="About us" />
              </div>

              <div className="field-group">
                <label className="field-label">Title</label>
                <input className="field-input" value={aboutDraft.title} onChange={(event) => setAboutDraft({ ...aboutDraft, title: event.target.value })} placeholder="Mission" />
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

              <button type="submit" className="button button-dark">Publish</button>
            </form>
          </div>

          <div className="panel editor-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Invest with us</p>
                <h2>Create an opportunity</h2>
              </div>
              <span className="draft-badge">Draft</span>
            </div>

            <form onSubmit={handleInvestSubmit} className="content-form-card hero-slide-form">
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

              <button type="submit" className="button button-dark">Publish</button>
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
                <input className="field-input" value={contactDraft.title} onChange={(event) => setContactDraft({ ...contactDraft, title: event.target.value })} placeholder="Let’s talk property" />
              </div>

              <div className="field-group">
                <label className="field-label">Location</label>
                <input className="field-input" value={contactDraft.location} onChange={(event) => setContactDraft({ ...contactDraft, location: event.target.value })} placeholder="Suite 30, Dolphin Plaza, Ikoyi, Lagos" />
              </div>

              <div className="field-group field-grid two-up">
                <div>
                  <label className="field-label">Phone</label>
                  <input className="field-input" value={contactDraft.phone} onChange={(event) => setContactDraft({ ...contactDraft, phone: event.target.value })} placeholder="0907 409 1408" />
                </div>
                <div>
                  <label className="field-label">Email</label>
                  <input className="field-input" value={contactDraft.email} onChange={(event) => setContactDraft({ ...contactDraft, email: event.target.value })} placeholder="info@soiraoyaconsulting.com.ng" />
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
                    <button type="button" className="text-link">Edit</button>
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
                    <button type="button" className="text-link">Edit</button>
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
                    <button type="button" className="text-link">Edit</button>
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
                    <button type="button" className="text-link">Edit</button>
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
                    <button type="button" className="text-link">Edit</button>
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
                <h2>Contact details</h2>
              </div>
              <span className="live-badge"><span></span> Live</span>
            </div>

            <div className="hero-slide-list">
              <div className="hero-slide-row">
                <div className="hero-slide-thumb service-list-icon">☎</div>
                <div className="hero-slide-meta">
                  <b>{draft.contact?.title || 'Let’s talk property'}</b>
                  <small>{draft.contact?.location || 'Suite 30, Dolphin Plaza, Ikoyi, Lagos'} · {draft.contact?.phone || '0907 409 1408'} · {draft.contact?.email || 'info@soiraoyaconsulting.com.ng'}</small>
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
function Testimonials({ draft, persistDraft, openConfirm }) {
  const { showToast } = useToast()
  const [tab, setTab] = useState('add')
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
