import { useState } from "react";
import FieldBuilder from "../components/FieldBuilder";
import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const [name, setName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  const saveEvent = async () => {
    if (!name || !expiryDate || fields.length === 0) {
      alert("Event name, expiry date and fields are required");
      return;
    }

    if (!fields.some(f => f.isPrimary)) {
      alert("Select one primary field (ex: mobile)");
      return;
    }
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/events`,
      { name, expiryDate, fields },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    alert("Event created");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Event</h1>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name
              </label>
              <input
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter event name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date & Time
              </label>
              <input
                type="datetime-local"
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Form Fields
              </label>
              <FieldBuilder fields={fields} setFields={setFields} />
            </div>

            <div className="flex gap-3 pt-6 border-t">
              <button
                onClick={saveEvent}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Create Event
              </button>
              <button
                onClick={() => navigate("/")}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
