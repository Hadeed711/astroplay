// Quiz question generator and static questions for all celestial objects

import { celestialBodies } from './celestialBodies'
import { calculateTravelTime, formatNumber } from '../utils/physics'
export const generateQuizQuestions = (mode = 'quick10', difficulty = 'student') => {
  const questions = []
  
  switch (mode) {
    case 'quick10':
      questions.push(...getQuickQuestions(difficulty))
      break
    case 'gravity':
      questions.push(...getGravityQuestions(difficulty))
      break
    case 'orbits':
      questions.push(...getOrbitQuestions(difficulty))
      break
    case 'compact':
      questions.push(...getCompactObjectQuestions(difficulty))
      break
    default:
      questions.push(...getQuickQuestions(difficulty))
  }
  
  return shuffleArray(questions).slice(0, 6)
}

// Quick 6 questions - mixed topics
const getQuickQuestions = (difficulty) => [
  {
    id: 'q1',
    type: 'multiple_choice',
    difficulty,
    question: 'Which planet is closest to the Sun?',
    options: ['Venus', 'Mercury', 'Earth', 'Mars'],
    correct: 1,
    explanation: 'Mercury is the closest planet to the Sun, orbiting at an average distance of 58 million km.',
    topic: 'planets',
    points: 10
  },
  {
    id: 'q2',
    type: 'multiple_choice',
    difficulty,
    question: 'What causes gravity?',
    options: [
      'Magnetic fields',
      'Mass bending spacetime', 
      'Electric charges',
      'Air pressure'
    ],
    correct: 1,
    explanation: 'According to Einstein\'s theory, gravity is caused by mass and energy bending the fabric of spacetime.',
    topic: 'gravity',
    points: 10
  },
  {
    id: 'q3',
    type: 'true_false',
    difficulty,
    question: 'The Moon has its own light source.',
    correct: false,
    explanation: 'The Moon doesn\'t produce its own light. It reflects sunlight, which is why we can see it.',
    topic: 'moon',
    points: 10
  },
  {
    id: 'q4',
    type: 'multiple_choice',
    difficulty,
    question: 'How long does it take light from the Sun to reach Earth?',
    options: ['8 seconds', '8 minutes', '8 hours', '8 days'],
    correct: 1,
    explanation: 'Light travels at 300,000 km/s and takes about 8 minutes to travel the 150 million km from Sun to Earth.',
    topic: 'light',
    points: 10
  },
  {
    id: 'q5',
    type: 'multiple_choice',
    difficulty,
    question: 'What is a black hole?',
    options: [
      'A hole in space',
      'A very dense collapsed star',
      'A dark planet',
      'Empty space'
    ],
    correct: 1,
    explanation: 'A black hole forms when a massive star collapses, creating a region where gravity is so strong that nothing can escape.',
    topic: 'black_holes',
    points: 10
  },
  {
    id: 'q6',
    type: 'true_false',
    difficulty,
    question: 'There is no gravity in space.',
    correct: false,
    explanation: 'Gravity exists everywhere in space! Astronauts feel weightless because they\'re in free fall, not because there\'s no gravity.',
    topic: 'gravity',
    points: 10
  }
]

