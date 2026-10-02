import React, { useState } from 'react';

export default function ComplaintModal({ onClose, onSubmit, isSubmitting }) {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [cabinNumber, setCabinNumber] = useState("");
  const [complaintText, setComplaintText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim() || !email.trim() || !complaintText.trim()) return;
    onSubmit({
      companyName: companyName.trim(),
      email: email.trim(),
      cabinNumber: cabinNumber.trim(),
      complaintText: complaintText.trim()
    });
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div 
        className="modal-dialog-responsive" 
        style={{ maxWidth: "560px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="modal-content rounded-4 border-0 shadow-lg bg-white overflow-hidden"
          style={{ maxHeight: "calc(100vh - 3rem)", display: "flex", flexDirection: "column" }}
        >
          <div className="modal-header border-bottom px-3 px-md-4 py-3 flex-shrink-0">
            <div>
              <h5 className="modal-title fw-bold text-dark mb-0">Register Cabin Issue</h5>
              <small className="text-muted">Direct submission to the floor maintenance desk</small>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <form id="complaint-modal-form" onSubmit={handleSubmit} style={{ display: "contents" }}>
            <div className="modal-body px-3 px-md-4 py-3" style={{ overflowY: "auto" }}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Tech Solutions"
                  className="form-control"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Official Contact Email *</label>
                <input
                  type="email"
                  required
                  placeholder="contact@company.com"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Cabin Number</label>
                <input
                  type="text"
                  placeholder="e.g. Cabin G-08"
                  className="form-control"
                  value={cabinNumber}
                  onChange={(e) => setCabinNumber(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Issue Details *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the issue (e.g. AC cooling inadequate, power port loose)..."
                  className="form-control"
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer border-top px-3 px-md-4 py-2 flex-shrink-0 bg-white">
              <button type="button" className="btn btn-light px-3" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="btn btn-danger px-4 fw-bold">
                {isSubmitting ? "Logging..." : "Submit Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}