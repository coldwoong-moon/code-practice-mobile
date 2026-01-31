import {
  Problem,
  UserProfile,
  Category,
  Difficulty,
  ProblemType,
  ProblemProgress,
  CategoryStats,
} from '../types';

// ============================================================================
// Recommendation Algorithm
// ============================================================================

/**
 * 사용자의 학습 데이터를 기반으로 다음에 풀어야 할 문제를 추천합니다.
 *
 * @param userId - 사용자 ID
 * @param userProfile - 사용자 프로필 (레벨, 강점/약점 카테고리 등)
 * @param allProblems - 전체 문제 목록
 * @param problemProgress - 사용자의 문제 진행 상황 Map
 * @param count - 추천할 문제 개수 (기본값: 5)
 * @returns 추천 문제 배열
 */
export function getRecommendedProblems(
  userId: string,
  userProfile: UserProfile,
  allProblems: Problem[],
  problemProgress: Map<string, ProblemProgress>,
  count: number = 5
): Problem[] {
  // 1. 최근에 푼 문제 제외
  const recentlySolvedIds = getRecentlySolvedProblemIds(problemProgress, 10);

  // 2. 약점 카테고리 파악
  const weakCategories = getWeakCategories(userProfile.categoryStats);

  // 3. 사용자 레벨에 맞는 난이도 계산
  const targetDifficulty = calculateNextDifficulty(
    userProfile.level,
    getRecentPerformance(problemProgress, 5)
  );

  // 4. 오답률 높은 유형 가중치 부여
  const typeWeights = calculateTypeWeights(problemProgress);

  // 5. 필터링: 미완료 또는 재시도 필요한 문제
  const availableProblems = allProblems.filter(problem => {
    // 최근에 푼 문제 제외
    if (recentlySolvedIds.includes(problem.id)) {
      return false;
    }

    // 난이도가 맞지 않으면 제외
    if (!isDifficultyAppropriate(problem.difficulty, targetDifficulty)) {
      return false;
    }

    // 완전히 마스터한 문제 제외
    const progress = problemProgress.get(problem.id);
    if (progress?.status === 'MASTERED') {
      return false;
    }

    return true;
  });

  // 6. 가중치 계산
  const weightedProblems = availableProblems.map(problem => {
    let weight = 50; // 기본 가중치

    // 약점 카테고리면 가중치 증가 (70% 확률로 추천)
    if (weakCategories.includes(problem.category)) {
      weight += 35;
    }

    // 오답률 높은 유형에 가중치 부여
    const typeWeight = typeWeights.get(problem.type) || 0;
    weight += typeWeight * 10;

    // 다양성을 위한 랜덤 요소 추가
    weight += Math.random() * 15;

    // 선수 문제를 풀지 않았으면 가중치 감소
    if (problem.prerequisites && problem.prerequisites.length > 0) {
      const prerequisitesSolved = problem.prerequisites.every(preqId => {
        const progress = problemProgress.get(preqId);
        return progress?.status === 'COMPLETED' || progress?.status === 'MASTERED';
      });

      if (!prerequisitesSolved) {
        weight -= 50; // 선수 문제를 안 풀었으면 크게 감소
      }
    }

    return { problem, weight };
  });

  // 7. 가중치 기반 정렬 및 선택
  const sortedProblems = weightedProblems
    .sort((a, b) => b.weight - a.weight)
    .map(item => item.problem);

  // 8. 다양한 문제 유형 순환 (FILL_BLANK → DRAG_DROP → MULTIPLE_CHOICE → CODE_ARRANGE)
  const diversifiedProblems = diversifyProblemTypes(sortedProblems, count);

  return diversifiedProblems.slice(0, count);
}

/**
 * 사용자의 레벨과 최근 성적을 기반으로 다음 문제의 난이도를 계산합니다.
 *
 * @param userLevel - 사용자 레벨 (1-10+)
 * @param recentPerformance - 최근 평균 점수 (0-100)
 * @returns 추천 난이도
 */
