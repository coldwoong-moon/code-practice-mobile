import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Problem,
  ProblemProgress,
  ProblemFilter,
  RecommendedProblem,
  LearningPath,
  UserAnswer,
  Category,
  Difficulty,
} from '../types';

// ============================================================================
// Problem Store Interface
// ============================================================================

interface ProblemState {
  // Current problem
  currentProblem: Problem | null;
  currentProblemProgress: ProblemProgress | null;

  // Problem collections
  allProblems: Problem[];
  recommendedProblems: RecommendedProblem[];
  learningPaths: LearningPath[];

  // Progress tracking
  problemProgress: Map<string, ProblemProgress>;

  // Filters and search
  filters: ProblemFilter;
  searchQuery: string;

  // Actions - Problem Management
  setCurrentProblem: (problem: Problem | null) => void;
  loadProblem: (problemId: string) => void;
  getNextProblem: () => Problem | null;
  getPreviousProblem: () => Problem | null;

  // Actions - Progress
  startProblem: (problemId: string) => void;
  submitAnswer: (answer: UserAnswer) => void;
  updateProblemProgress: (problemId: string, progress: Partial<ProblemProgress>) => void;
  resetProblemProgress: (problemId: string) => void;

  // Actions - Recommendations
  updateRecommendations: (userId: string) => void;
  refreshRecommendations: () => void;

  // Actions - Filters
  setFilters: (filters: Partial<ProblemFilter>) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;

  // Getters
  getFilteredProblems: () => Problem[];
  getProblemsByCategory: (category: Category) => Problem[];
  getProblemsByDifficulty: (difficulty: Difficulty) => Problem[];
  getCompletedProblems: () => Problem[];
  getInProgressProblems: () => Problem[];
}

// ============================================================================
// Helper Functions
// ============================================================================

const calculateProblemScore = (progress: ProblemProgress): number => {
  const { attempts, hintsUsed, bestTime } = progress;

  let score = 100;

  // Deduct for multiple attempts
  score -= Math.min(attempts - 1, 5) * 10;

  // Deduct for hints
  score -= hintsUsed * 5;

  // Bonus for fast completion (if bestTime < 5 minutes)
  if (bestTime > 0 && bestTime < 300) {
    score += Math.floor((300 - bestTime) / 60) * 5;
  }

  return Math.max(0, Math.min(100, score));
};

const matchesFilter = (problem: Problem, filter: ProblemFilter): boolean => {
  if (filter.difficulty && !filter.difficulty.includes(problem.difficulty)) {
    return false;
  }

  if (filter.category && !filter.category.includes(problem.category)) {
    return false;
  }

  if (filter.type && !filter.type.includes(problem.type)) {
    return false;
  }

  if (filter.tags && !filter.tags.some(tag => problem.tags.includes(tag))) {
    return false;
  }

  return true;
};

const matchesSearch = (problem: Problem, query: string): boolean => {
  const lowerQuery = query.toLowerCase();
  return (
    problem.title.toLowerCase().includes(lowerQuery) ||
    problem.description.toLowerCase().includes(lowerQuery) ||
    problem.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// ============================================================================
// Mock Data (Replace with API calls)
// ============================================================================

const mockProblems: Problem[] = [
  // Add sample problems here or load from API
];

// ============================================================================
// Zustand Store
// ============================================================================

export const useProblemStore = create<ProblemState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentProblem: null,
      currentProblemProgress: null,
      allProblems: mockProblems,
      recommendedProblems: [],
      learningPaths: [],
      problemProgress: new Map(),
      filters: {},
      searchQuery: '',

      // Actions - Problem Management
      setCurrentProblem: (problem) => {
        set({ currentProblem: problem });
        if (problem) {
          const progress = get().problemProgress.get(problem.id);
          set({ currentProblemProgress: progress || null });
        }
      },

      loadProblem: (problemId) => {
        const problem = get().allProblems.find(p => p.id === problemId);
        if (problem) {
          get().setCurrentProblem(problem);
        }
      },

      getNextProblem: () => {
        const { currentProblem, allProblems } = get();
        if (!currentProblem) return allProblems[0] || null;

        const currentIndex = allProblems.findIndex(p => p.id === currentProblem.id);
        if (currentIndex === -1 || currentIndex === allProblems.length - 1) return null;

        return allProblems[currentIndex + 1];
      },

      getPreviousProblem: () => {
        const { currentProblem, allProblems } = get();
        if (!currentProblem) return null;

        const currentIndex = allProblems.findIndex(p => p.id === currentProblem.id);
        if (currentIndex <= 0) return null;

        return allProblems[currentIndex - 1];
      },

      // Actions - Progress
      startProblem: (problemId) => {
        const { problemProgress } = get();
        const existing = problemProgress.get(problemId);

        if (!existing) {
          const newProgress: ProblemProgress = {
            problemId,
            status: 'IN_PROGRESS',
            attempts: 0,
            hintsUsed: 0,
            bestTime: 0,
            score: 0,
            answers: [],
            lastAttemptAt: new Date(),
          };

          set({
            problemProgress: new Map(problemProgress).set(problemId, newProgress),
          });
        } else {
          get().updateProblemProgress(problemId, {
            status: 'IN_PROGRESS',
            lastAttemptAt: new Date(),
          });
        }
      },

      submitAnswer: (answer) => {
        const { problemProgress } = get();
        const progress = problemProgress.get(answer.problemId);

        if (!progress) {
          console.error('No progress found for problem:', answer.problemId);
          return;
        }

        const updatedAnswers = [...progress.answers, answer];
        const attempts = progress.attempts + 1;
        const bestTime = progress.bestTime === 0 || answer.timeSpent < progress.bestTime
          ? answer.timeSpent
          : progress.bestTime;

        const updatedProgress: ProblemProgress = {
          ...progress,
          answers: updatedAnswers,
          attempts,
          bestTime,
          lastAttemptAt: new Date(),
        };

        if (answer.isCorrect) {
          updatedProgress.status = 'COMPLETED';
          updatedProgress.completedAt = new Date();
          updatedProgress.score = calculateProblemScore(updatedProgress);
        }

        set({
          problemProgress: new Map(problemProgress).set(answer.problemId, updatedProgress),
          currentProblemProgress: updatedProgress,
        });
      },

      updateProblemProgress: (problemId, updates) => {
        const { problemProgress } = get();
        const existing = problemProgress.get(problemId);

        if (!existing) return;

        const updated = { ...existing, ...updates };
        set({
          problemProgress: new Map(problemProgress).set(problemId, updated),
        });
      },

      resetProblemProgress: (problemId) => {
        const { problemProgress } = get();
        problemProgress.delete(problemId);
        set({ problemProgress: new Map(problemProgress) });
      },

      // Actions - Recommendations
      updateRecommendations: (userId) => {
        // TODO: Implement AI-based recommendation algorithm
        // For now, use simple logic based on category stats
        const { allProblems, problemProgress } = get();

        const recommended = allProblems
          .filter(p => !problemProgress.has(p.id) || problemProgress.get(p.id)?.status !== 'COMPLETED')
          .slice(0, 10)
          .map((problem, index) => ({
            problem,
            reason: 'Recommended for your level',
            priority: 100 - index * 10,
            matchScore: 90 - index * 5,
          }));

        set({ recommendedProblems: recommended });
      },

      refreshRecommendations: () => {
        // Trigger recommendation update
        get().updateRecommendations('current-user');
      },

      // Actions - Filters
      setFilters: (filters) => {
        set(state => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      clearFilters: () => {
        set({ filters: {} });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      // Getters
      getFilteredProblems: () => {
        const { allProblems, filters, searchQuery } = get();

        return allProblems.filter(problem => {
          if (!matchesFilter(problem, filters)) return false;
          if (searchQuery && !matchesSearch(problem, searchQuery)) return false;
          return true;
        });
      },

      getProblemsByCategory: (category) => {
        return get().allProblems.filter(p => p.category === category);
      },

      getProblemsByDifficulty: (difficulty) => {
        return get().allProblems.filter(p => p.difficulty === difficulty);
      },

      getCompletedProblems: () => {
        const { allProblems, problemProgress } = get();
        return allProblems.filter(p => {
          const progress = problemProgress.get(p.id);
          return progress?.status === 'COMPLETED' || progress?.status === 'MASTERED';
        });
      },

      getInProgressProblems: () => {
        const { allProblems, problemProgress } = get();
        return allProblems.filter(p => {
          const progress = problemProgress.get(p.id);
          return progress?.status === 'IN_PROGRESS';
        });
      },
    }),
    {
      name: 'problem-storage',
      partialize: (state) => ({
        problemProgress: Array.from(state.problemProgress.entries()),
        filters: state.filters,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.problemProgress)) {
          state.problemProgress = new Map(state.problemProgress as any);
        }
      },
    }
  )
);
