import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, History, ChartBar } from 'lucide-react';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-rose-400" />,
      title: "Challenge Your Mind",
      description: "Test your knowledge across multiple categories and difficulty levels"
    },
    {
      icon: <History className="w-8 h-8 text-teal-400" />,
      title: "Track Your Progress",
      description: "Monitor your learning journey and see your improvement over time"
    },
    {
      icon: <ChartBar className="w-8 h-8 text-amber-400" />,
      title: "Previous Attempts",
      description: "Review your past quiz scores and analyze your performance history"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-100 via-violet-100 to-teal-100">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-pink-200 opacity-40 blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-violet-200 opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-teal-200 opacity-40 blur-3xl"></div>
      
       
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div 
          className={`text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-rose-400 via-violet-400 to-teal-400 bg-clip-text text-transparent mb-6 animate-gradient">
            Welcome to QuizMaster
          </h1>
          
          <p className="text-violet-700 mb-12 max-w-xl mx-auto text-lg md:text-xl">
            Challenge yourself, track your progress, and become a quiz champion!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-white/50 backdrop-blur-sm p-6 rounded-xl transition-all duration-300 cursor-null transform hover:scale-105 hover:bg-white/60 shadow-lg ${
                  hoveredFeature === index ? 'bg-white/60 scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-violet-700 mb-2">{feature.title}</h3>
                <p className="text-violet-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center w-full">
            <button
              className="cursor-pointer group bg-gradient-to-r from-rose-400 to-violet-400 text-white px-8 py-4 rounded-lg font-medium hover:from-rose-500 hover:to-violet-500 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-violet-200 hover:shadow-violet-300 mx-auto hover:scale-105"
              onClick={() => navigate('/quiz')}
            >
              Start Quiz
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Animated wave footer */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto opacity-30">
          <path fill="#8B5CF6" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 10s infinite ease-in-out;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
