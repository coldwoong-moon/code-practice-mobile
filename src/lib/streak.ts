// ============================================================================
// Streak Management System
// ============================================================================

/**
 * 연속 학습 일수를 확인하고 업데이트합니다.
 *
 * @param lastActiveDate - 마지막 활동 날짜
 * @returns { maintained: 연속 유지 여부, newStreak: 새로운 연속 일수 }
 */
export function checkStreak(
  lastActiveDate: Date,
  currentStreak: number
): { maintained: boolean; newStreak: number } {
  const today = new Date();
  const lastActive = new Date(lastActiveDate);

  // 날짜만 비교 (시간 제거)
  const todayDate = getDateOnly(today);
  const lastActiveDate_ = getDateOnly(lastActive);

  // 오늘 이미 활동했는지 확인
  if (isSameDay(todayDate, lastActiveDate_)) {
    return {
      maintained: true,
      newStreak: currentStreak, // 변경 없음
    };
  }

  // 어제 활동했는지 확인
  if (isYesterday(lastActiveDate_, todayDate)) {
    return {
      maintained: true,
      newStreak: currentStreak + 1, // 연속 유지, +1일
    };
  }

  // 그 외의 경우: 연속이 끊김
  return {
    maintained: false,
    newStreak: 1, // 오늘부터 새로 시작
  };
}

/**
 * 연속 학습 일수에 따른 보너스 경험치를 계산합니다.
 *
 * @param streakDays - 연속 학습 일수
 * @returns 보너스 경험치
 */
export function getStreakBonus(streakDays: number): number {
  if (streakDays < 3) {
    return 0; // 3일 미만은 보너스 없음
  }

  if (streakDays < 7) {
    return 10; // 3-6일: +10 XP
  }

  if (streakDays < 14) {
    return 25; // 7-13일 (1주): +25 XP
  }

  if (streakDays < 30) {
    return 50; // 14-29일 (2주): +50 XP
  }

  if (streakDays < 60) {
    return 100; // 30-59일 (1달): +100 XP
  }

  if (streakDays < 100) {
    return 200; // 60-99일 (2달): +200 XP
  }

  // 100일 이상: +300 XP
  return 300;
}

/**
 * 연속 학습 레벨을 반환합니다.
 *
 * @param streakDays - 연속 학습 일수
 * @returns 연속 학습 레벨 (Beginner, Warming Up, On Fire, etc.)
 */
export function getStreakLevel(streakDays: number): {
  level: string;
  emoji: string;
  description: string;
} {
  if (streakDays === 0) {
    return {
      level: 'New Start',
      emoji: '🌱',
      description: '오늘부터 시작해보세요!',
    };
  }

  if (streakDays < 3) {
    return {
      level: 'Beginner',
      emoji: '🔥',
      description: '좋은 시작입니다!',
    };
  }

  if (streakDays < 7) {
    return {
      level: 'Warming Up',
      emoji: '🔥🔥',
      description: '연속 학습 중!',
    };
  }

  if (streakDays < 14) {
    return {
      level: 'On Fire',
      emoji: '🔥🔥🔥',
      description: '1주일 연속 달성!',
    };
  }

  if (streakDays < 30) {
    return {
      level: 'Blazing',
      emoji: '🔥🔥🔥🔥',
      description: '2주 연속! 대단해요!',
    };
  }

  if (streakDays < 60) {
    return {
      level: 'Unstoppable',
      emoji: '⚡',
      description: '한 달 연속! 멈출 수 없어요!',
    };
  }

  if (streakDays < 100) {
    return {
      level: 'Legend',
      emoji: '👑',
      description: '2개월 연속! 전설이에요!',
    };
  }

  return {
    level: 'Immortal',
    emoji: '💎',
    description: '100일 연속! 불멸의 존재!',
  };
}

/**
 * 연속 학습이 끊길 위험이 있는지 확인합니다.
 *
 * @param lastActiveDate - 마지막 활동 날짜
 * @returns { atRisk: 위험 여부, hoursLeft: 남은 시간 }
 */
