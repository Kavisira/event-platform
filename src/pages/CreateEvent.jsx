import { useState, useRef } from "react";
import FieldBuilder from "../components/FieldBuilder";
import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const IconBox = ({ children, color }) => (
  <div className={`w-8 h-8 ${color} rounded-md flex items-center justify-center text-white flex-shrink-0`}>
    {children}
  </div>
);

export default function CreateEvent() {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [locationType, setLocationType] = useState("url");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [eventCategory, setEventCategory] = useState("free");
  const [eventAmount, setEventAmount] = useState("");
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const descRef = useRef(null);

  // ---------- Markdown Editor Helper ----------
  const insertMarkdown = (before, after, placeholder) => {
    const textarea = descRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end) || placeholder;
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    setEventDescription(newText);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + before.length;
      textarea.focus();
    }, 0);
  };

  // ---------- Validation ----------
  const validateForm = () => {
    const e = {};

    if (eventName.length < 10) e.eventName = "Min 10 characters required";
    if (new Date(eventDate) <= new Date()) e.eventDate = "Future date required";
    if (!eventLocation.trim()) e.eventLocation = "Required";
    if (contactName.length < 3) e.contactName = "Min 3 characters";
    // if (!/^[0-9]{10}$/.test(contactPhone)) e.contactPhone = "10 digit number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) e.contactEmail = "Invalid email";

    if (eventCategory === "paid" && (!eventAmount || parseFloat(eventAmount) < 1)) {
      e.eventAmount = "Min ₹1 required";
    }

    if (fields.length === 0) e.fields = "Add at least one field";
    if (!fields.some(f => f.isPrimary)) e.primary = "Select one primary field";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---------- Save ----------
  const saveEvent = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/events`,
        {
          name: eventName,
          description: eventDescription,
          expiryDate: eventDate,
          location: eventLocation,
          locationType,
          contactName,
          contactPhone,
          contactEmail,
          category: eventCategory,
          amount: eventCategory === "paid" ? parseFloat(eventAmount) : 0,
          fields
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      toast.success("Event created successfully");
      navigate("/");
    } catch (err) {
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-4xl mx-auto p-4">

        {/* Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-indigo-600">Create New Event</h1>
          <p className="text-xs text-gray-500">Configure event details & form fields</p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">

          <div className="p-5 space-y-5">

            {/* Event Name */}
            <div className="pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <IconBox color="bg-indigo-500">📄</IconBox>
                <label className="text-sm font-semibold">Event Name *</label>
              </div>
              <input
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Event name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              {errors.eventName && <p className="text-xs text-red-500 mt-1">{errors.eventName}</p>}
            </div>

            {/* Event Description */}
            <div className="pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <IconBox color="bg-purple-500">✍️</IconBox>
                <label className="text-sm font-semibold">Description</label>
              </div>
              <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-1 flex-wrap">
                  <button type="button" onClick={() => insertMarkdown('**', '**', 'Bold')} className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold">B</button>
                  <button type="button" onClick={() => insertMarkdown('*', '*', 'Italic')} className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 italic">I</button>
                  <button type="button" onClick={() => insertMarkdown('# ', '\n', 'Heading')} className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold">H</button>
                  <button type="button" onClick={() => insertMarkdown('- ', '\n', 'List')} className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100">•</button>
                </div>
                <textarea
                  className="w-full px-3 py-2 text-sm border-0 focus:outline-none resize-vertical min-h-28"
                  placeholder="Enter event description (supports *italics*, **bold**, # headings, - lists)"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  ref={descRef}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Optional - Markdown supported: **bold**, *italic*, # heading, - list</p>
            </div>

            {/* Event Date */}
            <div className="pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <IconBox color="bg-blue-500">📅</IconBox>
                <label className="text-sm font-semibold">Event Date *</label>
              </div>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
              {errors.eventDate && <p className="text-xs text-red-500 mt-1">{errors.eventDate}</p>}
            </div>

            {/* Location */}
            <div className="pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <IconBox color="bg-green-500">📍</IconBox>
                <label className="text-sm font-semibold">Location *</label>
              </div>

              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setLocationType("url")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border-2 transition-all ${
                    locationType === "url"
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    locationType === "url" ? "border-indigo-500 bg-indigo-500" : "border-gray-300"
                  }`}>
                    {locationType === "url" && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-sm font-medium">URL</span>
                </button>
                
                <button
                  onClick={() => setLocationType("manual")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border-2 transition-all ${
                    locationType === "manual"
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    locationType === "manual" ? "border-indigo-500 bg-indigo-500" : "border-gray-300"
                  }`}>
                    {locationType === "manual" && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-sm font-medium">Manual</span>
                </button>
              </div>

              <input
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder={locationType === "url" ? "https://maps.google.com" : "Address"}
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
              {errors.eventLocation && <p className="text-xs text-red-500 mt-1">{errors.eventLocation}</p>}
            </div>

            {/* Contact */}
            <div className="pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <IconBox color="bg-purple-500">☎️</IconBox>
                <label className="text-sm font-semibold">Contact *</label>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <input className="px-3 py-2 text-sm border rounded-md" placeholder="Name"
                  value={contactName} onChange={(e)=>setContactName(e.target.value)} />
                <input className="px-3 py-2 text-sm border rounded-md" placeholder="Phone"
                  value={contactPhone} onChange={(e)=>setContactPhone(e.target.value.replace(/\D/g,"").slice(0,10))} />
                <input className="px-3 py-2 text-sm border rounded-md" placeholder="Email"
                  value={contactEmail} onChange={(e)=>setContactEmail(e.target.value)} />
              </div>

              {errors.contactName && <p className="text-xs text-red-500 mt-1">{errors.contactName}</p>}
              {errors.contactPhone && <p className="text-xs text-red-500 mt-1">{errors.contactPhone}</p>}
              {errors.contactEmail && <p className="text-xs text-red-500 mt-1">{errors.contactEmail}</p>}
            </div>

            {/* Category */}
            <div className="pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <IconBox color="bg-orange-500">💳</IconBox>
                <label className="text-sm font-semibold">Event Type *</label>
              </div>

              <select
                className="w-full px-3 py-2 text-sm border rounded-md"
                value={eventCategory}
                onChange={(e)=>setEventCategory(e.target.value)}
              >
                <option value="free">Free Event</option>
                <option value="paid">Paid Event</option>
              </select>

              {eventCategory === "paid" && (
                <input
                  className="w-full mt-2 px-3 py-2 text-sm border rounded-md"
                  placeholder="Amount ₹"
                  value={eventAmount}
                  onChange={(e)=>setEventAmount(e.target.value)}
                />
              )}
              {errors.eventAmount && <p className="text-xs text-red-500 mt-1">{errors.eventAmount}</p>}
            </div>

            {/* Fields */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <IconBox color="bg-cyan-500">🧩</IconBox>
                <label className="text-sm font-semibold">Form Fields *</label>
              </div>
              <FieldBuilder fields={fields} setFields={setFields} />
              {errors.fields && <p className="text-xs text-red-500 mt-1">{errors.fields}</p>}
              {errors.primary && <p className="text-xs text-red-500 mt-1">{errors.primary}</p>}
            </div>

          </div>

          {/* Actions */}
          <div className="px-5 py-4 bg-gray-50 border-t flex justify-between">
            <button
              onClick={()=>navigate("/")}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={saveEvent}
              disabled={loading}
              className="px-6 py-2 text-sm text-white rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-3 text-xs bg-blue-50 border border-blue-200 rounded-md p-2 text-blue-800">
          💡 Event date must be future. Phone must be 10 digits. One primary field required.
        </div>

      </main>
    </div>
  );
}
