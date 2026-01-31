'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getProblemById, allProblems } from '@/data/problems';
import type { Problem } from '@/data/problems';
import { CodeFillBlank, DragDropCode, MultipleChoice } from '@/components/problem';
import { ArrowLeft, Lightbulb, CheckCircle2, XCircle, ChevronRight, Sparkles } from 'lucide-react';

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const foundProblem = getProblemById(problemId);
    if (foundProblem) {
      setProblem(foundProblem);
    }
  }, [problemId]);

  const handleComplete = (correct: boolean) => {
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNextProblem = () => {
    const currentIndex = allProblems.findIndex(p => p.id === problemId);
    const nextProblem = allProblems[(currentIndex + 1) % allProblems.length];
    router.push(`/problems/${nextProblem.id}`);
  };

  const handleRetry = () => {
    setShowResult(false);
    setIsCorrect(false);
    setShowHint(false);
    // Force re-render by updating the problem state
    if (problem) {
      setProblem({ ...problem });
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFFBF5] via-[#FFF5E6] to-[#FFE8D6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-muted mb-4">문제를 찾을 수 없습니다</p>
          <Link href="/problems">
            <Button>문제 목록으로</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBF5] via-[#FFF5E6] to-[#FFE8D6] pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b-2 border-white sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/problems" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-bold text-sm mb-3">
              <ArrowLeft className="w-4 h-4" />
              문제 목록
            </Link>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                  <Badge
                    className={`
                      font-bold text-xs px-2.5 py-0.5 border-0
                      ${problem.difficulty === 'beginner' ? 'bg-success/20 text-success' : ''}
                      ${problem.difficulty === 'intermediate' ? 'bg-secondary/20 text-secondary' : ''}
                      ${problem.difficulty === 'advanced' ? 'bg-primary/20 text-primary' : ''}
                    `}
                  >
                    {problem.difficulty === 'beginner' ? '초급' : ''}
                    {problem.difficulty === 'intermediate' ? '중급' : ''}
                    {problem.difficulty === 'advanced' ? '고급' : ''}
                  </Badge>
                  <Badge className="bg-gray-100 text-foreground font-medium text-xs px-2.5 py-0.5 border-0">
                    {problem.category}
                  </Badge>
                </div>
                <h1 className="text-xl font-black text-foreground">{problem.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Description */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-white shadow-lg">
            <div className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-3">문제 설명</h2>
              <p className="text-base text-muted leading-relaxed">{problem.description}</p>
            </div>
          </Card>

          {/* Problem Component */}
          {!showResult && (
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-white shadow-lg overflow-hidden">
              <div className="p-6">
                {problem.type === 'FILL_BLANK' && problem.code && problem.blanks && (
                  <CodeFillBlank
                    code={problem.code}
                    blanks={Object.values(problem.blanks).map(blank => ({
                      options: blank.options,
                      correct: blank.correctIndex
                    }))}
                    onComplete={(isCorrect) => handleComplete(isCorrect)}
                  />
                )}

                {problem.type === 'DRAG_DROP' && problem.codeBlocks && problem.correctOrder && (
                  <DragDropCode
                    blocks={problem.codeBlocks.map(block => ({
                      id: block.id,
                      code: block.content
                    }))}
                    correctOrder={problem.correctOrder}
                    onComplete={(isCorrect) => handleComplete(isCorrect)}
                  />
                )}

                {problem.type === 'MULTIPLE_CHOICE' && problem.choices && typeof problem.correctIndex === 'number' && (
                  <MultipleChoice
                    question={problem.question || problem.description}
                    choices={problem.choices}
                    correctIndex={problem.correctIndex}
                    explanation={problem.explanation || ''}
                    onAnswer={(isCorrect) => handleComplete(isCorrect)}
                  />
                )}
              </div>
            </Card>
          )}

          {/* Hint Button */}
          {!showResult && (
            <Button
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              className="w-full border-2 border-accent/30 bg-accent/10 hover:bg-accent/20 text-foreground font-bold"
            >
              <Lightbulb className={`w-5 h-5 mr-2 ${showHint ? 'text-accent' : ''}`} />
              {showHint ? '힌트 숨기기' : '힌트 보기'}
            </Button>
          )}

          {/* Hint */}
          {showHint && !showResult && (
            <Card className="bg-gradient-to-br from-accent/20 to-secondary/20 border-2 border-accent/30 shadow-lg animate-in slide-in-from-top duration-300">
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-2">힌트</h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {problem.explanation || '이 문제는 기본 개념을 이해하고 있으면 쉽게 풀 수 있습니다.'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Result Modal */}
          {showResult && (
            <Card className={`
              border-2 shadow-xl animate-in slide-in-from-bottom duration-500
              ${isCorrect
                ? 'bg-gradient-to-br from-success/20 to-success/10 border-success/30'
                : 'bg-gradient-to-br from-danger/20 to-danger/10 border-danger/30'
              }
            `}>
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`
                    flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center
                    ${isCorrect ? 'bg-gradient-to-br from-success to-success/80' : 'bg-gradient-to-br from-danger to-danger/80'}
                  `}>
                    {isCorrect ? (
                      <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} />
                    ) : (
                      <XCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-foreground mb-2">
                      {isCorrect ? '정답입니다!' : '틀렸습니다'}
                    </h3>
                    <p className="text-muted font-medium">
                      {isCorrect
                        ? '훌륭해요! 다음 문제로 넘어가볼까요?'
                        : '다시 한 번 시도해보세요. 힌트를 확인해보는 것도 좋습니다.'}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                {problem.explanation && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-4">
                    <h4 className="font-bold text-foreground mb-2">해설</h4>
                    <p className="text-sm text-muted leading-relaxed">{problem.explanation}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!isCorrect && (
                    <Button
                      onClick={handleRetry}
                      className="flex-1 bg-white hover:bg-gray-50 text-foreground border-2 border-gray-200 font-bold"
                    >
                      다시 풀기
                    </Button>
                  )}
                  <Button
                    onClick={handleNextProblem}
                    className={`
                      bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-primary
                      text-white font-bold shadow-lg group
                      ${isCorrect ? 'flex-1' : 'flex-1'}
                    `}
                  >
                    <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    다음 문제
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