export function checkStreakAtRisk(lastActiveDate: Date): {
  atRisk: boolean;
  hoursLeft: number;
} {
  const now = new Date();
  const lastActive = new Date(lastActiveDate);

  const lastActiveDate_ = getDateOnly(lastActive);
  const todayDate = getDateOnly(now);

  // 오늘 이미 활동했으면 위험 없음
  if (isSameDay(lastActiveDate_, todayDate)) {
    return {
      atRisk: false,
      hoursLeft: 24,
    };
  }

  // 어제 활동했으면 오늘 자정까지 남은 시간 계산
  if (isYesterday(lastActiveDate_, todayDate)) {
    const midnight = new Date(todayDate);
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);

    const hoursLeft = (midnight.getTime() - now.getTime()) / (1000 * 60 * 60);

    return {
      atRisk: hoursLeft < 6, // 6시간 미만 남았으면 위험
      hoursLeft: Math.max(0, hoursLeft),
    };
  }

  // 그 외의 경우: 이미 연속이 끊김
  return {
    atRisk: false,
    hoursLeft: 0,
  };
}

/**
 * 연속 학습 통계를 반환합니다.
 *
 * @param currentStreak - 현재 연속 일수
 * @param longestStreak - 최고 연속 일수
 * @param lastActiveDate - 마지막 활동 날짜
 * @returns 연속 학습 통계 객체
 */
export function getStreakStats(
  currentStreak: number,
  longestStreak: number,
  lastActiveDate: Date
) {
  const streakLevel = getStreakLevel(currentStreak);
  const streakBonus = getStreakBonus(currentStreak);
  const riskInfo = checkStreakAtRisk(lastActiveDate);

  return {
    currentStreak,
    longestStreak,
    level: streakLevel,
    bonus: streakBonus,
    atRisk: riskInfo.atRisk,
    hoursLeft: riskInfo.hoursLeft,
    isPersonalBest: currentStreak >= longestStreak,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Date 객체에서 시간 정보를 제거하고 날짜만 반환합니다.
 */
function getDateOnly(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 두 날짜가 같은 날인지 확인합니다.
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * date1이 date2의 어제인지 확인합니다.
 */
function isYesterday(date1: Date, date2: Date): boolean {
  const yesterday = new Date(date2);
  yesterday.setDate(yesterday.getDate() - 1);

  return isSameDay(date1, yesterday);
}

/**
 * 두 날짜 사이의 일수 차이를 계산합니다.
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // 밀리초 단위
  const firstDate = getDateOnly(date1);
  const secondDate = getDateOnly(date2);

  return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
}

/**
 * 주간 연속 학습 패턴을 분석합니다 (최근 7일).
 *
 * @param activityDates - 활동한 날짜 배열
 * @returns 요일별 활동 빈도 (일-토)
 */
export function getWeeklyPattern(activityDates: Date[]): number[] {
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0]; // 일-토

  activityDates.forEach(date => {
    const dayOfWeek = date.getDay(); // 0 (일요일) ~ 6 (토요일)
    weekdayCounts[dayOfWeek]++;
  });

  return weekdayCounts;
}

/**
 * 연속 학습 예측: 현재 패턴으로 며칠 더 유지할 수 있을지 예측합니다.
 *
 * @param currentStreak - 현재 연속 일수
 * @param activityDates - 최근 활동 날짜 배열
 * @returns 예상 연속 유지 가능 일수
 */
export function predictStreakContinuation(
  currentStreak: number,
  activityDates: Date[]
): number {
  if (currentStreak === 0 || activityDates.length === 0) {
    return 0;
  }

  // 최근 30일간의 활동 빈도 계산
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentActivities = activityDates.filter(date => date >= thirtyDaysAgo);
  const activityRate = recentActivities.length / 30; // 일평균 활동 빈도

  // 활동 빈도가 0.8 이상이면 연속 유지 가능성 높음
  if (activityRate >= 0.8) {
    return Math.floor(currentStreak * 1.5); // 50% 더 유지 가능 예상
  } else if (activityRate >= 0.6) {
    return currentStreak; // 현재 수준 유지 예상
  } else {
    return Math.floor(currentStreak * 0.5); // 절반만 유지 가능 예상
  }
}
