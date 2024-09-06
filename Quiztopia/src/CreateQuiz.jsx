import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateQuiz() {
  const [quizName, setQuizName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate ("/")
       return;
     }

    try {
      const response = await fetch(
        "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: quizName }),
        }
      );

      const data = await response.json();

      if (data.success) {
        navigate("/AddQuestion", { state: { quizId: data.quizId } });
      } else {
        setError("Det gick inte att lägga till fråga");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <input
          type="text"
          placeholder="Namn på quiz"
          onChange={(event) => setQuizName(event.target.value)}
        />
        <button>Skapa quiz</button>
      </form>
    </div>
  );
}

export default CreateQuiz;
