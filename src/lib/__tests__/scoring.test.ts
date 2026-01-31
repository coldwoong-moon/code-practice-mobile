import {
  calculateScore,
  calculateXP,
  checkLevelUp,
  getXPToNextLevel,
  getLevelProgress,
  getTotalXPForLevel,
} from '../scoring';

describe('Scoring System', () => {
  describe('calculateScore', () => {
    test('완벽한 풀이 (첫 시도, 힌트 없음, 빠른 시간)', () => {
      const score = calculateScore(60, 0, 1, 'MEDIUM');
      expect(score).toBeGreaterThanOrEqual(95); // 시간 보너스 포함
    });

    test('시도 횟수에 따른 감점', () => {
      const score1 = calculateScore(180, 0, 1, 'EASY');
      const score2 = calculateScore(180, 0, 2, 'EASY');
      const score3 = calculateScore(180, 0, 3, 'EASY');

      expect(score2).toBeLessThan(score1);
      expect(score3).toBeLessThan(score2);
      expect(score1 - score2).toBe(15); // 2번째 시도 -15점
      expect(score2 - score3).toBe(10); // 3번째 시도 -10점 더 (총 -25점)
    });

    test('힌트 사용에 따른 감점', () => {
      const score1 = calculateScore(180, 0, 1, 'EASY');
      const score2 = calculateScore(180, 1, 1, 'EASY');
      const score3 = calculateScore(180, 2, 1, 'EASY');

      expect(score2).toBeLessThan(score1);
      expect(score3).toBeLessThan(score2);
      expect(score1 - score2).toBe(10); // 힌트 1개 -10점
      expect(score1 - score3).toBe(20); // 힌트 2개 -20점
    });

    test('난이도 보너스', () => {
      const scoreBeginner = calculateScore(120, 0, 1, 'BEGINNER');
      const scoreExpert = calculateScore(600, 0, 1, 'EXPERT');

      expect(scoreExpert).toBeGreaterThan(scoreBeginner);
    });

    test('점수는 0-100 범위 내', () => {
      const score1 = calculateScore(1000, 10, 10, 'BEGINNER');
      const score2 = calculateScore(10, 0, 1, 'EXPERT');

      expect(score1).toBeGreaterThanOrEqual(0);
      expect(score1).toBeLessThanOrEqual(100);
      expect(score2).toBeGreaterThanOrEqual(0);
      expect(score2).toBeLessThanOrEqual(100);
    });
  });

  describe('calculateXP', () => {
    test('점수에 비례한 경험치', () => {
      const xp100 = calculateXP(100, 'MEDIUM');
      const xp50 = calculateXP(50, 'MEDIUM');

      expect(xp100).toBe(200); // MEDIUM 기본 XP
      expect(xp50).toBe(100); // 50% 점수
    });

    test('난이도별 기본 경험치', () => {
      const xpBeginner = calculateXP(100, 'BEGINNER');
      const xpEasy = calculateXP(100, 'EASY');
      const xpMedium = calculateXP(100, 'MEDIUM');
      const xpHard = calculateXP(100, 'HARD');
      const xpExpert = calculateXP(100, 'EXPERT');

      expect(xpBeginner).toBe(50);
      expect(xpEasy).toBe(100);
      expect(xpMedium).toBe(200);
      expect(xpHard).toBe(350);
      expect(xpExpert).toBe(500);
    });

    test('최소 경험치 보장 (기본 XP의 30%)', () => {
      const xp0 = calculateXP(0, 'MEDIUM');
      expect(xp0).toBe(60); // 200 * 0.3
    });
  });

  describe('checkLevelUp', () => {
    test('경험치 충분 시 레벨업', () => {
      const result = checkLevelUp(100, 1);
      expect(result.levelUp).toBe(true);
      expect(result.newLevel).toBe(2);
    });

    test('경험치 부족 시 레벨 유지', () => {
      const result = checkLevelUp(50, 1);
      expect(result.levelUp).toBe(false);
      expect(result.newLevel).toBe(1);
    });
  });

  describe('getXPToNextLevel', () => {
    test('레벨 1 → 2: 100 XP', () => {
      expect(getXPToNextLevel(1)).toBe(100);
    });

    test('레벨 2 → 3: 150 XP', () => {
      expect(getXPToNextLevel(2)).toBe(150);
    });

    test('레벨이 높을수록 필요 경험치 증가', () => {
      const xp1 = getXPToNextLevel(1);
      const xp5 = getXPToNextLevel(5);
      const xp10 = getXPToNextLevel(10);

      expect(xp5).toBeGreaterThan(xp1);
      expect(xp10).toBeGreaterThan(xp5);
    });
  });

  describe('getLevelProgress', () => {
    test('진행률 0%', () => {
      const progress = getLevelProgress(0, 1);
      expect(progress).toBe(0);
    });

    test('진행률 50%', () => {
      const progress = getLevelProgress(50, 1); // 레벨 1 → 2는 100 XP 필요
      expect(progress).toBe(50);
    });

    test('진행률 100%', () => {
      const progress = getLevelProgress(100, 1);
      expect(progress).toBe(100);
    });

    test('진행률은 0-100 범위 내', () => {
      const progress1 = getLevelProgress(-10, 1);
      const progress2 = getLevelProgress(200, 1);

      expect(progress1).toBe(0);
      expect(progress2).toBe(100);
    });
  });

  describe('getTotalXPForLevel', () => {
    test('레벨 1 누적 XP는 0', () => {
      expect(getTotalXPForLevel(1)).toBe(0);
    });

    test('레벨 2 누적 XP는 100', () => {
      expect(getTotalXPForLevel(2)).toBe(100);
    });

    test('레벨 3 누적 XP는 250 (100 + 150)', () => {
      expect(getTotalXPForLevel(3)).toBe(250);
    });
  });
});
