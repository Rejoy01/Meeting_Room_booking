import React from 'react';

export default function Footer({ onUnlockAdmin }) {
  return (
    <footer className="mt-auto py-4 text-center text-muted small">
      <span>© {new Date().getFullYear()} Calmwork Spaces. Ground Floor Facilities.</span>
      <button
        onClick={onUnlockAdmin}
        className="btn btn-link btn-sm text-muted ms-2 p-0 text-decoration-none"
        title="Admin Area"
      >
        <i className="bi bi-lock-fill"></i>
      </button>
    </footer>
  );
}