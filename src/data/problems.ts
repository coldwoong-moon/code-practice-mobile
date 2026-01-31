import { CodeBlank, CodeBlock, DifficultyLevel } from '@/types/problem';

export type ProblemType = 'FILL_BLANK' | 'DRAG_DROP' | 'MULTIPLE_CHOICE';

export interface Problem {
  id: string;
  type: ProblemType;
  title: string;
  difficulty: DifficultyLevel;
  category: string;
  description: string;
  // Fill Blank specific
  code?: string;
  blanks?: Record<string, CodeBlank>;
  // Drag Drop specific
  codeBlocks?: CodeBlock[];
  correctOrder?: string[]; // IDs in correct order
  // Multiple Choice specific
  question?: string;
  choices?: string[];
  correctIndex?: number;
  explanation?: string;
}

// ==================== FILL_BLANK 문제 (5개) ====================

export const fillBlankProblems: Problem[] = [
  {
    id: 'fb-001',
    type: 'FILL_BLANK',
    title: '배열 순회하기',
    difficulty: 'beginner',
    category: '반복문',
    description: '배열의 모든 요소를 출력하는 for 반복문을 완성하세요.',
    code: `const numbers = [1, 2, 3, 4, 5];

for ({{BLANK_1}} i = 0; i {{BLANK_2}} numbers.length; i++) {
  console.log(numbers{{BLANK_3}});
}`,
    blanks: {
      BLANK_1: {
        id: 'BLANK_1',
        options: ['let', 'const', 'var', 'int'],
        correctIndex: 0,
      },
      BLANK_2: {
        id: 'BLANK_2',
        options: ['>', '<', '>=', '=='],
        correctIndex: 1,
      },
      BLANK_3: {
        id: 'BLANK_3',
        options: ['[i]', '(i)', '.i', '{i}'],
        correctIndex: 0,
      },
    },
    explanation: 'for 반복문은 let으로 변수를 선언하고, 조건은 배열 길이보다 작을 때까지 실행되며, 배열 요소는 대괄호로 접근합니다.',
  },
  {
    id: 'fb-002',
    type: 'FILL_BLANK',
    title: '짝수 판별하기',
    difficulty: 'beginner',
    category: '조건문',
    description: '숫자가 짝수인지 홀수인지 판별하는 조건문을 완성하세요.',
    code: `function checkNumber(num) {
  {{BLANK_1}} (num {{BLANK_2}} 2 === 0) {
    return "짝수";
  } {{BLANK_3}} {
    return "홀수";
  }
}`,
    blanks: {
      BLANK_1: {
        id: 'BLANK_1',
        options: ['if', 'for', 'while', 'switch'],
        correctIndex: 0,
      },
      BLANK_2: {
        id: 'BLANK_2',
        options: ['/', '%', '*', '+'],
        correctIndex: 1,
      },
      BLANK_3: {
        id: 'BLANK_3',
        options: ['else', 'elif', 'then', 'otherwise'],
        correctIndex: 0,
      },
    },
    explanation: 'if-else 조건문을 사용하고, 나머지 연산자(%)로 짝수를 판별합니다.',
  },
  {
    id: 'fb-003',
    type: 'FILL_BLANK',
    title: '두 수의 합 함수',
    difficulty: 'beginner',
    category: '함수',
    description: '두 숫자를 더해서 반환하는 함수를 완성하세요.',
    code: `{{BLANK_1}} add(a, b) {
  {{BLANK_2}} a + b;
}

const result = add(5, 3);
console.log(result); // {{BLANK_3}}`,
    blanks: {
      BLANK_1: {
        id: 'BLANK_1',
        options: ['function', 'func', 'def', 'method'],
        correctIndex: 0,
      },
      BLANK_2: {
        id: 'BLANK_2',
        options: ['return', 'print', 'output', 'give'],
        correctIndex: 0,
      },
      BLANK_3: {
        id: 'BLANK_3',
        options: ['8', '53', '15', 'undefined'],
        correctIndex: 0,
      },
    },
    explanation: 'function 키워드로 함수를 정의하고, return으로 값을 반환합니다. 5 + 3 = 8입니다.',
  },
  {
    id: 'fb-004',
    type: 'FILL_BLANK',
    title: '배열 필터링',
    difficulty: 'intermediate',
    category: '배열 메서드',
    description: '배열에서 조건을 만족하는 요소만 필터링하세요.',
    code: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const evenNumbers = numbers.{{BLANK_1}}(num {{BLANK_2}} num % 2 === 0);
const doubled = evenNumbers.{{BLANK_3}}(num => num * 2);

console.log(doubled); // [4, 8, 12, 16, 20]`,
    blanks: {
      BLANK_1: {
        id: 'BLANK_1',
        options: ['filter', 'map', 'reduce', 'forEach'],
        correctIndex: 0,
      },
      BLANK_2: {
        id: 'BLANK_2',
        options: ['=>', ':', '==', 'in'],
        correctIndex: 0,
      },
      BLANK_3: {
        id: 'BLANK_3',
        options: ['map', 'filter', 'reduce', 'find'],
        correctIndex: 0,
      },
    },
    explanation: 'filter는 조건을 만족하는 요소만 선택하고, map은 각 요소를 변환합니다. 화살표 함수(=>)를 사용합니다.',
  },
  {
    id: 'fb-005',
    type: 'FILL_BLANK',
    title: '팩토리얼 재귀 함수',
    difficulty: 'advanced',
    category: '재귀',
    description: '재귀 함수를 사용하여 팩토리얼을 계산하세요.',
    code: `function factorial(n) {
  {{BLANK_1}} (n {{BLANK_2}} 1) {
    return 1;
  }
  return n * {{BLANK_3}}(n - 1);
}

console.log(factorial(5)); // 120`,
    blanks: {
      BLANK_1: {
        id: 'BLANK_1',
        options: ['if', 'while', 'for', 'switch'],
        correctIndex: 0,
      },
      BLANK_2: {
        id: 'BLANK_2',
        options: ['<=', '>=', '==', '!='],
        correctIndex: 0,
      },
      BLANK_3: {
        id: 'BLANK_3',
        options: ['factorial', 'recursion', 'calc', 'repeat'],
        correctIndex: 0,
      },
    },
    explanation: '재귀 함수는 종료 조건(n <= 1)을 확인하고, 자기 자신을 호출합니다. 5! = 5 × 4 × 3 × 2 × 1 = 120',
  },
];

