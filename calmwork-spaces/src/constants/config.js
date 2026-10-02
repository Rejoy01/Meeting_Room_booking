export const BACKEND_ENDPOINT = "https://script.google.com/macros/s/AKfycbzrnL2z0sL6Dy6VG3uPdgF1mPgX1jOvzDfU8rQiLHVv6z5RpsYSYq73j1Wqc9ALL4Q34A/exec";

export const ADMIN_PASSCODE = "calmwork";

export const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM"
];

export const ROOMS = {
  meeting: {
    id: "meeting",
    title: "Executive Meeting Room",
    badge: "8 Seater",
    floor: "Ground Floor",
    badgeClass: "bg-primary-subtle text-primary border border-primary-subtle",
    btnClass: "btn-outline-primary",
    description: "Designed for team huddles, confidential client meets, and structured interviews.",
    features: [
      "Android TV with Screen Share",
      "Air Conditioned (AC)",
      "High-Speed Wi-Fi",
      "Suitable for: Quick team syncs, client consultations, interviews & one-on-one reviews"
    ]
  },
  conference: {
    id: "conference",
    title: "Interactive Conference Room",
    badge: "16 Seater",
    floor: "Ground Floor",
    badgeClass: "bg-purple-badge",
    btnClass: "btn-outline-dark",
    description: "Built for interactive discussions, hybrid board conferences, and webinars.",
    features: [
      "Interactive Panel",
      "Air Conditioned (AC)",
      "High-Speed Wi-Fi",
      "Ideal for: Hybrid board meetings, product demos, interactive workshops & webinars"
    ]
  }
};