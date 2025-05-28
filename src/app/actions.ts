'use server'

import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:kamu@email.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

interface PushSubscriptionObject {
  endpoint: string
  expirationTime: number | null
  keys: {
    p256dh: string
    auth: string
  }
}

let subscription: PushSubscriptionObject | null = null

export async function subscribeUser(sub: PushSubscriptionObject) {
  subscription = sub
  return { success: true }
}

export async function unsubscribeUser() {
  subscription = null
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('Tidak ada langganan')
  }

  try {
    await webpush.sendNotification(subscription, JSON.stringify({
      title: 'Notifikasi Tes',
      body: message,
      icon: '/icon-192x192.png',
    }))
    return { success: true }
  } catch (error) {
    console.error('Gagal kirim notifikasi:', error)
    return { success: false }
  }
}
