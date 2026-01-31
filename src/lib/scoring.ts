import { Difficulty } from '../types';

// ============================================================================
// Scoring System
// ============================================================================

/**
 * 문제 풀이 점수를 계산합니다.
 *
 * @param timeSpent - 소요 시간 (초)
 * @param hintsUsed - 사용한 힌트 개수
 * @param attempts - 시도 횟수
 * @param difficulty - 문제 난이도
 * @returns 0-100 사이의 점수
 */
export function calculateScore(
  timeSpent: number,
  hintsUsed: number,
  attempts: number,
  difficulty: Difficulty
): number {
  let score = 100;

  // 1. 시도 횟수에 따른 감점
  // 첫 시도: 0점 감점
  // 두 번째 시도: -15점
  // 세 번째 시도: -25점
  // 네 번째 이상: -35점
  if (attempts === 2) {
    score -= 15;
  } else if (attempts === 3) {
    score -= 25;
  } else if (attempts >= 4) {
    score -= 35;
  }

  // 2. 힌트 사용에 따른 감점
  // 힌트 1개당 -10점
  score -= hintsUsed * 10;

  // 3. 시간에 따른 보너스/감점
  const timeBonus = calculateTimeBonus(timeSpent, difficulty);
  score += timeBonus;

  // 4. 난이도 보너스
  const difficultyBonus = getDifficultyBonus(difficulty);
  score += difficultyBonus;

  // 5. 최종 점수는 0-100 범위로 제한
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * 점수와 난이도를 기반으로 경험치를 계산합니다.
 *
 * @param score - 문제 풀이 점수 (0-100)
 * @param difficulty - 문제 난이도
 * @returns 획득 경험치
 */
export function calculateXP(score: number, difficulty: Difficulty): number {
  // 기본 경험치 (난이도에 따라 다름)
  const baseXP = getBaseXP(difficulty);

  // 점수 비율 (0.0 ~ 1.0)
  const scoreRatio = score / 100;

  // 최소 경험치 보장 (기본 경험치의 30%)
  const minXP = Math.floor(baseXP * 0.3);

  // 실제 획득 경험치 = 기본 경험치 × 점수 비율
  const earnedXP = Math.floor(baseXP * scoreRatio);

  // 최소 경험치와 실제 경험치 중 큰 값 반환
  return Math.max(minXP, earnedXP);
}

/**
 * 현재 경험치와 레벨을 기반으로 레벨업 여부를 확인합니다.
 *
 * @param currentXP - 현재 경험치
 * @param currentLevel - 현재 레벨
 * @returns { levelUp: 레벨업 여부, newLevel: 새로운 레벨 }
 */
export function checkLevelUp(
  currentXP: number,
  currentLevel: number
): { levelUp: boolean; newLevel: number } {
  const xpRequired = getXPRequiredForLevel(currentLevel + 1);

  if (currentXP >= xpRequired) {
    return {
      levelUp: true,
      newLevel: currentLevel + 1,
    };
  }

  return {
    levelUp: false,
    newLevel: currentLevel,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 소요 시간에 따른 보너스/감점을 계산합니다.
 */
function calculateTimeBonus(timeSpent: number, difficulty: Difficulty): number {
  // 난이도별 예상 시간 (초)
  const expectedTime = getExpectedTime(difficulty);

  // 예상 시간의 50% 이하로 풀면 보너스
  if (timeSpent <= expectedTime * 0.5) {
    return 15; // 매우 빠름
  } else if (timeSpent <= expectedTime * 0.75) {
    return 10; // 빠름
  } else if (timeSpent <= expectedTime) {
    return 5; // 적정 시간
  } else if (timeSpent <= expectedTime * 1.5) {
    return 0; // 약간 느림
  } else if (timeSpent <= expectedTime * 2) {
    return -5; // 느림
  } else {
    return -10; // 매우 느림
  }
}

/**
 * 난이도별 예상 소요 시간을 반환합니다 (초).
 */
function getExpectedTime(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'BEGINNER':
      return 120; // 2분
    case 'EASY':
      return 180; // 3분
    case 'MEDIUM':
      return 300; // 5분
    case 'HARD':
      return 480; // 8분
    case 'EXPERT':
      return 600; // 10분
    default:
      return 300; // 기본 5분
  }
}

/**
 * 난이도별 보너스 점수를 반환합니다.
 */
function getDifficultyBonus(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'BEGINNER':
      return 0;
    case 'EASY':
      return 2;
    case 'MEDIUM':
      return 5;
    case 'HARD':
      return 8;
    case 'EXPERT':
      return 12;
    default:
      return 0;
  }
}

/**
 * 난이도별 기본 경험치를 반환합니다.
 */
function getBaseXP(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'BEGINNER':
      return 50;
    case 'EASY':
      return 100;
    case 'MEDIUM':
      return 200;
    case 'HARD':
      return 350;
    case 'EXPERT':
      return 500;
    default:
      return 100;
  }
}

/**
 * 특정 레벨에 도달하기 위한 필요 경험치를 계산합니다.
 * 지수 곡선: 100 × 1.5^(level-1)
 */
function getXPRequiredForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

/**
 * 레벨별 누적 총 경험치를 계산합니다.
 *
 * @param level - 목표 레벨
 * @returns 해당 레벨까지의 누적 경험치
 */
export function getTotalXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXPRequiredForLevel(i);
  }
  return total;
}

/**
 * 현재 레벨에서 다음 레벨까지 필요한 경험치를 반환합니다.
 *
 * @param currentLevel - 현재 레벨
 * @returns 다음 레벨까지 필요한 경험치
 */
export function getXPToNextLevel(currentLevel: number): number {
  return getXPRequiredForLevel(currentLevel + 1);
}

/**
 * 현재 레벨 내 경험치 진행률을 계산합니다 (0-100%).
 *
 * @param currentXP - 현재 경험치
 * @param currentLevel - 현재 레벨
 * @returns 진행률 (0-100)
 */
export function getLevelProgress(currentXP: number, currentLevel: number): number {
  const xpRequired = getXPRequiredForLevel(currentLevel + 1);
  const progress = (currentXP / xpRequired) * 100;
  return Math.min(100, Math.max(0, progress));
}
