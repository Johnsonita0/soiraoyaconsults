const whatsappNumber = '2349074091408'

export const whatsappUrl = (message) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

export const openWhatsAppConversation = (message) => {
  const link = document.createElement('a')
  link.href = whatsappUrl(message)
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.click()
}
