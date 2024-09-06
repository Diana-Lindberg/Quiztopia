import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SignIn.css"

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const token = sessionStorage.getItem("token");

  if (token) {
    navigate ("/CreateQuiz")
     return;
   }
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );
      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem("token", data.token);
        navigate("/CreateQuiz");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <form className="SignIn_Form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Användarnamn"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <input
          type="text"
          name="password"
          placeholder="Lösenord"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button>Logga in</button>
        <Link to="/SignUp" ><button>Skapa konto</button></Link>
        <Link to="/AllQuiz"><button>Alla Frågor</button></Link>
      </form>
      
      
    </div>
  );
}
export default SignIn;
