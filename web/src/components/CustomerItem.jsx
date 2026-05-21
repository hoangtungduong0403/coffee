import CoffeeProgress from "./CoffeeProgress";

export default function CustomerItem({ customer, onClick }) {

  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg">
          📱 {customer.phone}
        </p>
        <span className="text-sm text-gray-500 font-semibold">
          {customer.points} pts
        </span>
        <span className="text-sm text-gray-500 font-semibold">
          {customer.purchases} purchases
        </span>
      </div>

      {/* Progress */}
      <div className="mt-2">
        <CoffeeProgress progress={customer.purchases} />
      </div>
    </div>
  );
}