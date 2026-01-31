import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserProfile,
  CategoryStats,
  Achievement,
  UserPreferences,
  StudySession,
  Category,
  Difficulty,
} from '../types';

// ============================================================================
// User Store Interface
// ============================================================================

interface UserState {
  // User profile
  profile: UserProfile | null;
  currentSession: StudySession | null;
  studyHistory: StudySession[];

  // Actions - Profile
  initializeUser: (username: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addExperience: (amount: number) => void;
  levelUp: () => void;

  // Actions - Stats
  updateCategoryStats: (category: Category, updates: Partial<CategoryStats>) => void;
  recordProblemCompletion: (category: Category, score: number, timeSpent: number) => void;
  updateStreak: () => void;
  checkAndUpdateStreak: () => void;

  // Actions - Achievements
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  checkAchievements: () => Achievement[];

  // Actions - Session
  startStudySession: () => void;
  endStudySession: () => void;
  updateCurrentSession: (updates: Partial<StudySession>) => void;

  // Actions - Preferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void;

  // Getters
  getLevel: () => number;
  getExperienceProgress: () => number;
  getStrongestCategories: (limit?: number) => CategoryStats[];
  getWeakestCategories: (limit?: number) => CategoryStats[];
  getTotalStudyTime: () => number;
  getAverageScore: () => number;
  getCompletionRate: () => number;
}

// ============================================================================
// Helper Functions
// ============================================================================

const calculateExperienceForLevel = (level: number): number => {
  // Exponential curve: 100 * 1.5^(level-1)
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

const calculateStrengthLevel = (stats: CategoryStats): CategoryStats['strengthLevel'] => {
  const { averageScore, completedProblems } = stats;

  if (completedProblems === 0) return 'WEAK';
  if (completedProblems < 5) return 'LEARNING';

  if (averageScore >= 90) return 'EXPERT';
  if (averageScore >= 75) return 'STRONG';
  if (averageScore >= 60) return 'GOOD';
  if (averageScore >= 40) return 'LEARNING';
  return 'WEAK';
};

const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

// ============================================================================
// Default Data
// ============================================================================

const defaultPreferences: UserPreferences = {
  preferredLanguage: 'python',
  dailyGoal: 3,
  difficulty: ['EASY', 'MEDIUM'],
  categories: [],
  notificationsEnabled: true,
  soundEnabled: true,
};

const defaultCategoryStats: CategoryStats[] = [
  'ARRAY',
  'STRING',
  'LINKED_LIST',
  'TREE',
  'GRAPH',
  'DP',
  'SORTING',
  'SEARCHING',
  'RECURSION',
  'STACK_QUEUE',
].map(category => ({
  category: category as Category,
  totalProblems: 0,
  completedProblems: 0,
  averageScore: 0,
  totalTimeSpent: 0,
  strengthLevel: 'WEAK',
}));

const defaultAchievements: Achievement[] = [
  {
    id: 'first-problem',
    title: 'First Steps',
    description: 'Complete your first problem',
    icon: '🎯',
    progress: 0,
    requirement: 1,
  },
  {
    id: 'week-streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    progress: 0,
    requirement: 7,
  },
  {
    id: 'problem-10',
    title: 'Getting Started',
    description: 'Complete 10 problems',
    icon: '⭐',
    progress: 0,
    requirement: 10,
  },
  {
    id: 'problem-50',
    title: 'Dedicated Learner',
    description: 'Complete 50 problems',
    icon: '🌟',
    progress: 0,
    requirement: 50,
  },
  {
    id: 'problem-100',
    title: 'Century',
    description: 'Complete 100 problems',
    icon: '💯',
    progress: 0,
    requirement: 100,
  },
  {
    id: 'perfect-score',
    title: 'Perfectionist',
    description: 'Get a perfect score on a problem',
    icon: '💎',
    progress: 0,
    requirement: 1,
  },
  {
    id: 'category-master',
    title: 'Category Master',
    description: 'Reach EXPERT level in any category',
    icon: '👑',
    progress: 0,
    requirement: 1,
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete 5 problems in under 3 minutes each',
    icon: '⚡',
    progress: 0,
    requirement: 5,
  },
];

// ============================================================================
// Zustand Store
// ============================================================================

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      currentSession: null,
      studyHistory: [],

      // Actions - Profile
      initializeUser: (username) => {
        const newProfile: UserProfile = {
          id: `user-${Date.now()}`,
          username,
          level: 1,
          experience: 0,
          experienceToNextLevel: calculateExperienceForLevel(1),
          totalProblemsCompleted: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: new Date(),
          categoryStats: defaultCategoryStats,
          achievements: defaultAchievements,
          preferences: defaultPreferences,
        };

        set({ profile: newProfile });
      },

      updateProfile: (updates) => {
        set(state => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        }));
      },

      addExperience: (amount) => {
        const { profile } = get();
        if (!profile) return;

        const newExperience = profile.experience + amount;
        const expNeeded = profile.experienceToNextLevel;

        if (newExperience >= expNeeded) {
          get().levelUp();
          const overflow = newExperience - expNeeded;
          set(state => ({
            profile: state.profile
              ? { ...state.profile, experience: overflow }
              : null,
          }));
        } else {
          set(state => ({
            profile: state.profile
              ? { ...state.profile, experience: newExperience }
              : null,
          }));
        }
      },

      levelUp: () => {
        const { profile } = get();
        if (!profile) return;

        const newLevel = profile.level + 1;
        const newExpNeeded = calculateExperienceForLevel(newLevel);

        set(state => ({
          profile: state.profile
            ? {
                ...state.profile,
                level: newLevel,
                experienceToNextLevel: newExpNeeded,
              }
            : null,
        }));
      },

      // Actions - Stats
      updateCategoryStats: (category, updates) => {
        set(state => {
          if (!state.profile) return state;

          const categoryStats = state.profile.categoryStats.map(stat =>
            stat.category === category
              ? { ...stat, ...updates, strengthLevel: calculateStrengthLevel({ ...stat, ...updates }) }
              : stat
          );

          return {
            profile: { ...state.profile, categoryStats },
          };
        });
      },

      recordProblemCompletion: (category, score, timeSpent) => {
        const { profile } = get();
        if (!profile) return;

        const categoryStats = profile.categoryStats.find(s => s.category === category);
        if (!categoryStats) return;

        const newCompleted = categoryStats.completedProblems + 1;
        const newTotalTime = categoryStats.totalTimeSpent + timeSpent;
        const newAvgScore =
          (categoryStats.averageScore * categoryStats.completedProblems + score) / newCompleted;

        get().updateCategoryStats(category, {
          completedProblems: newCompleted,
          totalTimeSpent: newTotalTime,
          averageScore: Math.round(newAvgScore),
        });

        // Update total problems completed
        set(state => ({
          profile: state.profile
            ? {
                ...state.profile,
                totalProblemsCompleted: state.profile.totalProblemsCompleted + 1,
                lastActiveDate: new Date(),
              }
            : null,
        }));

        // Add experience based on difficulty and score
        const expGained = Math.floor(score / 10) * 10; // 10 exp per 10 points
        get().addExperience(expGained);

        // Check for achievements
        get().checkAchievements();
      },

      updateStreak: () => {
        const { profile } = get();
        if (!profile) return;

        const lastActive = new Date(profile.lastActiveDate);

        if (isToday(lastActive)) {
          // Already active today, no change
          return;
        }

        if (isYesterday(lastActive)) {
          // Continue streak
          const newStreak = profile.currentStreak + 1;
          const newLongest = Math.max(newStreak, profile.longestStreak);

          set(state => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  currentStreak: newStreak,
                  longestStreak: newLongest,
                  lastActiveDate: new Date(),
                }
              : null,
          }));
        } else {
          // Streak broken, reset to 1
          set(state => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  currentStreak: 1,
                  lastActiveDate: new Date(),
                }
              : null,
          }));
        }
      },

      checkAndUpdateStreak: () => {
        get().updateStreak();
      },

      // Actions - Achievements
      unlockAchievement: (achievementId) => {
        set(state => {
          if (!state.profile) return state;

          const achievements = state.profile.achievements.map(ach =>
            ach.id === achievementId && !ach.unlockedAt
              ? { ...ach, unlockedAt: new Date(), progress: ach.requirement }
              : ach
          );

          return {
            profile: { ...state.profile, achievements },
          };
        });
      },

      updateAchievementProgress: (achievementId, progress) => {
        set(state => {
          if (!state.profile) return state;

          const achievements = state.profile.achievements.map(ach =>
            ach.id === achievementId
              ? { ...ach, progress: Math.min(progress, ach.requirement) }
              : ach
          );

          return {
            profile: { ...state.profile, achievements },
          };
        });
      },

      checkAchievements: () => {
        const { profile } = get();
        if (!profile) return [];

        const unlockedAchievements: Achievement[] = [];

        // First problem
        if (profile.totalProblemsCompleted >= 1) {
          get().updateAchievementProgress('first-problem', profile.totalProblemsCompleted);
          const ach = profile.achievements.find(a => a.id === 'first-problem');
          if (ach && !ach.unlockedAt) {
            get().unlockAchievement('first-problem');
            unlockedAchievements.push(ach);
          }
        }

        // Problem milestones
        if (profile.totalProblemsCompleted >= 10) {
          get().updateAchievementProgress('problem-10', profile.totalProblemsCompleted);
          const ach = profile.achievements.find(a => a.id === 'problem-10');
          if (ach && !ach.unlockedAt) {
            get().unlockAchievement('problem-10');
            unlockedAchievements.push(ach);
          }
        }

        if (profile.totalProblemsCompleted >= 50) {
          get().updateAchievementProgress('problem-50', profile.totalProblemsCompleted);
          const ach = profile.achievements.find(a => a.id === 'problem-50');
          if (ach && !ach.unlockedAt) {
            get().unlockAchievement('problem-50');
            unlockedAchievements.push(ach);
          }
        }

        if (profile.totalProblemsCompleted >= 100) {
          get().updateAchievementProgress('problem-100', profile.totalProblemsCompleted);
          const ach = profile.achievements.find(a => a.id === 'problem-100');
          if (ach && !ach.unlockedAt) {
            get().unlockAchievement('problem-100');
            unlockedAchievements.push(ach);
          }
        }

        // Week streak
        if (profile.currentStreak >= 7) {
          get().updateAchievementProgress('week-streak', profile.currentStreak);
          const ach = profile.achievements.find(a => a.id === 'week-streak');
          if (ach && !ach.unlockedAt) {
            get().unlockAchievement('week-streak');
            unlockedAchievements.push(ach);
          }
        }

        // Category master
        const hasExpert = profile.categoryStats.some(s => s.strengthLevel === 'EXPERT');
        if (hasExpert) {
          get().updateAchievementProgress('category-master', 1);
          const ach = profile.achievements.find(a => a.id === 'category-master');
          if (ach && !ach.unlockedAt) {
            get().unlockAchievement('category-master');
            unlockedAchievements.push(ach);
          }
        }

        return unlockedAchievements;
      },

      // Actions - Session
      startStudySession: () => {
        const newSession: StudySession = {
          id: `session-${Date.now()}`,
          startTime: new Date(),
          problemsAttempted: [],
          problemsCompleted: [],
          totalTimeSpent: 0,
          experienceGained: 0,
          achievements: [],
        };

        set({ currentSession: newSession });
        get().checkAndUpdateStreak();
      },

      endStudySession: () => {
        const { currentSession, studyHistory } = get();
        if (!currentSession) return;

        const completedSession: StudySession = {
          ...currentSession,
          endTime: new Date(),
        };

        set({
          currentSession: null,
          studyHistory: [completedSession, ...studyHistory.slice(0, 99)], // Keep last 100 sessions
        });
      },

      updateCurrentSession: (updates) => {
        set(state => ({
          currentSession: state.currentSession
            ? { ...state.currentSession, ...updates }
            : null,
        }));
      },

      // Actions - Preferences
      updatePreferences: (preferences) => {
        set(state => ({
          profile: state.profile
            ? {
                ...state.profile,
                preferences: { ...state.profile.preferences, ...preferences },
              }
            : null,
        }));
      },

      // Getters
      getLevel: () => {
        return get().profile?.level || 1;
      },

      getExperienceProgress: () => {
        const { profile } = get();
        if (!profile) return 0;

        return (profile.experience / profile.experienceToNextLevel) * 100;
      },

      getStrongestCategories: (limit = 3) => {
        const { profile } = get();
        if (!profile) return [];

        return [...profile.categoryStats]
          .filter(s => s.completedProblems > 0)
          .sort((a, b) => b.averageScore - a.averageScore)
          .slice(0, limit);
      },

      getWeakestCategories: (limit = 3) => {
        const { profile } = get();
        if (!profile) return [];

        return [...profile.categoryStats]
          .filter(s => s.completedProblems > 0)
          .sort((a, b) => a.averageScore - b.averageScore)
          .slice(0, limit);
      },

      getTotalStudyTime: () => {
        const { studyHistory } = get();
        return studyHistory.reduce((total, session) => total + session.totalTimeSpent, 0);
      },

      getAverageScore: () => {
        const { profile } = get();
        if (!profile) return 0;

        const totalScore = profile.categoryStats.reduce(
          (sum, stat) => sum + stat.averageScore * stat.completedProblems,
          0
        );
        const totalCompleted = profile.totalProblemsCompleted;

        return totalCompleted > 0 ? Math.round(totalScore / totalCompleted) : 0;
      },

      getCompletionRate: () => {
        const { profile } = get();
        if (!profile) return 0;

        const totalProblems = profile.categoryStats.reduce(
          (sum, stat) => sum + stat.totalProblems,
          0
        );

        return totalProblems > 0
          ? (profile.totalProblemsCompleted / totalProblems) * 100
          : 0;
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        profile: state.profile,
        studyHistory: state.studyHistory,
      }),
    }
  )
);
