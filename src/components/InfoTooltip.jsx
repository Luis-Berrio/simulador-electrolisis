import { useState } from 'react'

export default function InfoTooltip({ text }) {
  const [visible, setVisible] = useState(false)

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(v => !v)}
        style={{
          width: 16, height: 16, borderRadius: '50%',
          background: 'rgba(255,255,255,.08)',
          border: '1px solid rgba(255,255,255,.15)',
          color: '#9ca3af', fontSize: 10, fontWeight: 700,
          cursor: 'pointer', display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-main)',
          flexShrink: 0, lineHeight: 1,
          transition: 'all .2s',
        }}
      >
        ?
      </button>
      {visible && (
        <div style={{
          position: 'absolute', bottom: '120%', left: '50%',
          transform: 'translateX(-50%)',
          background: '#0d1117',
          border: '1px solid rgba(59,130,246,.3)',
          borderRadius: 8, padding: '10px 12px',
          width: 220, zIndex: 999,
          boxShadow: '0 8px 24px rgba(0,0,0,.5)',
          pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: 11, color: '#cbd5e1',
            lineHeight: 1.6, fontFamily: 'var(--font-main)',
          }}>
            {text}
          </div>
          {/* Triángulo */}
          <div style={{
            position: 'absolute', top: '100%', left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid rgba(59,130,246,.3)',
          }} />
        </div>
      )}
    </span>
  )
}