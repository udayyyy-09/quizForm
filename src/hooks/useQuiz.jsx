import { useState, useEffect } from "react";
import { questions } from "../data/questions";

const timeques = 30;

export const useQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [option, setOption] = useState(null);
  const [feedback, setFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeques);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [startTime, setStartTime] = useState(Date.now());


  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive]);


  const handleTimeout = () => {
    setIsTimerActive(false);
    setFeedback(true);
  };


  const handleAnswerClick = (selectedOption) => {
    if (!feedback) {
      setOption(selectedOption);
      setIsTimerActive(false);
      setFeedback(true);
    }
  };


  const handleNextQuestion = () => {
    console.log("Current Question Before Update:", currentQuestion);

    if (option === questions[currentQuestion].correct) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1); 
      setAttempts((prev) => [...prev, option]); 
      setOption(null);
      setFeedback(false);
      setTimeLeft(timeques);
      setIsTimerActive(true);
    } else {
      console.log("Quiz Completed!");
      setShowScore(true);
    }
  };


  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setOption(null);
    setFeedback(false);
    setTimeLeft(timeques);
    setIsTimerActive(true);
    setStartTime(Date.now());
    setAttempts([]);
  };

  return {
    currentQuestion,
    score,
    showScore,
    attempts,
    option,
    feedback,
    timeLeft,
    isTimerActive,
    questions,
    handleAnswerClick,
    handleNextQuestion,
    restartQuiz,
    formatTime: (seconds) =>
      `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`,
  };
};
