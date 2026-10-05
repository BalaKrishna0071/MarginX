
import Skeleton from "@mui/material/Skeleton";
import {useState, useEffect} from "react";


// StockComparison Componenet
function StockComparison(){

    // State Variables
    const [data, setData] = useState([]);
    const [today, setToday] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({key: "price_diff", direction: "desc"})


    // Fetch APi Func
    const fetchData = () => {
      
        // Today Date
        setToday(new Date().toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        }));

        fetch("http://localhost:5001/stocks_comparison")
        .then(res => res.json())
        .then(data => {
            // console.log("API DATA:", data)
            setData(data);
            setLoading(false);
            setError(null);
                    })
        .catch(err =>{
            console.error("Fetch Error", err);
            setError("API Failed");
            setLoading(false);
        });
    };


    // useEffect Hook
    useEffect(() => {

        // Calling
        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(interval);

    }, []);
    

    // CSS Keyframe
    const keyframes = `
    @keyframes pulseGlow{
        0% : {
            background-color: rgba(255, 0, 0, 0.05);
            transform: scale(1);
        }
        50% : {
            background-color: rgba(255, 0, 0, 0.25);
            transform: scale(1.02);
        }
        100% : {
            background-color: rgba(255, 0, 0, 0.05);
            transform: scale(1);
        }
    }
    `;


    // CSS Part 
    const styles = {

        container: {
            width: "95%",
            maxWidth: "1080px",
            maxHeight: "calc(100vh - 40px)",
            overflow: "hidden",
            fontFamily: "Arial, sans-serif",
            border: "1px solid #d1d5db",
            margin: "12px auto",
            padding: "16px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            boxShadow: "0 20px 45px rgba(15,23,42,0.08)",
            boxSizing: "border-box",
        },

        tableWrapper: {
            overflowY: "auto",
            maxHeight: "calc(100vh - 220px)",
            paddingRight: "8px",
        },

        table: {
            width: "100%",
            padding: "10px",
            borderCollapse: "separate", 
            borderSpacing: "0"

        },

        thead: {
            position: "sticky",
            top: 0,
            backgroundColor: "#110c55",
            color: "white",
            zIndex: 1,
            padding: "6px",
            fontSize: "14px",
            cursor: "pointer",
            userSelect: "none",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
        },

        highlight: {
            animation: "pulseGlow 0.8s ease-in-out infinite",
            backgroundColor: "rgb(144, 250, 185)",
            fontWeight: 500,
            transition: "all 0.3s ease",
        },

        row: {
            transition: "all 0.2s ease",
            cursor: "pointer"
        },

        rowHover: {
            backgroundColor: "#e3f2fd"
        }

    };

    // Sorting Handler
    const handleSort = (column) => {
        setSortConfig((prev) => {
            const isSameColumn = prev.key === column;
            return {
                key: column,
                direction: isSameColumn ? prev.direction === "asc" ? "desc" : "asc" : "desc"
            }
        })
    }
    

    // Sorting Data 
    const sortedData = [...(data.data || [])].sort(
        (a, b) => {
            const {key, direction} = sortConfig;
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
            
        });

        
    // Html 
    return (
        <div style={styles.container}>
            
            <h2 style={{display: "flex", justifyContent:"center", margin: "10px", color: "#3d3838"}}>Stock Comparison</h2>
            <p style={{display: "flex", justifyContent:"center", fontSize: "13px", color: "#3d3838", margin: "2px"}}>Time: {today}</p>
            <div style={styles.tableWrapper}>
              {(loading || error || !(data?.data?.length)) ? (
                <table style={styles.table}>
                    <thead>
                        <tr>
                        <th style={styles.thead}>Timestamp</th>
                        <th style={styles.thead}>Symbol</th>
                        <th style={styles.thead}>Link_LTP</th>
                        <th style={styles.thead}>Live_LTP</th>
                        <th style={styles.thead}>Price_Diff</th>
                    </tr>
                    </thead>
                    <tbody>
                        {[...Array(34)].map((_, i) => {
                            return(
                                <tr key={i}>    
                                <td><Skeleton variant="text" width="80%" animation="wave" height={20} /></td>
                                <td><Skeleton variant="text" width="80%" animation="wave" height={20} /></td>
                                <td><Skeleton variant="text" width="80%" animation="wave" height={20} /></td>
                                <td><Skeleton variant="text" width="80%" animation="wave" height={20} /></td>
                                <td><Skeleton variant="text" width="80%" animation="wave" height={20} /></td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
                ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.thead}>Timestamp</th>
                            <th style={styles.thead}>Symbol</th>
                            <th style={styles.thead}>Link_LTP</th>
                            <th style={styles.thead}>Live_LTP</th>
                            <th style={styles.thead} onClick={() => {handleSort("price_diff")}}>Price_Diff{" "}{sortConfig.key === "price_diff" ? sortConfig.direction === "asc" ? "▲" : "▼" : ""}</th>
                        </tr>
                    </thead>
                    <tbody style={styles.tbody}>
                        <style>{keyframes}</style>
                            {(sortedData || []).map((item, index) => (
                                <tr key={index} style={{backgroundColor: index %2 ===0 ? "#f9f9f9": "#ffffff"}}onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e3f2fd"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}>
                                    <td style={{ padding: "8px", textAlign: "center", fontSize: "13px"}}>{item.time_stamp}</td>
                                    <td style={{padding: "8px", textAlign: "center",  fontSize: "13px"}}>{item.symbol}</td>
                                    <td style={{padding: "8px", textAlign: "center", fontSize: "13px"}}>{item.link_ltp}</td>
                                    <td style={{padding: "8px", textAlign: "center", fontSize: "13px"}}>{item.live_ltp}</td>
                                    <td style={{padding: "8px", textAlign: "center", fontSize: "15px", fontWeight: item.price_diff >= 0 ? 700 : "normal", color: item.price_diff >= 10 ? "#ef4444": "#15dd15", transition: "all 0.3s ease"}}>{item.price_diff}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
            </div>
        </div>
    );
};

export default StockComparison;