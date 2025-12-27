import EventList from "../components/EventList";
import Header from "../components/Header";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6">
        <EventList />
      </main>
    </div>
  );
}
