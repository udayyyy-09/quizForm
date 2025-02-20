import React, { useState, useEffect } from "react";
import { questions } from "../data/questions"; // ✅ Import questions from external file
import { addQuizResult, getQuizResults } from "../utils/db"; // ✅ Import IndexedDB functions

const QuizPlatform = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30); // ✅ Timer for each question
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState([]); // ✅ Store previous attempts
  const [questionResponses, setQuestionResponses] = useState([]);

  // ✅ Load past attempts from IndexedDB on page load
  useEffect(() => {
    const fetchHistory = async () => {
      const history = await getQuizResults();
      setAttempts(history);
    };
    fetchHistory();
  }, []);

  // ✅ Reset timer when a new question appears
  useEffect(() => {
    setTimeLeft(30);
  }, [currentQuestion]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleNextQuestion(); // Move to next question when time runs out
    }
  }, [timeLeft]);

  const handleAnswerClick = (index) => {
    if (selectedOption !== null || timeLeft === 0) return; // Prevent multiple selections

    setSelectedOption(index);

    if (index === questions[currentQuestion].correct) {
      setFeedback(
        <div>
          <p className="text-green-600 font-semibold">✅ Correct!</p>
          <p className="text-gray-700 text-sm mt-1">ℹ️ {questions[currentQuestion].explanation}</p>
        </div>
      );
      setScore((prevScore) => prevScore + 1);
    } else {
      setFeedback(
        <span className="text-red-600 font-semibold">
          Incorrect! The correct answer is:{" "}
          <span className="text-blue-600">{questions[currentQuestion].options[questions[currentQuestion].correct]}</span>
        </span>
      );
    }

    // ✅ Track responses
    setQuestionResponses((prevResponses) => [
      ...prevResponses,
      {
        question: currentQuestion,
        selected: index,
        correct: questions[currentQuestion].correct,
        timeTaken: 30 - timeLeft,
      },
    ]);
  };

  const handleNextQuestion = async () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setFeedback(null);
    } else {
      // ✅ Save the attempt history in IndexedDB
      const newAttempt = {
        date: new Date().toLocaleString(),
        score,
        totalQuestions: questions.length,
        timeTaken: questionResponses.reduce((acc, curr) => acc + curr.timeTaken, 0),
        answers: questionResponses,
      };
      
      await addQuizResult(newAttempt); // ✅ Save to IndexedDB
      setAttempts((prevAttempts) => [...prevAttempts, newAttempt]); // Update UI
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setTimeLeft(30);
    setFeedback(null);
    setQuestionResponses([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-sm p-6">
        {showScore ? (
          <div className="text-center">
            <h2 className="text-grey-300 text-3xl font-sans mb-2">🎉 Quiz Completed! 🎉</h2>
            <p className="text-lg mb-6">
              Your score: <span className="font-bold text-blue-600">{score}</span> out of <span className="font-bold text-blue-600">{questions.length}</span>
            </p>

            
            {attempts.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <h3 className="font-semibold mb-3">📊 Previous Attempts</h3>
                <div className="space-y-2">
                  {attempts.slice(-3).reverse().map((attempt, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border-b">
                      <span className="text-gray-600">{new Date(attempt.date).toLocaleString()}</span>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold">{((attempt.score / attempt.totalQuestions) * 100).toFixed(1)}%</span>
                        <span className="text-gray-500">{attempt.timeTaken.toFixed(1)}s avg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={restartQuiz}
              className="cursor-pointer w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mt-4 transform hover:scale-105"
            >
              🔄 Try Again
            </button>
          </div>
        ) : (
          <>
           
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  Question {currentQuestion+1} of {questions.length}
                </span>
                <span className="text-sm text-gray-500">⏳ Time Left: {timeLeft}s</span>
              </div>
              <div className="w-full bg-gray-100 h-1">
                <div className="bg-blue-500 h-1 transition-all duration-300" style={{ width: `${(timeLeft / 30) * 100}%` }}></div>
              </div>
            </div>

            
            <h2 className="text-lg font-medium mb-4">{questions[currentQuestion].question}</h2>
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={selectedOption !== null || timeLeft === 0} // 
                  className={` w-full p-3 text-left rounded border ${
                    selectedOption !== null
                      ? index === questions[currentQuestion].correct
                        ? "border-green-500 bg-green-50"
                        : selectedOption === index
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                      : "border-gray-200 hover:border-blue-500"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            
            {feedback && <div className="text-lg mt-3 font-semibold text-gray-700">{feedback}</div>}

           
            {(selectedOption !== null || timeLeft === 0) && (
              <button
                onClick={handleNextQuestion}
                className="cursor-pointer w-full mt-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPlatform;