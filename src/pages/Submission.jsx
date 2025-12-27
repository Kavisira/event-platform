import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import Header from "../components/Header";
import { fetchSubmissions } from "../api/submission.api";

// Icons
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SortIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const SubmissionsIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const StatCard = ({ label, value, icon: Icon, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-lg p-8 text-white transform hover:scale-105 transition-transform duration-300`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white text-opacity-90 text-sm font-medium mb-2">{label}</p>
        <p className="text-4xl font-bold">{value}</p>
      </div>
      <div className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
        <Icon />
      </div>
    </div>
  </div>
);

export default function Submissions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("submittedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    fetchSubmissions(id).then(res => {
      setRows(res.data);
      if (res.data.length > 0) {
        setHeaders(Object.keys(res.data[0].data));
      }
    });
  }, [id]);

  // Filtering and Sorting with useMemo
  const filteredRows = useMemo(() => {
    let filtered = [...rows];

    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row.data).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        String(row.primaryValue).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aValue, bValue;

      if (sortField === "submittedAt") {
        aValue = a.submittedAt._seconds || a.submittedAt.seconds || 0;
        bValue = b.submittedAt._seconds || b.submittedAt.seconds || 0;
      } else {
        aValue = a.data[sortField] || "";
        bValue = b.data[sortField] || "";
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [rows, searchTerm, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedRows = filteredRows.slice(startIdx, startIdx + itemsPerPage);

  if (!rows.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Submissions</h1>
                <p className="text-gray-600 mt-1">No submissions received yet</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6">
                <SubmissionsIcon />
              </div>
              <p className="text-2xl font-semibold text-gray-900 mb-2">No Submissions Yet</p>
              <p className="text-gray-600 mb-8">When users submit the form, their responses will appear here</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <Header />
      <main className="p-6 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Submissions</h1>
                <p className="text-gray-600 mt-1">Manage and view all form responses</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <StatCard
              label="Total Responses"
              value={rows.length}
              icon={SubmissionsIcon}
              gradient="from-indigo-500 to-purple-600"
            />
            <StatCard
              label="Latest Response"
              value={new Date((rows[0]?.submittedAt._seconds || rows[0]?.submittedAt.seconds || 0) * 1000).toLocaleDateString()}
              icon={CalendarIcon}
              gradient="from-blue-500 to-cyan-600"
            />
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2 relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search submissions by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-colors"
                />
              </div>

              {/* Sort Controls */}
              <div className="flex gap-2">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-colors font-medium text-sm"
                >
                  <option value="submittedAt">📅 Date</option>
                  {headers.map(h => (
                    <option key={h} value={h}>
                      📝 {h.substring(0, 15)}...
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center gap-2 transform hover:scale-105"
                >
                  <SortIcon />
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-4 text-sm text-gray-600 font-medium">
            Found <span className="text-indigo-600 font-bold">{filteredRows.length}</span> submission{filteredRows.length !== 1 ? "s" : ""}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-gray-700 text-sm">#</th>
                    {headers.map(h => (
                      <th
                        key={h}
                        onClick={() => setSortField(h)}
                        className="px-6 py-4 text-left font-bold text-gray-700 text-sm cursor-pointer hover:bg-gray-200 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          {h}
                          {sortField === h && <SortIcon />}
                        </div>
                      </th>
                    ))}
                    <th
                      onClick={() => setSortField("submittedAt")}
                      className="px-6 py-4 text-left font-bold text-gray-700 text-sm cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        📅 Submitted
                        {sortField === "submittedAt" && <SortIcon />}
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {paginatedRows.map((r, idx) => (
                    <tr
                      key={r.id}
                      className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4 text-gray-700 font-bold text-indigo-600">
                        {startIdx + idx + 1}
                      </td>
                      {headers.map(h => (
                        <td key={h} className="px-6 py-4 text-gray-700 text-sm">
                          <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full text-gray-700 font-medium group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:text-indigo-700 transition-all">
                            {r.data[h]}
                          </span>
                        </td>
                      ))}
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full font-bold group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
                          {new Date((r.submittedAt._seconds || r.submittedAt.seconds) * 1000).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <p className="text-sm text-gray-700 font-medium">
                Showing <span className="text-indigo-600 font-bold">{startIdx + 1}</span> to <span className="text-indigo-600 font-bold">{Math.min(startIdx + itemsPerPage, filteredRows.length)}</span> of <span className="text-indigo-600 font-bold">{filteredRows.length}</span> submissions
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors font-medium disabled:hover:bg-transparent"
                >
                  ← Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg font-bold transition-all ${
                        currentPage === page
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors font-medium disabled:hover:bg-transparent"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
