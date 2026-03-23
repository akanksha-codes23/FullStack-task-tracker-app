import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form,setForm] = useState({ email:"", password:"" });

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post("http://localhost:8080/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="logo-text">TaskTracker</h1>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}/>
          <input type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})}/>
          <button type="submit">Login</button>
        </form>
        <p>Don't have account? <Link to="/">Signup</Link></p>
        <p><Link to="/forgot-password">Forgot Password?</Link></p>
      </div>
    </div>
  );
}