// ==================== DRAG_DROP 문제 (5개) ====================

export const dragDropProblems: Problem[] = [
  {
    id: 'dd-001',
    type: 'DRAG_DROP',
    title: '버블 정렬 구현하기',
    difficulty: 'intermediate',
    category: '정렬',
    description: '버블 정렬 알고리즘의 코드 블록을 올바른 순서로 배열하세요.',
    codeBlocks: [
      { id: 'block-1', content: 'function bubbleSort(arr) {', order: 0 },
      { id: 'block-2', content: '  for (let i = 0; i < arr.length; i++) {', order: 1 },
      { id: 'block-3', content: '    for (let j = 0; j < arr.length - i - 1; j++) {', order: 2 },
      { id: 'block-4', content: '      if (arr[j] > arr[j + 1]) {', order: 3 },
      { id: 'block-5', content: '        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];', order: 4 },
      { id: 'block-6', content: '      }', order: 5 },
      { id: 'block-7', content: '    }', order: 6 },
      { id: 'block-8', content: '  }', order: 7 },
      { id: 'block-9', content: '  return arr;', order: 8 },
      { id: 'block-10', content: '}', order: 9 },
    ],
    correctOrder: ['block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6', 'block-7', 'block-8', 'block-9', 'block-10'],
    explanation: '버블 정렬은 인접한 두 요소를 비교하여 정렬합니다. 이중 반복문으로 구현됩니다.',
  },
  {
    id: 'dd-002',
    type: 'DRAG_DROP',
    title: '이진 탐색 구현하기',
    difficulty: 'intermediate',
    category: '탐색',
    description: '이진 탐색 알고리즘의 코드 블록을 올바른 순서로 배열하세요.',
    codeBlocks: [
      { id: 'block-1', content: 'function binarySearch(arr, target) {', order: 0 },
      { id: 'block-2', content: '  let left = 0, right = arr.length - 1;', order: 1 },
      { id: 'block-3', content: '  while (left <= right) {', order: 2 },
      { id: 'block-4', content: '    const mid = Math.floor((left + right) / 2);', order: 3 },
      { id: 'block-5', content: '    if (arr[mid] === target) return mid;', order: 4 },
      { id: 'block-6', content: '    if (arr[mid] < target) left = mid + 1;', order: 5 },
      { id: 'block-7', content: '    else right = mid - 1;', order: 6 },
      { id: 'block-8', content: '  }', order: 7 },
      { id: 'block-9', content: '  return -1;', order: 8 },
      { id: 'block-10', content: '}', order: 9 },
    ],
    correctOrder: ['block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6', 'block-7', 'block-8', 'block-9', 'block-10'],
    explanation: '이진 탐색은 정렬된 배열에서 중간값을 비교하여 탐색 범위를 절반씩 줄입니다. O(log n) 시간 복잡도를 가집니다.',
  },
  {
    id: 'dd-003',
    type: 'DRAG_DROP',
    title: '스택 구현하기',
    difficulty: 'beginner',
    category: '자료구조',
    description: '스택의 push와 pop 메서드를 올바른 순서로 배열하세요.',
    codeBlocks: [
      { id: 'block-1', content: 'class Stack {', order: 0 },
      { id: 'block-2', content: '  constructor() {', order: 1 },
      { id: 'block-3', content: '    this.items = [];', order: 2 },
      { id: 'block-4', content: '  }', order: 3 },
      { id: 'block-5', content: '  push(element) {', order: 4 },
      { id: 'block-6', content: '    this.items.push(element);', order: 5 },
      { id: 'block-7', content: '  }', order: 6 },
      { id: 'block-8', content: '  pop() {', order: 7 },
      { id: 'block-9', content: '    return this.items.pop();', order: 8 },
      { id: 'block-10', content: '  }', order: 9 },
      { id: 'block-11', content: '}', order: 10 },
    ],
    correctOrder: ['block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6', 'block-7', 'block-8', 'block-9', 'block-10', 'block-11'],
    explanation: '스택은 LIFO(Last In First Out) 자료구조입니다. push로 요소를 추가하고 pop으로 제거합니다.',
  },
  {
    id: 'dd-004',
    type: 'DRAG_DROP',
    title: '링크드 리스트 노드 추가',
    difficulty: 'intermediate',
    category: '자료구조',
    description: '링크드 리스트의 끝에 노드를 추가하는 코드를 올바른 순서로 배열하세요.',
    codeBlocks: [
      { id: 'block-1', content: 'append(data) {', order: 0 },
      { id: 'block-2', content: '  const newNode = new Node(data);', order: 1 },
      { id: 'block-3', content: '  if (!this.head) {', order: 2 },
      { id: 'block-4', content: '    this.head = newNode;', order: 3 },
      { id: 'block-5', content: '    return;', order: 4 },
      { id: 'block-6', content: '  }', order: 5 },
      { id: 'block-7', content: '  let current = this.head;', order: 6 },
      { id: 'block-8', content: '  while (current.next) {', order: 7 },
      { id: 'block-9', content: '    current = current.next;', order: 8 },
      { id: 'block-10', content: '  }', order: 9 },
      { id: 'block-11', content: '  current.next = newNode;', order: 10 },
      { id: 'block-12', content: '}', order: 11 },
    ],
    correctOrder: ['block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6', 'block-7', 'block-8', 'block-9', 'block-10', 'block-11', 'block-12'],
    explanation: '링크드 리스트는 노드들이 연결된 자료구조입니다. 끝에 추가하려면 마지막 노드까지 순회해야 합니다.',
  },
  {
    id: 'dd-005',
    type: 'DRAG_DROP',
    title: 'DFS 그래프 탐색',
    difficulty: 'advanced',
    category: '그래프',
    description: '깊이 우선 탐색(DFS) 알고리즘의 코드 블록을 올바른 순서로 배열하세요.',
    codeBlocks: [
      { id: 'block-1', content: 'function dfs(graph, start, visited = new Set()) {', order: 0 },
      { id: 'block-2', content: '  visited.add(start);', order: 1 },
      { id: 'block-3', content: '  console.log(start);', order: 2 },
      { id: 'block-4', content: '  for (const neighbor of graph[start]) {', order: 3 },
      { id: 'block-5', content: '    if (!visited.has(neighbor)) {', order: 4 },
      { id: 'block-6', content: '      dfs(graph, neighbor, visited);', order: 5 },
      { id: 'block-7', content: '    }', order: 6 },
      { id: 'block-8', content: '  }', order: 7 },
      { id: 'block-9', content: '  return visited;', order: 8 },
      { id: 'block-10', content: '}', order: 9 },
    ],
    correctOrder: ['block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6', 'block-7', 'block-8', 'block-9', 'block-10'],
    explanation: 'DFS는 깊이 우선으로 그래프를 탐색합니다. 재귀 호출로 구현하며, 방문한 노드를 Set으로 관리합니다.',
  },
];

