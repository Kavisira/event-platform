import QventLogo from "../assets/Qvent.png";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
        
        <div className="flex flex-col items-center mb-6">
          <img src={QventLogo} alt="Qvent" className="h-12 mb-3" />
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1 text-center">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
