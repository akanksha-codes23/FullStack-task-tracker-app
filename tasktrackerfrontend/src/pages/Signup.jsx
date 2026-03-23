import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [form,setForm] = useState({ name:"", email:"", password:"" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/signup", form);
      alert("Signup successful ");
      navigate("/login");
    } catch(err){
      console.error(err.response?.data || err.message);
      alert("Signup failed ");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="logo-text">TaskTracker</h1>
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
          <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
          <button type="submit">Signup</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}