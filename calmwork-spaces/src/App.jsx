import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RoomCard from './components/RoomCard';
import ComplaintCard from './components/ComplaintCard';
import BookingModal from './components/BookingModal';
import ComplaintModal from './components/ComplaintModal';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { BACKEND_ENDPOINT, ROOMS, ADMIN_PASSCODE } from './constants/config';

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  // Today's ISO date string (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split("T")[0];

  // Persistent bookings state initialized from localStorage
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem("cw_bookings");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Check URL query parameters (?admin=true) or hash (#admin) on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true" || window.location.hash === "#admin") {
      setIsAdmin(true);
    }
  }, []);

  // Silent sync: fetch live bookings from backend endpoint on mount
  useEffect(() => {
    if (!BACKEND_ENDPOINT) return;

    fetch(`${BACKEND_ENDPOINT}?action=getBookings`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Normalize and merge backend data with existing local bookings
          setBookings((prevLocal) => {
            const map = new Map();
            data.forEach((item) => {
              if (item.id) map.set(item.id, item);
            });
            prevLocal.forEach((item) => {
              if (item.bookingId && !map.has(item.bookingId)) {
                map.set(item.bookingId, item);
              }
            });
            const merged = Array.from(map.values());
            localStorage.setItem("cw_bookings", JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch(() => {
        // Silently continue with local storage data if network is unreachable
      });
  }, []);

  // Submit Room Booking: Instant local lockout + silent backend dispatch
  const handleBookingSubmit = async (formData) => {
    setIsSubmitting(true);
    const bookingId = "CW-" + Math.floor(100000 + Math.random() * 900000);
    const payload = {
      type: "booking",
      bookingId,
      roomType: formData.roomType,
      date: formData.date,
      slots: formData.slots,
      companyName: formData.companyName,
      email: formData.email,
      createdAt: new Date().toISOString()
    };

    // 1. Immediately update state and localStorage so slots lock out instantly across all views
    setBookings((prev) => {
      const updated = [...prev, payload];
      localStorage.setItem("cw_bookings", JSON.stringify(updated));
      return updated;
    });

    // 2. Dispatch to backend endpoint in background
    if (BACKEND_ENDPOINT) {
      try {
        fetch(BACKEND_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          mode: "no-cors",
          body: JSON.stringify(payload)
        }).catch(() => {});
      } catch (err) {}
    }

    setIsSubmitting(false);
    setSelectedRoom(null);
    setAlert({
      type: "success",
      title: "Booking Confirmed",
      message: `Your reservation (Ref: ${bookingId}) has been confirmed. A confirmation summary will be sent to ${payload.email}.`
    });
  };

  // Submit Cabin Complaint: Silent backend dispatch + confirmation alert
  const handleComplaintSubmit = async (formData) => {
    setIsSubmitting(true);
    const ticketId = "CMP-" + Math.floor(1000 + Math.random() * 9000);
    const payload = {
      type: "complaint",
      ticketId,
      companyName: formData.companyName,
      email: formData.email,
      complaint: formData.cabinNumber 
        ? `[Cabin: ${formData.cabinNumber}] ${formData.complaintText}` 
        : formData.complaintText,
      date: todayStr,
      timestamp: new Date().toISOString()
    };

    // Silent background dispatch
    if (BACKEND_ENDPOINT) {
      try {
        fetch(BACKEND_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          mode: "no-cors",
          body: JSON.stringify(payload)
        }).catch(() => {});
      } catch (err) {}
    }

    setIsSubmitting(false);
    setShowComplaintModal(false);
    setAlert({
      type: "info",
      title: "Service Request Registered",
      message: `Ticket #${ticketId} has been logged. Our facilities and maintenance desk will address your cabin request promptly.`
    });
  };

  // Admin passcode prompt
  const handleUnlockAdmin = () => {
    const code = prompt("Enter Admin Passcode:");
    const passcodeToMatch = ADMIN_PASSCODE || "calmwork";
    if (code === passcodeToMatch) {
      setIsAdmin((prev) => !prev);
    } else if (code !== null) {
      alert("Incorrect admin passcode.");
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column font-sans">
      <Navbar />

      <main className="container my-5 flex-grow-1">
        {/* User Notification Alerts */}
        {alert && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show shadow-sm mb-4`} role="alert">
            <h6 className="alert-heading fw-bold mb-1">{alert.title}</h6>
            <div className="small">{alert.message}</div>
            <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold text-dark mb-2">Workspace Reservations & Cabin Support</h1>
          <p className="text-muted">Select an available facility to reserve time slots or report maintenance issues in your cabin.</p>
        </div>

        {/* 3 Main Hover Containers */}
        <div className="row g-4 justify-content-center">
          <RoomCard room={ROOMS.meeting} onSelect={(id) => setSelectedRoom(id)} />
          <RoomCard room={ROOMS.conference} onSelect={(id) => setSelectedRoom(id)} />
          <ComplaintCard onOpen={() => setShowComplaintModal(true)} />
        </div>

        {/* Admin Dashboard (Visible only when unlocked) */}
        {isAdmin && <AdminPanel bookings={bookings} todayStr={todayStr} />}
      </main>

      {/* Booking Modal with Dynamic Date & Slot Management */}
      {selectedRoom && (
        <BookingModal
          roomId={selectedRoom}
          allBookings={bookings}
          onClose={() => setSelectedRoom(null)}
          onSubmit={handleBookingSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Cabin Support Request Modal */}
      {showComplaintModal && (
        <ComplaintModal
          onClose={() => setShowComplaintModal(false)}
          onSubmit={handleComplaintSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      <Footer onUnlockAdmin={handleUnlockAdmin} />
    </div>
  );
}