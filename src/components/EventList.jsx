import { useEffect, useState } from "react";
import { fetchEvents, deleteEvent } from "../api/event.api";
import QrModal from "./QrModal";
import { useNavigate } from "react-router-dom";

// SVG Icons
const PlusIcon = () => (
  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const QrIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h1v3h-1zm-3 0h3v1h-3zm1 2h2v1h-2z" />
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

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [qrEvent, setQrEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showExpired, setShowExpired] = useState(false);
  const navigate = useNavigate();

  const colors = [
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-green-400 to-green-600",
    "from-yellow-400 to-yellow-600",
    "from-red-400 to-red-600",
  ];

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchEvents();
      setEvents(res.data);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filter & Sort Logic
  const filteredEvents = events
    .filter(event => {
      const eventDate = new Date(event.expiryDate);
      const now = new Date();
      const isExpired = eventDate < now;

      // Filter by search query
      const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by expired
      if (isExpired && !showExpired) return false;

      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "date") {
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      } else if (sortBy === "latest") {
        return new Date(b.expiryDate) - new Date(a.expiryDate);
      }
      return 0;
    });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteEvent(id);
      await load();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-gray-600">Manage and create your events</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value="name">Name (A-Z)</option>
              <option value="date">Date (Earliest)</option>
              <option value="latest">Date (Latest)</option>
            </select>

            {/* Toggle Switch - Expired Only */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border border-gray-200">
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Expired:</span>
              <button
                onClick={() => setShowExpired(!showExpired)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showExpired ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    showExpired ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Results Info */}
            <div className="text-xs font-medium text-indigo-600 px-3 py-2 bg-indigo-50 rounded-lg whitespace-nowrap">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mb-2">No events yet</p>
            <p className="text-gray-600 mb-8">Create your first event to get started</p>
            <button
              onClick={() => navigate("/create")}
              className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              <PlusIcon />
              Create Event
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mb-2">No events found</p>
            <p className="text-gray-600 mb-8">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {filteredEvents.map((event) => {
              const letter = event.name?.charAt(0).toUpperCase() || "E";
              const colorIndex = letter.charCodeAt(0) % colors.length;
              const bgColor = colors[colorIndex];

              // Calculate countdown from event date (starting date)
              const getCountdown = () => {
                const eventDate = new Date(event.eventDate || event.expiryDate);
                const now = new Date();
                const diff = eventDate - now;

                if (diff <= 0) return "Started";

                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const mins = Math.floor((diff / (1000 * 60)) % 60);

                if (days > 0) return `${days}d`;
                if (hours > 0) return `${hours}h`;
                return `${mins}m`;
              };
              const countdown = getCountdown();

              const isExpired = new Date(event.expiryDate) < new Date();
              console.log('event', event.category)
              const isFree = !event.category || event.category === "Free" || event.category === "free" || (event.amount === 0);
              const amount = event.amount || 0;

              return (
                <div
                  key={event.id}
                  className="group relative bg-white rounded-md shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:scale-105 cursor-pointer"
                >
                  {/* Image or Avatar Section */}
                  <div className="relative h-32 overflow-hidden">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${bgColor} flex items-center justify-center`}>
                        <span className="text-4xl font-bold text-white opacity-90">{letter}</span>
                      </div>
                    )}
                    
                    {/* QR Icon - Left Side */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setQrEvent(event.id);
                      }}
                      className="absolute left-2 top-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-1.5 rounded cursor-pointer transition-all duration-200 hover:scale-110"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h1v3h-1zm-3 0h3v1h-3zm1 2h2v1h-2z" />
                      </svg>
                    </div>

                    {/* Price/Free Badge */}
                    <div className={`absolute right-2 top-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${isFree ? "bg-green-100" : "bg-indigo-100"}`}>
                      {isFree ? (
                        <>
                          <span>🎁</span>
                          <span className="text-green-700">FREE</span>
                        </>
                      ) : (
                        <>
                          <span>💰</span>
                          <span className="text-indigo-700">₹{amount}</span>
                        </>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute right-2 bottom-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${isExpired ? "bg-red-500" : "bg-green-500"}`}>
                        {isExpired ? "EXP" : "ON"}
                      </span>
                    </div>

                    {/* Floating Edit Button - Top Right on Hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/event/${event.id}/edit`);
                      }}
                      className="absolute top-2 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110 shadow-lg"
                    >
                      <EditIcon />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-3">
                    {/* Event Name */}
                    <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {event.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-start gap-1.5 mb-2 text-xs text-gray-600">
                      <MapIcon />
                      <div className="flex-1 line-clamp-1">
                        {event.location?.startsWith("http") ? (
                          <a
                            href={event.location}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline line-clamp-1"
                          >
                            Location
                          </a>
                        ) : (
                          <span className="truncate text-xs">{event.location || "No loc"}</span>
                        )}
                      </div>
                    </div>

                    {/* Date with Countdown */}
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                      <ClockIcon />
                      <span className="font-medium text-xs">
                        {new Date(event.eventDate || event.expiryDate).toLocaleDateString("en-IN", {month: "short", day: "numeric"})}
                      </span>
                      <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold text-xs">
                        {countdown}
                      </span>
                    </div>

                    {/* Submissions Count & Delete Button - Bottom Row */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-gray-100">
                      {/* Submissions Tooltip Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/event/${event.id}/submissions`);
                        }}
                        title="View submissions"
                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-all duration-200 transform hover:scale-105"
                      >
                        <CreditIcon />
                        <span className="font-bold">{event.submissionCount || 0}</span>
                      </button>

                      {/* Delete Icon Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(event.id);
                        }}
                        title="Delete event"
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 transform hover:scale-110"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate("/create")}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 animate-pulse hover:animate-none group z-40"
      >
        <svg className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* QR MODAL */}
      {qrEvent && (
        <QrModal
          eventId={qrEvent}
          onClose={() => setQrEvent(null)}
        />
      )}
    </div>
  );
}
