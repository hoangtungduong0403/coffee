import { useEffect, useState } from "react";
import ApproveModal from "../components/ApproveModal";
import RequestItem from "../components/RequestItem";
import { useRequests } from "../hooks/useRequests";
import api from "../utils/axios";
export default function Notifications() {
  const { requests, loading, setRequests } = useRequests();
  const [selected, setSelected] = useState(null);
  const [highlightId, setHighlightId] = useState(null);

  // highlight newest request
  useEffect(() => {
    if (requests.length > 0) {
      const latest = requests[0];
      setHighlightId(latest.id);

      const timer = setTimeout(() => setHighlightId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [requests]);

  const handleApprove = async (qty) => {
    if (!selected) return;

    try {
      await api.post(`/requests/${selected.id}/approve`, {
        quantity: qty,
      });
      setRequests((prev) =>
        prev.filter((r) => r.id !== selected.id)
      );

    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    try {
      await api.post(`/requests/${selected.id}/reject`);
      setRequests((prev) =>
        prev.filter((r) => r.id !== selected.id)
      );
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  return (
    <div className="h-full bg-gray-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-500 text-sm">
            Incoming customer requests
          </p>
        </div>

        <div className="bg-black text-white px-3 py-1 rounded-full text-sm">
          {requests.length} pending
        </div>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        {loading && (
          <div className="p-6 text-gray-500">Loading...</div>
        )}

        {!loading && requests.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            📭 No pending requests
          </div>
        )}

        <div className="divide-y">
          {requests.map((item) => (
            <RequestItem
              key={item.id}
              request={item}
              highlight={item.id === highlightId}
              onClick={() => setSelected(item)}
            />
          ))}
        </div>
      </div>

      <ApproveModal
        visible={!!selected}
        request={selected}
        onClose={() => setSelected(null)}
        onApprove={(qty) => {
          if (!selected) return;
          handleApprove(qty);
          setSelected(null);
        }}
        onReject={() => {
          if (!selected) return;
          handleReject();
          setSelected(null);
        }}
      />
    </div>
  );
}