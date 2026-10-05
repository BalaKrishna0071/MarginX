import React, { useEffect, useState } from "react";

function NmassMargin() {
  const nse_holiday_arr = [
    new Date(2026, 0, 26),
    new Date(2026, 2, 3),
    new Date(2026, 2, 26),
    new Date(2026, 2, 31),
    new Date(2026, 3, 3),
    new Date(2026, 3, 14),
    new Date(2026, 4, 1),
    new Date(2026, 4, 28),
    new Date(2026, 5, 26),
    new Date(2026, 8, 14),
    new Date(2026, 9, 2),
    new Date(2026, 9, 20),
    new Date(2026, 10, 10),
    new Date(2026, 10, 24),
    new Date(2026, 11, 25),
  ];

  const [data, setData] = useState([]);
  const [today, setToday] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [blink, setBlink] = useState(true);

  const checkExpiry = (today_, holidays) => {
    const day = today_.getDay();

    const isHoliday = (date) =>
      holidays.some(
        (h) =>
          h.getFullYear() === date.getFullYear() &&
          h.getMonth() === date.getMonth() &&
          h.getDate() === date.getDate()
      );

    const nextday = (daysAhead) => {
      const d = new Date(today_);
      d.setDate(today_.getDate() + daysAhead);
      return d;
    };

    if ((day === 2 || day === 4) && !isHoliday(today_)) return true;
    if (day === 1 && isHoliday(nextday(1))) return true;
    if (day === 3 && isHoliday(nextday(1))) return true;
    return false;
  };

  const today_ = new Date();
  const isExpiryDay = checkExpiry(today_, nse_holiday_arr);

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setToday(formattedDate);
    setCurrentDay(date.toLocaleDateString("en-US", { weekday: "long" }));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/nmass_margin_data");
      console.log(response);
      const result = await response.json();
      setData(result.data || []);
      setError("");
    } catch (fetchError) {
      console.error("Nmass fetch error:", fetchError);
      setError("Unable to load NMASS margin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isExpiryDay) return;
    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => clearInterval(interval);
  }, [currentDay, isExpiryDay]);

  useEffect(() => {
    const interval = setInterval(() => setBlink((prev) => !prev), 5000);
    return () => clearInterval(interval);
  }, []);

  const styles = {
    container: {
      width: "55%",
      maxHeight: "800px",
      overflowY: "auto",
      fontFamily: "Arial",
      border: "1px solid #ccc",
      margin: "5px auto",
      padding: "14px",
      backgroundColor: "#fff",
      borderRadius: "22px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    th: {
      backgroundColor: "#110c55",
      color: "white",
      padding: "10px 0 10px 90px",
      textAlign: "center",
      fontSize: "13px",
      fontWeight: "bold",
      position: "sticky",
      top: 0,
      margin: "10px",
      zIndex: 1
    },
    td: {
      padding: "10px",
      textAlign: "center",
      fontSize: "13px",
      // borderBottom: "1px solid #ddd"
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center", margin: "10px", color: "#333" }}>NMASS Margin Dashboard</h2>
      <p style={{ textAlign: "center", fontSize: "13px", color: "#666", margin: "10px" }}>
         Time: {today_.toLocaleString("en-GB", {day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,})}
      </p>
      
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Time</th>
            <th style={styles.th}>Total Margin</th>
            <th style={styles.th}>Utilised Margin</th>
          </tr>
        </thead>
        <tbody>
          {!isExpiryDay ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                No Margin Data (Non-Expiry Day)
              </td>
            </tr>
          ) : loading ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                Loading data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                No data available.
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const utilization = parseFloat(item["Utilised Margin"]);
              const highUtil = utilization >= 80;
              return (
                <tr key={`${item.Time}-${index}`} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                  <td style={styles.td}>{item.Time}</td>
                  <td style={styles.td}>{item["Total Margin"]}</td>
                  <td
                    style={{
                      ...styles.td,
                      color: highUtil ? "#ff0000" : "#00aa00",
                      fontWeight: highUtil ? "bold" : "normal",
                      opacity: highUtil && blink ? 0.7 : 1
                    }}
                  >
                    {item["Utilised Margin"]}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NmassMargin;
