import {
  getRecommendedProblems,
  calculateNextDifficulty,
  getWeakCategories,
  shuffleWithWeight,
} from '../recommendation';
import {
  Problem,
  UserProfile,
  CategoryStats,
  ProblemProgress,
  Difficulty,
  Category,
} from '../../types';

describe('Recommendation System', () => {
  // Mock data
  const mockCategoryStats: CategoryStats[] = [
    {
      category: 'ARRAY',
      totalProblems: 10,
      completedProblems: 8,
      averageScore: 85,
      totalTimeSpent: 3600,
      strengthLevel: 'STRONG',
    },
    {
      category: 'STRING',
      totalProblems: 10,
      completedProblems: 3,
      averageScore: 45,
      totalTimeSpent: 1200,
      strengthLevel: 'WEAK',
    },
    {
      category: 'GRAPH',
      totalProblems: 10,
      completedProblems: 0,
      averageScore: 0,
      totalTimeSpent: 0,
      strengthLevel: 'WEAK',
    },
  ];

  const mockUserProfile: UserProfile = {
    id: 'user-1',
    username: 'testuser',
    level: 5,
    experience: 500,
    experienceToNextLevel: 1000,
    totalProblemsCompleted: 11,
    currentStreak: 3,
    longestStreak: 7,
    lastActiveDate: new Date(),
    categoryStats: mockCategoryStats,
    achievements: [],
    preferences: {
      preferredLanguage: 'javascript',
      dailyGoal: 3,
      difficulty: ['EASY', 'MEDIUM'],
      categories: [],
      notificationsEnabled: true,
      soundEnabled: true,
    },
  };

  const mockProblems: Problem[] = [
    {
      id: 'p1',
      title: 'Array Sum',
      description: 'Calculate sum',
      difficulty: 'MEDIUM',
      category: 'ARRAY',
      type: 'FILL_BLANK',
      content: {} as any,
      hints: [],
      timeEstimate: 5,
      tags: ['array', 'basic'],
      learningObjectives: [],
    },
    {
      id: 'p2',
      title: 'String Reverse',
      description: 'Reverse string',
      difficulty: 'MEDIUM',
      category: 'STRING',
      type: 'DRAG_DROP',
      content: {} as any,
      hints: [],
      timeEstimate: 5,
      tags: ['string'],
      learningObjectives: [],
    },
    {
      id: 'p3',
      title: 'Graph BFS',
      description: 'BFS traversal',
      difficulty: 'HARD',
      category: 'GRAPH',
      type: 'MULTIPLE_CHOICE',
      content: {} as any,
      hints: [],
      timeEstimate: 10,
      tags: ['graph', 'bfs'],
      learningObjectives: [],
    },
    {
      id: 'p4',
      title: 'Easy String',
      description: 'String basics',
      difficulty: 'EASY',
      category: 'STRING',
      type: 'FILL_BLANK',
      content: {} as any,
      hints: [],
      timeEstimate: 3,
      tags: ['string', 'easy'],
      learningObjectives: [],
    },
  ];

  describe('calculateNextDifficulty', () => {
    test('레벨 5, 성적 90점 → HARD (난이도 상승)', () => {
      const difficulty = calculateNextDifficulty(5, 90);
      expect(difficulty).toBe('HARD');
    });

    test('레벨 5, 성적 50점 → EASY (난이도 하락)', () => {
      const difficulty = calculateNextDifficulty(5, 50);
      expect(difficulty).toBe('EASY');
    });

    test('레벨 2 → BEGINNER', () => {
      const difficulty = calculateNextDifficulty(2, 70);
      expect(difficulty).toBe('BEGINNER');
    });

    test('레벨 10 → EXPERT', () => {
      const difficulty = calculateNextDifficulty(10, 70);
      expect(difficulty).toBe('EXPERT');
    });
  });

  describe('getWeakCategories', () => {
    test('약점 카테고리를 올바르게 파악', () => {
      const weakCategories = getWeakCategories(mockCategoryStats);
      expect(weakCategories).toContain('STRING');
      expect(weakCategories).toContain('GRAPH');
      expect(weakCategories).not.toContain('ARRAY');
    });
  });

  describe('getRecommendedProblems', () => {
    test('추천 문제 반환', () => {
      const problemProgress = new Map<string, ProblemProgress>();

      const recommended = getRecommendedProblems(
        'user-1',
        mockUserProfile,
        mockProblems,
        problemProgress,
        2
      );

      expect(recommended).toHaveLength(2);
      expect(recommended.every(p => p.difficulty === 'MEDIUM' || p.difficulty === 'EASY')).toBe(true);
    });

    test('약점 카테고리 문제 우선 추천', () => {
      const problemProgress = new Map<string, ProblemProgress>();

      const recommended = getRecommendedProblems(
        'user-1',
        mockUserProfile,
        mockProblems,
        problemProgress,
        4
      );

      // STRING과 GRAPH 문제가 포함되어야 함
      const categories = recommended.map(p => p.category);
      const hasWeakCategory = categories.some(c => c === 'STRING' || c === 'GRAPH');
      expect(hasWeakCategory).toBe(true);
    });

    test('최근 푼 문제 제외', () => {
      const problemProgress = new Map<string, ProblemProgress>();
      problemProgress.set('p2', {
        problemId: 'p2',
        status: 'COMPLETED',
        attempts: 1,
        bestTime: 100,
        score: 90,
        answers: [],
        completedAt: new Date(),
        lastAttemptAt: new Date(),
      });

      const recommended = getRecommendedProblems(
        'user-1',
        mockUserProfile,
        mockProblems,
        problemProgress,
        4
      );

      expect(recommended.every(p => p.id !== 'p2')).toBe(true);
    });

    test('마스터한 문제 제외', () => {
      const problemProgress = new Map<string, ProblemProgress>();
      problemProgress.set('p1', {
        problemId: 'p1',
        status: 'MASTERED',
        attempts: 1,
        bestTime: 100,
        score: 100,
        answers: [],
        completedAt: new Date(),
        lastAttemptAt: new Date(),
      });

      const recommended = getRecommendedProblems(
        'user-1',
        mockUserProfile,
        mockProblems,
        problemProgress,
        4
      );

      expect(recommended.every(p => p.id !== 'p1')).toBe(true);
    });
  });

  describe('shuffleWithWeight', () => {
    test('가중치 기반 셔플', () => {
      const weights = new Map<string, number>();
      weights.set('p1', 100);
      weights.set('p2', 1);
      weights.set('p3', 1);
      weights.set('p4', 1);

      const shuffled = shuffleWithWeight(mockProblems, weights);

      expect(shuffled).toHaveLength(4);
      // p1이 높은 가중치로 인해 앞쪽에 올 확률이 높음
      // (확률적이므로 항상 성공하지는 않지만, 대부분 성공)
    });
  });
});
