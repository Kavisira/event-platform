import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Header from "../components/Header";
import EventCard from "../components/EventCard";

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SortIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 00-1 1v2.586a1 1 0 00.293.707l6.414 6.414a1 1 0 00.293.707V17l4 4v-6.586a1 1 0 00.293-.707v-.914a1 1 0 00.293-.707l6.414-6.414a1 1 0 00.293-.707V5a1 1 0 00-1-1H3z" />
  </svg>
);

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [eventSearchTerm, setEventSearchTerm] = useState("");
  const [eventSortBy, setEventSortBy] = useState("name");
  const [showExpiredEvents, setShowExpiredEvents] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to load users:", err));
  }, []);

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile?.includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      } else if (sortBy === "mobile") {
        return (a.mobile || "").localeCompare(b.mobile || "");
      } else if (sortBy === "email") {
        return (a.email || "").localeCompare(b.email || "");
      }
      return 0;
    });
  }, [users, searchTerm, sortBy]);

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events
      .filter(event => {
        const eventDate = new Date(event.expiryDate);
        const now = new Date();
        const isExpired = eventDate < now;

        // Filter by search
        const matchesSearch = event.name.toLowerCase().includes(eventSearchTerm.toLowerCase());

        // Filter by expired
        if (isExpired && !showExpiredEvents) return false;

        return matchesSearch;
      })
      .sort((a, b) => {
        if (eventSortBy === "name") {
          return a.name.localeCompare(b.name);
        } else if (eventSortBy === "date") {
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        } else if (eventSortBy === "latest") {
          return new Date(b.expiryDate) - new Date(a.expiryDate);
        }
        return 0;
      });

    return filtered;
  }, [events, eventSearchTerm, eventSortBy, showExpiredEvents]);

  const loadEvents = (user) => {
    setLoading(true);
    setSelectedUser(user);
    setEventSearchTerm("");
    setEventSortBy("name");
    setShowExpiredEvents(false);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${user.id}/events`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(res => setEvents(res.data))
      .catch(err => console.error("Failed to load events:", err))
      .finally(() => setLoading(false));
  };

  // Color palette for user avatars
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-green-500 to-emerald-500",
    "from-indigo-600 to-blue-600",
    "from-rose-500 to-pink-500",
  ];

  const getColorClass = (index) => colors[index % colors.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        {!selectedUser ? (
          // Users View
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                All Users
              </h1>
              <p className="text-gray-600 text-sm">Manage and view events from all users</p>
            </div>

            {/* Search and Sort Bar */}
            <div className="bg-white rounded-xl shadow p-4 flex gap-3 flex-col md:flex-row items-stretch md:items-center">
              {/* Search */}
              <div className="flex-1 relative min-w-0">
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, mobile, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SortIcon />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition cursor-pointer"
                >
                  <option value="name">By Name</option>
                  <option value="mobile">By Mobile</option>
                  <option value="email">By Email</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow">
                <p className="text-blue-100 text-xs font-semibold">Total Users</p>
                <p className="text-3xl font-bold mt-1">{users.length}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow">
                <p className="text-purple-100 text-xs font-semibold">Filtered</p>
                <p className="text-3xl font-bold mt-1">{filteredAndSortedUsers.length}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-4 text-white shadow">
                <p className="text-pink-100 text-xs font-semibold">Total Events</p>
                <p className="text-3xl font-bold mt-1">{users.reduce((sum, u) => sum + (u.eventCount || 0), 0)}</p>
              </div>
            </div>

            {/* Users Grid */}
            {filteredAndSortedUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No users found matching your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredAndSortedUsers.map((user, index) => {
                  const letter = user.name?.charAt(0).toUpperCase() || user.mobile?.charAt(0);
                  const colorClass = getColorClass(index);
                  return (
                    <div
                      key={user.id}
                      onClick={() => loadEvents(user)}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105 p-4 cursor-pointer group overflow-hidden relative"
                    >
                      {/* Background accent */}
                      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${colorClass} opacity-10 rounded-full transform translate-x-6 -translate-y-6 group-hover:translate-x-4 group-hover:-translate-y-4 transition`}></div>

                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClass} text-white flex items-center justify-center text-lg font-bold shadow`}>
                        {letter}
                      </div>

                      {/* User Info */}
                      <h3 className="mt-2 font-bold text-gray-900 text-sm truncate">{user.name}</h3>
                      <p className="text-xs text-gray-500 font-medium mt-0.5 truncate">{user.mobile}</p>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {user.email}
                      </p>

                      {/* View Events Button */}
                      <button className="mt-3 w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 shadow">
                        View →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          // Events View
          <div className="space-y-4">
            {/* Header with Back Button */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm transition shadow"
                >
                  ← Back
                </button>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-3">
                  {selectedUser.name}
                </h1>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">{selectedUser.mobile}</span> • {selectedUser.email}
                </p>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-4 text-white shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-xs font-semibold">Events Created</p>
                  <p className="text-4xl font-bold mt-1">{filteredAndSortedEvents.length}</p>
                </div>
                <div className="text-5xl opacity-20">📊</div>
              </div>
            </div>

            {/* Event Filters */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Search events..."
                  value={eventSearchTerm}
                  onChange={(e) => setEventSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                />

                {/* Sort */}
                <select
                  value={eventSortBy}
                  onChange={(e) => setEventSortBy(e.target.value)}
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
                    onClick={() => setShowExpiredEvents(!showExpiredEvents)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showExpiredEvents ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        showExpiredEvents ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Results Info */}
                <div className="text-xs font-medium text-indigo-600 px-3 py-2 bg-indigo-50 rounded-lg whitespace-nowrap">
                  {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {/* Events Grid */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="text-center">
                  <div className="inline-block">
                    <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-500 mt-3 font-medium text-sm">Loading events...</p>
                </div>
              </div>
            ) : filteredAndSortedEvents.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-600 text-sm font-medium">
                  {events.length === 0 ? "No events created yet" : "No events match your filters"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredAndSortedEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
