import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CodeBlock {
  id: string;
  code: string;
}

interface DragDropCodeProps {
  blocks: CodeBlock[];
  correctOrder: string[];
  onComplete: (isCorrect: boolean) => void;
}

interface SortableItemProps {
  id: string;
  code: string;
  index: number;
  submitted: boolean;
  isCorrect: boolean | null;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  code,
  index,
  submitted,
  isCorrect,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  let bgColor = 'bg-gray-800';
  if (submitted && isCorrect !== null) {
    bgColor = isCorrect ? 'bg-green-600/20 border-green-500' : 'bg-red-600/20 border-red-500';
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`touch-none ${isDragging ? 'z-50' : 'z-0'}`}
    >
      <motion.div
        animate={{
          opacity: isDragging ? 0.5 : 1,
          scale: isDragging ? 1.05 : 1,
        }}
        className={`flex items-start gap-3 p-4 rounded-lg border-2 ${bgColor} ${
          submitted ? 'border-gray-600' : 'border-gray-700'
        } transition-colors`}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 pt-1 cursor-grab active:cursor-grabbing touch-none"
        >
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>

        {/* Line Number */}
        <div className="flex-shrink-0 w-8 text-right">
          <span className="text-gray-500 font-mono text-sm">{index + 1}</span>
        </div>

        {/* Code */}
        <div className="flex-1 overflow-x-auto">
          <code className="text-white font-mono text-sm whitespace-pre">
            {code}
          </code>
        </div>

        {/* Status Icon */}
        {submitted && isCorrect !== null && (
          <div className="flex-shrink-0">
            {isCorrect ? (
              <span className="text-green-500 text-xl">✓</span>
            ) : (
              <span className="text-red-500 text-xl">✗</span>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export const DragDropCode: React.FC<DragDropCodeProps> = ({
  blocks,
  correctOrder,
  onComplete,
}) => {
  const [items, setItems] = useState<CodeBlock[]>(blocks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (submitted) return;
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (submitted || !over || active.id === over.id) {
      return;
    }

    setItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleSubmit = () => {
    const currentOrder = items.map((item) => item.id);
    const correct =
      currentOrder.length === correctOrder.length &&
      currentOrder.every((id, idx) => id === correctOrder[idx]);

    setSubmitted(true);
    setIsCorrect(correct);
    onComplete(correct);
  };

  const handleReset = () => {
    setItems(blocks);
    setSubmitted(false);
    setIsCorrect(null);
  };

  const activeItem = activeId
    ? items.find((item) => item.id === activeId)
    : null;

  const checkBlockCorrectness = (index: number): boolean | null => {
    if (!submitted) return null;
    return items[index].id === correctOrder[index];
  };

  return (
    <div className="flex flex-col h-full">
      {/* Instructions */}
      <div className="p-4 bg-gray-800/50 rounded-lg mb-4">
        <p className="text-sm text-gray-300">
          코드 블록을 드래그하여 올바른 순서로 정렬하세요
        </p>
      </div>

      {/* Sortable List */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {items.map((item, index) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  code={item.code}
                  index={index}
                  submitted={submitted}
                  isCorrect={checkBlockCorrectness(index)}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeItem ? (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-800 border-2 border-blue-500 shadow-2xl">
                <div className="flex-shrink-0 pt-1">
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <code className="text-white font-mono text-sm whitespace-pre">
                    {activeItem.code}
                  </code>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

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
          disabled={submitted}
          className={`flex-1 py-3 rounded-lg font-medium transition-colors min-h-[48px] ${
            !submitted
              ? 'bg-blue-600 text-white'
              : isCorrect
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
          whileTap={!submitted ? { scale: 0.98 } : {}}
        >
          {submitted
            ? isCorrect
              ? '정답입니다! ✓'
              : '오답입니다 ✗'
            : '제출하기'}
        </motion.button>
      </div>
    </div>
  );
};
