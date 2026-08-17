"use client";
import { useEffect, useState } from "react";
import { playCorrectSound, playWrongSound } from "@/lib/sounds";
import { speak, SpeechLang } from "@/lib/tts";

interface FeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  onComplete: () => void;
  lang?: SpeechLang;
}

export default function Feedback({ isCorrect, correctAnswer, onComplete, lang = "en-IN" }: FeedbackProps) {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    if (isCorrect) playCorrectSound(); else playWrongSound();
    speak(
      isCorrect
        ? "Great job! Well done!"
        : `Try again! The correct answer is ${correctAnswer}`,
      lang
    );

    // Hide animation after 2 seconds
    const timer = setTimeout(() => {
      setShowAnimation(false);
      setTimeout(onComplete, 300); // Allow fade out
    }, 2000);

    return () => clearTimeout(timer);
  }, [isCorrect, correctAnswer, onComplete, lang]);

  if (!showAnimation) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${showAnimation ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20" />

      {/* Stars and balloons are positioned against the full-screen "fixed inset-0"
          root above, not the centered card below — percentages need a full-viewport
          containing block to actually scatter instead of collapsing to one spot. */}
      {isCorrect && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute text-[clamp(2.25rem,9vw,3.75rem)] animate-bounce"
              style={{
                left: `${8 + i * 11}%`,
                top: `${12 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            >
              ⭐
            </div>
          ))}
          {['🎈', '🎈', '🎈', '🎈', '🎈', '🎈'].map((balloon, i) => (
            <div
              key={`balloon-${i}`}
              className="absolute text-[clamp(1.5rem,6vw,2.25rem)] animate-float"
              style={{
                left: `${6 + i * 16}%`,
                top: `${58 + (i % 2) * 10}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            >
              {balloon}
            </div>
          ))}
        </>
      )}

      {/* Feedback content */}
      <div className="relative z-10 text-center px-6">
        {isCorrect ? (
          <div className="bg-green-100 border-4 border-green-400 rounded-3xl p-8 shadow-2xl">
            <div className="text-[clamp(3.5rem,14vw,6rem)] mb-4">🎉</div>
            <div className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-green-600">Excellent!</div>
            <div className="text-xl text-green-700 mt-2">You got it right!</div>
          </div>
        ) : (
          <div className="bg-red-100 border-4 border-red-400 rounded-3xl p-8 shadow-2xl">
            <div className="text-[clamp(3.5rem,14vw,6rem)] mb-4">😅</div>
            <div className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-red-600">Oops!</div>
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