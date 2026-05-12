import React from 'react';

export default function Spinner({ fullscreen, size = 32 }) {
  const style = {
    width: size,
    height: size,
    border: `3px solid rgba(99,102,241,0.2)`,
    borderTop: `3px solid #6366f1`,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block'
  };

  if (fullscreen) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg)'
      }}>
        <div style={style} role="status" aria-label="Loading" />
      </div>
    );
  }

  return <div style={style} role="status" aria-label="Loading" />;
}
