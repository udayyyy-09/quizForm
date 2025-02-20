import React from "react";

export const ScoreBoard = ({ score, questions, attempts, restartQuiz }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-4">Quiz Completed!</h2>
      <p className="text-xl text-center mb-6">You scored {score} out of {questions.length}</p>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Attempt History:</h3>
        <div className="space-y-2">
          {attempts.map((attempt, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded">
              <p className="text-sm">Attempt {index + 1}: {attempt.score}/{attempt.total}</p>
              <p className="text-xs text-gray-500">{attempt.date}</p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={restartQuiz} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200">
        Try Again
      </button>
    </div>
  );
};
