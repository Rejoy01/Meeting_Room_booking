import React from 'react';

export default function ComplaintCard({ onOpen }) {
  return (
    <div className="col-lg-4 col-md-6">
      <div
        className="card h-100 shadow-sm border-0 card-hover"
        onClick={onOpen}
        style={{ borderRadius: "14px", cursor: "pointer" }}
      >
        <div className="card-body p-4 d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill fw-bold">
              Cabin Helpdesk
            </span>
            <small className="text-muted fw-semibold">Facilities Desk</small>
          </div>
          <h4 className="card-title fw-bold text-dark mb-2">Cabin Complaints</h4>
          <p className="text-muted small mb-4">
            Report any maintenance, power, AC, or cleaning issues directly inside your cabin for immediate action.
          </p>

          <div className="mb-4 flex-grow-1">
            <h6 className="fw-bold small text-uppercase text-secondary mb-2" style={{ letterSpacing: "0.5px" }}>
              Reportable Items:
            </h6>
            <ul className="list-unstyled mb-0 small text-secondary">
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-snow text-danger me-2"></i> AC cooling & temperature control
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-plug-fill text-danger me-2"></i> Power sockets & network access
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-bucket-fill text-danger me-2"></i> Cabin cleaning & housekeeping
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-wrench-adjustable text-danger me-2"></i> Ergonomic chairs & desk fixtures
              </li>
            </ul>
          </div>

          <button className="btn btn-outline-danger w-100 fw-bold py-2 rounded-3 mt-auto">
            Report Cabin Issue
          </button>
        </div>
      </div>
    </div>
  );
}