import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const QRIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

const CreditIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 2v4H5V5h14zm0 12H5v-6h14v6z" />
  </svg>
);

export default function EventCard({ event }) {
  const navigate = useNavigate();

  const letter = event.name?.charAt(0).toUpperCase() || "E";
  
  // Calculate countdown
  const countdown = useMemo(() => {
    const eventDate = new Date(event.expiryDate);
    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 0) return `${days}d left`;
    if (hours > 0) return `${hours}h left`;
    return `${mins}m left`;
  }, [event.expiryDate]);

  const isPaid = event.category === "paid" || event.amount > 0;
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-green-500 to-emerald-500",
    "from-indigo-600 to-blue-600",
    "from-rose-500 to-pink-500",
  ];
  const colorClass = colors[letter.charCodeAt(0) % colors.length];

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
      
      {/* Image or Avatar Section */}
      <div className={`relative w-full h-32 bg-gradient-to-br ${colorClass} flex items-center justify-center overflow-hidden`}>
        {event.image ? (
          <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-5xl font-bold text-white opacity-80">{letter}</div>
        )}
        
        {/* Price Badge */}
        {isPaid && (
          <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow">
            <span>💰</span>
            ₹{event.amount}
          </div>
        )}
        {!isPaid && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold shadow flex items-center gap-1">
            <span>🎁</span>
            FREE
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Event Name */}
        <h3 className="font-bold text-gray-900 text-sm truncate mb-2">{event.name}</h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3 truncate">
          <MapIcon />
          {event.locationType === "url" ? (
            <a href={event.location} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
              View Venue →
            </a>
          ) : (
            <span className="truncate">{event.location}</span>
          )}
        </div>

        {/* Date and Countdown */}
        <div className="flex items-center gap-2 text-xs text-gray-700 font-medium mb-3">
          <ClockIcon />
          <span>{new Date(event.expiryDate).toLocaleDateString()}</span>
          <span className={`ml-auto px-2 py-1 rounded-full text-white font-bold ${
            countdown === "Expired" ? "bg-red-500" : "bg-gradient-to-r from-green-500 to-emerald-500"
          }`}>
            {countdown}
          </span>
        </div>

        {/* Bottom Info */}
        <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-200">
          {/* QR Icon and Submissions */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 hover:bg-indigo-200 transition cursor-pointer">
              <QRIcon />
            </div>
            {event.submissionCount && (
              <span className="font-semibold text-gray-700">{event.submissionCount} submissions</span>
            )}
          </div>

          {/* Status Badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            event.status === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {event.status}
          </span>
        </div>
      </div>

      {/* Floating Edit Button */}
      <button
        onClick={() => navigate(`/event/${event.id}/edit`)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2.5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110"
      >
        <EditIcon />
      </button>
    </div>
  );
}
