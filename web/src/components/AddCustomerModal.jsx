import { useEffect, useState } from "react";

export default function AddCustomerModal({ visible, onClose, onSubmit }) {
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    if (visible) {
      setMobile("");
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl">
        <div className="mb-4">
          <p className="text-xl font-semibold">Add Customer</p>
          <p className="text-sm text-gray-500 mt-1">
            Enter the customer mobile number to continue.
          </p>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mobile number
        </label>
        <input
          type="tel"
          placeholder="e.g. +1234567890"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => onSubmit?.(mobile.trim())}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl font-semibold transition"
          >
            Add
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