// ==================== MULTIPLE_CHOICE 문제 (5개) ====================

export const multipleChoiceProblems: Problem[] = [
  {
    id: 'mc-001',
    type: 'MULTIPLE_CHOICE',
    title: '시간 복잡도 분석',
    difficulty: 'intermediate',
    category: '알고리즘 분석',
    description: '다음 코드의 시간 복잡도는?',
    question: `\`\`\`javascript
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    console.log(i, j);
  }
}
\`\`\``,
    choices: [
      'O(n)',
      'O(n²)',
      'O(log n)',
      'O(n log n)',
    ],
    correctIndex: 1,
    explanation: '이중 반복문이므로 O(n²) 시간 복잡도를 가집니다. 외부 루프 n번, 내부 루프 각각 n번 실행됩니다.',
  },
  {
    id: 'mc-002',
    type: 'MULTIPLE_CHOICE',
    title: '적절한 자료구조 선택',
    difficulty: 'beginner',
    category: '자료구조',
    description: 'LIFO(Last In First Out) 방식으로 데이터를 저장해야 할 때 가장 적절한 자료구조는?',
    question: '웹 브라우저의 뒤로 가기 기능을 구현하려고 합니다. 어떤 자료구조를 사용해야 할까요?',
    choices: [
      '큐(Queue)',
      '스택(Stack)',
      '링크드 리스트(Linked List)',
      '해시 테이블(Hash Table)',
    ],
    correctIndex: 1,
    explanation: '스택은 LIFO 구조로, 가장 최근에 방문한 페이지부터 뒤로 갈 수 있습니다. 뒤로 가기 기능에 적합합니다.',
  },
  {
    id: 'mc-003',
    type: 'MULTIPLE_CHOICE',
    title: '코드 출력 예측',
    difficulty: 'intermediate',
    category: '배열',
    description: '다음 코드의 출력 결과는?',
    question: `\`\`\`javascript
const arr = [1, 2, 3, 4, 5];
const result = arr.reduce((acc, cur) => acc + cur, 0);
console.log(result);
\`\`\``,
    choices: [
      '0',
      '15',
      '[1, 2, 3, 4, 5]',
      'undefined',
    ],
    correctIndex: 1,
    explanation: 'reduce는 배열의 모든 요소를 누적합니다. 1 + 2 + 3 + 4 + 5 = 15가 출력됩니다.',
  },
  {
    id: 'mc-004',
    type: 'MULTIPLE_CHOICE',
    title: '코드 오류 찾기',
    difficulty: 'beginner',
    category: '디버깅',
    description: '다음 코드에서 오류가 있는 부분은?',
    question: `\`\`\`javascript
function findMax(arr) {
  let max = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}
console.log(findMax([-5, -2, -10, -1]));
\`\`\``,
    choices: [
      'for 반복문 조건이 잘못되었다',
      'max 초기값이 0이어서 음수 배열에서 오류가 발생한다',
      'if 조건문이 잘못되었다',
      'return 문이 잘못된 위치에 있다',
    ],
    correctIndex: 1,
    explanation: 'max를 0으로 초기화하면 모든 값이 음수인 경우 0이 반환됩니다. arr[0]이나 -Infinity로 초기화해야 합니다.',
  },
  {
    id: 'mc-005',
    type: 'MULTIPLE_CHOICE',
    title: '최적 알고리즘 선택',
    difficulty: 'advanced',
    category: '알고리즘',
    description: '정렬된 배열에서 특정 값을 찾을 때 가장 효율적인 알고리즘은?',
    question: '1억 개의 정렬된 숫자 배열에서 특정 값을 찾아야 합니다. 가장 빠른 알고리즘은?',
    choices: [
      '선형 탐색 - O(n)',
      '이진 탐색 - O(log n)',
      '해시 탐색 - O(1)',
      '점프 탐색 - O(√n)',
    ],
    correctIndex: 1,
    explanation: '정렬된 배열에서는 이진 탐색이 O(log n)으로 가장 효율적입니다. 해시는 정렬을 활용하지 못합니다.',
  },
];

// ==================== 전체 문제 목록 ====================

export const allProblems: Problem[] = [
  ...fillBlankProblems,
  ...dragDropProblems,
  ...multipleChoiceProblems,
];

// ==================== 유틸리티 함수 ====================

export function getProblemsByType(type: ProblemType): Problem[] {
  return allProblems.filter(p => p.type === type);
}

export function getProblemsByDifficulty(difficulty: DifficultyLevel): Problem[] {
  return allProblems.filter(p => p.difficulty === difficulty);
}

export function getProblemsByCategory(category: string): Problem[] {
  return allProblems.filter(p => p.category === category);
}

export function getProblemById(id: string): Problem | undefined {
  return allProblems.find(p => p.id === id);
}

export function getRandomProblems(count: number): Problem[] {
  const shuffled = [...allProblems].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const categories = [
  '반복문',
  '조건문',
  '함수',
  '배열 메서드',
  '재귀',
  '정렬',
  '탐색',
  '자료구조',
  '그래프',
  '알고리즘 분석',
  '배열',
  '디버깅',
  '알고리즘',
];
