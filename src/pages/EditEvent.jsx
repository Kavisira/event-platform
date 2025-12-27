import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import FieldBuilder from "../components/FieldBuilder";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/events`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(res => {
        const e = res.data.find(x => x.id === id);
        setEvent(e);
      });
  }, []);

  const save = async () => {
    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/events/${id}`,
      event,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    alert("Event updated");
    navigate("/");
  };

  if (!event) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6 flex justify-center items-center h-96">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Event</h1>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name
              </label>
              <input
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={event.name}
                onChange={e => setEvent({ ...event, name: e.target.value })}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date & Time
              </label>
              <input
                type="datetime-local"
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={event.expiryDate}
                onChange={e =>
                  setEvent({ ...event, expiryDate: e.target.value })
                }
              />
            </div>

            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="eventActive"
                checked={event.status === "ACTIVE"}
                onChange={e =>
                  setEvent({
                    ...event,
                    status: e.target.checked ? "ACTIVE" : "DISABLED",
                  })
                }
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="eventActive" className="ml-2 text-sm font-medium text-gray-700">
                Event Active
              </label>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Form Fields
              </label>
              <FieldBuilder
                fields={event.fields}
                setFields={fields =>
                  setEvent({ ...event, fields })
                }
              />
            </div>

            <div className="flex gap-3 pt-6 border-t">
              <button
                onClick={save}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
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
