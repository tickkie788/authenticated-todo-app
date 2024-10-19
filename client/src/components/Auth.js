import { useState } from "react";
import { useCookies } from "react-cookie";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  function viewLogin(status) {
    setErrorMessage(null);
    setIsLogin(status);
  }

  async function handleSubmit(e, endpoint) {
    e.preventDefault();

    // In register mode and password does not match
    if (!isLogin && password !== confirmPassword) {
      setErrorMessage("Make sure passwords match");
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    const jsonData = await response.json();

    // If an error occurs during server-side sign-up
    if (jsonData.errorDetail) {
      setErrorMessage(jsonData.errorDetail);
      return;
    }

    // Set cookies
    setCookie("Email", jsonData.email);
    setCookie("AuthToken", jsonData.token);
    window.location.reload();
  }

  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <form>
          <h2>{isLogin ? "Login" : "Sign up"}</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>

          {/* Show confirm password for registration */}
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
          )}

          <input
            type="submit"
            className="create-btn"
            value={isLogin ? "Login" : "Sign up"}
            onClick={(e) => handleSubmit(e, isLogin ? "login" : "signup")}
          ></input>
        </form>

        {/* Show error message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="auth-options">
          <button
            type="submit"
            style={{ backgroundColor: !isLogin ? "darkgray" : "white" }}
            onClick={() => viewLogin(false)}
          >
            Sign Up
          </button>
          <button
            type="submit"
            style={{ backgroundColor: isLogin ? "darkgray" : "white" }}
            onClick={() => viewLogin(true)}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
