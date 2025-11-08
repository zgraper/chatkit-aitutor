"use client";

import { useCallback, useMemo, useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { LessonSummary } from "@/components/LessonSummary";
import { ObjectiveStep } from "@/components/ObjectiveStep";
import { FinalSummary } from "@/components/FinalSummary";
import { ChatKitPopup } from "@/components/ChatKitPopup";
import { useColorScheme } from "@/hooks/useColorScheme";
import type { LessonPlan } from "@/types/lesson";

export default function App() {
  const { scheme, setScheme } = useColorScheme();
  const [lesson, setLesson] = useState<LessonPlan | null>(null);
  const [step, setStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, number>>({});
  const [objectiveCompletion, setObjectiveCompletion] = useState<boolean[]>([]);
  const [activeObjectiveIndex, setActiveObjectiveIndex] = useState<number | null>(
    null
  );

  const objectiveCount = lesson?.learning_objectives?.length ?? 0;
  const finalStepIndex = lesson ? objectiveCount + 2 : 0;
  const isObjectiveStep = step >= 2 && step <= objectiveCount + 1;
  const currentObjectiveIndex = isObjectiveStep ? step - 2 : null;

  const handleLessonGenerated = useCallback((generatedLesson: LessonPlan) => {
    setLesson(generatedLesson);
    const count = generatedLesson.learning_objectives?.length ?? 0;
    const initialResults = Object.fromEntries(
      Array.from({ length: count }, (_, index) => [
        `objective${index + 1}`,
        0,
      ])
    );
    setResults(initialResults);
    setObjectiveCompletion(Array(count).fill(false));
    setActiveObjectiveIndex(null);
    setStep(1);
  }, []);

  const handleQuizComplete = useCallback((index: number, wrongCount: number) => {
    setResults((prev) => ({
      ...prev,
      [`objective${index + 1}`]: wrongCount,
    }));
    setObjectiveCompletion((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  }, []);

  const openDiscussion = useCallback((index: number) => {
    setActiveObjectiveIndex(index);
  }, []);

  const closeDiscussion = useCallback(() => {
    setActiveObjectiveIndex(null);
  }, []);

  const canGoNext = useMemo(() => {
    if (!lesson) {
      return false;
    }
    if (step === 0) {
      return false;
    }
    if (step === 1) {
      return true;
    }
    if (currentObjectiveIndex !== null) {
      return objectiveCompletion[currentObjectiveIndex] ?? false;
    }
    return false;
  }, [currentObjectiveIndex, lesson, objectiveCompletion, step]);

  const showPrevious = step > 0;
  const showNext = lesson !== null && step < finalStepIndex;

  const goNext = useCallback(() => {
    if (!lesson) {
      return;
    }
    setStep((prev) => Math.min(prev + 1, finalStepIndex));
  }, [finalStepIndex, lesson]);

  const goPrevious = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const activeObjectiveTitle =
    activeObjectiveIndex !== null
      ? lesson?.learning_objectives?.[activeObjectiveIndex]?.title ??
        `Objective ${activeObjectiveIndex + 1}`
      : "";

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-100 py-10 dark:bg-slate-950">
      <div className="flex w-full max-w-5xl flex-col gap-6 px-4">
        <header className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            AI Tutor Lesson Builder
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Upload content, explore Socratic conversations, and assess learning
            through guided quizzes.
          </p>
        </header>
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-900/20 dark:text-rose-200">
            {error}
          </div>
        ) : null}
        {step === 0 ? (
          <FileUpload
            onLessonGenerated={handleLessonGenerated}
            onProcessingChange={setIsProcessing}
            onError={setError}
          />
        ) : null}
        {lesson && step === 1 ? (
          <LessonSummary lesson={lesson} onNext={goNext} />
        ) : null}
        {lesson && currentObjectiveIndex !== null ? (
          <ObjectiveStep
            objective={lesson.learning_objectives?.[currentObjectiveIndex]}
            index={currentObjectiveIndex}
            onQuizComplete={(count) =>
              handleQuizComplete(currentObjectiveIndex, count)
            }
            existingResult={results[`objective${currentObjectiveIndex + 1}`]}
            onOpenDiscussion={() => openDiscussion(currentObjectiveIndex)}
          />
        ) : null}
        {lesson && step === finalStepIndex ? (
          <FinalSummary lesson={lesson} results={results} />
        ) : null}
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            Processing PDF...
          </div>
        ) : null}
        <div className="flex justify-between pt-4">
          {showPrevious ? (
            <button
              type="button"
              onClick={goPrevious}
              className="rounded-full bg-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              Previous
            </button>
          ) : (
            <span />
          )}
          {showNext ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:bg-slate-400 dark:disabled:bg-slate-700"
            >
              Next
            </button>
          ) : null}
        </div>
      </div>
      {lesson && activeObjectiveIndex !== null ? (
        <ChatKitPopup
          open={activeObjectiveIndex !== null}
          objectiveTitle={activeObjectiveTitle}
          onClose={closeDiscussion}
          theme={scheme}
          onThemeChange={setScheme}
        />
      ) : null}
    </main>
  );
}
