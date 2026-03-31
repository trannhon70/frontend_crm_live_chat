import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

const ChatWidget = () => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999999 }}>
      {open && (
        <div style={{
          width: 300,
          height: 400,
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: 10,
          padding: 10,
        }}>
          <p>Chào bạn! Bạn cần hỗ trợ gì? sadsad</p>
        </div>
      )}
      <button onClick={() => setOpen(!open)} style={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        fontSize: 18,
      }}>
        💬
      </button>
    </div>
  )
}

const container = document.createElement('div')
container.id = 'chat-widget-root';
document.body.appendChild(container)

ReactDOM.createRoot(container).render(<ChatWidget />)
