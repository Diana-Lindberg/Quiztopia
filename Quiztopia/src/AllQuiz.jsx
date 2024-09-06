import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AllQuiz.css"

function AllQuiz() {
  const [quizzes, setQuiz] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const response = await fetch(
          "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz"
        );
        const data = await response.json();
        setQuiz(data.quizzes);
      } catch (error) {
        setError(error.message);
      }
    };
    getQuiz();
  }, []);

  const startQuiz = (userId, quizId) => {
    navigate(`/QuizMap`, { state: { userId, quizId } });
  };

  return (
    <div className="quiz_container">
      <div className="button_container">
        <Link to="/"><button>Skapa quiz</button></Link>
        </div>
      {quizzes.map((quiz, index) => (

        <div key={index}>
          <div className="quiz_item">
          <h2>Quiz</h2>
          <p>Namn: {quiz.quizId}</p>
          <p>Av: {quiz.username}</p>
          <button onClick={() => startQuiz(quiz.userId, quiz.quizId)}>
            Visa
          </button>
          </div>
        </div>
      ))}
      
      {error && <p>Error: {error}</p>}
    </div>
  );
}
export default AllQuiz;
