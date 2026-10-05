import React, { useEffect, useState } from "react";
import axios from "axios";

function TradesMismatch() {
  const [data, setData] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [theme, setTheme] = useState("dark");

  const isDark = theme === "dark";

  const colors = {
    // bg: isDark ? "#0b1726" : "#f4f7fb",
    card: isDark ? "#0f1c2e" : "#ffffff",
    text: isDark ? "#d6e1f0" : "#1a1a1a",
    header: isDark ? "#13233a" : "#e3eaf5",
    border: isDark ? "#1a2e45" : "#d0d7e2",
    hover: isDark ? "#1a2f4a" : "#eef3fb",
    mismatch: "#ff4d4d",
    zero: "#e0e7e3"
  };

  const columns = [
    'SYMBOL_NEST', 'STRIKE_NEST', 'TYPE_NEST', 'EXPIRY_NEST',
    "DC_BUYPRICE","BUYPRICE_API219","BUYPRICE_API135",
    "DC_SELLPRICE","SELLPRICE_API219","SELLPRICE_API135",
    "LTP_NEST","LTP_API219","LTP_API135"
  ];

  const numericColumns = [
    "DC_BUYPRICE","BUYPRICE_API219","BUYPRICE_API135",
    "DC_SELLPRICE","SELLPRICE_API219","SELLPRICE_API135",
    "LTP_NEST","LTP_API219","LTP_API135"
  ];

  const formatNumber = (val) =>
    typeof val === "number" && !isNaN(val) ? val.toFixed(2) : val;

  const fetchData = () => {
    axios.get("http://localhost:5001/trades_mismatch_data")
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.data);
          setLastRefresh(new Date());
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getMismatchMap = (values) => {
    const normalized = values.map((v) =>
      typeof v === "number" ? Number(v).toFixed(2) : v
    );

    const counts = {};
    normalized.forEach((v) => {
      counts[v] = (counts[v] || 0) + 1;
    });

    const majorityValue = Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );

    return normalized.map((v) => v !== majorityValue);
  };

  return (
    <div style={{
      background: colors.bg,
      minHeight: "90vh",
      padding: "18px",
      color: colors.text,
      fontFamily: "Arial"
    }}>

      {/* HEADER BAR */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px"
      }}>
        <h3 style={{ margin: 0 }}>
          Trade Mismatch
          <span style={{
            marginLeft: "10px",
            fontSize: "12px",
            color: "#7fa6d6"
          }}>
            {lastRefresh && `(Updated: ${lastRefresh.toLocaleTimeString()})`}
          </span>
        </h3>

        {/* THEME TOGGLE */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            background: isDark ? "#1f3a5a" : "#dce6f5",
            color: isDark ? "#fff" : "#000"
          }}
        >
          {isDark ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* TABLE CARD */}
      <div style={{
        background: colors.card,
        borderRadius: "2px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
      }}>
        {/* Scroll wrapper */}
        <div style={{
          maxHeight: "85vh", // vertical scroll
          overflowY: "auto",
          overflowX: "auto",
          borderRadius: "20px"
        }}>
          <table style={{
            width: "50%",
            minWidth: "1100px",
            borderCollapse: "collapse",
            fontSize: "13px",
            border: `1px solid ${colors.border}`,
          }}>
            {/* HEADER */}
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    style={{
                      background: colors.header,
                      border: "1px solid",
                      padding: "4px 8px",
                      whiteSpace: "nowrap",
                      position: "sticky",
                      top: 0,
                      zIndex: 1000
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {data.map((row, idx) => {

                const buyMismatch = getMismatchMap([
                  row.DC_BUYPRICE,
                  row.BUYPRICE_API219,
                  row.BUYPRICE_API135
                ]);

                const sellMismatch = getMismatchMap([
                  row.DC_SELLPRICE,
                  row.SELLPRICE_API219,
                  row.SELLPRICE_API135
                ]);

                const ltpMismatch = getMismatchMap([
                  row.LTP_NEST,
                  row.LTP_API219,
                  row.LTP_API135
                ]);

                return (
                  <tr key={idx}>
                    {columns.map((col) => {
                      let color = colors.text;
                      let bg = "transparent";
                      const value = row[col];

                      // BUY
                      if (["DC_BUYPRICE","BUYPRICE_API219","BUYPRICE_API135"].includes(col)) {
                        const i = ["DC_BUYPRICE","BUYPRICE_API219","BUYPRICE_API135"].indexOf(col);
                        if (buyMismatch[i]) {
                          color = colors.mismatch;
                          bg = isDark ? "#2a0f14" : "#ffe5e5";
                        }
                      }

                      // SELL
                      if (["DC_SELLPRICE","SELLPRICE_API219","SELLPRICE_API135"].includes(col)) {
                        const i = ["DC_SELLPRICE","SELLPRICE_API219","SELLPRICE_API135"].indexOf(col);
                        if (sellMismatch[i]) {
                          color = colors.mismatch;
                          bg = isDark ? "#2a0f14" : "#ffe5e5";
                        }
                      }

                      // LTP
                      if (["LTP_NEST","LTP_API219","LTP_API135"].includes(col)) {
                        const i = ["LTP_NEST","LTP_API219","LTP_API135"].indexOf(col);
                        if (ltpMismatch[i]) {
                          color = colors.mismatch;
                          bg = isDark ? "#2a0f14" : "#ffe5e5";
                        }
                      }

                      // ZERO / NEG
                      if (typeof value === "number") {
                        if (value === 0) color = colors.zero;
                        if (value < 0) color = "#ff4d4d";
                      }

                      return (
                        <td
                          key={col}
                          style={{
                            padding: "10px 4px",
                            textAlign: "center",
                            // borderBottom: `1px solid ${colors.border}`,
                            // background: bg,
                            whiteSpace: "nowrap",
                            color: color,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          {numericColumns.includes(col)
                            ? formatNumber(value)
                            : value}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default TradesMismatch;