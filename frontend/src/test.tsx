import React from 'react'
import ReactDOM from 'react-dom/client'

// Simple test
const TestApp = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>Customer Service System</h1>
    <p style={{ color: 'green' }}>React is working!</p>
    <p>If you see this, the basic setup is working.</p>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>,
)
