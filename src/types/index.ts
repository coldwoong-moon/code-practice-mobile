// ============================================================================
// Problem Types & Enums
// ============================================================================

export type ProblemType = 'FILL_BLANK' | 'DRAG_DROP' | 'MULTIPLE_CHOICE' | 'CODE_ARRANGE';

export type Difficulty = 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export type Category =
  | 'ARRAY'
  | 'STRING'
  | 'LINKED_LIST'
  | 'TREE'
  | 'GRAPH'
  | 'DP'
  | 'SORTING'
  | 'SEARCHING'
  | 'RECURSION'
  | 'STACK_QUEUE';

// ============================================================================
// Content Types for Each Problem Type
// ============================================================================

export interface FillBlankContent {
  code: string; // Code with blanks marked as {{0}}, {{1}}, etc.
  blanks: {
    id: number;
    correctAnswer: string;
    options?: string[]; // Optional dropdown options
    validation?: (answer: string) => boolean; // Custom validation
  }[];
  language: 'python' | 'javascript' | 'java' | 'cpp';
}

export interface DragDropContent {
  code: string; // Code structure with drop zones marked as [[0]], [[1]], etc.
  dropZones: {
    id: number;
    acceptedItems: string[]; // IDs of draggable items that can go here
  }[];
  draggableItems: {
    id: string;
    content: string;
    category?: string; // For grouping similar items
  }[];
  language: 'python' | 'javascript' | 'java' | 'cpp';
}

export interface MultipleChoiceContent {
  question: string;
  codeSnippet?: string; // Optional code to analyze
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string; // Explanation shown after answering
  language?: 'python' | 'javascript' | 'java' | 'cpp';
}

export interface CodeArrangeContent {
  description: string;
  codeLines: {
    id: string;
    content: string;
    correctPosition: number; // 0-indexed
    indentLevel: number; // For proper formatting
  }[];
  language: 'python' | 'javascript' | 'java' | 'cpp';
}

// ============================================================================
// Main Problem Interface
// ============================================================================

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: Category;
  type: ProblemType;
  content: FillBlankContent | DragDropContent | MultipleChoiceContent | CodeArrangeContent;
  hints: string[];
  timeEstimate: number; // minutes
  tags: string[];
  prerequisites?: string[]; // Problem IDs that should be completed first
  relatedProblems?: string[]; // Similar problems
  learningObjectives: string[]; // What user should learn
}

// ============================================================================
// User Progress Types
// ============================================================================

export interface UserAnswer {
  problemId: string;
  type: ProblemType;
  answer: any; // Type varies by problem type
  isCorrect: boolean;
  timeSpent: number; // seconds
  hintsUsed: number;
  attemptNumber: number;
  timestamp: Date;
}

export interface ProblemProgress {
  problemId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'MASTERED';
  attempts: number;
  hintsUsed: number;
  bestTime: number; // seconds
  completedAt?: Date;
  lastAttemptAt?: Date;
  score: number; // 0-100
  answers: UserAnswer[];
}

export interface CategoryStats {
  category: Category;
  totalProblems: number;
  completedProblems: number;
  averageScore: number;
  totalTimeSpent: number; // seconds
  strengthLevel: 'WEAK' | 'LEARNING' | 'GOOD' | 'STRONG' | 'EXPERT';
}

// ============================================================================
// User Profile & Stats
// ============================================================================

export interface UserProfile {
  id: string;
  username: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalProblemsCompleted: number;
  currentStreak: number; // days
  longestStreak: number; // days
  lastActiveDate: Date;
  categoryStats: CategoryStats[];
  achievements: Achievement[];
  preferences: UserPreferences;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number; // 0-100
  requirement: number;
}

export interface UserPreferences {
  preferredLanguage: 'python' | 'javascript' | 'java' | 'cpp';
  dailyGoal: number; // problems per day
  difficulty: Difficulty[];
  categories: Category[];
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

// ============================================================================
// Recommendation Types
// ============================================================================

export interface RecommendedProblem {
  problem: Problem;
  reason: string;
  priority: number; // 0-100, higher = more recommended
  matchScore: number; // 0-100, how well it matches user's profile
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  problems: string[]; // Problem IDs in order
  estimatedTime: number; // minutes
  completionRate: number; // 0-100
}

// ============================================================================
// Session Types
// ============================================================================

export interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  problemsAttempted: string[];
  problemsCompleted: string[];
  totalTimeSpent: number; // seconds
  experienceGained: number;
  achievements: string[]; // Achievement IDs unlocked
}

// ============================================================================
// UI State Types
// ============================================================================

export interface UIState {
  currentProblemId: string | null;
  isLoading: boolean;
  showHints: boolean;
  showSolution: boolean;
  sidebarOpen: boolean;
  activeTab: 'problems' | 'progress' | 'leaderboard' | 'settings';
}

// ============================================================================
// Helper Types
// ============================================================================

export type ProblemContent<T extends ProblemType> =
  T extends 'FILL_BLANK' ? FillBlankContent :
  T extends 'DRAG_DROP' ? DragDropContent :
  T extends 'MULTIPLE_CHOICE' ? MultipleChoiceContent :
  T extends 'CODE_ARRANGE' ? CodeArrangeContent :
  never;

export type ProblemFilter = {
  difficulty?: Difficulty[];
  category?: Category[];
  type?: ProblemType[];
  tags?: string[];
  status?: ProblemProgress['status'][];
};
