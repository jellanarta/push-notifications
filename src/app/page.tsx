'use client'

import { useEffect, useState } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from './actions'
import { InstallPrompt } from './InstallPrompt'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function Page() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(setSubscription)
      })
    }
  }, [])

  async function subscribeToPush() {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    })
    setSubscription(sub)
    await subscribeUser(JSON.parse(JSON.stringify(sub)))
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }

  async function sendTestNotification() {
    await sendNotification(message)
    setMessage('')
  }

  return (
    <div>
      <InstallPrompt />
      <h1>Contoh PWA + Push Notifikasi</h1>
      {subscription ? (
        <>
          <p>Sudah berlangganan notifikasi.</p>
          <button onClick={unsubscribeFromPush}>Unsubscribe</button>
          <input
            type="text"
            placeholder="Isi pesan"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendTestNotification}>Kirim Notifikasi</button>
        </>
      ) : (
        <>
          <p>Belum berlangganan.</p>
          <button onClick={subscribeToPush}>Subscribe</button>
        </>
      )}
    </div>
  )
}
