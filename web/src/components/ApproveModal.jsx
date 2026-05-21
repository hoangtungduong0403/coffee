import { useState } from "react";

export default function ApproveModal({
  visible,
  request,
  onClose,
  onApprove,
  onReject
}) {
  const [qty, setQty] = useState(1);

  if (!visible || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[360px] p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-2">
          Approve Request
        </h2>

        <p className="text-gray-500 text-sm mb-4">
          {request.phone}
        </p>

        {/* qty selector */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-8 h-8 rounded-full bg-gray-100"
          >
            −
          </button>

          <span className="text-lg font-semibold">{qty}</span>

          <button
            onClick={() => setQty(qty + 1)}
            className="w-8 h-8 rounded-full bg-gray-100"
          >
            +
          </button>
        </div>

        {/* actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              onApprove(qty);
              setQty(1);
            }}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium"
          >
            Confirm
          </button>
          <button
            onClick={onReject}
            className="flex-1 bg-gray-100 py-2 rounded-lg"
          >
            Reject
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}