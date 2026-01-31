import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Blank {
  options: string[];
  correct: number;
}

interface CodeFillBlankProps {
  code: string;
  blanks: Blank[];
  onComplete: (isCorrect: boolean, answers: number[]) => void;
}

export const CodeFillBlank: React.FC<CodeFillBlankProps> = ({
  code,
  blanks,
  onComplete,
}) => {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(blanks.length).fill(null)
  );
  const [activeBlankIndex, setActiveBlankIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = useMemo(
    () => answers.every((answer) => answer !== null),
    [answers]
  );

  const isCorrect = useMemo(() => {
    if (!submitted) return null;
    return answers.every((answer, idx) => answer === blanks[idx].correct);
  }, [answers, blanks, submitted]);

  const handleBlankClick = (index: number) => {
    if (submitted) return;
    setActiveBlankIndex(index);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (activeBlankIndex === null) return;
    const newAnswers = [...answers];
    newAnswers[activeBlankIndex] = optionIndex;
    setAnswers(newAnswers);
    setActiveBlankIndex(null);
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    const correct = answers.every((answer, idx) => answer === blanks[idx].correct);
    onComplete(correct, answers as number[]);
  };

  const handleReset = () => {
    setAnswers(new Array(blanks.length).fill(null));
    setSubmitted(false);
    setActiveBlankIndex(null);
  };

  const renderCodeWithBlanks = () => {
    const parts = code.split(/(\{\{\d+\}\})/g);

    return parts.map((part, index) => {
      const match = part.match(/\{\{(\d+)\}\}/);
      if (match) {
        const blankIndex = parseInt(match[1], 10);
        const answer = answers[blankIndex];
        const isActive = activeBlankIndex === blankIndex;

        let bgColor = 'bg-gray-700';
        if (submitted && answer !== null) {
          bgColor = answer === blanks[blankIndex].correct
            ? 'bg-green-600/30 border-green-500'
            : 'bg-red-600/30 border-red-500';
        } else if (isActive) {
          bgColor = 'bg-blue-600/30 border-blue-500';
        } else if (answer !== null) {
          bgColor = 'bg-blue-600/20 border-blue-400';
        }

        return (
          <motion.button
            key={`blank-${blankIndex}`}
            onClick={() => handleBlankClick(blankIndex)}
            disabled={submitted}
            className={`inline-flex items-center justify-center min-w-[80px] px-3 py-1 mx-1 rounded border-2 ${bgColor} transition-colors`}
            whileTap={submitted ? {} : { scale: 0.95 }}
          >
            <span className="text-sm font-mono text-white">
              {answer !== null ? blanks[blankIndex].options[answer] : '___'}
            </span>
          </motion.button>
        );
      }

      return (
        <span key={`text-${index}`} className="whitespace-pre">
          {part}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Code Block */}
      <div className="flex-1 overflow-auto p-4 bg-gray-900 rounded-lg">
        <pre className="font-mono text-sm text-gray-100 leading-relaxed">
          <code>{renderCodeWithBlanks()}</code>
        </pre>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 p-4">
        {submitted && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleReset}
            className="flex-1 py-3 rounded-lg bg-gray-700 text-white font-medium"
          >
            다시 풀기
          </motion.button>
        )}
        <motion.button
          onClick={handleSubmit}
          disabled={!allAnswered || submitted}
          className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
            allAnswered && !submitted
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-400'
          }`}
          whileTap={allAnswered && !submitted ? { scale: 0.98 } : {}}
        >
          {submitted ? (isCorrect ? '정답입니다! ✓' : '오답입니다 ✗') : '제출하기'}
        </motion.button>
      </div>

      {/* Options Panel */}
      <AnimatePresence>
        {activeBlankIndex !== null && !submitted && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveBlankIndex(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Options Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-gray-800 rounded-t-2xl shadow-2xl z-50"
            >
              <div className="p-4">
                {/* Handle */}
                <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4" />

                <h3 className="text-lg font-semibold text-white mb-4">
                  빈칸 {activeBlankIndex + 1} 선택
                </h3>

                <div className="space-y-2 max-h-[60vh] overflow-auto pb-safe">
                  {blanks[activeBlankIndex].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors min-h-[48px]"
                      whileTap={{ scale: 0.98 }}
                    >
                      <code className="text-white font-mono text-sm">
                        {option}
                      </code>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
