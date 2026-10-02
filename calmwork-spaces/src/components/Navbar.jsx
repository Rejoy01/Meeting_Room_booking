import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark py-3 shadow-sm">
      <div className="container">
        <span className="navbar-brand fw-bold fs-4 tracking-wide mb-0">
          CALMWORK <span className="text-primary fw-light">SPACES</span>
        </span>
        <span className="badge bg-secondary px-3 py-2 text-uppercase" style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}>
          Ground Floor Facilities
        </span>
      </div>
    </nav>
  );
}