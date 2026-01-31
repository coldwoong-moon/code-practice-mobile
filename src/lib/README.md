# 적응형 학습 추천 시스템

이 폴더에는 사용자의 학습 패턴을 분석하고 최적의 문제를 추천하는 시스템이 구현되어 있습니다.

## 📁 파일 구조

### 1. `recommendation.ts`
사용자 프로필 기반 문제 추천 알고리즘

**주요 함수:**
- `getRecommendedProblems()`: 사용자에게 맞는 문제 추천
- `calculateNextDifficulty()`: 레벨과 성적 기반 난이도 계산
- `getWeakCategories()`: 약점 카테고리 파악
- `shuffleWithWeight()`: 가중치 기반 문제 셔플

**추천 로직:**
1. 약점 카테고리 문제 우선 (70% 확률)
2. 현재 레벨에 맞는 난이도 선택
3. 최근에 푼 문제 제외
4. 오답률 높은 유형 가중치 부여
5. 다양한 문제 유형 순환

### 2. `scoring.ts`
점수 및 경험치 계산 시스템

**주요 함수:**
- `calculateScore()`: 점수 계산 (시간, 힌트, 시도 횟수, 난이도 고려)
- `calculateXP()`: 경험치 계산
- `checkLevelUp()`: 레벨업 체크
- `getXPToNextLevel()`: 다음 레벨까지 필요 XP
- `getLevelProgress()`: 레벨 진행률

**점수 계산 요소:**
- 시도 횟수: 첫 시도 0점 감점, 2번째 -15점, 3번째 -25점, 4번째 이상 -35점
- 힌트 사용: 힌트당 -10점
- 시간 보너스: 예상 시간 대비 빠르게 풀면 최대 +15점
- 난이도 보너스: EXPERT 문제 +12점

### 3. `streak.ts`
연속 학습 관리 시스템

**주요 함수:**
- `checkStreak()`: 연속 학습 일수 체크 및 업데이트
- `getStreakBonus()`: 연속 일수에 따른 보너스 XP
- `getStreakLevel()`: 연속 학습 레벨 (🌱 → 🔥 → ⚡ → 👑 → 💎)
- `checkStreakAtRisk()`: 연속 학습 위험 알림
- `getStreakStats()`: 전체 연속 학습 통계

**보너스 체계:**
- 3-6일: +10 XP
- 7-13일: +25 XP
- 14-29일: +50 XP
- 30-59일: +100 XP
- 60-99일: +200 XP
- 100일 이상: +300 XP

## 🚀 사용 예시

### 1. 문제 추천받기

