import { QRCodeCanvas } from "qrcode.react";

export default function QrModal({ eventId, onClose }) {
  const url = `https://event-landing-sigma.vercel.app/event/${eventId}`;

  const whatsappShare = () => {
    const text = encodeURIComponent(`Please fill the form: ${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-96 p-6 shadow-2xl relative"
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Event QR Code
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Scan or share the link
          </p>
        </div>

        {/* QR Section */}
        <div className="flex justify-center items-center mb-4">
          <div className="p-4 bg-gray-50 rounded-2xl shadow-inner">
            <QRCodeCanvas value={url} size={180} />
          </div>
        </div>

        {/* URL */}
        <div className="text-xs text-gray-500 break-all bg-gray-50 p-3 rounded-xl mb-4">
          {url}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={whatsappShare}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition text-white py-2.5 rounded-xl font-medium"
          >
            Share via WhatsApp
          </button>

          <button
            onClick={onClose}
            className="w-full text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
