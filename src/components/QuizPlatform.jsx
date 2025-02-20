import React, { useState, useEffect } from "react";
import { questions } from "../data/questions";
import { addQuizResult, getQuizResults } from "../utils/db";

const QuizPlatform = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [questionResponses, setQuestionResponses] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      const history = await getQuizResults();
      setAttempts(history);
    };
    fetchHistory();
  }, []);

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
      handleNextQuestion();
    }
  }, [timeLeft]);

  const handleAnswerClick = (index) => {
    if (selectedOption !== null || timeLeft === 0) return;

    setSelectedOption(index);

    if (index === questions[currentQuestion].correct) {
      setFeedback(
        <div>
          <p className="text-rose-500 font-semibold">✅ Correct!</p>
          <p className="text-violet-600 text-sm mt-1">ℹ️ {questions[currentQuestion].explanation}</p>
        </div>
      );
      setScore((prevScore) => prevScore + 1);
    } else {
      setFeedback(
        <span className="text-rose-500 font-semibold">
          Incorrect! The correct answer is:{" "}
          <span className="text-violet-600">{questions[currentQuestion].options[questions[currentQuestion].correct]}</span>
        </span>
      );
    }

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
      const newAttempt = {
        date: new Date().toISOString(), // Using ISO string for better date handling
        score,
        totalQuestions: questions.length,
        timeTaken: questionResponses.reduce((acc, curr) => acc + curr.timeTaken, 0),
        answers: questionResponses,
      };
      
      await addQuizResult(newAttempt);
      setAttempts((prevAttempts) => [...prevAttempts, newAttempt]);
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
    setShowHistory(false);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString; // Fallback to original string if parsing fails
    }
  };

  // Component to display previous attempts
  const PreviousAttempts = () => (
    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg text-left shadow-md mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-violet-700">📊 Previous Attempts</h3>
        <button 
          onClick={() => setShowHistory(false)} 
          className="text-violet-500 hover:text-violet-700 text-sm"
        >
          ✕ Close
        </button>
      </div>
      {attempts.length > 0 ? (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {attempts.slice().reverse().map((attempt, index) => (
            <div key={index} className="flex justify-between items-center p-2 border-b border-violet-200">
              <div className="flex-1">
                <span className="text-violet-600">{formatDate(attempt.date)}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-rose-500 font-semibold">
                  {attempt.score} / {attempt.totalQuestions}
                </span>
                <span className="font-semibold text-violet-600">
                  {((attempt.score / attempt.totalQuestions) * 100).toFixed(1)}%
                </span>
                <span className="text-violet-500">{attempt.timeTaken.toFixed(1)}s avg</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-violet-600 text-center italic">No previous attempts yet</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-100 via-violet-100 to-teal-100">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-pink-200 opacity-40 blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-violet-200 opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-teal-200 opacity-40 blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-6">
          {/* History button - visible when not showing score or history */}
          {!showScore && !showHistory && attempts.length > 0 && (
            <button
              onClick={() => setShowHistory(true)}
              className="absolute top-4 right-4 bg-violet-100 hover:bg-violet-200 text-violet-700 px-3 py-1 rounded-full text-sm font-medium transition flex items-center"
            >
              <span className="mr-1">📊</span> History
            </button>
          )}

          {/* Show history view when toggled */}
          {showHistory && <PreviousAttempts />}
          
          {showScore ? (
            <div className="text-center">
              <h2 className="text-violet-700 text-3xl font-sans mb-2">🎉 Quiz Completed! 🎉</h2>
              <p className="text-lg mb-6 text-violet-600">
                Your score: <span className="font-bold text-rose-500">{score}</span> out of <span className="font-bold text-rose-500">{questions.length}</span>
              </p>

              {attempts.length > 0 && (
                <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg text-left">
                  <h3 className="font-semibold mb-3 text-violet-700">📊 Previous Attempts</h3>
                  <div className="space-y-2">
                    {attempts.slice(-3).reverse().map((attempt, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border-b border-violet-200">
                        <div className="flex-1">
                          <span className="text-violet-600">{formatDate(attempt.date)}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-rose-500 font-semibold">
                            {attempt.score} / {attempt.totalQuestions}
                          </span>
                          <span className="font-semibold text-violet-600">
                            {((attempt.score / attempt.totalQuestions) * 100).toFixed(1)}%
                          </span>
                          <span className="text-violet-500">{attempt.timeTaken.toFixed(1)}s avg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {attempts.length > 3 && (
                    <button
                      onClick={() => setShowHistory(true)}
                      className="text-violet-600 hover:text-violet-800 underline text-sm mt-2"
                    >
                      View all attempts
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={restartQuiz}
                className="cursor-pointer w-full py-3 bg-gradient-to-r from-rose-400 to-violet-400 text-white rounded-lg hover:from-rose-500 hover:to-violet-500 transition mt-4 transform hover:scale-105 shadow-lg shadow-violet-200"
              >
                🔄 Try Again
              </button>
            </div>
          ) : (
            !showHistory && (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-violet-600">
                      Question {currentQuestion+1} of {questions.length}
                    </span>
                    <span className="text-violet-600">⏳ Time Left: {timeLeft}s</span>
                  </div>
                  <div className="w-full bg-violet-100 h-1 rounded-full">
                    <div className="bg-gradient-to-r from-rose-400 to-violet-400 h-1 rounded-full transition-all duration-300" 
                        style={{ width: `${(timeLeft / 30) * 100}%` }}></div>
                  </div>
                </div>

                <h2 className="text-lg font-medium mb-4 text-violet-700">{questions[currentQuestion].question}</h2>
                <div className="space-y-2">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      disabled={selectedOption !== null || timeLeft === 0}
                      className={`w-full p-3 text-left rounded-lg border transition-all duration-300 ${
                        selectedOption !== null
                          ? index === questions[currentQuestion].correct
                            ? "border-teal-400 bg-teal-50/50 text-teal-700"
                            : selectedOption === index
                            ? "border-rose-400 bg-rose-50/50 text-rose-700"
                            : "border-violet-200 text-violet-600"
                          : "border-violet-200 text-violet-600 hover:border-violet-400 hover:bg-white/50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {feedback && <div className="text-lg mt-3 font-semibold">{feedback}</div>}

                {(selectedOption !== null || timeLeft === 0) && (
                  <button
                    onClick={handleNextQuestion}
                    className="cursor-pointer w-full mt-4 py-2 bg-gradient-to-r from-rose-400 to-violet-400 text-white rounded-lg hover:from-rose-500 hover:to-violet-500 transition shadow-lg shadow-violet-200 hover:shadow-violet-300"
                  >
                    {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                  </button>
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPlatform;
