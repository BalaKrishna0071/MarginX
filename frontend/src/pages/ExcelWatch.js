import {useState, useEffect, useRef} from "react";


function ExcelWatch() {

    const alertedSymbol = useRef(new Set());
    const lastAlertTime = useRef(new Map());
    const latestData = useRef(null);
    const [excelIndexData, setIndexData] = useState([]);
    const [excelOptionData, setOptionData] = useState([]);

    const tableStyle = {
        width: "30%",
        borderSpacing: "0",
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(64, 66, 182, 0.84)",
    };

    const tableStyleOption = {
        width: "60%",
        borderSpacing: "0",
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(64, 66, 182, 0.84)",
    };

    const thStyle = {
        padding: "6px 8px",
        backgroundColor: "#091b5efd",
        color: "#f8fafc",
        fontSize: "14px",
        fontWeight: "600",
        textAlign: "center",
        // borderBottom: "2px solid #334155",
    };

    const tdStyle = {
        padding: "5px 8px",
        color: "#1e293b",
        fontSize: "14px",
        textAlign: "center",
        borderBottom: "1px solid #e2e8f0",
    };

    const dateStyle = {
        fontSize: "12px",
        fontWeight: "500",
        color: "#fafafa",
        backgroundColor: "#0c1e5a",
        padding: "8px 12px",
        borderRadius: "6px",
        // border: "1px solid #cbd5e1",
    };

    const titleStyle = {
        fontWeight: "700",
        color: "#282a2c",
    };

    const speakAlert = (message) => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const speech = new SpeechSynthesisUtterance(message);
            speech.rate = 1;
            speech.pitch = 1;
            speech.volume = 1;
            window.speechSynthesis.speak(speech);
        }
    };


    const checkSingleLtt = (price, ltt, name) => {
         if (price == null)
        return;

        if (!ltt) return;

        const now = new Date();
        const [h, m, s] = ltt.split(":").map(Number);
        const isValidTime = /^\d{2}:\d{2}:\d{2}$/.test(ltt);
        if (!isValidTime)
            return;
        const lttTime = new Date();
        lttTime.setHours(h, m, s, 0);
        const diff = now.getTime() - lttTime.getTime();

        // Check if Diff > 1
        if (diff > 60000) {
           
            const lastSpoken = lastAlertTime.current.get(name);

            if (!lastSpoken || now.getTime() - lastSpoken > 60000) {
                // Speak & Print
                console.log("excel not updating");
                speakAlert("excel not updating");
                lastAlertTime.current.set(name, now.getTime());
            }

        } else {
            lastAlertTime.current.delete(name);
        }
    };



    const checkLtt = (data) => {
        const now = new Date();
        const day = now.getDay();

        // Saturday / Sunday
        if (day === 0 || day === 6) {
            return;
        }

        // Market start: 9:15 AM
        const marketStart = new Date();
        marketStart.setHours(9, 15, 0, 0);

        // Market end: 3:40 PM
        const marketEnd = new Date();
        marketEnd.setHours(15, 40, 0, 0);

        // Outside market hours
        if (now < marketStart || now > marketEnd) {
            return;
        }

        // Check INDEX
        data.index?.forEach((item) => {
            checkSingleLtt(item.ltp, item.ltt, `${item.symbol} index`);
        });

        // Check OPTIONS
        data.options?.forEach((item) => {
            checkSingleLtt(item.price, item.ltt, `${item.symbol} ${item.strike} ${item.type} option`);
        });
    };


    useEffect(() => {

        const ws = new WebSocket('ws://172.16.47.57:8004/ws');
        ws.onopen = () => {
            console.log("Connected");
        };
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setIndexData(data.index || []);
            setOptionData(data.options || []);
            latestData.current = data;
        };
        ws.onerror = (error) => {
            console.log(error);
        };
        ws.onclose = () => {
            console.log("Socket Closed");
        };
        return () => {
            ws.close();
        }

    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (latestData.current) {
                checkLtt(latestData.current);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };

    }, []);

  return (
    <div >
        <h1>Excel Watch</h1>
        <span style={dateStyle}>Time: {new Date().toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        })}
        </span>
        <div className="tables">
            <h2 style={titleStyle}>Index Data</h2>
            {excelIndexData.length > 0 ? (
                <div>
                    <table border="1" style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Symbol</th>
                                <th style={thStyle}>LTP</th>
                                <th style={thStyle}>LTT</th>
                            </tr>
                        </thead>

                        <tbody>
                            {excelIndexData.map((row, index) => (
                                <tr key={index}>
                                    <td style={tdStyle}>{row.symbol}</td>
                                    <td style={tdStyle}>{row.ltp ?? "--"}</td>
                                    <td style={tdStyle}>{row.ltt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                

                <h2 style={titleStyle}>Option Data</h2>
                <table border="1" style={tableStyleOption}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Symbol</th>
                            <th style={thStyle}>Expiry</th>
                            <th style={thStyle}>Type</th>
                            <th style={thStyle}>Strike</th>
                            <th style={thStyle}>Ticker</th>
                            <th style={thStyle}>Price</th>
                            <th style={thStyle}>LTT</th>
                        </tr>
                    </thead>

                    <tbody>
                        {excelOptionData.map((row, index) => (
                            <tr key={index}>
                                <td style={tdStyle}>{row.symbol}</td>
                                <td style={tdStyle}>{row.expiry}</td>
                                <td style={tdStyle}>{row.type}</td>
                                <td style={tdStyle}>{row.strike}</td>
                                <td style={tdStyle}>{row.ticker}</td>
                                <td style={tdStyle}>{row.price ?? "--"}</td>
                                <td style={tdStyle}>{row.ltt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            ) : (
                 <div
                    style={{
                        width: "30%",
                        height: "180px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#f8fafc",
                        color: "#64748b",
                        fontWeight: "600",
                    }}
                >
                    📡 Waiting for live excel data...
                </div>
            )}

        </div>
    </div>
  );
}

export default ExcelWatch;