\`\`\`typescript
import { getRecommendedProblems } from '@/lib/recommendation';
import { useUserStore } from '@/store/userStore';
import { useProblemStore } from '@/store/problemStore';

function RecommendationExample() {
  const { profile } = useUserStore();
  const { allProblems, problemProgress } = useProblemStore();

  if (!profile) return null;

  // 5개의 추천 문제 가져오기
  const recommendedProblems = getRecommendedProblems(
    profile.id,
    profile,
    allProblems,
    problemProgress,
    5
  );

  return (
    <div>
      <h2>추천 문제</h2>
      {recommendedProblems.map(problem => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  );
}
\`\`\`

### 2. 점수 및 경험치 계산

\`\`\`typescript
import { calculateScore, calculateXP, checkLevelUp } from '@/lib/scoring';

// 문제 풀이 완료 시
function handleProblemComplete(
  timeSpent: number,
  hintsUsed: number,
  attempts: number,
  difficulty: Difficulty
) {
  // 1. 점수 계산
  const score = calculateScore(timeSpent, hintsUsed, attempts, difficulty);
  console.log('획득 점수:', score);

  // 2. 경험치 계산
  const xp = calculateXP(score, difficulty);
  console.log('획득 경험치:', xp);

  // 3. 레벨업 체크
  const currentXP = profile.experience + xp;
  const levelUpResult = checkLevelUp(currentXP, profile.level);

  if (levelUpResult.levelUp) {
    console.log('레벨업!', levelUpResult.newLevel);
  }

  return { score, xp, levelUpResult };
}
\`\`\`

### 3. 연속 학습 관리

\`\`\`typescript
import { checkStreak, getStreakBonus, getStreakStats } from '@/lib/streak';

// 앱 시작 시 연속 학습 체크
function checkDailyStreak() {
  const { profile, updateProfile } = useUserStore();

  if (!profile) return;

  const streakResult = checkStreak(
    profile.lastActiveDate,
    profile.currentStreak
  );

  if (streakResult.maintained) {
    // 연속 유지
    updateProfile({
      currentStreak: streakResult.newStreak,
      lastActiveDate: new Date(),
    });

    // 보너스 XP 지급
    const bonusXP = getStreakBonus(streakResult.newStreak);
    if (bonusXP > 0) {
      addExperience(bonusXP);
      toast.success(\`연속 \${streakResult.newStreak}일! +\${bonusXP} XP\`);
    }
  } else {
    // 연속 끊김
    updateProfile({
      currentStreak: 1,
      lastActiveDate: new Date(),
    });
    toast.info('새로운 연속 학습을 시작하세요!');
  }
}

// 연속 학습 통계 표시
function StreakDisplay() {
  const { profile } = useUserStore();

  if (!profile) return null;

  const stats = getStreakStats(
    profile.currentStreak,
    profile.longestStreak,
    profile.lastActiveDate
  );

  return (
    <div>
      <h3>
        {stats.level.emoji} {stats.level.level}
      </h3>
      <p>{stats.level.description}</p>
      <p>현재 연속: {stats.currentStreak}일</p>
      <p>최고 기록: {stats.longestStreak}일</p>
      <p>보너스 XP: +{stats.bonus}</p>
      {stats.atRisk && (
        <Alert>
          ⚠️ {Math.floor(stats.hoursLeft)}시간 내에 학습하지 않으면 연속이 끊깁니다!
        </Alert>
      )}
    </div>
  );
}
\`\`\`

### 4. 통합 예시: 문제 완료 플로우

\`\`\`typescript
import { calculateScore, calculateXP, checkLevelUp } from '@/lib/scoring';
import { checkStreak, getStreakBonus } from '@/lib/streak';
import { useUserStore } from '@/store/userStore';
import { useProblemStore } from '@/store/problemStore';

function completeProblem(
  problemId: string,
  answer: any,
  isCorrect: boolean,
  timeSpent: number,
  hintsUsed: number,
  attempts: number
) {
  const { profile, addExperience, recordProblemCompletion, updateStreak } = useUserStore();
  const { allProblems } = useProblemStore();

  if (!profile) return;

  const problem = allProblems.find(p => p.id === problemId);
  if (!problem) return;

  // 1. 점수 계산
  const score = calculateScore(
    timeSpent,
    hintsUsed,
    attempts,
    problem.difficulty
  );

  // 2. 경험치 계산
  const baseXP = calculateXP(score, problem.difficulty);

  // 3. 연속 학습 체크 및 보너스
  updateStreak();
  const streakBonus = getStreakBonus(profile.currentStreak);
  const totalXP = baseXP + streakBonus;

  // 4. 경험치 추가 및 레벨업 체크
  addExperience(totalXP);
  const levelUpResult = checkLevelUp(
    profile.experience + totalXP,
    profile.level
  );

  // 5. 카테고리 통계 업데이트
  recordProblemCompletion(problem.category, score, timeSpent);

  // 6. UI 피드백
  toast.success(\`문제 완료! 점수: \${score}점, XP: +\${totalXP}\`);

  if (levelUpResult.levelUp) {
    toast.success(\`🎉 레벨업! 레벨 \${levelUpResult.newLevel}\`);
  }

  if (streakBonus > 0) {
    toast.info(\`🔥 연속 \${profile.currentStreak}일 보너스: +\${streakBonus} XP\`);
  }

  return {
    score,
    xp: totalXP,
    levelUp: levelUpResult.levelUp,
    newLevel: levelUpResult.newLevel,
  };
}
\`\`\`

## 📊 알고리즘 세부 사항

### 추천 알고리즘 가중치

1. **약점 카테고리 가중치**: +35점
2. **오답률 높은 유형 가중치**: 오답률 × 10점
3. **랜덤 다양성**: +0~15점
4. **선수 문제 미완료**: -50점

### 난이도 자동 조정

| 사용자 레벨 | 기본 난이도 | 성적 85점 이상 | 성적 60점 미만 |
|------------|------------|---------------|---------------|
| 1-2 | BEGINNER | EASY | BEGINNER |
| 3-4 | EASY | MEDIUM | BEGINNER |
| 5-6 | MEDIUM | HARD | EASY |
| 7-8 | HARD | EXPERT | MEDIUM |
| 9+ | EXPERT | EXPERT | HARD |

### 경험치 공식

\`\`\`
기본 XP (난이도별):
- BEGINNER: 50 XP
- EASY: 100 XP
- MEDIUM: 200 XP
- HARD: 350 XP
- EXPERT: 500 XP

획득 XP = 기본 XP × (점수 / 100)
최소 XP = 기본 XP × 0.3 (보장)
\`\`\`

### 레벨업 공식

\`\`\`
레벨 N 달성에 필요한 XP = 100 × 1.5^(N-1)

예시:
- 레벨 2: 100 XP
- 레벨 3: 150 XP
- 레벨 4: 225 XP
- 레벨 5: 338 XP
- 레벨 10: 3,834 XP
\`\`\`

## 🎯 향후 개선 사항

1. **AI 기반 추천**: 기계학습 모델로 더 정교한 추천
2. **협업 필터링**: 비슷한 수준 사용자들의 학습 패턴 분석
3. **학습 곡선 분석**: 개인별 학습 속도 추적
4. **시간대별 추천**: 사용자가 활동적인 시간대 고려
5. **목표 기반 추천**: 사용자의 단기/장기 목표에 맞는 문제 추천
