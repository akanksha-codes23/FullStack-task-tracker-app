import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email,setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email || !/\S+@\S+\.\S+/.test(email)){
      alert("Please enter a valid email");
      return;
    }
    try{
      const res = await axios.post("http://localhost:8080/api/auth/forgot-password",{ email });
      alert("Reset token generated  Check backend console / response");
      console.log("Reset token:", res.data.resetToken);
    } catch(err){
      console.error(err.response?.data || err.message);
      alert(err.response?.data || "Error sending reset link");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="logo-text">TaskTracker</h1>
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)}/>
          <button type="submit">Send Link</button>
        </form>
        <p>Already have a token? <Link to="/reset-password">Reset Password</Link></p>
      </div>
    </div>
  );
}