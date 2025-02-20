import React, { useState, useEffect } from 'react';

const QuizPlatform = () => {
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Jupiter", "Mars", "Venus", "Saturn"],
      correct: 1
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: 1
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [attempts, setAttempts] = useState([]);
  const [questionResponses, setQuestionResponses] = useState([]);

  useEffect(() => {
    const timer = timeLeft > 0 && setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    if (timeLeft === 0) {
      handleNextQuestion();
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerClick = (index) => {
    setSelectedOption(index);
    setQuestionResponses([...questionResponses, {
      question: currentQuestion,
      selected: index,
      correct: questions[currentQuestion].correct,
      timeTaken: 30 - timeLeft
    }]);
  };

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null);
      setTimeLeft(30);
    } else {
      const newAttempt = {
        date: new Date().toLocaleString(),
        score,
        responses: questionResponses,
        averageTime: questionResponses.reduce((acc, curr) => acc + curr.timeTaken, 0) / questions.length
      };
      setAttempts([...attempts, newAttempt]);
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setTimeLeft(30);
    setQuestionResponses([]);
  };

  const calculatePercentage = (score) => {
    return ((score / questions.length) * 100).toFixed(1);
  };

  const Scoreboard = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
        <div className="text-5xl font-bold text-blue-500 mb-4">
          {score}/{questions.length}
        </div>
        <p className="text-xl text-gray-600">
          Score: {calculatePercentage(score)}%
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Question Analysis</h3>
        <div className="space-y-2">
          {questionResponses.map((response, index) => (
            <div key={index} className="flex items-center justify-between p-2 border-b">
              <span>Question {index + 1}</span>
              <div className="flex items-center space-x-4">
                <span className={response.selected === response.correct ? "text-green-500" : "text-red-500"}>
                  {response.selected === response.correct ? "Correct" : "Incorrect"}
                </span>
                <span className="text-gray-500">{response.timeTaken}s</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {attempts.length > 1 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Previous Attempts</h3>
          <div className="space-y-2">
            {attempts.slice(-3).reverse().map((attempt, index) => (
              <div key={index} className="flex justify-between items-center p-2 border-b">
                <span className="text-gray-600">{attempt.date}</span>
                <div className="flex items-center space-x-4">
                  <span>{calculatePercentage(attempt.score)}%</span>
                  <span className="text-gray-500">{attempt.averageTime.toFixed(1)}s avg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={restartQuiz}
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-sm p-6">
        {showScore ? (
          <Scoreboard />
        ) : (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm text-gray-500">
                  Time: {timeLeft}s
                </span>
              </div>
              <div className="w-full bg-gray-100 h-1">
                <div 
                  className="bg-blue-500 h-1 transition-all duration-300"
                  style={{ width: `${(currentQuestion + 1) / questions.length * 100}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-lg font-medium mb-4">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  className={`w-full p-3 text-left rounded border
                    ${selectedOption === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-500'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {selectedOption !== null && (
              <button
                onClick={handleNextQuestion}
                className="w-full mt-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPlatform;