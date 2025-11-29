// Mock data for development/testing
export const mockEvents = [
  {
    id: 1,
    name: 'Tech Innovation Summit 2025',
    description: 'Join us for the biggest technology conference of the year featuring industry leaders and breakthrough innovations.',
    startDate: '2025-06-15',
    endDate: '2025-06-17',
    location: 'San Francisco, CA',
    attendeeCount: 1500,
    status: 'UPCOMING',
    tags: ['Technology', 'Innovation', 'AI', 'Startups'],
  },
  {
    id: 2,
    name: 'Digital Marketing Masterclass',
    description: 'Learn the latest digital marketing strategies from industry experts.',
    startDate: '2025-07-10',
    endDate: '2025-07-11',
    location: 'New York, NY',
    attendeeCount: 300,
    status: 'UPCOMING',
    tags: ['Marketing', 'Digital', 'Social Media'],
  },
  {
    id: 3,
    name: 'Web Development Workshop',
    description: 'Hands-on workshop covering modern web development technologies.',
    startDate: '2025-08-05',
    endDate: '2025-08-06',
    location: 'Seattle, WA',
    attendeeCount: 200,
    status: 'UPCOMING',
    tags: ['Web Dev', 'JavaScript', 'React'],
  },
];

export const mockAgenda = [
  {
    id: 1,
    title: 'Opening Keynote: The Future of AI',
    description: 'Explore the latest advancements in artificial intelligence and their impact on society.',
    startTime: '2025-06-15T09:00:00',
    endTime: '2025-06-15T10:30:00',
    speaker: 'Dr. Jane Smith',
    questionCount: 15,
    pollCount: 2,
  },
  {
    id: 2,
    title: 'Panel Discussion: Ethics in Technology',
    description: 'Leading experts discuss ethical considerations in modern technology.',
    startTime: '2025-06-15T11:00:00',
    endTime: '2025-06-15T12:30:00',
    speaker: 'Multiple Speakers',
    questionCount: 23,
    pollCount: 1,
  },
];

export const mockQuestions = [
  {
    id: 1,
    question: 'How do you see AI evolving in the next 5 years?',
    askedBy: 'John Doe',
    timestamp: '2 hours ago',
    upvotes: 42,
    upvoted: false,
    answered: true,
    answer: 'AI will continue to advance rapidly, with significant improvements in natural language processing and computer vision. We expect to see more practical applications in healthcare, education, and everyday consumer products.',
    answeredBy: 'Dr. Jane Smith',
  },
  {
    id: 2,
    question: 'What are the main ethical concerns we should be aware of?',
    askedBy: 'Sarah Johnson',
    timestamp: '1 hour ago',
    upvotes: 38,
    upvoted: false,
    answered: false,
  },
];

export const mockPolls = [
  {
    id: 1,
    question: 'Which technology are you most excited about?',
    options: [
      { id: 1, text: 'Artificial Intelligence', votes: 145 },
      { id: 2, text: 'Blockchain', votes: 67 },
      { id: 3, text: 'Quantum Computing', votes: 89 },
      { id: 4, text: 'Virtual Reality', votes: 54 },
    ],
    hasVoted: false,
  },
  {
    id: 2,
    question: 'How do you rate this session?',
    options: [
      { id: 1, text: 'Excellent', votes: 234 },
      { id: 2, text: 'Good', votes: 123 },
      { id: 3, text: 'Average', votes: 45 },
      { id: 4, text: 'Poor', votes: 12 },
    ],
    hasVoted: true,
  },
];