// Gravity-focused questions
const getGravityQuestions = (difficulty) => [
  {
    id: 'g1',
    type: 'multiple_choice',
    difficulty,
    question: 'What happens to your weight on the Moon?',
    options: [
      'It stays the same',
      'It becomes 6 times lighter', 
      'It becomes 6 times heavier',
      'You become weightless'
    ],
    correct: 1,
    explanation: 'The Moon has about 1/6th of Earth\'s gravity, so you would weigh 6 times less on the Moon.',
    topic: 'gravity',
    points: 10
  },
  {
    id: 'g2',
    type: 'multiple_choice',
    difficulty,
    question: 'Why do objects fall at the same rate on Earth?',
    options: [
      'They have the same weight',
      'Air resistance is the same',
      'Gravity pulls equally on all objects',
      'They have the same size'
    ],
    correct: 2,
    explanation: 'Gravity accelerates all objects equally (9.8 m/s²) regardless of their mass, as discovered by Galileo.',
    topic: 'gravity',
    points: 10
  },
  {
    id: 'g3',
    type: 'true_false',
    difficulty,
    question: 'Heavier objects fall faster than lighter objects.',
    correct: false,
    explanation: 'In a vacuum, all objects fall at the same rate regardless of weight. Air resistance can make lighter objects fall slower.',
    topic: 'gravity',
    points: 10
  },
  {
    id: 'g4',
    type: 'multiple_choice',
    difficulty,
    question: 'What keeps the Moon orbiting Earth?',
    options: [
      'Magnetic force',
      'Gravity',
      'Solar wind',
      'Centrifugal force'
    ],
    correct: 1,
    explanation: 'Earth\'s gravity keeps the Moon in orbit. The Moon is constantly falling toward Earth but moving fast enough to keep missing it.',
    topic: 'gravity',
    points: 10
  },
  {
    id: 'g5',
    type: 'multiple_choice',
    difficulty,
    question: 'Where would you weigh the most?',
    options: ['Earth', 'Mars', 'Jupiter', 'The Moon'],
    correct: 2,
    explanation: 'Jupiter has the strongest gravity of these options - about 2.5 times stronger than Earth\'s gravity.',
    topic: 'gravity',
    points: 10
  },
  {
    id: 'g6',
    type: 'true_false',
    difficulty,
    question: 'Astronauts float in space because there is no gravity.',
    correct: false,
    explanation: 'Astronauts float because they\'re in free fall, constantly falling toward Earth but moving fast enough to keep orbiting.',
    topic: 'gravity',
    points: 10
  }
]

// Orbital mechanics questions
const getOrbitQuestions = (difficulty) => [
  {
    id: 'o1',
    type: 'multiple_choice',
    difficulty,
    question: 'How long does it take Earth to orbit the Sun?',
    options: ['1 day', '1 month', '1 year', '10 years'],
    correct: 2,
    explanation: 'Earth takes exactly one year (365.25 days) to complete one orbit around the Sun.',
    topic: 'orbits',
    points: 10
  },
  {
    id: 'o2',
    type: 'multiple_choice',
    difficulty,
    question: 'What shape is Earth\'s orbit around the Sun?',
    options: ['Perfect circle', 'Slightly oval (ellipse)', 'Square', 'Triangle'],
    correct: 1,
    explanation: 'Earth\'s orbit is an ellipse - slightly oval shaped, not a perfect circle.',
    topic: 'orbits',
    points: 10
  },
  {
    id: 'o3',
    type: 'true_false',
    difficulty,
    question: 'The Moon always shows the same face to Earth.',
    correct: true,
    explanation: 'The Moon is tidally locked to Earth, meaning it rotates once for each orbit, so we always see the same side.',
    topic: 'orbits',
    points: 10
  },
  {
    id: 'o4',
    type: 'multiple_choice',
    difficulty,
    question: 'How long does it take the Moon to orbit Earth?',
    options: ['1 day', '1 week', '1 month', '1 year'],
    correct: 2,
    explanation: 'The Moon takes about 27.3 days to orbit Earth, which is roughly one month.',
    topic: 'orbits',
    points: 10
  },
  {
    id: 'o5',
    type: 'multiple_choice',
    difficulty,
    question: 'What causes the seasons on Earth?',
    options: [
      'Distance from the Sun',
      'Earth\'s tilted axis',
      'Solar flares',
      'The Moon\'s gravity'
    ],
    correct: 1,
    explanation: 'Earth\'s 23.5° axial tilt causes different parts to receive more or less sunlight throughout the year.',
    topic: 'orbits',
    points: 10
  },
  {
    id: 'o6',
    type: 'true_false',
    difficulty,
    question: 'All planets orbit the Sun in the same direction.',
    correct: true,
    explanation: 'All planets in our solar system orbit the Sun counterclockwise when viewed from above Earth\'s North Pole.',
    topic: 'orbits',
    points: 10
  }
]

