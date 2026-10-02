import React, { useState } from 'react';
import { TIME_SLOTS, ROOMS } from '../constants/config';

export default function BookingModal({ roomId, allBookings, onClose, onSubmit, isSubmitting }) {
  const room = ROOMS[roomId];

  const todayStr = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const [date, setDate] = useState(todayStr);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");

  const bookedSlotsForDate = (allBookings || [])
    .filter((b) => {
      const matchRoom = String(b.roomType || "").trim().toLowerCase() === String(roomId).trim().toLowerCase();
      const matchDate = String(b.date || "").trim().startsWith(date.trim());
      return matchRoom && matchDate;
    })
    .flatMap((b) => (Array.isArray(b.slots) ? b.slots : [b.slots]))
    .map((s) => String(s).trim());

  const toggleSlot = (slot) => {
    if (bookedSlotsForDate.includes(slot)) return;
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot].sort()
    );
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setSelectedSlots([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim() || !email.trim() || selectedSlots.length === 0) return;
    onSubmit({
      roomType: roomId,
      date,
      slots: selectedSlots,
      companyName: companyName.trim(),
      email: email.trim()
    });
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div 
        className="modal-dialog-responsive" 
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="modal-content rounded-4 border-0 shadow-lg bg-white overflow-hidden"
          style={{ maxHeight: "calc(100vh - 3rem)", display: "flex", flexDirection: "column" }}
        >
          {/* Fixed Header */}
          <div className="modal-header border-bottom px-3 px-md-4 py-3 flex-shrink-0">
            <div>
              <h5 className="modal-title fw-bold text-dark mb-0">{room?.title || "Meeting Room"}</h5>
              <small className="text-muted">Select date, 30-min slots, and company info</small>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          {/* Scrollable Body (Accommodates slots + company info on mobile screens) */}
          <div className="modal-body px-3 px-md-4 py-3" style={{ overflowY: "auto" }}>
            {/* 1. Date Selection */}
            <label className="form-label fw-bold small text-uppercase text-secondary mb-2">
              1. Choose Date
            </label>
            <div className="d-flex flex-wrap gap-2 mb-4 align-items-center">
              <button
                type="button"
                className={`btn btn-sm ${date === todayStr ? "btn-dark fw-bold" : "btn-outline-secondary"}`}
                onClick={() => handleDateChange(todayStr)}
              >
                Today
              </button>
              <button
                type="button"
                className={`btn btn-sm ${date === tomorrowStr ? "btn-dark fw-bold" : "btn-outline-secondary"}`}
                onClick={() => handleDateChange(tomorrowStr)}
              >
                Tomorrow
              </button>
              <input
                type="date"
                className="form-control form-control-sm w-auto"
                min={todayStr}
                max={maxDateStr}
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>

            {/* 2. Slot Selection */}
            <label className="form-label fw-bold small text-uppercase text-secondary mb-2">
              2. Available Time Slots for {date}
            </label>
            <div className="row g-2 mb-4">
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedSlotsForDate.includes(slot);
                const isSelected = selectedSlots.includes(slot);

                let btnClass = "btn btn-outline-secondary text-dark";
                if (isBooked) btnClass = "btn btn-light text-muted text-decoration-line-through border-0 disabled";
                else if (isSelected) btnClass = "btn btn-primary text-white fw-bold shadow-sm";

                return (
                  <div key={slot} className="col-6 col-sm-4 col-md-3">
                    <button
                      type="button"
                      disabled={isBooked}
                      onClick={() => toggleSlot(slot)}
                      className={`w-100 py-2 small rounded-3 ${btnClass}`}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {slot}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* 3. Company & Contact Details Form */}
            <form id="booking-modal-form" onSubmit={handleSubmit} className="border-top pt-3">
              <h6 className="fw-bold text-dark mb-3">3. Company & Contact Details</h6>
              <div className="row g-3">
                <div className="col-12 col-md-6">
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
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@company.com"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Fixed Footer with Action Buttons */}
          <div className="modal-footer border-top px-3 px-md-4 py-2 flex-shrink-0 bg-white">
            <button type="button" className="btn btn-light px-3" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              form="booking-modal-form"
              disabled={isSubmitting || selectedSlots.length === 0}
              className="btn btn-primary px-4 fw-bold"
            >
              {isSubmitting ? "Confirming..." : `Confirm (${selectedSlots.length} Slots)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}