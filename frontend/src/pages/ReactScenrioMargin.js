import React, { useEffect, useState } from "react";

const Home = () => {
  const [tables, setTables] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchTime, setFetchTime] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  // ✅ Live Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "medium",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ API
  useEffect(() => {
    const start = Date.now();

    fetch("http://localhost:5001/parque_files")
      .then((res) => res.json())
      .then((result) => {
        setTables(result.data);
        setFetchTime(Date.now() - start);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ✅ Smart Table Renderer
  const renderTable = (tableData) => {
    if (!tableData || tableData.length === 0) {
      return <p style={{ color: "gray", fontSize: "12px" }}>No Data</p>;
    }

    const columns = Object.keys(tableData[0]);
    const colCount = columns.length;

    // 🔥 Dynamic sizing
    let fontSize = "11px";
    let padding = "4px";
    if (colCount === 1 ) {
      fontSize = "9px";
      padding = "4px";
    }
    if (colCount > 6) {
      fontSize = "11px";
      padding = "7px";
    }
    if (colCount > 10) {
      fontSize = "11px";
      padding = "7px 1px";
    }

    return (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
          fontSize,
        }}
      >
        <thead>
          <tr style={{ background: "#494949", color: "#fff" }}>
            {columns.map((col, i) => (
              <th
                key={i}
                style={{
                  padding,
                  border: "1px solid #424040",
                  wordBreak: "break-word",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableData.map((row, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "#f2f2f2" : "#fff",
              }}
            >
              {columns.map((col, j) => {
                const value = row[col];
                return (
                  <td
                    key={j}
                    style={{
                      padding,
                      border: "1px solid #ddd",
                      textAlign: "center",
                      wordBreak: "break-word",
                      color:
                        typeof value === "number"
                          ? value < 0
                            ? "red"
                            : "green"
                          : "black",
                    }}
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading) return <h2 style={{ padding: "20px" }}>Loading...</h2>;

  return (
    <div style={{ background: "#eef2f5", minHeight: "100vh" }}>
      {/* HEADER */}
      <div
        style={{
          background: "#1f2937",
          color: "white",
          padding: "4px 20px",
          display: "flex",
          borderRadius : "6px",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0 }}>📊 Dashboard</h2>

        <div style={{ fontSize: "13px", textAlign: "right" }}>
          <div>🕒 {currentTime}</div>
          <div>⚡ {fetchTime} ms</div>
        </div>
      </div>

      {/* GRID */}
      <div
        style={{
          padding: "8px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "13px",
        }}
      >
        {Object.entries(tables).map(
          ([tableName, tableData], index) => {
            const colCount =
              tableData && tableData.length > 0
                ? Object.keys(tableData[0]).length
                : 0;

            // 🔥 WIDE TABLE CONDITION
            const isWide = colCount > 6;

            return (
              <div
                key={index}
                style={{
                  gridColumn: isWide
                    ? "span 2"
                    : "span 1", // 🔥 MAGIC
                  padding: "15px",
                  borderRadius: "10px",
                  background: "#fff",
                  boxShadow:
                    "0 2px 6px rgba(0,0,0,0.08)",
                }}
              >
                <h3
                  style={{
                    fontSize: "13px",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  {tableName.replaceAll("_", " ")}
                </h3>

                {renderTable(tableData)}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Home;