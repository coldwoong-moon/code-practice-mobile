'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { allProblems, categories } from '@/data/problems';
import type { Problem, ProblemType } from '@/data/problems';
import type { DifficultyLevel } from '@/types/problem';
import { ChevronRight, Filter, CheckCircle2, Circle } from 'lucide-react';

export default function ProblemsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | '전체'>('전체');
  const [showCompleted, setShowCompleted] = useState<'all' | 'completed' | 'incomplete'>('all');

  // Filter problems
  const filteredProblems = useMemo(() => {
    return allProblems.filter((problem) => {
      const categoryMatch = selectedCategory === '전체' || problem.category === selectedCategory;
      const difficultyMatch = selectedDifficulty === '전체' || problem.difficulty === selectedDifficulty;

      // TODO: Add completion status from user store
      const completedMatch = showCompleted === 'all';

      return categoryMatch && difficultyMatch && completedMatch;
    });
  }, [selectedCategory, selectedDifficulty, showCompleted]);

  const allCategories = ['전체', ...categories];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBF5] via-[#FFF5E6] to-[#FFE8D6] pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b-2 border-white sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-foreground">문제 목록</h1>
              <div className="flex items-center gap-2 text-sm">
                <Filter className="w-4 h-4 text-muted" />
                <span className="font-bold text-primary">{filteredProblems.length}개</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="px-4 py-6 space-y-4">
        <div className="max-w-6xl mx-auto">
          {/* Category Filter - Horizontal Scroll */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">카테고리</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    flex-shrink-0 px-4 py-2 rounded-full font-bold text-sm transition-all duration-200
                    ${selectedCategory === category
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105'
                      : 'bg-white/90 text-muted hover:bg-white hover:text-foreground border-2 border-white'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">난이도</h3>
            <div className="flex gap-2 flex-wrap">
              {(['전체', 'beginner', 'intermediate', 'advanced'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`
                    px-4 py-2 rounded-full font-bold text-sm transition-all duration-200
                    ${selectedDifficulty === difficulty
                      ? difficulty === 'beginner'
                        ? 'bg-success text-white shadow-lg scale-105'
                        : difficulty === 'intermediate'
                        ? 'bg-secondary text-white shadow-lg scale-105'
                        : difficulty === 'advanced'
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105'
                      : 'bg-white/90 text-muted hover:bg-white hover:text-foreground border-2 border-white'
                    }
                  `}
                >
                  {difficulty === '전체' ? '전체' : ''}
                  {difficulty === 'beginner' ? '초급' : ''}
                  {difficulty === 'intermediate' ? '중급' : ''}
                  {difficulty === 'advanced' ? '고급' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Completion Filter */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">완료 상태</h3>
            <div className="flex gap-2">
              {(['all', 'completed', 'incomplete'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setShowCompleted(status)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all duration-200
                    ${showCompleted === status
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105'
                      : 'bg-white/90 text-muted hover:bg-white hover:text-foreground border-2 border-white'
                    }
                  `}
                >
                  {status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                  {status === 'incomplete' && <Circle className="w-4 h-4" />}
                  {status === 'all' ? '전체' : ''}
                  {status === 'completed' ? '완료' : ''}
                  {status === 'incomplete' ? '미완료' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="px-4">
        <div className="max-w-6xl mx-auto space-y-3">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Filter className="w-8 h-8 text-muted" />
              </div>
              <p className="text-muted font-medium">조건에 맞는 문제가 없습니다</p>
            </div>
          ) : (
            filteredProblems.map((problem) => (
              <Link key={problem.id} href={`/problems/${problem.id}`}>
                <Card className="group bg-white/90 backdrop-blur-sm border-2 border-white hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={`
                              font-bold text-xs px-2.5 py-0.5 border-0
                              ${problem.type === 'FILL_BLANK' ? 'bg-blue-100 text-blue-700' : ''}
                              ${problem.type === 'DRAG_DROP' ? 'bg-purple-100 text-purple-700' : ''}
                              ${problem.type === 'MULTIPLE_CHOICE' ? 'bg-green-100 text-green-700' : ''}
                            `}
                          >
                            {problem.type === 'FILL_BLANK' ? '빈칸 채우기' : ''}
                            {problem.type === 'DRAG_DROP' ? '순서 맞추기' : ''}
                            {problem.type === 'MULTIPLE_CHOICE' ? '객관식' : ''}
                          </Badge>
                        </div>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
