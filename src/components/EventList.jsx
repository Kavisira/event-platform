import { useEffect, useState } from "react";
import { fetchEvents, deleteEvent } from "../api/event.api";
import QrModal from "./QrModal";
import { useNavigate } from "react-router-dom";

// Simple SVG Icons
const PlusIcon = () => (
  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const QrIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h1v3h-1zm-3 0h3v1h-3zm1 2h2v1h-2z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const SubmissionsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [qrEvent, setQrEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteEvent(id);
      await load();
    }
  };

  const isExpired = (expiryDate) => new Date(expiryDate) < new Date();
  const daysUntilExpiry = (expiryDate) => {
    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">Manage and create your events</p>
          </div>
          <button
            onClick={() => navigate("/create")}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <PlusIcon />
            Create Event
          </button>
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
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => {
              const expired = isExpired(e.expiryDate);
              const daysLeft = daysUntilExpiry(e.expiryDate);

              return (
                <div
                  key={e.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                >
                  {/* Card Header with Status */}
                  <div className={`h-2 ${expired ? "bg-red-500" : "bg-green-500"}`}></div>

                  <div className="p-6">
                    {/* Event Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                      {e.name}
                    </h3>

                    {/* Status and Date */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <CheckIcon />
                        <span className={`ml-2 text-sm font-medium ${expired ? "text-red-600" : "text-green-600"}`}>
                          {expired ? "EXPIRED" : "ACTIVE"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon />
                        <span className="ml-2 text-sm">
                          Expires {new Date(e.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                      {!expired && (
                        <div className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-2 rounded-lg w-fit">
                          {daysLeft} days remaining
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-6 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/event/${e.id}/edit`)}
                        className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-lg font-medium text-sm transition-colors duration-200"
                      >
                        <EditIcon />
                        Edit
                      </button>
                      <button
                        onClick={() => setQrEvent(e.id)}
                        className="flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 px-3 rounded-lg font-medium text-sm transition-colors duration-200"
                      >
                        <QrIcon />
                        QR
                      </button>
                      <button
                        onClick={() => navigate(`/event/${e.id}/submissions`)}
                        className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 py-2 px-3 rounded-lg font-medium text-sm transition-colors duration-200"
                      >
                        <SubmissionsIcon />
                        Submissions
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-3 rounded-lg font-medium text-sm transition-colors duration-200"
                      >
                        <TrashIcon />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
