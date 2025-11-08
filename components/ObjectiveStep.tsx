"use client";

import { useEffect, useState } from "react";
import { Quiz } from "./Quiz";
import type { LearningObjective } from "@/types/lesson";

interface ObjectiveStepProps {
  objective: LearningObjective | undefined;
  index: number;
  onQuizComplete: (wrongCount: number) => void;
  existingResult: number | undefined;
  onOpenDiscussion: () => void;
}

export function ObjectiveStep({
  objective,
  index,
  onQuizComplete,
  existingResult,
  onOpenDiscussion,
}: ObjectiveStepProps) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (typeof existingResult === "number") {
      setIsComplete(true);
    }
  }, [existingResult]);

  const handleQuizComplete = (wrongCount: number) => {
    setIsComplete(true);
    onQuizComplete(wrongCount);
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="rounded-3xl bg-white p-8 shadow-md dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Objective {index + 1}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {objective?.title ?? "Learning objective"}
        </h2>
        {objective?.summary ? (
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            {objective.summary}
          </p>
        ) : null}
        {objective?.reflection_prompt ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              Reflection Prompt
            </p>
            <p className="mt-2">{objective.reflection_prompt}</p>
          </div>
        ) : null}
        {objective?.discussion_prompt ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-900/30 dark:text-amber-200">
            <p className="font-semibold">Discussion Starter</p>
            <p className="mt-2">{objective.discussion_prompt}</p>
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpenDiscussion}
            className="rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            Begin Socratic Discussion
          </button>
          {isComplete ? (
            <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
              Quiz Completed
            </span>
          ) : null}
        </div>
      </div>
      <Quiz questions={objective?.quiz} onComplete={handleQuizComplete} />
    </div>
  );
}
