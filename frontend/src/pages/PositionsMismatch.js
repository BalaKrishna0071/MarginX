import axios from 'axios';
import {useState, useEffect} from 'react';

function PositionsMismatch() {

    // State Variables !
    const [apiData, setApiData] = useState([]); 
    const [tradeFileTime, setTradeFileTime] = useState('');


    // Fetching data from API !
    const fetchData = () => {
        axios.get("http://localhost:5001/positions_mismatch_data")
        .then(res => {
            setApiData(res.data.data);
            setTradeFileTime(res.data.file_timestamp);
            console.log('API data fetched successfully:', res.data);
        })
        .catch(err => {
            console.error('Error fetching API data:', err);
        })
    };

    // useEffect to call fetchData on component mount
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000)
        return () => clearInterval(interval);
    }, []); 


    // CSS
    const container = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    //   padding: '0rem',
      background: 'linear-gradient(135deg, #f7f9fc 0%, #eef3fb 100%)',
      color: '#333',
      minHeight: '93vh',
      boxSizing: 'border-box',
      borderRadius: '40px',
    };

    const tableContainer = {
      width: '100%',
      maxHeight: '725px',
      overflowY: 'auto',
      overflowX: 'auto',
      border: '1px solid #e5e7eb',
    //   borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
      paddingRight: '6px',
      boxSizing: 'border-box',
      scrollbarWidth: 'thin',
      scrollbarColor: '#8b9cb2 #f1f5f9',
      scrollbarGutter: 'stable',
    };

    const contentContainer = {
      width: '100%',
      maxWidth: '950px',
      display: 'flex',
      minHeight: '70vh',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: '8px 10px',
      borderRadius: '18px',
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
      boxSizing: 'border-box',
    };

    const header = {
        width: '100%',
        display: 'flex',
        textAlign: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '12px',
        borderBottom: '1px solid #e5e7eb',
    };

    const headingStyle = {
        margin: '0 0 6px',
        fontSize: 'clamp(22px, 2.2vw, 24px)',
        fontWeight: '700',
        color: '#1f2937',
        textAlign: 'center',
    };

    const subHeadingStyle = {
        margin: '0',
        fontSize: '13px',
        color: '#6b7280',
        textAlign: 'center',
        fontWeight: '500',
    };

    const tableHead = {
        background: '#110c55',
        position: 'sticky',
        top: '0',
        zIndex: 1,
    };

    const thStyle = {
        padding: '8px 10px',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: '14px',
        letterSpacing: '0.5px',
        color: '#ffffff',
        borderBottom: '1px solid #bfdbfe',
        whiteSpace: 'nowrap',
    };

    const bodyStyle = {
        backgroundColor: '#ffffff',
        color: '#374151',
    };

    const rowStyle = {
        backgroundColor: '#ffffff',
    };

    const cellStyle = {
        padding: '8px 10px',
        borderBottom: '1px solid #e5e7eb',
        textAlign: 'center',
        fontSize: '13px',
        whiteSpace: 'nowrap',
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#ffffff',
    };

    return(
        <div style={container} >
            <style>{`
                .table-scroll::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                .table-scroll::-webkit-scrollbar-thumb {
                    background-color: #8b9cb2;
                    border-radius: 999px;
                    border: 2px solid transparent;
                    background-clip: padding-box;
                }
                .table-scroll::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 999px;
                }
            `}</style>
            <div style={contentContainer}>
                <div style={header}>
                    <h2 style={headingStyle}>Positions Mismatch</h2>
                    {tradeFileTime && <p style={subHeadingStyle}>Trade File Modify Time: {tradeFileTime}</p>}
                </div>
                <div style={tableContainer} className="table-scroll">
                    <table style={tableStyle}>
                        <thead style={tableHead}>
                            <tr>
                                <th style={thStyle}>Ticker</th>
                                <th style={thStyle}>Excel_Positions</th>
                                <th style={thStyle}>Csv_Positions</th>
                                <th style={thStyle}>Diff</th>
                            </tr>
                        </thead>
                        <tbody style={bodyStyle}>
                            {apiData.map((item, index) => {
                                return (
                                    <tr key={item.Ticker} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                                        <td style={cellStyle}>{item.Ticker}</td>
                                        <td style={cellStyle}>{item.Excel_Positions}</td>
                                        <td style={cellStyle}>{item.Csv_Positions}</td>
                                        <td style={cellStyle}>{item.Diff}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default PositionsMismatch;