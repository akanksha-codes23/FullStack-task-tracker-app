import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [token,setToken] = useState("");
  const [newPassword,setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!token || !newPassword){
      alert("Please enter both token and new password");
      return;
    }
    try{
      const res = await axios.post("http://localhost:8080/api/auth/reset-password", null, {
        params: { token,newPassword }
      });
      alert(res.data);
      navigate("/login");
    } catch(err){
      console.error(err.response?.data || err.message);
      alert(err.response?.data || "Error resetting password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="logo-text">TaskTracker</h1>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Paste reset token here" value={token} onChange={e=>setToken(e.target.value)}/>
          <input type="password" placeholder="Enter new password" value={newPassword} onChange={e=>setNewPassword(e.target.value)}/>
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}