import React, { useEffect, useState } from "react";
import axios from "axios";

function TradesMismatch_v4() {
  const [data, setData] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [colWidths, setColWidths] = useState({});
  const [zoom, setZoom] = useState(1);
  const [pnlData, setPnlData] = useState({});
  const [fileTimestamp, setFileTimestamp] = useState(null);
  const isDark = theme === "dark";

  const thStyle = {
  padding: "10px",
  textAlign: "center",
  color: "#b0b8c1",
  fontWeight: 600,
};

const tdStyle = {
  padding: "10px",
  textAlign: "center",
  borderBottom: "1px solid #1f2d3a",
};
  const colors = {
    bg: isDark ? "#0b1726" : "#f4f7fb",
    card: isDark
      ? "linear-gradient(180deg, #16263c 0%, #0f1c2e 100%)"
      : "#ffffff",
    text: isDark ? "#d6e1f0" : "#1a1a1a",
    header: isDark ? "#13233a" : "#e3eaf5",
    border: isDark
      ? "rgba(250, 250, 250, 0.6)"
      : "rgba(0,0,0,0.08)",
    divider: isDark
      ? "rgba(250, 250, 250, 0.72)"
      : "rgba(0,0,0,0.12)",
    mismatch: "#ff4d4d"
  };

  const columns = [
    'SYMBOL_NEST','STRIKE_NEST','TYPE_NEST','EXPIRY_NEST',
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
      .then(res => {
        setData(res.data.data);
        setFileTimestamp(res.data.file_timestamp);
        // console.log("Fetched data:", res.data.file_timestamp);
        setPnlData(res.data.pnl);
        setLastRefresh(new Date());
        
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Resize
  const startResize = (e, index) => {
    const startX = e.clientX;
    const startWidth = colWidths[index] || 120;

    const onMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      setColWidths(prev => ({
        ...prev,
        [index]: Math.max(newWidth, 60)
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const getMismatchMap = (values) => {
    const normalized = values.map(v =>
      typeof v === "number" ? v.toFixed(2) : v
    );

    const counts = {};
    normalized.forEach(v => counts[v] = (counts[v] || 0) + 1);

    const majority = Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );

    return normalized.map(v => v !== majority);
  };

  const separatorIndex = [3, 6, 9];

  const formatPnLInLakhs = (val) => {
    if (val === undefined || val === null) return "-";

    const num = Number(val);
    if (isNaN(num)) return val;

    const lakhs = num / 100000;

    return lakhs.toFixed(2);   // 2 decimal places
  };

  const formatPnLDiff = (backup, main) => {
    const backupNum = Number(backup);
    const mainNum = Number(main);

    if (isNaN(backupNum) || isNaN(mainNum)) return "-";

    return ((backupNum - mainNum) / 100000).toFixed(2);
  };

  return (
    <div style={{
      background: colors.bg,
      minHeight: "90vh",
      padding: 10,
      color: colors.text
    }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
      }}>

        
        

      <div style={{ display: "flex", gap: 20 }}>

        {/* <h3 style={{ color: "#00c853" }}>
          Nest Pnl : ₹ {formatPnLInLakhs(pnlData?.Nest_Pnl)}K
        </h3> */}

        <h3 style={{ color: "#00c853" }}>
          Nest Pnl(L) :  {(pnlData?.Nest_Pnl/100000).toFixed(2)}
        </h3>

        {/* <h3 style={{ color: "#00c853" }}>
            Main Pnl : ₹ {formatPnLInLakhs(pnlData?.Main_Pnl)}K
        </h3> */}
        
        <h3 style={{ color: "#00c853" }}>
            Main Pnl :  {(pnlData?.Main_Pnl/100000).toFixed(2)}
        </h3>

        {/* <h3 style={{ color: "#00c853" }}>
          Backup Pnl : ₹ {formatPnLInLakhs(pnlData?.Backup_Pnl)}K
        </h3> */}
        
        <h3 style={{ color: "#00c853" }}>
          Backup Pnl :  {(pnlData?.Backup_Pnl/100000).toFixed(2)}
        </h3>

        {/* <h3 style={{ color: "#00c853" }}>
          Diff : ₹ {formatPnLDiff(pnlData?.Nest_Pnl, pnlData?.Main_Pnl)}K
        </h3> */}

        {/* <h3 style={{ color: "#00c853" }}>
          Diff :  {((pnlData?.Nest_Pnl - pnlData?.Main_Pnl) / 100000).toFixed(2)}
        </h3> */}
      </div>
      <div
        style={{
            padding: "10px 16px",
            background: "#0f1b2b",
            borderRadius: "6px",
            color: "#fff",
            fontSize: "13px",
            marginLeft: "-12rem",
        }}
        >
        <table
            style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "520px",
            }}
        >
            <thead>
            <tr style={{ borderBottom: "1px solid #2c3e50" }}>
                <th style={thStyle}>Comparison</th>
                <th style={thStyle}>A</th>
                <th style={thStyle}>B   </th>
                <th style={thStyle}>Difference</th>
            </tr>
            </thead>

            <tbody>
            {/* Main vs Backup */}
            <tr>
                <td style={tdStyle}>Main ↔ Backup</td>

                <td style={tdStyle}>
                {(pnlData?.Main_Pnl / 100000).toFixed(2)} 
                </td>

                <td style={tdStyle}>
                {(pnlData?.Backup_Pnl / 100000).toFixed(2)} 
                </td>

                <td
                style={{
                    ...tdStyle,
                    color:
                    (pnlData?.Main_Pnl - pnlData?.Backup_Pnl) > 0
                        ? "#00e676"
                        : "#ff5252",
                    fontWeight: 700,
                }}
                >
                {((Math.abs(pnlData?.Main_Pnl) - Math.abs(pnlData?.Backup_Pnl)) / 100000).toFixed(2)} 
                </td>
            </tr>

            {/* Main vs Nest */}
            <tr>
                <td style={tdStyle}>Main ↔ Nest</td>

                <td style={tdStyle}>
                {(pnlData?.Main_Pnl / 100000).toFixed(2)} 
                </td>

                <td style={tdStyle}>
                {(pnlData?.Nest_Pnl / 100000).toFixed(2)} 
                </td>

                <td
                style={{
                    ...tdStyle,
                    color:
                    (pnlData?.Main_Pnl - pnlData?.Nest_Pnl) > 0
                        ? "#00e676"
                        : "#ff5252",
                    fontWeight: 700,
                }}
                >
                {((Math.abs(pnlData?.Main_Pnl) - Math.abs(pnlData?.Nest_Pnl)) / 100000).toFixed(2)} 
                </td>
            </tr>
            </tbody>
        </table>
        </div>

        <div style={{ display: "flex", gap: 8 ,padding: "15px 4px",  }}>
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>➖</button>
          <button onClick={() => setZoom(1)}>Reset</button>
          <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}>➕</button>

          <button onClick={() => setTheme(isDark ? "light" : "dark")}>
            {isDark ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      {/* ✅ KEY: dynamic wrapper */}
      <div style={{
        width: "100%",
        // overflow: "auto",
        overflowX: "auto"
        // overflowX: zoom === 1 ? "hidden" : "auto"
      }}>

        {/* ✅ ZOOM WRAPPER (ONLY ACTIVE WHEN ZOOM ≠ 1) */}
        <div style={
          zoom === 1
            ? { width: "max-content",   // always content-based
                minWidth: "100%", }      // but never smaller than container }   // ✅ FULL WIDTH ON RESET
            : {
                // transform: `scale(${zoom})`,
                // transformOrigin: "top left",
                //  overflowX: "auto",
                //  overflow: "auto",
                // width: "fit-content"
                // width: zoom === 1 ? "100%" : "fit-content"
                // width: `${100 / zoom}%`
              }
        }>

          {/* CARD */}
          <div style={{
            background: colors.card,
            borderRadius: 10,
            padding: "10px 14px 10px 10px",
            border: `1px solid ${colors.border}`,
            width: zoom === 1 ? "88%" : "fit-content"   // ✅ FIX
          }}>
            <h3>
                Trade Mismatch
                {/* <span style={{ marginLeft: 10, fontSize: 13 }}>
                    {lastRefresh && `(Refresh: ${lastRefresh.toLocaleTimeString()})`}
                </span> */}
                <span style={{ marginLeft: 10, fontSize: 13 }}>
                    {fileTimestamp && `(Trade File Modify Time: ${fileTimestamp})`}
                </span>
            </h3>

            <table style={{
              width: zoom === 1 ? "100%" : "max-content", // ✅ FIX
              // display: "inline-table",
              borderCollapse: "collapse",
              fontSize: 10,
              // borderCollapse: "separate",
              borderSpacing: 0
            }}>

              <thead>
                <tr>
                  <th colSpan={4} style={{...groupStyle(colors), position: "sticky", top: 0, zIndex: 10}}></th>
                  <th colSpan={3} style={{...groupStyle(colors), position: "sticky", top: 0, zIndex: 10}}>BUYPRICE</th>
                  <th colSpan={3} style={{...groupStyle(colors), position: "sticky", top: 0, zIndex: 10}}>SELLPRICE</th>
                  <th colSpan={3} style={{...groupStyle(colors), position: "sticky", top: 0, zIndex: 10}}>LTP</th>
                </tr>

                <tr>
                  {[
                    "SYMBOL","STRIKE","TYPE","EXPIRY",
                    "Dropcopy Trades","Portfolio Trades (Main)","Portfolio Trades (Backup)",
                    "Dropcopy Trades","Portfolio Trades (Main)","Portfolio Trades (Backup)",
                    "NEST","Main Server","Backup Server"
                  ].map((col, i) => (
                    <th
                      key={i}
                      style={{
                        width: colWidths[i] || "auto",
                        minWidth: colWidths[i] || 80,
                        position: "sticky",
                        top: 32,   // 👈 adjust 30–40 if needed
                        zIndex: 9,
                        background: colors.header,
                        border: `1px solid ${colors.border}`,
                        borderRight: separatorIndex.includes(i)
                          ? `2px solid ${colors.divider}`
                          : `1px solid ${colors.border}`,
                        padding: "5px",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {col}

                      <div
                        onMouseDown={(e) => startResize(e, i)}
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          width: 4,
                          height: "100%",
                          cursor: "col-resize"
                        }}
                      />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.map((row, idx) => {

                  const buy = getMismatchMap([
                    row.DC_BUYPRICE,row.BUYPRICE_API219,row.BUYPRICE_API135
                  ]);
                  const sell = getMismatchMap([
                    row.DC_SELLPRICE,row.SELLPRICE_API219,row.SELLPRICE_API135
                  ]);
                  const ltp = getMismatchMap([
                    row.LTP_NEST,row.LTP_API219,row.LTP_API135
                  ]);

                  return (
                    <tr key={idx}>
                      {columns.map((col) => {
                        let color = colors.text;
                        const val = row[col];

                        if (numericColumns.includes(col)) {
                          const group = col.includes("BUY") ? buy :
                                        col.includes("SELL") ? sell : ltp;
                          const index = col.includes("DC") ? 0 :
                                        col.includes("219") ? 1 : 2;
                          if (group[index]) color = colors.mismatch;
                        }

                        return (
                          <td
                            key={col}
                            style={{
                              padding: "0px",
                              textAlign: "center",
                              border: `1px solid ${colors.border}`,
                              color,
                              whiteSpace: "nowrap"
                            }}
                          >
                            {numericColumns.includes(col)
                              ? formatNumber(val)
                              : val}
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
    </div>
  );
}

const groupStyle = (colors) => ({
  background: colors.header,
  padding: "5px",
  border: `1px solid ${colors.border}`
});

export default TradesMismatch_v4;