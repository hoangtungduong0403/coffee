import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
export default function CustomerDetail() {
  const { id } = useParams(); // instead of route.params
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [points, setPoints] = useState(0);
  const [purchases, setPurchases] = useState(0);
  const [pointsToAdd, setPointsToAdd] = useState("0");

  // fetch customer
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        const data = res.data;

        setCustomer(data);
        setPoints(data.points);
        setPurchases(data.purchases);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };

    fetchCustomer();
  }, [id]);

  // add coffee
  const handleAddPoints = async () => {
    const amount = Number(pointsToAdd);
    if (!amount || Number.isNaN(amount)) return;

    try {
      const res = await api.post(`/users/${id}/add`, {
        quantity: amount,
      });

      const data = res.data;

      setCustomer(data);
      setPoints(data.points);
      setPurchases(data.purchases);
      setPointsToAdd("0");
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  // redeem
  const handleRedeem = async () => {
    if (points < 5) return;

    try {
      const res = await api.post(`/users/${id}/redeem`);
      const data = res.data;

      setCustomer(data);
      setPoints(data.points);
      setPurchases(data.purchases);
    } catch (err) {
      console.error("Redeem failed", err);
    }
  };

  const progress = purchases % 5;
  const canRedeem = points >= 1;

  if (!customer) return <div className="p-5">Loading...</div>;

  return (
    <div className="bg-gray-100 p-5">
      {/* HEADER */}
      <button
        onClick={() => navigate("/customers")}
        className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-black"
      >
        ← Back to Customers
      </button>
      <div className="bg-white rounded-2xl p-5 shadow mb-4">
        <p className="text-gray-400 text-sm">Customer</p>
        <h2 className="text-xl font-bold mt-1">📱 {customer.phone}</h2>

        <div className="mt-3">
          <p className="text-gray-400 text-sm">Points</p>
          <h1 className="text-3xl font-bold text-amber-500">
            {points}
          </h1>
        </div>
        <div className="mt-3">
          <p className="text-gray-400 text-sm">Purchases</p>
          <h1 className="text-3xl font-bold text-amber-500">
            {purchases}
          </h1>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="bg-white rounded-2xl p-5 shadow mb-4">
        <p className="text-gray-400 text-sm mb-2">Progress</p>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${(progress / 5) * 100}%` }}
          />
        </div>

        <p className="text-center mt-2 text-gray-600">
          {Math.floor(points / 5)} coffees
        </p>
      </div>

      {/* ACTION */}
      <div className="bg-white rounded-2xl p-5 shadow">
        <p className="text-gray-400 text-sm mb-3">Add Coffee</p>

        <input
          value={pointsToAdd}
          onChange={(e) => setPointsToAdd(e.target.value)}
          type="number"
          placeholder="Number of cups"
          className="w-full h-10 px-3 border rounded-lg bg-gray-50 mb-4"
        />

        <button
          onClick={handleAddPoints}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold mb-3"
        >
          Add Coffee
        </button>

        <button
          onClick={canRedeem ? handleRedeem : undefined}
          className={`w-full py-3 rounded-lg font-bold text-white ${canRedeem ? "bg-blue-600" : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          Redeem Reward
        </button>
      </div>
    </div>
  );
}