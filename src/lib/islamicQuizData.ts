export interface QuizQuestion {
  id: string
  type: 'fill-in' | 'multiple-choice' | 'true-false' | 'write-answer'
  question: string
  options?: string[]
  correctAnswer: string
  category: string
}

export const islamicQuiz1: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'fill-in',
    question: 'The first pillar is ___________.',
    correctAnswer: 'Shahadah',
    category: 'Five Pillars'
  },
  {
    id: 'q2',
    type: 'fill-in',
    question: 'The second pillar is ___________.',
    correctAnswer: 'Salah',
    category: 'Five Pillars'
  },
  {
    id: 'q3',
    type: 'fill-in',
    question: 'The third pillar is ___________.',
    correctAnswer: 'Zakah',
    category: 'Five Pillars'
  },
  {
    id: 'q4',
    type: 'fill-in',
    question: 'The fourth pillar is ___________.',
    correctAnswer: 'Sawm',
    category: 'Five Pillars'
  },
  {
    id: 'q5',
    type: 'fill-in',
    question: 'The fifth pillar is ___________.',
    correctAnswer: 'Hajj',
    category: 'Five Pillars'
  },
  {
    id: 'q6',
    type: 'multiple-choice',
    question: 'How many times do Muslims pray each day?',
    options: ['2', '3', '5'],
    correctAnswer: '5',
    category: 'Prayer'
  },
  {
    id: 'q7',
    type: 'multiple-choice',
    question: 'What month do Muslims fast in?',
    options: ['Muharram', 'Ramadan', 'Dhul Hijjah'],
    correctAnswer: 'Ramadan',
    category: 'Fasting'
  },
  {
    id: 'q8',
    type: 'multiple-choice',
    question: 'What do we give to help the poor?',
    options: ['Toys', 'Zakah', 'Food'],
    correctAnswer: 'Zakah',
    category: 'Charity'
  },
  {
    id: 'q9',
    type: 'multiple-choice',
    question: 'Where do Muslims go for Hajj?',
    options: ['Madinah', 'Makkah', 'Jerusalem'],
    correctAnswer: 'Makkah',
    category: 'Hajj'
  },
  {
    id: 'q10',
    type: 'true-false',
    question: 'Fasting means eating a lot in Ramadan.',
    correctAnswer: 'False',
    category: 'Fasting'
  },
  {
    id: 'q11',
    type: 'true-false',
    question: 'Salah helps us remember Allah.',
    correctAnswer: 'True',
    category: 'Prayer'
  },
  {
    id: 'q12',
    type: 'true-false',
    question: 'Shahadah means believing in one Allah.',
    correctAnswer: 'True',
    category: 'Faith'
  },
  {
    id: 'q13',
    type: 'true-false',
    question: 'We should give Zakah to help others.',
    correctAnswer: 'True',
    category: 'Charity'
  }
]

export const fivePillarsOrder = ['Shahadah', 'Salah', 'Zakah', 'Sawm', 'Hajj']
