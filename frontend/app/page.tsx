'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => {
        setMessage(data.message)
        setStatus(data.status)
      })
      .catch(err => console.error('Error:', err))
  }, [])

  return (
    <div className="container">
      <h1 className="title">Flask + Next.js アプリ</h1>
      <div className="status">
        <p>バックエンドメッセージ: {message}</p>
        <p>ステータス: {status}</p>
      </div>
    </div>
  )
}