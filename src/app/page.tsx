'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getRandomProblems } from '@/data/problems';
import { useUserStore } from '@/store/userStore';
import type { Problem } from '@/data/problems';
import { Code2, Trophy, Flame, Sparkles, ChevronRight, Target } from 'lucide-react';

export default function HomePage() {
  const [recommendedProblems, setRecommendedProblems] = useState<Problem[]>([]);
  const profile = useUserStore((state) => state.profile);
  const initializeUser = useUserStore((state) => state.initializeUser);
  const getExperienceProgress = useUserStore((state) => state.getExperienceProgress);

  useEffect(() => {
    // Initialize user if not exists
    if (!profile) {
      initializeUser('학습자');
    }

    // Get recommended problems
    setRecommendedProblems(getRandomProblems(3));
  }, [profile, initializeUser]);

  const expProgress = getExperienceProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBF5] via-[#FFF5E6] to-[#FFE8D6]">
      {/* Hero Section with Dynamic Background */}
      <section className="relative px-4 pt-12 pb-8 overflow-hidden">
        {/* Geometric decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/30 to-success/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-6xl mx-auto">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl blur-lg opacity-60" />
              <div className="relative bg-gradient-to-br from-primary to-secondary p-3 rounded-2xl shadow-lg">
                <Code2 className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">
                코테원격공부
              </h1>
              <p className="text-sm text-muted font-medium">언제 어디서나, 쉽게</p>
            </div>
          </div>

          {/* Hero Message */}
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight mb-4">
              모바일에서
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                쉽게 배우는
              </span>
              <br />
              코딩 테스트
            </h2>
            <p className="text-lg text-muted max-w-lg">
              출퇴근길, 카페에서, 잠자기 전 5분. 당신의 시간에 맞춰 성장하세요.
            </p>
          </div>

          {/* CTA */}
          <Link href="/problems">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-primary text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-0 group"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              지금 시작하기
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      {profile && (
        <section className="px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-white">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Level */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-2xl mb-2 shadow-md">
                    <Trophy className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="text-2xl font-black text-foreground">Lv.{profile.level}</div>
                  <div className="text-xs text-muted font-medium">레벨</div>
                </div>

                {/* Streak */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-danger to-primary rounded-2xl mb-2 shadow-md">
                    <Flame className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="text-2xl font-black text-foreground">{profile.currentStreak}일</div>
                  <div className="text-xs text-muted font-medium">연속 학습</div>
                </div>

                {/* Completed */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-success to-primary rounded-2xl mb-2 shadow-md">
                    <Target className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="text-2xl font-black text-foreground">{profile.totalProblemsCompleted}</div>
                  <div className="text-xs text-muted font-medium">완료</div>
                </div>
              </div>

              {/* Experience Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-foreground">다음 레벨까지</span>
                  <span className="text-sm font-black text-primary">
                    {profile.experience} / {profile.experienceToNextLevel} XP
                  </span>
                </div>
                <Progress
                  value={expProgress}
                  className="h-3 bg-gray-200/50"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recommended Problems */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-black text-foreground">오늘의 추천 문제</h3>
            <Link href="/problems" className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">
              전체보기
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedProblems.map((problem) => (
              <Link key={problem.id} href={`/problems/${problem.id}`}>
                <Card className="group bg-white/90 backdrop-blur-sm border-2 border-white hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {problem.title}
                        </h4>
                        <p className="text-sm text-muted line-clamp-2">
                          {problem.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        className={`
                          font-bold text-xs px-3 py-1 border-0
                          ${problem.difficulty === 'beginner' ? 'bg-success/20 text-success' : ''}
                          ${problem.difficulty === 'intermediate' ? 'bg-secondary/20 text-secondary' : ''}
                          ${problem.difficulty === 'advanced' ? 'bg-primary/20 text-primary' : ''}
                        `}
                      >
                        {problem.difficulty === 'beginner' ? '초급' : ''}
                        {problem.difficulty === 'intermediate' ? '중급' : ''}
                        {problem.difficulty === 'advanced' ? '고급' : ''}
                      </Badge>
                      <Badge className="bg-gray-100 text-foreground font-medium text-xs px-3 py-1 border-0">
                        {problem.category}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Navigation Spacer */}
      <div className="h-20" />
    </div>
  );
}