export function calculateNextDifficulty(
  userLevel: number,
  recentPerformance: number
): Difficulty {
  // 기본 레벨별 난이도 매핑
  let baseDifficulty: Difficulty;

  if (userLevel <= 2) {
    baseDifficulty = 'BEGINNER';
  } else if (userLevel <= 4) {
    baseDifficulty = 'EASY';
  } else if (userLevel <= 6) {
    baseDifficulty = 'MEDIUM';
  } else if (userLevel <= 8) {
    baseDifficulty = 'HARD';
  } else {
    baseDifficulty = 'EXPERT';
  }

  // 최근 성적에 따라 난이도 조정
  if (recentPerformance >= 85) {
    // 성적이 매우 좋으면 난이도 상승
    baseDifficulty = increaseDifficulty(baseDifficulty);
  } else if (recentPerformance < 60) {
    // 성적이 나쁘면 난이도 하락
    baseDifficulty = decreaseDifficulty(baseDifficulty);
  }

  return baseDifficulty;
}

/**
 * 사용자의 통계에서 약점 카테고리를 추출합니다.
 *
 * @param stats - 카테고리별 통계
 * @returns 약점 카테고리 배열
 */
export function getWeakCategories(stats: CategoryStats[]): Category[] {
  return stats
    .filter(stat => {
      // 완료한 문제가 있고, 점수가 낮거나 강도가 약한 경우
      if (stat.completedProblems === 0) {
        return true; // 한 번도 안 푼 카테고리도 약점으로 간주
      }

      return (
        stat.strengthLevel === 'WEAK' ||
        stat.strengthLevel === 'LEARNING' ||
        stat.averageScore < 65
      );
    })
    .map(stat => stat.category);
}

/**
 * 가중치를 적용하여 문제를 셔플합니다.
 *
 * @param problems - 문제 배열
 * @param weights - 문제별 가중치 Map
 * @returns 셔플된 문제 배열
 */
