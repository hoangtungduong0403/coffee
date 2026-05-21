export default function RequestItem({ request, onClick, highlight }) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center justify-between px-5 py-4 cursor-pointer transition
        ${highlight ? "bg-yellow-50" : "bg-white"}
        hover:bg-gray-50
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* status dot */}
        <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />

        <div>
          <p className="font-medium text-gray-900">
            {request.phone}
          </p>
          <p className="text-sm text-gray-500">
            Requested coffee
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-400">
          {request.time}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="px-4 py-2 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
        >
          Approve
        </button>
      </div>
    </div>
  );
}