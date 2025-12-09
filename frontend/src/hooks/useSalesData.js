import { useState, useEffect } from "react";
import { fetchSalesData } from "../services/api";

export const useSalesData = (filters, page, sort, search) => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    total_units: 0,
    total_amount: 0,
    total_discount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        // Combine all state into query params
        const params = {
          ...filters,
          page,
          sortBy: sort,
          search,
        };

        const result = await fetchSalesData(params);

        if (isMounted && result.success) {
          setData(result.data);
          setStats(result.stats);
          setTotalPages(result.total_pages);
        }
      } catch (err) {
        console.error("Hook Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Debounce search slightly to prevent spamming API while typing
    const timeoutId = setTimeout(() => {
      loadData();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [filters, page, sort, search]); // Re-run whenever these change

  return { data, stats, loading, totalPages };
};
