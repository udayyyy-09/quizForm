import React from "react";

export const QuestionCard = ({ question, options, handleAnswerClick, option, feedback, correctAnswer }) => {
  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      
      <h2 className="text-xl font-semibold text-gray-800">{question}</h2>

      
      {options?.map((opt, index) => (
        <button
          key={index}
          onClick={() => handleAnswerClick(index)}
          disabled={feedback}
          className={`w-full p-4 text-left rounded-lg border text-lg font-medium transition duration-200 
            ${feedback
              ? index === correctAnswer
                ? "bg-green-500 text-white border-green-700"
                : option === index
                ? "bg-red-500 text-white border-red-700"
                : "border-gray-200"
              : "border-gray-300 hover:bg-gray-100"
            }`
          }
        >
          {opt}
        </button>
      ))}
    </div>
  );
};
