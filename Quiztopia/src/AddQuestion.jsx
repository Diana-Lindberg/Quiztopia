import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

function AddQuestion() {
  const location = useLocation();
  const [quizData, setQuizData] = useState();
  const { quizId } = location.state || {};
  const [position, setPosition] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState();
  const mapRef = useRef();
  const marker = useRef();

  useEffect(() => {
    const map = Leaflet.map(mapRef.current);

    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    if (position) {
      const { latitude, longitude } = position;
      Leaflet.marker([latitude, longitude])
      .addTo(map)
      .bindPopup("Du är här");
      map.setView([latitude, longitude], 15);
    }

    map.on("click", (event) => {
      const { lat, lng } = event.latlng;
      setSelectedLocation({ latitude: lat, longitude: lng });

      if (marker.current) {
        map.removeLayer(marker.current);
      }

      marker.current = Leaflet.marker([lat, lng]).addTo(map);
    });

      if (quizData && quizData.questions){
        quizData.questions.forEach((q) => {
          const {latitude, longitude} = q.location;
          Leaflet.marker([latitude, longitude])
          .addTo(map)
          .bindPopup(`${q.question}`)
        });
      }

    return () => {
      map.remove();
    };
  }, [quizId, position, quizData]);

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
        setError("Gammal webbläsaren.");
      }
    };

    getPosition();
  }, []);

  const handleAddQuestion = async (event) => {
    event.preventDefault();
    if (!selectedLocation) {
      setError("Välj en plats på kartan.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
       navigate ("/")
        return;
      }

      const response = await fetch(
        "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: quizId,
            question,
            answer,
            location: selectedLocation,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Frågan har lagts till!");
        setQuestion("");
        setAnswer("");
        setSelectedLocation(null);
        setQuizData(data.quiz.Attributes)

        if (marker.current) {
          marker.current.remove();
          marker.current = null;
        }
      } else {
        setError("Det gick inte att lägga till fråga. Försök igen.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleAddQuestion}>
          <input
            type="text"
            name="question"
            placeholder="Fråga"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            required
          />
      
          <input
            type="text"
            name="answer"
            placeholder="Svar"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            required
          />
      
        <button>Lägg till fråga</button>
       <Link to="/AllQuiz"><button>Alla Frågor</button></Link>
      </form>
      <div ref={mapRef} style={{ height: "500px", width: "1200px", marginLeft: "70px" }}></div>

      
    </div>
  );
}

export default AddQuestion;
