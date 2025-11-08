export interface QuizQuestion {
  question: string;
  choices: string[];
  answer: string;
  explanation?: string;
}

export interface LearningObjective {
  title: string;
  reflection_prompt?: string;
  discussion_prompt?: string;
  summary?: string;
  quiz?: QuizQuestion[];
}

export interface LessonAnalysis {
  overall?: string;
  concepts_to_review?: string[];
}

export interface LessonPlan {
  lesson_objective?: string;
  summary?: string;
  learning_objectives?: LearningObjective[];
  analysis?: LessonAnalysis | string;
  next_steps?: string[];
}
