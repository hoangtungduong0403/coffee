import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL;

export function useRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);

    const fetchInitial = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${BASE_URL}/requests`);
        const data = await res.json();

        setRequests(data);
      } catch (err) {
        console.error("Fetch requests failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();

    // ✅ new request
    socket.on("new-request", (data) => {
      setRequests((prev) => {
        if (prev.some((r) => r.id === data.id)) return prev;
        return [data, ...prev];
      });
    });

    // ✅ approved request
    socket.on("request-approved", ({ requestId }) => {
      setRequests((prev) =>
        prev.filter((r) => r.id !== requestId)
      );
    });

    return () => {
      socket.off("new-request");
      socket.off("request-approved");
      socket.disconnect();
    };
  }, []);

  return { requests, loading, setRequests };
}