"use client";

import type { LessonPlan } from "@/types/lesson";

interface LessonSummaryProps {
  lesson: LessonPlan;
  onNext: () => void;
}

export function LessonSummary({ lesson, onNext }: LessonSummaryProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl bg-white p-8 shadow-md dark:bg-slate-900">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Lesson Objective
        </h2>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
          {lesson.lesson_objective ?? "Review the generated lesson plan."}
        </p>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Summary
        </h3>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
          {lesson.summary ?? "A summary will appear once the lesson is generated."}
        </p>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Learning Objectives
        </h3>
        <ul className="mt-3 space-y-3">
          {(lesson.learning_objectives ?? []).map((objective, index) => (
            <li
              key={objective.title ?? index}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-slate-700 dark:bg-slate-800"
            >
              <p className="text-base font-medium text-slate-800 dark:text-slate-100">
                Objective {index + 1}: {objective.title ?? "Untitled objective"}
              </p>
              {objective.reflection_prompt ? (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Reflection Prompt: {objective.reflection_prompt}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Start Lesson
        </button>
      </div>
    </div>
  );
}