export function shuffleWithWeight(
  problems: Problem[],
  weights: Map<string, number>
): Problem[] {
  const weightedProblems = problems.map(problem => ({
    problem,
    weight: weights.get(problem.id) || 1,
  }));

  // 가중치 기반 랜덤 선택
  const shuffled: Problem[] = [];
  const remaining = [...weightedProblems];

  while (remaining.length > 0) {
    const totalWeight = remaining.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    let selectedIndex = 0;
    for (let i = 0; i < remaining.length; i++) {
      random -= remaining[i].weight;
      if (random <= 0) {
        selectedIndex = i;
        break;
      }
    }

    shuffled.push(remaining[selectedIndex].problem);
    remaining.splice(selectedIndex, 1);
  }

  return shuffled;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 최근에 완료한 문제 ID 목록을 가져옵니다.
 */
function getRecentlySolvedProblemIds(
  problemProgress: Map<string, ProblemProgress>,
  limit: number
): string[] {
  const completedProblems = Array.from(problemProgress.entries())
    .filter(([_, progress]) => progress.status === 'COMPLETED' || progress.status === 'MASTERED')
    .sort((a, b) => {
      const dateA = a[1].completedAt?.getTime() || 0;
      const dateB = b[1].completedAt?.getTime() || 0;
      return dateB - dateA; // 최신순 정렬
    })
    .slice(0, limit)
    .map(([problemId, _]) => problemId);

  return completedProblems;
}

/**
 * 최근 N개 문제의 평균 점수를 계산합니다.
 */
function getRecentPerformance(
  problemProgress: Map<string, ProblemProgress>,
  limit: number
): number {
  const recentScores = Array.from(problemProgress.values())
    .filter(progress => progress.status === 'COMPLETED' || progress.status === 'MASTERED')
    .sort((a, b) => {
      const dateA = a.lastAttemptAt?.getTime() || 0;
      const dateB = b.lastAttemptAt?.getTime() || 0;
      return dateB - dateA;
    })
    .slice(0, limit)
    .map(progress => progress.score);

  if (recentScores.length === 0) {
    return 50; // 기본값
  }

  return recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
}

/**
 * 문제 유형별 오답률을 기반으로 가중치를 계산합니다.
 */
function calculateTypeWeights(
  problemProgress: Map<string, ProblemProgress>
): Map<ProblemType, number> {
  const typeStats = new Map<ProblemType, { total: number; correct: number }>();

  // 각 유형별 정답률 계산
  problemProgress.forEach((progress) => {
    progress.answers.forEach((answer) => {
      const stats = typeStats.get(answer.type) || { total: 0, correct: 0 };
      stats.total++;
      if (answer.isCorrect) {
        stats.correct++;
      }
      typeStats.set(answer.type, stats);
    });
  });

  // 정답률을 가중치로 변환 (정답률이 낮을수록 가중치 높음)
  const weights = new Map<ProblemType, number>();
  typeStats.forEach((stats, type) => {
    const accuracy = stats.total > 0 ? stats.correct / stats.total : 0.5;
    const weight = 1 - accuracy; // 오답률이 곧 가중치
    weights.set(type, weight);
  });

  return weights;
}

/**
 * 난이도가 목표 난이도에 적절한지 확인합니다.
 * 목표 난이도와 같거나, 한 단계 위/아래까지 허용합니다.
 */
function isDifficultyAppropriate(
  problemDifficulty: Difficulty,
  targetDifficulty: Difficulty
): boolean {
  const difficultyOrder: Difficulty[] = ['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXPERT'];
  const problemIndex = difficultyOrder.indexOf(problemDifficulty);
  const targetIndex = difficultyOrder.indexOf(targetDifficulty);

  // 목표 난이도의 ±1 범위 허용
  return Math.abs(problemIndex - targetIndex) <= 1;
}

/**
 * 난이도를 한 단계 올립니다.
 */
function increaseDifficulty(difficulty: Difficulty): Difficulty {
  const order: Difficulty[] = ['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXPERT'];
  const index = order.indexOf(difficulty);

  if (index === -1 || index === order.length - 1) {
    return difficulty;
  }

  return order[index + 1];
}

/**
 * 난이도를 한 단계 내립니다.
 */
function decreaseDifficulty(difficulty: Difficulty): Difficulty {
  const order: Difficulty[] = ['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXPERT'];
  const index = order.indexOf(difficulty);

  if (index <= 0) {
    return difficulty;
  }

  return order[index - 1];
}

/**
 * 다양한 문제 유형이 순환되도록 문제를 재배열합니다.
 * FILL_BLANK → DRAG_DROP → MULTIPLE_CHOICE → CODE_ARRANGE 순서
 */
function diversifyProblemTypes(problems: Problem[], count: number): Problem[] {
  const typeOrder: ProblemType[] = ['FILL_BLANK', 'DRAG_DROP', 'MULTIPLE_CHOICE', 'CODE_ARRANGE'];

  // 유형별로 문제 그룹화
  const problemsByType = new Map<ProblemType, Problem[]>();
  typeOrder.forEach(type => {
    problemsByType.set(type, []);
  });

  problems.forEach(problem => {
    const typeProblems = problemsByType.get(problem.type);
    if (typeProblems) {
      typeProblems.push(problem);
    }
  });

  // 순환하면서 문제 선택
  const diversified: Problem[] = [];
  let typeIndex = 0;

  while (diversified.length < count && diversified.length < problems.length) {
    const currentType = typeOrder[typeIndex];
    const typeProblems = problemsByType.get(currentType);

    if (typeProblems && typeProblems.length > 0) {
      diversified.push(typeProblems.shift()!);
    }

    typeIndex = (typeIndex + 1) % typeOrder.length;

    // 모든 타입의 문제를 다 사용했는지 확인
    const allEmpty = typeOrder.every(type => {
      const problems = problemsByType.get(type);
      return !problems || problems.length === 0;
    });

    if (allEmpty) {
      break;
    }
  }

  return diversified;
}
