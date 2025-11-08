"use client";

import type { LessonPlan } from "@/types/lesson";

interface FinalSummaryProps {
  lesson: LessonPlan;
  results: Record<string, number>;
}

const isLessonAnalysisObject = (
  analysis: LessonPlan["analysis"]
): analysis is { overall?: string; concepts_to_review?: string[] } => {
  return Boolean(analysis && typeof analysis === "object");
};

export function FinalSummary({ lesson, results }: FinalSummaryProps) {
  const totalWrong = Object.values(results).reduce((sum, value) => sum + value, 0);
  const analysis = lesson.analysis;
  const nextSteps = lesson.next_steps ?? [];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 rounded-3xl bg-white p-8 shadow-md dark:bg-slate-900">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Lesson Summary & Analysis
        </h2>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
          {lesson.summary ?? "No lesson summary provided."}
        </p>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Quiz Performance
        </h3>
        {Object.keys(results).length ? (
          <>
            <ul className="mt-3 space-y-3">
              {Object.entries(results).map(([key, value]) => (
                <li
                  key={key}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <span className="font-medium capitalize">{key.replace(/objective/, "Objective ")}</span>
                  <span>Incorrect answers: {value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Total incorrect answers: {totalWrong}
            </p>
          </>
        ) : (
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            No quiz results were recorded.
          </p>
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Analysis
        </h3>
        {isLessonAnalysisObject(analysis) ? (
          <div className="space-y-3">
            {analysis.overall ? (
              <p className="text-base text-slate-600 dark:text-slate-300">
                {analysis.overall}
              </p>
            ) : null}
            {analysis.concepts_to_review?.length ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-900/20 dark:text-amber-200">
                <p className="font-semibold">Concepts to Review</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {analysis.concepts_to_review.map((concept) => (
                    <li key={concept}>{concept}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : analysis ? (
          <p className="text-base text-slate-600 dark:text-slate-300">{analysis}</p>
        ) : (
          <p className="text-base text-slate-600 dark:text-slate-300">
            No analysis available.
          </p>
        )}
      </div>
      {nextSteps.length ? (
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Next Steps
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-slate-600 dark:text-slate-300">
            {nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
