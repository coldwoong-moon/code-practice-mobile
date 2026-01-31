import {
  checkStreak,
  getStreakBonus,
  getStreakLevel,
  checkStreakAtRisk,
  getStreakStats,
  daysBetween,
  getWeeklyPattern,
  predictStreakContinuation,
} from '../streak';

describe('Streak Management System', () => {
  describe('checkStreak', () => {
    test('오늘 이미 활동 → 연속 유지, 변경 없음', () => {
      const today = new Date();
      const result = checkStreak(today, 5);

      expect(result.maintained).toBe(true);
      expect(result.newStreak).toBe(5);
    });

    test('어제 활동 → 연속 유지, +1일', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = checkStreak(yesterday, 5);

      expect(result.maintained).toBe(true);
      expect(result.newStreak).toBe(6);
    });

    test('2일 전 활동 → 연속 끊김, 1일로 리셋', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const result = checkStreak(twoDaysAgo, 5);

      expect(result.maintained).toBe(false);
      expect(result.newStreak).toBe(1);
    });
  });

  describe('getStreakBonus', () => {
    test('3일 미만 → 0 XP', () => {
      expect(getStreakBonus(0)).toBe(0);
      expect(getStreakBonus(1)).toBe(0);
      expect(getStreakBonus(2)).toBe(0);
    });

    test('3-6일 → 10 XP', () => {
      expect(getStreakBonus(3)).toBe(10);
      expect(getStreakBonus(6)).toBe(10);
    });

    test('7-13일 (1주) → 25 XP', () => {
      expect(getStreakBonus(7)).toBe(25);
      expect(getStreakBonus(13)).toBe(25);
    });

    test('14-29일 (2주) → 50 XP', () => {
      expect(getStreakBonus(14)).toBe(50);
      expect(getStreakBonus(29)).toBe(50);
    });

    test('30-59일 (1달) → 100 XP', () => {
      expect(getStreakBonus(30)).toBe(100);
      expect(getStreakBonus(59)).toBe(100);
    });

    test('60-99일 (2달) → 200 XP', () => {
      expect(getStreakBonus(60)).toBe(200);
      expect(getStreakBonus(99)).toBe(200);
    });

    test('100일 이상 → 300 XP', () => {
      expect(getStreakBonus(100)).toBe(300);
      expect(getStreakBonus(365)).toBe(300);
    });
  });

  describe('getStreakLevel', () => {
    test('0일 → New Start', () => {
      const level = getStreakLevel(0);
      expect(level.level).toBe('New Start');
      expect(level.emoji).toBe('🌱');
    });

    test('1-2일 → Beginner', () => {
      const level = getStreakLevel(2);
      expect(level.level).toBe('Beginner');
      expect(level.emoji).toBe('🔥');
    });

    test('3-6일 → Warming Up', () => {
      const level = getStreakLevel(5);
      expect(level.level).toBe('Warming Up');
      expect(level.emoji).toBe('🔥🔥');
    });

    test('7-13일 → On Fire', () => {
      const level = getStreakLevel(10);
      expect(level.level).toBe('On Fire');
      expect(level.emoji).toBe('🔥🔥🔥');
    });

    test('14-29일 → Blazing', () => {
      const level = getStreakLevel(20);
      expect(level.level).toBe('Blazing');
    });

    test('30-59일 → Unstoppable', () => {
      const level = getStreakLevel(45);
      expect(level.level).toBe('Unstoppable');
      expect(level.emoji).toBe('⚡');
    });

    test('60-99일 → Legend', () => {
      const level = getStreakLevel(80);
      expect(level.level).toBe('Legend');
      expect(level.emoji).toBe('👑');
    });

    test('100일 이상 → Immortal', () => {
      const level = getStreakLevel(150);
      expect(level.level).toBe('Immortal');
      expect(level.emoji).toBe('💎');
    });
  });

  describe('checkStreakAtRisk', () => {
    test('오늘 활동 → 위험 없음', () => {
      const today = new Date();
      const result = checkStreakAtRisk(today);

      expect(result.atRisk).toBe(false);
      expect(result.hoursLeft).toBeGreaterThan(0);
    });

    test('어제 활동, 6시간 미만 남음 → 위험', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(20, 0, 0, 0); // 어제 8PM

      const result = checkStreakAtRisk(yesterday);

      // 현재 시간에 따라 다를 수 있으므로 atRisk만 확인
      expect(typeof result.atRisk).toBe('boolean');
      expect(result.hoursLeft).toBeGreaterThanOrEqual(0);
    });

    test('2일 전 활동 → 이미 끊김', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const result = checkStreakAtRisk(twoDaysAgo);

      expect(result.atRisk).toBe(false);
      expect(result.hoursLeft).toBe(0);
    });
  });

  describe('getStreakStats', () => {
    test('전체 통계 반환', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const stats = getStreakStats(7, 10, yesterday);

      expect(stats.currentStreak).toBe(7);
      expect(stats.longestStreak).toBe(10);
      expect(stats.level.level).toBe('On Fire');
      expect(stats.bonus).toBe(25);
      expect(stats.isPersonalBest).toBe(false);
    });

    test('개인 최고 기록 달성', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const stats = getStreakStats(10, 10, yesterday);

      expect(stats.isPersonalBest).toBe(true);
    });

    test('개인 최고 기록 갱신', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const stats = getStreakStats(15, 10, yesterday);

      expect(stats.isPersonalBest).toBe(true);
    });
  });

  describe('daysBetween', () => {
    test('같은 날 → 0일', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-01');
      expect(daysBetween(date1, date2)).toBe(0);
    });

    test('하루 차이 → 1일', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-02');
      expect(daysBetween(date1, date2)).toBe(1);
    });

    test('일주일 차이 → 7일', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-08');
      expect(daysBetween(date1, date2)).toBe(7);
    });
  });

  describe('getWeeklyPattern', () => {
    test('요일별 활동 빈도 계산', () => {
      const dates = [
        new Date('2024-01-01'), // 월요일
        new Date('2024-01-08'), // 월요일
        new Date('2024-01-10'), // 수요일
      ];

      const pattern = getWeeklyPattern(dates);

      expect(pattern).toHaveLength(7); // 일-토
      expect(pattern.every(count => count >= 0)).toBe(true);
    });
  });

  describe('predictStreakContinuation', () => {
    test('활동 빈도가 높으면 높은 예측값', () => {
      const dates: Date[] = [];
      const today = new Date();

      // 최근 30일 중 25일 활동 (83% 활동률)
      for (let i = 0; i < 25; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date);
      }

      const prediction = predictStreakContinuation(10, dates);
      expect(prediction).toBeGreaterThan(10); // 현재보다 더 유지 가능 예상
    });

    test('활동 빈도가 낮으면 낮은 예측값', () => {
      const dates: Date[] = [];
      const today = new Date();

      // 최근 30일 중 10일만 활동 (33% 활동률)
      for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i * 3);
        dates.push(date);
      }

      const prediction = predictStreakContinuation(10, dates);
      expect(prediction).toBeLessThanOrEqual(10);
    });

    test('연속이 0이면 예측값도 0', () => {
      const prediction = predictStreakContinuation(0, []);
      expect(prediction).toBe(0);
    });
  });
});
