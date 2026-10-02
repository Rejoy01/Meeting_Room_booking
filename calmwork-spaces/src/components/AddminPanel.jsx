import React from 'react';
import { useState } from "react";
import { cancelBooking } from "../services/bookingService";

export default function AdminPanel({ bookings, todayStr }) {
  const todayBookings = bookings.filter((b) => b.date === todayStr);

  return (
    <div className="mt-5 p-4 bg-white rounded-4 shadow-sm border">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold text-dark mb-0">Daily Bookings Log (Admin)</h5>
        <span className="badge bg-dark px-3 py-2">Today: {todayStr}</span>
      </div>
      {todayBookings.length === 0 ? (
        <p className="text-muted small my-3">No active bookings scheduled for today.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle small mb-0">
            <thead className="table-light">
              <tr>
                <th>Booking Ref</th>
                <th>Room Type</th>
                <th>Company</th>
                <th>Email</th>
                <th>Reserved Slots</th>
              </tr>
            </thead>
            <tbody>
              {todayBookings.map((b, idx) => (
                <tr key={idx}>
                  <td className="fw-bold text-dark">{b.bookingId}</td>
                  <td>{b.roomType === "meeting" ? "Executive Meeting Room" : "Interactive Conference Room"}</td>
                  <td>{b.companyName}</td>
                  <td>{b.email}</td>
                  <td>
                    {(b.slots || []).map((slot) => (
                      <span key={slot} className="badge bg-light text-dark border me-1">
                        {slot}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}