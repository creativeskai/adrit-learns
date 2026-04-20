"use client";
import { useEffect, useState } from "react";

interface FeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  onComplete: () => void;
}

export default function Feedback({ isCorrect, correctAnswer, onComplete }: FeedbackProps) {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Play sound
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(
        isCorrect
          ? "Great job! Well done!"
          : `Try again! The correct answer is ${correctAnswer}`
      );
      utterance.rate = 0.8;
      utterance.pitch = isCorrect ? 1.2 : 0.8;
      window.speechSynthesis.speak(utterance);
    }

    // Hide animation after 2 seconds
    const timer = setTimeout(() => {
      setShowAnimation(false);
      setTimeout(onComplete, 300); // Allow fade out
    }, 2000);

    return () => clearTimeout(timer);
  }, [isCorrect, correctAnswer, onComplete]);

  if (!showAnimation) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${showAnimation ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20" />

      {/* Feedback content */}
      <div className="relative z-10 text-center">
        {isCorrect ? (
          <>
            {/* Stars animation */}
            <div className="relative">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-6xl animate-bounce"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${10 + (i % 3) * 20}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '1s'
                  }}
                >
                  ⭐
                </div>
              ))}
            </div>

            {/* Balloons */}
            <div className="relative mt-20">
              {['🎈', '🎈', '🎈', '🎈', '🎈', '🎈'].map((balloon, i) => (
                <div
                  key={i}
                  className="absolute text-4xl animate-float"
                  style={{
                    left: `${10 + i * 15}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '2s'
                  }}
                >
                  {balloon}
                </div>
              ))}
            </div>

            <div className="mt-32 bg-green-100 border-4 border-green-400 rounded-3xl p-8 shadow-2xl">
              <div className="text-8xl mb-4">🎉</div>
              <div className="text-4xl font-black text-green-600">Excellent!</div>
              <div className="text-xl text-green-700 mt-2">You got it right!</div>
            </div>
          </>
        ) : (
          <div className="bg-red-100 border-4 border-red-400 rounded-3xl p-8 shadow-2xl">
            <div className="text-8xl mb-4">😅</div>
            <div className="text-4xl font-black text-red-600">Oops!</div>
            <div className="text-xl text-red-700 mt-2">
              The correct answer is:<br />
              <span className="font-bold text-2xl">{correctAnswer}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}