// Compact objects questions
const getCompactObjectQuestions = (difficulty) => [
  {
    id: 'c1',
    type: 'multiple_choice',
    difficulty,
    question: 'What happens when a massive star dies?',
    options: [
      'It becomes a planet',
      'It can become a black hole',
      'It turns into the Sun',
      'It disappears completely'
    ],
    correct: 1,
    explanation: 'When very massive stars (over 25 times the Sun\'s mass) die, they can collapse into black holes.',
    topic: 'compact_objects',
    points: 10
  },
  {
    id: 'c2',
    type: 'true_false',
    difficulty,
    question: 'Black holes are completely black and invisible.',
    correct: false,
    explanation: 'While black holes don\'t emit light, we can see them by observing how they affect nearby matter and light.',
    topic: 'compact_objects',
    points: 10
  },
  {
    id: 'c3',
    type: 'multiple_choice',
    difficulty,
    question: 'What is a neutron star?',
    options: [
      'A new star being born',
      'A collapsed star made of neutrons',
      'A star made of gas',
      'A small planet'
    ],
    correct: 1,
    explanation: 'A neutron star is the collapsed core of a massive star, so dense that protons and electrons combine to form neutrons.',
    topic: 'compact_objects',
    points: 10
  },
  {
    id: 'c4',
    type: 'multiple_choice',
    difficulty,
    question: 'How big is a typical neutron star?',
    options: [
      'Size of Earth',
      'Size of a city (20 km across)',
      'Size of the Sun',
      'Size of the Moon'
    ],
    correct: 1,
    explanation: 'Neutron stars are incredibly dense - about 20 km across but containing more mass than our Sun!',
    topic: 'compact_objects',
    points: 10
  },
  {
    id: 'c5',
    type: 'true_false',
    difficulty,
    question: 'If you fell into a black hole, time would slow down for you.',
    correct: false,
    explanation: 'Time would feel normal to you, but observers outside would see your time slow down due to time dilation.',
    topic: 'compact_objects',
    points: 10
  },
  {
    id: 'c6',
    type: 'multiple_choice',
    difficulty,
    question: 'What is the event horizon of a black hole?',
    options: [
      'The surface of the black hole',
      'The point of no return',
      'The center of the black hole',
      'The edge of space'
    ],
    correct: 1,
    explanation: 'The event horizon is the boundary around a black hole beyond which nothing, not even light, can escape.',
    topic: 'compact_objects',
    points: 10
  }
]

// Scene reading questions (based on 3D visualizations)
export const getSceneQuestions = (selectedObject) => [
  {
    id: 's1',
    type: 'scene_reading',
    difficulty: 'student',
    question: `Looking at the ${selectedObject.name} visualization, what do the green lines represent?`,
    options: [
      'Magnetic field lines',
      'Gravitational field lines',
      'Light rays',
      'Orbital paths'
    ],
    correct: 1,
    explanation: 'The green lines show gravitational field lines, indicating how gravity pulls objects toward the center.',
    topic: 'visualization',
    points: 12,
    requiresVisualization: 'gravity'
  },
  {
    id: 's2',
    type: 'scene_reading',
    difficulty: 'student',
    question: 'In the escape velocity visualization, what do red trajectories indicate?',
    options: [
      'Successful escape paths',
      'Failed escape attempts',
      'Orbital paths',
      'Collision courses'
    ],
    correct: 1,
    explanation: 'Red trajectories show sub-escape velocity - objects that fall back to the surface.',
    topic: 'visualization',
    points: 12,
    requiresVisualization: 'escape'
  }
]

// Utility functions
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Quiz modes configuration
export const quizModes = {
  quick10: {
    title: 'Quick Quiz',
    description: 'Fast 6-question challenge',
    icon: '⚡',
    timeLimit: 180, // 3 minutes
    questions: 6
  },
  gravity: {
    title: 'Gravity',
    description: 'Forces and gravitational fields',
    icon: '🌍',
    timeLimit: 240, // 4 minutes
    questions: 6
  },
  orbits: {
    title: 'Orbits',
    description: 'Planetary motion and mechanics',
    icon: '🪐',
    timeLimit: 240,
    questions: 6
  },
  compact: {
    title: 'Compact Objects',
    description: 'Black holes & neutron stars',
    icon: '🕳️',
    timeLimit: 300, // 5 minutes
    questions: 6
  }
}

export default {
  generateQuizQuestions,
  getSceneQuestions,
  quizModes
}