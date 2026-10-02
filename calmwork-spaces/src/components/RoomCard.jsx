import React from 'react';

export default function RoomCard({ room, onSelect }) {
  return (
    <div className="col-lg-4 col-md-6">
      <div
        className="card h-100 shadow-sm border-0 card-hover"
        onClick={() => onSelect(room.id)}
        style={{ borderRadius: "14px", cursor: "pointer" }}
      >
        <div className="card-body p-4 d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className={`badge px-3 py-2 rounded-pill fw-bold ${room.badgeClass}`}>
              {room.badge}
            </span>
            <small className="text-muted fw-semibold">{room.floor}</small>
          </div>
          <h4 className="card-title fw-bold text-dark mb-2">{room.title}</h4>
          <p className="text-muted small mb-4">{room.description}</p>

          <div className="mb-4 flex-grow-1">
            <h6 className="fw-bold small text-uppercase text-secondary mb-2" style={{ letterSpacing: "0.5px" }}>
              Key Amenities:
            </h6>
            <ul className="list-unstyled mb-0 small text-secondary">
              {room.features.map((feature, idx) => (
                <li key={idx} className="mb-2 d-flex align-items-start">
                  <i className="bi bi-check-circle-fill text-primary me-2 mt-1"></i>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className={`btn ${room.btnClass} w-100 fw-bold py-2 rounded-3 mt-auto`}>
            Book {room.title.split(" ")[0]} Room
          </button>
        </div>
      </div>
    </div>
  );
}