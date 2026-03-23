import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {

  const [open, setOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const navigate = useNavigate();

  // REF
  const dropdownRef = useRef();

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDownloadOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (

    <nav className="navbar">

      <div className="logo">TaskTracker</div>

      <div className={`nav-links ${open ? "active" : ""}`}>

        <Link to="/home">Home</Link>
        <Link to="/create">Create</Link>
        <Link to="/tasks">Show</Link>
        <Link to="/search">Search</Link>
        <Link to="/progress">Progress</Link>
        <Link to="/calendar">Calendar</Link>

        {/* DOWNLOAD DROPDOWN*/}
        <div
          className="download-menu"
          ref={dropdownRef}
          onClick={(e)=>e.stopPropagation()} //
        >

          <button
            className="download-btn"
            onClick={(e) => {
              e.stopPropagation(); // 
              setDownloadOpen(!downloadOpen);
            }}
          >
            Download ▼
          </button>

          {downloadOpen && (
            <div className="dropdown">

              <button onClick={()=>{
                window.downloadPDF?.();
                setDownloadOpen(false);
              }}>
                📄 PDF
              </button>

              <button onClick={()=>{
                window.downloadExcel?.();
                setDownloadOpen(false);
              }}>
                📊 Excel
              </button>

              <button onClick={()=>{
                window.printTasks?.();
                setDownloadOpen(false);
              }}>
                🖨 Print
              </button>

            </div>
          )}

        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>

      <div
        className={`hamburger ${open ? "open" : ""}`}
        onClick={()=>setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

    </nav>
  );
}