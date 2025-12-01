import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export function initEmailJS() {
  if (PUBLIC_KEY) emailjs.init(PUBLIC_KEY)
}

export async function sendNotificationEmail(recipientId, type, postData) {
  const team = [
    { id: 'gaia', name: 'Gaia', email: 'gaia@enooso.it' },
    { id: 'viola', name: 'Viola', email: 'viola@enooso.it' },
    { id: 'alessandro', name: 'Alessandro', email: 'alessandro@enooso.it' },
    { id: 'valerio', name: 'Valerio', email: 'valerio@enooso.it' }
  ]
  const recipient = team.find(m => m.id === recipientId)
  if (!recipient || !SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) return true

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_name: recipient.name,
      to_email: recipient.email,
      notification_type: type === 'task_grafica' ? '🎨 Nuova grafica' : type === 'task_copy' ? '✍️ Nuovo copy' : '🎬 Nuovo video',
      post_date: new Date(postData.date).toLocaleDateString('it-IT'),
      post_text: postData.text?.substring(0, 100) || 'Nessun testo',
      message: 'C\'è un post che ha bisogno di te!'
    })
    return true
  } catch (error) {
    return false
  }
}
