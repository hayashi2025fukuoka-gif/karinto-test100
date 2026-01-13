
export interface Poem {
  id: number;
  author: string;
  kamunoku: string;
  shimunoku: string;
}

export interface QuizState {
  pendingPoemIds: number[];
  score: number;
  showResult: boolean;
  selectedOption: string | null;
  shuffledOptions: string[];
  isCorrect: boolean | null;
  manjuStep: number;
}

export interface PoemExplanation {
  translation: string;
  appreciation: string;
}

export interface ManjuStepInfo {
  step: number;
  title: string;
  description: string;
}

export interface CelebrationContent {
  originalPoem: string;
  poemMeaning: string;
  date: string;
}
