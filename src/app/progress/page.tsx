'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/userStore';
import { Trophy, Flame, Target, TrendingUp, Award, Clock, BarChart3, Sparkles } from 'lucide-react';

export default function ProgressPage() {
  const profile = useUserStore((state) => state.profile);
  const initializeUser = useUserStore((state) => state.initializeUser);
  const getExperienceProgress = useUserStore((state) => state.getExperienceProgress);
  const getStrongestCategories = useUserStore((state) => state.getStrongestCategories);
  const getWeakestCategories = useUserStore((state) => state.getWeakestCategories);

  useEffect(() => {
    if (!profile) {
      initializeUser('학습자');
    }
  }, [profile, initializeUser]);

  if (!profile) {
    return null;
  }

  const expProgress = getExperienceProgress();
  const strongestCategories = getStrongestCategories(3);
  const weakestCategories = getWeakestCategories(3);

  const strengthLevelColors = {
    EXPERT: 'from-primary to-secondary',
    STRONG: 'from-success to-primary',
    GOOD: 'from-accent to-secondary',
    LEARNING: 'from-secondary to-accent',
    WEAK: 'from-gray-400 to-gray-500',
  };

  const strengthLevelText = {
    EXPERT: '전문가',
    STRONG: '강함',
    GOOD: '좋음',
    LEARNING: '학습중',
    WEAK: '약함',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBF5] via-[#FFF5E6] to-[#FFE8D6] pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b-2 border-white shadow-sm">
        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-black text-foreground mb-2">학습 진행 현황</h1>
            <p className="text-sm text-muted font-medium">당신의 성장을 확인하세요</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Level & Experience */}
          <Card className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 border-white shadow-xl overflow-hidden">
            <div className="relative p-6">
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent to-secondary rounded-3xl flex items-center justify-center shadow-lg">
                    <Trophy className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-4xl font-black text-foreground">Lv.{profile.level}</div>
                    <p className="text-sm text-muted font-medium">현재 레벨</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-foreground">다음 레벨까지</span>
                    <span className="font-black text-primary">
                      {profile.experience} / {profile.experienceToNextLevel} XP
                    </span>
                  </div>
                  <Progress value={expProgress} className="h-4 bg-white/50" />
                  <p className="text-xs text-muted font-medium text-right">
                    {Math.round(expProgress)}% 달성
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Streak */}
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-white shadow-lg">
              <div className="p-5">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-danger to-primary rounded-2xl mb-3 shadow-md">
                  <Flame className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-3xl font-black text-foreground mb-1">{profile.currentStreak}일</div>
                <div className="text-sm text-muted font-medium">연속 학습</div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-xs text-muted">
                    최장 기록: <span className="font-bold text-foreground">{profile.longestStreak}일</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Completed */}
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-white shadow-lg">
              <div className="p-5">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-success to-primary rounded-2xl mb-3 shadow-md">
                  <Target className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-3xl font-black text-foreground mb-1">{profile.totalProblemsCompleted}</div>
                <div className="text-sm text-muted font-medium">완료한 문제</div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-xs text-muted">
                    이번 주: <span className="font-bold text-foreground">12개</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Strongest Categories */}
          {strongestCategories.length > 0 && (
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-white shadow-lg">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-success to-primary rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-black text-foreground">강점 카테고리</h3>
                </div>
                <div className="space-y-3">
                  {strongestCategories.map((stat) => (
                    <div key={stat.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm">{stat.category}</span>
                          <Badge className={`bg-gradient-to-r ${strengthLevelColors[stat.strengthLevel]} text-white text-xs font-bold px-2 py-0.5 border-0`}>
                            {strengthLevelText[stat.strengthLevel]}
                          </Badge>
                        </div>
                        <span className="text-sm font-black text-success">{stat.averageScore}점</span>
                      </div>
                      <Progress value={stat.averageScore} className="h-2 bg-gray-100" />
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span>{stat.completedProblems}개 완료</span>
                        <span>{Math.floor(stat.totalTimeSpent / 60)}분 학습</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Weakest Categories */}
          {weakestCategories.length > 0 && (
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-white shadow-lg">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-black text-foreground">보완이 필요한 카테고리</h3>
                </div>
                <div className="space-y-3">
                  {weakestCategories.map((stat) => (
                    <div key={stat.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm">{stat.category}</span>
                          <Badge className={`bg-gradient-to-r ${strengthLevelColors[stat.strengthLevel]} text-white text-xs font-bold px-2 py-0.5 border-0`}>
                            {strengthLevelText[stat.strengthLevel]}
                          </Badge>
                        </div>
                        <span className="text-sm font-black text-secondary">{stat.averageScore}점</span>
                      </div>
                      <Progress value={stat.averageScore} className="h-2 bg-gray-100" />
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span>{stat.completedProblems}개 완료</span>
                        <span>더 연습이 필요해요</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Achievements */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-white shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-black text-foreground">업적</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {profile.achievements.slice(0, 6).map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`
                      p-4 rounded-2xl border-2 transition-all
                      ${achievement.unlockedAt
                        ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                      }
                    `}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="text-sm font-bold text-foreground mb-1">{achievement.title}</div>
                    <div className="text-xs text-muted mb-2">{achievement.description}</div>
                    {!achievement.unlockedAt && (
                      <div className="space-y-1">
                        <Progress value={(achievement.progress / achievement.requirement) * 100} className="h-1.5 bg-gray-200" />
                        <div className="text-xs text-muted font-medium">
                          {achievement.progress} / {achievement.requirement}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-white shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-black text-foreground">최근 활동</h3>
              </div>
              <div className="space-y-3">
                {profile.totalProblemsCompleted === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
                      <Sparkles className="w-8 h-8 text-muted" />
                    </div>
                    <p className="text-muted font-medium mb-4">아직 풀이 기록이 없습니다</p>
                    <Link href="/problems" className="inline-block">
                      <span className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">
                        첫 문제 풀러가기 →
                      </span>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <p className="text-sm font-medium">최근 활동 기록이 표시됩니다</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
