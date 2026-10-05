import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { FaHome, FaChartLine, FaSignOutAlt } from "react-icons/fa";
import {ChartColumn, House, Wallet, Scale, Search, FileSpreadsheet, TriangleAlert, ArrowLeftRight, RefreshCw, LogOut, ChartCandlestick} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 40%, #eef2ff 100%)",
  };

  const sidebarStyle = {
    width: isOpen ? "240px" : "72px",
    background: "linear-gradient(180deg, #08104e 0%, #0d0755 100%)",
    color: "#ffffff",
    padding: isOpen ? "24px 18px" : "24px 12px",
    transition: "width 0.3s ease, padding 0.3s ease",
    position: "relative",
    boxShadow: "4px 0 30px rgba(15, 23, 42, 0.08)",
  };

  const menuItemStyle = (active) => ({
    margin: "14px 0",
    cursor: "pointer",
    padding: "14px 16px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    color: active ? "#ffffff" : "#e0e7ff",
    background: active ? "rgba(255,255,255,0.12)" : "transparent",
    border: active ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent",
    boxShadow: active ? "0 10px 20px rgba(59, 130, 246, 0.12)" : "none",
    transition: "all 0.25s ease",
  });

  const contentStyle = {
    flex: 1,
    padding: "28px",
    background: "transparent",
    minHeight: "100vh",
    boxSizing: "border-box",
    overflow: "auto",
  };

  const pageWrapperStyle = {
    minHeight: "50%",
    background: "#f8fafc",
    borderRadius: "28px",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
    padding: "28px",
    boxSizing: "border-box",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "28px",
  };

  const titleStyle = {
    margin: 0,
    fontSize: "28px",
    color: "#111827",
  };

  const subtitleStyle = {
    margin: "6px 0 0",
    fontSize: "15px",
    color: "#6b7280",
    maxWidth: "500px",
    lineHeight: 1.65,
  };

  const statsStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "18px",
    marginBottom: "28px",
  };

  const statCardStyle = {
    background: "white",
    borderRadius: "20px",
    padding: "20px 33px",
    boxShadow: "0 6px 32px rgba(12, 44, 119, 0.69)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  };

  const statLabelStyle = {
    margin: 0,
    fontSize: "13px",
    color: "#64748b",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  };

  const statValueStyle = {
    margin: "10px 0 0",
    fontSize: "24px",
    fontWeight: 700,
    color: "#111827",
  };

  const smallMetaStyle = {
    margin: "6px 0 0",
    fontSize: "13px",
    color: "#64748b",
  };

  const sidebarItems = [
    { label: "Home", path: "/home", icon:  House },
    { label: "Nmass Margin", path: "/home/nmassmargin", icon: Wallet },
    { label: "Scenario Margin", path: "/home/scenariomargin", icon: Scale },
    { label: "Stocks Screener", path: "/home/stockcomparison", icon: ChartCandlestick },
    { label: "Excel Watch", path: "/home/excelwatch", icon: FileSpreadsheet },
    { label: "Positions Mismatch", path: "/home/positionsmismatch", icon: TriangleAlert },
    { label: "Trades Mismatch", path: "/home/tradesmismatch", icon: ArrowLeftRight },
    { label: "Trades Mismatch_v2", path: "/home/tradesmismatch_testing", icon: RefreshCw },
    
  ];

  const icon = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  };

  const hamburgerStyle = {
    width: "30px",
    height: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    cursor: "pointer",
    marginBottom: "36px",
  };

  const barStyle = (index) => ({
    height: "4px",
    width: "100%",
    background: "white",
    borderRadius: "999px",
    transform:
      isOpen
        ? index === 0
          ? "rotate(45deg) translate(4px, 4px)"
          : index === 1
          ? "scale(0)"
          : "rotate(-45deg) translate(4px, -4px)"
        : "rotate(0) translate(0,0)",
    transition: "transform 0.3s ease, opacity 0.3s ease",
  });

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <div
          style={hamburgerStyle}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div style={barStyle(0)} />
          <div style={barStyle(1)} />
          <div style={barStyle(2)} />
        </div>

        {isOpen && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.16)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <ChartColumn size={18} color="#e0e7ff" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "13px", color: "#c7d2fe", letterSpacing: "0.04em" }}>MarginX</p>
              <h2 style={{ margin: 0, fontSize: "20px", color: "#ffffff" }}>Dashboard</h2>
            </div>
          </div>
        )}
{sidebarItems.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <div key={path} style={menuItemStyle(active)} onClick={() => navigate(path)}>
              <Icon size={20} />
              {isOpen && label}
            </div>
          );
        })}

        {/* <div style={{ ...menuItem, ...icon }} onClick={() => navigate("/home/login")}>
          <FaChartLine size={20} />
          {isOpen && "Login"}
        </div> */}

        <div
          style={{
            ...menuItemStyle(false),
            ...icon,
            marginTop: "auto",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "18px",
          }}
          onClick={() => navigate("/")}
        >
          <LogOut size={18} />
          {isOpen && "Exit"}
        </div>
      </div>

      <div style={contentStyle}>
        <div style={pageWrapperStyle}>
          {location.pathname === "/home" ? (
            <>
              <div style={headerStyle}>
                <div>
                  <h1 style={titleStyle}>Welcome to MarginX</h1>
                  <p style={subtitleStyle}>Monitor your portfolios, compare margins, and catch trade discrepancies.</p>
                </div>
                <div style={{ display: "grid", gap: "10px", textAlign: "right" }}>
                  <span style={{ color: "#475569", fontSize: "14px" }}>Live update enabled</span>
                  <div style={{ padding: "10px 18px", borderRadius: "999px", background: "#eef2ff", color: "#4338ca", fontWeight: 600, fontSize: "13px" }}>v1.0</div>
                </div>
              </div>

              <div style={statsStyle}>
                <div style={statCardStyle}>
                  <p style={statLabelStyle}>Active Views</p>
                  <p style={statValueStyle}>7 sections</p>
                  <p style={smallMetaStyle}>Quick access to all dashboard modules.</p>
                </div>
                <div style={statCardStyle}>
                  <p style={statLabelStyle}>Realtime watch</p>
                  <p style={statValueStyle}>Enabled</p>
                  <p style={smallMetaStyle}>Data refresh every 30 seconds.</p>
                </div>
                <div style={statCardStyle}>
                  <p style={statLabelStyle}>Risk signals</p>
                  <p style={statValueStyle}>Stable</p>
                  <p style={smallMetaStyle}>No critical anomalies detected.</p>
                </div>
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;