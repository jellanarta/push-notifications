'use client'
import { useEffect, useState } from 'react'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setVisible(true)
    })
  }, [])

  const install = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === 'accepted') {
      console.log('User accepted install')
      setVisible(false)
    }
  }

  if (!visible) return null

  return (
    <div className='bg-gray-600 text-gray-50'>
      <p>Install aplikasi ini ke perangkat Anda!</p>
      <button className='bg-blue text-white p-3' onClick={install}>Install Di Sini</button>
    </div>
  )
}
