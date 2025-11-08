"use client";

import { useMemo, useState } from "react";
import type { QuizQuestion } from "@/types/lesson";

interface QuizProps {
  questions: QuizQuestion[] | undefined;
  onComplete: (wrongCount: number) => void;
}

export function Quiz({ questions, onComplete }: QuizProps) {
  const normalizedQuestions = useMemo(() => questions ?? [], [questions]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  if (!normalizedQuestions.length) {
    return (
      <p className="text-sm text-slate-600 dark:text-slate-300">
        No quiz available for this objective.
      </p>
    );
  }

  const currentQuestion = normalizedQuestions[currentIndex];

  const handleChoiceSelect = (choice: string) => {
    if (selectedChoice !== null || isComplete) {
      return;
    }
    setSelectedChoice(choice);
    setIsCorrect(choice.trim() === currentQuestion.answer?.trim());
  };

  const handleNext = () => {
    if (selectedChoice === null) {
      return;
    }
    const updatedWrong = wrongCount + (isCorrect ? 0 : 1);

    if (currentIndex === normalizedQuestions.length - 1) {
      setWrongCount(updatedWrong);
      setIsComplete(true);
      onComplete(updatedWrong);
      return;
    }

    setWrongCount(updatedWrong);
    setCurrentIndex((index) => index + 1);
    setSelectedChoice(null);
    setIsCorrect(null);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Quiz
        </p>
        <p className="mt-1 text-lg font-medium text-slate-900 dark:text-slate-100">
          Question {currentIndex + 1} of {normalizedQuestions.length}
        </p>
        <p className="mt-2 text-base text-slate-700 dark:text-slate-200">
          {currentQuestion.question}
        </p>
      </div>
      <div className="space-y-3">
        {currentQuestion.choices?.map((choice) => {
          const isChosen = selectedChoice === choice;
          const isAnswer =
            selectedChoice !== null && choice.trim() === currentQuestion.answer?.trim();
          const showFeedback = selectedChoice !== null;
          const baseClass =
            "w-full rounded-2xl border px-4 py-3 text-left text-sm transition-colors";
          const stateClass = !showFeedback
            ? "border-slate-200 bg-slate-50 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800"
            : isAnswer
            ? "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900/40"
            : isChosen
            ? "border-rose-500 bg-rose-50 dark:border-rose-400 dark:bg-rose-900/40"
            : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800";

          return (
            <button
              key={choice}
              type="button"
              className={`${baseClass} ${stateClass}`}
              onClick={() => handleChoiceSelect(choice)}
              disabled={selectedChoice !== null}
            >
              <span className="text-base text-slate-800 dark:text-slate-100">
                {choice}
              </span>
            </button>
          );
        })}
      </div>
      {selectedChoice !== null ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {isCorrect ? "Great job!" : "Take another look."}
          {currentQuestion.explanation ? (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {currentQuestion.explanation}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          disabled={selectedChoice === null || isComplete}
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:bg-slate-400 dark:disabled:bg-slate-600"
        >
          {currentIndex === normalizedQuestions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
      {isComplete ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Quiz complete! Incorrect answers: {wrongCount}.
        </p>
      ) : null}
    </div>
  );
}
