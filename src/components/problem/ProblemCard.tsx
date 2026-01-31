import React from 'react';
import { motion } from 'framer-motion';

interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  type: 'multiple-choice' | 'code-fill-blank' | 'drag-drop';
}

interface Progress {
  completed: boolean;
  score?: number;
}

interface ProblemCardProps {
  problem: Problem;
  progress?: Progress;
  onClick: () => void;
}

const difficultyConfig = {
  easy: {
    label: '쉬움',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30',
  },
  medium: {
    label: '보통',
    bgColor: 'bg-yellow-500/20',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
  },
  hard: {
    label: '어려움',
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
  },
};

const typeConfig = {
  'multiple-choice': {
    label: '객관식',
    icon: '📝',
  },
  'code-fill-blank': {
    label: '빈칸 채우기',
    icon: '✏️',
  },
  'drag-drop': {
    label: '드래그 앤 드롭',
    icon: '🔄',
  },
};

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  progress,
  onClick,
}) => {
  const diffConfig = difficultyConfig[problem.difficulty];
  const typeInfo = typeConfig[problem.type];
  const isCompleted = progress?.completed ?? false;
  const score = progress?.score;

  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left bg-gray-800 rounded-xl p-4 border-2 border-gray-700 hover:border-blue-500/50 transition-all min-h-[120px] relative overflow-hidden"
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      {/* Completion Indicator */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-white text-lg">✓</span>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-start gap-2 mb-3">
        <span className="text-2xl flex-shrink-0">{typeInfo.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base leading-tight line-clamp-2 mb-1">
            {problem.title}
          </h3>
          <p className="text-gray-400 text-sm">{typeInfo.label}</p>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Category Tag */}
        <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
          {problem.category}
        </span>

        {/* Difficulty Badge */}
        <span
          className={`px-2.5 py-1 ${diffConfig.bgColor} ${diffConfig.textColor} text-xs font-medium rounded-full border ${diffConfig.borderColor}`}
        >
          {diffConfig.label}
        </span>

        {/* Score Badge */}
        {isCompleted && score !== undefined && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
              score >= 80
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : score >= 60
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}
          >
            {score}점
          </motion.span>
        )}
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.button>
  );
};
