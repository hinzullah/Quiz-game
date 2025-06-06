import React, { useEffect, useState } from "react";
import questionsData from "./data/questions.json";
import "./index.css";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // ⏱️ 15 seconds per question

  useEffect(() => {
    setQuestions(questionsData);
  }, []);

  // Timer logic
  useEffect(() => {
    if (showFeedback || gameOver) return;

    if (timeLeft === 0) {
      handleAnswer(null); // skip question
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, showFeedback, gameOver]);

  const handleAnswer = (option) => {
    if (showFeedback) return;

    setSelectedOption(option);

    if (option && option === questions[currentIndex].answer) {
      setScore((prev) => prev + 1);
    }

    setShowFeedback(true);
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        setTimeLeft(15); // reset timer for next question
      } else {
        setGameOver(true);
      }
    }, 1000);
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowFeedback(false);
    setGameOver(false);
    setTimeLeft(15);
  };

  if (questions.length === 0) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        {gameOver ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <p className="mb-6 text-lg">
              Your score: {score} / {questions.length}
            </p>
            <button
              onClick={restartGame}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                Question {currentIndex + 1}
              </h2>
              <p className="text-sm text-gray-500">⏱️ {timeLeft}s</p>
            </div>
            <p className="mb-4">{questions[currentIndex].question}</p>
            <div className="space-y-2">
              {questions[currentIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className={`block w-full text-left px-4 py-2 rounded border transition-all
                    ${
                      selectedOption === option
                        ? option === questions[currentIndex].answer
                          ? "bg-green-200 border-green-500"
                          : "bg-red-200 border-red-500"
                        : "hover:bg-gray-100 border-gray-300"
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
