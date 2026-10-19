const whatsappNumber = '2349074091408'

export const whatsappUrl = () => `https://wa.me/${whatsappNumber}`

export const openWhatsAppConversation = () => {
  const link = document.createElement('a')
  link.href = whatsappUrl()
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.click()
}
