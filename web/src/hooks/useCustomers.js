import { useState } from "react";
import api from "../utils/axios";
export function useCustomers() {
  const [customers, setCustomers] = useState([]);

  const search = async (phone) => {
    try {
      const res = await api.get("/users", {
        params: { phone },
      });

      setCustomers(res.data[0] || []);
    } catch (err) {
      console.error("Search failed", err);
      setCustomers([]);
    }
  };

  return { customers, search };
}