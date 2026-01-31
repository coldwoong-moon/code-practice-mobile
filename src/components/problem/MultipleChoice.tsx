import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MultipleChoiceProps {
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  onAnswer: (isCorrect: boolean, selectedIndex: number) => void;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question,
  choices,
  correctIndex,
  explanation,
  onAnswer,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChoiceClick = (index: number) => {
    if (submitted) return;
    setSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setSubmitted(true);
    const isCorrect = selectedIndex === correctIndex;
    onAnswer(isCorrect, selectedIndex);
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setSubmitted(false);
  };

  const getChoiceClassName = (index: number): string => {
    const baseClass = 'w-full p-4 rounded-lg text-left transition-all min-h-[48px] border-2';

    if (!submitted) {
      if (selectedIndex === index) {
        return `${baseClass} bg-blue-600 border-blue-500 text-white`;
      }
      return `${baseClass} bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700`;
    }

    // After submission
    if (index === correctIndex) {
      return `${baseClass} bg-green-600/30 border-green-500 text-white`;
    }

    if (selectedIndex === index && index !== correctIndex) {
      return `${baseClass} bg-red-600/30 border-red-500 text-white`;
    }

    return `${baseClass} bg-gray-800 border-gray-700 text-gray-400`;
  };

  const getChoiceIcon = (index: number): React.ReactNode => {
    if (!submitted) {
      return (
        <div
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            selectedIndex === index
              ? 'border-white bg-white'
              : 'border-gray-500'
          }`}
        >
          {selectedIndex === index && (
            <div className="w-3 h-3 rounded-full bg-blue-600" />
          )}
        </div>
      );
    }

    if (index === correctIndex) {
      return (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white text-sm">✓</span>
        </div>
      );
    }

    if (selectedIndex === index && index !== correctIndex) {
      return (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
          <span className="text-white text-sm">✗</span>
        </div>
      );
    }

    return (
      <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-600" />
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Question */}
      <div className="p-4 bg-gray-800/50 rounded-lg mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">문제</h3>
        <p className="text-gray-200 leading-relaxed">{question}</p>
      </div>

      {/* Choices */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        <div className="space-y-3">
          {choices.map((choice, index) => (
            <motion.button
              key={index}
              onClick={() => handleChoiceClick(index)}
              disabled={submitted}
              className={getChoiceClassName(index)}
              whileTap={submitted ? {} : { scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start gap-3">
                {getChoiceIcon(index)}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">
                      {String.fromCharCode(65 + index)}.
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{choice}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 mb-4 p-4 bg-gray-800/80 rounded-lg border-2 border-blue-500/30"
          >
            <h4 className="text-sm font-semibold text-blue-400 mb-2">해설</h4>
            <p className="text-sm text-gray-200 leading-relaxed">
              {explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-2 p-4 bg-gray-900/50 backdrop-blur-sm">
        {submitted && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleReset}
            className="flex-1 py-3 rounded-lg bg-gray-700 text-white font-medium min-h-[48px]"
            whileTap={{ scale: 0.98 }}
          >
            다시 풀기
          </motion.button>
        )}
        <motion.button
          onClick={handleSubmit}
          disabled={selectedIndex === null || submitted}
          className={`flex-1 py-3 rounded-lg font-medium transition-colors min-h-[48px] ${
            selectedIndex !== null && !submitted
              ? 'bg-blue-600 text-white'
              : submitted && selectedIndex === correctIndex
              ? 'bg-green-600 text-white'
              : submitted && selectedIndex !== correctIndex
              ? 'bg-red-600 text-white'
              : 'bg-gray-700 text-gray-400'
          }`}
          whileTap={selectedIndex !== null && !submitted ? { scale: 0.98 } : {}}
        >
          {submitted
            ? selectedIndex === correctIndex
              ? '정답입니다! ✓'
              : '오답입니다 ✗'
            : '제출하기'}
        </motion.button>
      </div>
    </div>
  );
};
