import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = React.useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, []);
  
const collectData = async () => {
  if(!name || !email || !password )
  {   
      setError(true);
      return false
  }
            console.warn(name, email, password);
            let result = await fetch(process.env.REACT_APP_API_URL + 'register', {
                method: 'post',
                body: JSON.stringify({ name, email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            result = await result.json();
            console.warn(result);
            localStorage.setItem("user", JSON.stringify(result.result))
            localStorage.setItem("token", JSON.stringify(result.auth))
            navigate('/')
        }
  return (
    <div className="signup-form">
      <h2>Register</h2>
      <div>
        <input
          required
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
         {error && !name && <span className='invalid-input'>Enter name</span>}
        <input
          required
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
         {error && !email && <span className='invalid-input'>Enter email</span>}
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
         {error && !password && <span className='invalid-input'>Enter password</span>}
      </div>
      <button type="submit" onClick={collectData}>
        SignUp
      </button>
    </div>
  );
};

export default SignUp;
