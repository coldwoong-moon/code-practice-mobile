export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface CodeBlank {
  id: string;
  options: string[];
  correctIndex: number;
}

export interface CodeFillBlankProps {
  code: string; // Code with {{BLANK_ID}} placeholders
  blanks: Record<string, CodeBlank>;
  onComplete: (isCorrect: boolean, answers: Record<string, string>) => void;
}

export interface CodeBlock {
  id: string;
  content: string;
  order: number;
}

export interface DragDropCodeProps {
  codeBlocks: CodeBlock[];
  onComplete: (isCorrect: boolean, orderedBlocks: CodeBlock[]) => void;
}

export interface MultipleChoiceProps {
  question: string;
  choices: string[];
  correctIndex: number;
  onAnswer: (selectedIndex: number, isCorrect: boolean) => void;
}

export interface ProblemCardProps {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  category: string;
  progress?: number; // 0-100
  isCompleted?: boolean;
  onClick?: () => void;
}
