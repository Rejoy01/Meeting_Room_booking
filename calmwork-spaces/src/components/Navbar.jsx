import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar navbar-light bg-white border-bottom shadow-sm py-2">
      <div className="container d-flex flex-row align-items-center justify-content-between flex-nowrap px-3">
        <a 
          className="navbar-brand d-flex align-items-center p-0 m-0 text-decoration-none flex-shrink-0" 
          href="/"
        >
          {/* Responsive logo frame: 135px on mobile with safe spacing, 170px on desktop */}
          <div 
            className="logo-container"
            style={{ 
              width: "clamp(130px, 38vw, 170px)", 
              height: "44px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "flex-start",
              overflow: "hidden" 
            }}
          >
            <img
              src="/logo.png"
              alt="Calm Workspaces"
              style={{
                width: "100%",
                height: "100px",
                objectFit: "fill",
                margin: "-10px 0",
                display: "block"
              }}
            />
          </div>
        </a>

        {/* Locked right-side badge with a guaranteed margin spacer */}
        <div className="d-flex align-items-center flex-shrink-0 ms-3">
          <span
            className="badge bg-light text-secondary border px-2 px-sm-3 py-2 text-uppercase fw-semibold"
            style={{ 
              fontSize: "0.68rem", 
              letterSpacing: "0.4px",
              whiteSpace: "nowrap"
            }}
          >
            Ground Floor Facilities
          </span>
        </div>
      </div>
    </nav>
  );
}