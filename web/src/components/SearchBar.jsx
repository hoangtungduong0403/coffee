import { useState } from "react";
import AddCustomerModal from "./AddCustomerModal";
import api from "../utils/axios";
export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSearch = () => {
    if(value.trim() === "") return;
    onSearch?.(value);
  };

  const handleAddCustomer = () => {
    setIsAddModalOpen(true);
  };

  const handleAddCustomerSubmit = async (mobile) => {
  try {
    const res = await api.post("/users", {
      phone: mobile,
    });
    const newCustomer = res.data;
    setIsAddModalOpen(false);
  } catch (err) {
    console.error("Create customer failed", err);

    alert(
      err?.response?.data?.message || "Failed to create customer"
    );
  }
};

  return (
    <>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter phone..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <button
          onClick={handleSearch}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 rounded-lg transition"
        >
          Search
        </button>
        <button
          onClick={handleAddCustomer}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg transition"
        >
          Add Customer
        </button>
      </div>

      <AddCustomerModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCustomerSubmit}
      />
    </>
  );
}
