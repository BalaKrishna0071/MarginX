import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SecurityIcon from '@mui/icons-material/Security';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from "react-toastify";
import {Layers3 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";


const Login = () => {
  const navigate = useNavigate();
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [focusedField, setFocusedField] = useState("");




  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (username === "admin" && password === "1212") {
        toast.success("Login Successful ✅");
        navigate("/home");
      } else {
        setError("Invalid username or password ❌");
        toast.error("Invalid username or password ❌");
      }
      setLoading(false);
    }, 600);
  };

  // Styles
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 36%), linear-gradient(135deg, rgb(23, 7, 68) 0%, rgb(26, 9, 73), rgb(25, 11, 71))",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "20px",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "380px",
    minWidth: "320px",
    padding: "42px 30px",
    background: "rgba(240, 240, 247, 0.96)",
    borderRadius: "28px",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.16)",
    border: "1px solid rgba(255,255,255,0.72)",
    backdropFilter: "blur(14px)",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "16px",
    borderRadius: "16px",
    border: "1px solid #d1d5db",
    background: "#f8fafc",
    color: "#111827",
    fontSize: "15px",
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
    outline: "none",
    boxSizing: "border-box",
  };

  const getInputStyle = (field) => ({
    ...inputStyle,
    ...(focusedField === field ? {
      borderColor: "#120e63",
      boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.14)",
      background: "#ffffff",
    } : {}),
  });

  const getButtonStyle = () => ({
    width: "100%",
    padding: "14px 0",
    background: loading
      ? "linear-gradient(135deg, #9ca3af, #6b7280)"
      : buttonHovered
      ? "linear-gradient(135deg, #131866 , #06173d)"
      : "linear-gradient(135deg, #131866, #06173d )",
    color: "#ffffff",
    border: "none",
    borderRadius: "16px",
    cursor: loading ? "not-allowed" : "pointer",
    fontSize: "16px",
    fontWeight: 600,
    boxShadow: loading ? "0 0 0 rgba(0,0,0,0)" : "0 16px 36px rgba(59, 130, 246, 0.24)",
    opacity: loading ? 0.85 : 1,
    transition: "transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, opacity 0.25s ease",
  });

  const titleStyle = {
    margin: 0,
    fontSize: "28px",
    color: "#111827",
    textAlign: "center",
    marginBottom: "8px",
  };

  const subTextStyle = {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: "28px",
    lineHeight: 1.6,
  };

  const helperTextStyle = {
    color: "#f97316",
    fontSize: "13px",
    marginTop: "8px",
  };

  
  return (
    <div style={containerStyle}>
      <ToastContainer position="top-right" autoClose={1000} />
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Layers3 style={{ fontSize: 92, color: "#090d49", marginBottom: 10 }} />
          <h2 style={titleStyle}>Secure Access</h2>
          <p style={subTextStyle}>
            MarginX
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={getInputStyle("username")}
            required
            onFocus={() => setFocusedField("username")}
            onBlur={() => setFocusedField("")}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={getInputStyle("password")}
              required
              onKeyUp={(e) => setCapsLockOn(e.getModifierState("CapsLock"))}
              onFocus={() => setFocusedField("password")}
              onBlur={() => {
                setFocusedField("");
                setCapsLockOn(false);
              }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-67%)",
                cursor: "pointer",
                color: "#6b7280",
                padding: "4px",
                opacity: 0.875,
              }}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </span>

            {capsLockOn && (
              <p style={helperTextStyle}>
                ⚠️ Caps Lock is ON
              </p>
            )}
          </div>


          <button
            type="submit"
            style={getButtonStyle()}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Error */}
          {error && (
            <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
          )}
        </form>

        
      </div>
    </div>
  );
};

export default Login;