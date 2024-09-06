import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

function QuizMap() {
  const location = useLocation();
  const [quiz, setQuiz] = useState();
  const { userId, quizId } = location.state || {};
  const [error, setError] = useState();
  const [position, setPosition] = useState();
  const mapRef = useRef();

  useEffect(() => {
    const getPosition = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setPosition({ latitude, longitude });
          },
          (error) => {
            console.error(
              "Det gick inte att hämta användarens plats:",
              error.message
            );
            setError("Det gick inte att hämta din plats.");
          }
        );
      } else {
        setError("Geolokalisering stöds inte av den här webbläsaren.");
      }
    };

    getPosition();
  }, []);

  useEffect(() => {
    const getQuiz = async () => {
      if (!userId || !quizId) return;

      try {
        const response = await fetch(
          `https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/${userId}/${quizId}`
        );

        const data = await response.json();
        setQuiz(data.quiz);
      } catch (error) {
        setError(error.message);
      }
    };
    getQuiz();
  }, [userId, quizId]);

  useEffect(() => {
    if (mapRef.current && quiz) {
      const { questions } = quiz;
      const firstQuestionLocation = questions[0].location;
      const { latitude: quizLat, longitude: quizLng } = firstQuestionLocation;

      const map = Leaflet.map(mapRef.current).setView([quizLat, quizLng], 15);

      Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      questions.forEach((question) => {
        const { latitude, longitude } = question.location;
        Leaflet.marker([latitude, longitude])
          .addTo(map)
          .bindPopup(`${question.question}`);
      });

      if (position) {
        const { latitude, longitude } = position;
        Leaflet.marker([latitude, longitude]).addTo(map).bindPopup("Du är här");
        map.setView([latitude, longitude], 15);
      }

      return () => {
        map.remove();
      };
    }
  }, [quiz, position]);

  return (
    <div>
      <h1>Quiz Map</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div ref={mapRef} style={{ height: "500px", width: "1000px" }}></div>
    </div>
  );
}

export default QuizMap;
