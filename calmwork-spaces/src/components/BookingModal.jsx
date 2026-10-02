import React, { useState } from 'react';
import { TIME_SLOTS, ROOMS } from '../constants/config';

// Helper: Converts "10:00 AM" to total minutes from midnight
const parseSlotToMinutes = (slotStr) => {
  const [time, modifier] = slotStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

export default function BookingModal({ roomId, allBookings, onClose, onSubmit, isSubmitting }) {
  const room = ROOMS[roomId];

  // Current system date and time
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

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
  const [rangeError, setRangeError] = useState("");

  const isSelectedDateToday = date === todayStr;

  // Extract all booked slots for this room on this date
  const bookedSlotsForDate = (allBookings || [])
    .filter((b) => {
      const matchRoom = String(b.roomType || "").trim().toLowerCase() === String(roomId).trim().toLowerCase();
      const matchDate = String(b.date || "").trim().startsWith(date.trim());
      return matchRoom && matchDate;
    })
    .flatMap((b) => (Array.isArray(b.slots) ? b.slots : [b.slots]))
    .map((s) => String(s).trim());

  // Check if a slot is disabled: already booked or earlier today
  const isSlotDisabled = (slot) => {
    if (bookedSlotsForDate.includes(slot)) return true;
    if (isSelectedDateToday) {
      const slotMinutes = parseSlotToMinutes(slot);
      if (slotMinutes <= currentMinutes) return true;
    }
    return false;
  };

  const handleSlotClick = (clickedSlot) => {
    setRangeError("");
    if (isSlotDisabled(clickedSlot)) return;

    const clickedIndex = TIME_SLOTS.indexOf(clickedSlot);

    if (selectedSlots.length === 0 || selectedSlots.length > 1) {
      setSelectedSlots([clickedSlot]);
      return;
    }

    const firstSelectedIndex = TIME_SLOTS.indexOf(selectedSlots[0]);

    if (clickedIndex === firstSelectedIndex) {
      setSelectedSlots([]);
      return;
    }

    const startIndex = Math.min(firstSelectedIndex, clickedIndex);
    const endIndex = Math.max(firstSelectedIndex, clickedIndex);

    const range = TIME_SLOTS.slice(startIndex, endIndex + 1);

    const hasConflict = range.some((s) => isSlotDisabled(s));
    if (hasConflict) {
      setRangeError("The selected duration contains past or already booked slots. Please choose another range.");
      setSelectedSlots([clickedSlot]);
      return;
    }

    setSelectedSlots(range);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setSelectedSlots([]);
    setRangeError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim() || !email.trim()) return;

    // Strict validation: Require at least 2 consecutive slots (1 hour minimum)
    if (selectedSlots.length < 2) {
      setRangeError("Please select at least 2 slots . Click an end slot to complete your range.");
      return;
    }

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
          style={{
            maxHeight: "calc(100vh - 3rem)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div className="modal-header border-bottom px-3 px-md-4 py-2 flex-shrink-0 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div
                style={{
                  width: "135px",
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/logo.png"
                  alt="Calm Workspaces"
                  style={{
                    width: "100%",
                    height: "82px",
                    objectFit: "fill",
                    margin: "-7px 0",
                    display: "block",
                  }}
                />
              </div>
              <div className="border-start ps-3">
                <h5 className="modal-title fw-bold text-dark mb-0">
                  {room?.title || "Meeting Room"}
                </h5>
                <small className="text-muted">
                  {room?.badge} · {room?.floor}
                </small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <div
            className="modal-body px-3 px-md-4 py-3"
            style={{ overflowY: "auto" }}
          >
            {/* 1. Date */}
            <label className="form-label fw-bold small text-uppercase text-secondary mb-2">
              1. Choose Date
            </label>
            <div className="d-flex flex-wrap gap-2 mb-4 align-items-center">
              <button
                type="button"
                className={`btn btn-sm ${
                  date === todayStr
                    ? "btn-dark fw-bold"
                    : "btn-outline-secondary"
                }`}
                onClick={() => handleDateChange(todayStr)}
              >
                Today
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  date === tomorrowStr
                    ? "btn-dark fw-bold"
                    : "btn-outline-secondary"
                }`}
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

          
            {/* 2. Slots */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-1 mb-2">
              <label className="form-label fw-bold small text-uppercase text-secondary mb-0">
                2. Available Time Slots ({date})
              </label>
              <span
                className="badge bg-light text-muted border fw-normal text-wrap text-start"
                style={{ fontSize: "0.72rem", lineHeight: "1.3" }}
              >
                💡 Select start slot, then end slot (Min: 2)
              </span>
            </div>

            {rangeError && (
              <div className="alert alert-danger py-2 small mb-3">
                {rangeError}
              </div>
            )}

            <div className="row g-2 mb-4">
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedSlotsForDate.includes(slot);
                const isPast =
                  isSelectedDateToday &&
                  parseSlotToMinutes(slot) <= currentMinutes;
                const disabled = isBooked || isPast;
                const isSelected = selectedSlots.includes(slot);

                let btnClass = "btn btn-outline-secondary text-dark";
                let labelExtra = "";

                if (disabled) {
                  btnClass =
                    "btn btn-light text-muted text-decoration-line-through border-0 disabled";
                  if (isPast && !isBooked) labelExtra = " (Passed)";
                } else if (isSelected) {
                  btnClass = "btn btn-primary text-white fw-bold shadow-sm";
                }

                return (
                  <div key={slot} className="col-6 col-sm-4 col-md-3">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => handleSlotClick(slot)}
                      className={`w-100 py-2 small rounded-3 ${btnClass}`}
                      style={{ fontSize: "0.82rem" }}
                    >
                      {slot}
                      {labelExtra}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Range Summary Preview & Guidance */}
            {selectedSlots.length === 1 && (
              <div className="p-3 mb-4 rounded-3 border border-warning bg-warning-subtle text-dark d-flex justify-content-between align-items-center">
                <small className="fw-semibold">
                  ⚠️️ Starting slot chosen ({selectedSlots[0]}). Please select
                  an ending slot.
                </small>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark"
                  onClick={() => setSelectedSlots([])}
                >
                  Clear
                </button>
              </div>
            )}

            {selectedSlots.length >= 2 && (
              <div className="p-3 mb-4 rounded-3 border bg-light d-flex justify-content-between align-items-center">
                <div>
                  <small
                    className="text-secondary d-block fw-semibold text-uppercase"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Selected Reservation Time:
                  </small>
                  <strong className="text-primary">
                    {selectedSlots[0]} →{" "}
                    {selectedSlots[selectedSlots.length - 1]}
                  </strong>
                  <span className="text-muted ms-2 small">
                    ({selectedSlots.length} slots · {selectedSlots.length * 30}{" "}
                    mins)
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSelectedSlots([])}
                >
                  Clear
                </button>
              </div>
            )}

            {/* 3. Company Form */}
            <form
              id="booking-modal-form"
              onSubmit={handleSubmit}
              className="border-top pt-3"
            >
              <h6 className="fw-bold text-dark mb-3">
                3. Company & Contact Details
              </h6>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">
                    Company Name *
                  </label>
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
                  <label className="form-label small fw-semibold">
                    Official Email Address *
                  </label>
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

          {/* Footer */}
          <div className="modal-footer border-top px-3 px-md-4 py-2 flex-shrink-0 bg-white">
            <button
              type="button"
              className="btn btn-light px-3"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="booking-modal-form"
              disabled={isSubmitting || selectedSlots.length < 2}
              className="btn btn-primary px-4 fw-bold"
            >
              {isSubmitting
                ? "Confirming..."
                : selectedSlots.length < 2
                ? "Select 2 or More Slots to Book"
                : `Confirm (${selectedSlots.length} Slots)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}