import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notifydata = {
  position: "top-center",
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};
const successNotify = () => toast.success("Login Successfully!", notifydata);
const errNotify = () => toast.error("Login Failed!", notifydata);
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = React.useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    ///this for route when u do /login on url bar if user already login it will not redirect to login page but in Nav section we already resolve the login whwn to show likw auth ?A:B so both will be resolve diffrent;ly
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, []);
  const handleLogin = async () => {
    if (!email || !password) {
      errNotify();
      setError(true);
      return false;
    }
    let result = await fetch(process.env.REACT_APP_API_URL + "login", {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    console.warn(result);
    if (result.auth) {
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", JSON.stringify(result.auth));
      setTimeout(() => {
        navigate("/");
        successNotify();
      }, 200);
    } else {
      errNotify();
    }
  };

  return (
    <div className="signup-form">
      <h2>Login</h2>
      <div>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && !email && (
          <span className="invalid-input">Enter valid email</span>
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && !password && (
          <span className="invalid-input">Enter valid password</span>
        )}
      </div>
      <button type="submit" onClick={handleLogin}>
        Login
      </button>
      <ToastContainer />
    </div>
  );
};

export default Login;
