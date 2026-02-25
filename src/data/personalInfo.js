// Personal and professional information for Michael Chen's portfolio

export const PERSONAL_INFO = {
  name: 'Michael Chen',
  title: 'Frontend Developer',
  location: 'New Taipei City, Taiwan',
  email: 'chen.michael40@gmail.com',
  phone: '+886-901-365-501',
  github: 'https://github.com/michael-chen12',
  linkedin: 'https://linkedin.com/in/chen-michael40',
};

export const HERO_CONTENT = {
  headline: 'Frontend Developer',
  description:
    'I create responsive, user-focused web applications using React and modern frontend technologies. With a strong foundation in full-stack development and a passion for clean code, I bring ideas to life through thoughtful design and efficient implementation.',
};

export const PROJECTS = [
  {
    id: 'job-tracker',
    title: 'Job Tracker',
    description:
      'Full-stack job application tracker with real-time statistics, calendar integration, and document management. Built with React, Node.js, Express, and MongoDB.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    demoUrl: 'https://job-tracker-blond-xi.vercel.app',
    githubUrl: 'https://github.com/michael-chen12/JobTracker',
    featured: true,
  },
  {
    id: 'ledgerline',
    title: 'LedgerLine',
    description:
      'Personal expense tracking application with intuitive data visualization and category management. Features responsive design and real-time budget tracking.',
    technologies: ['React', 'Chart.js', 'Local Storage', 'CSS3'],
    demoUrl: 'https://expense-tracker-gamma-gules-45.vercel.app',
    githubUrl: 'https://github.com/michael-chen12/ExpenseTracker',
    featured: false,
  },
  {
    id: 'placeholder-1',
    title: 'Coming Soon',
    description: '',
    technologies: [],
    isPlaceholder: true,
    githubUrl: 'https://github.com/michael-chen12',
    featured: false,
  },
  {
    id: 'placeholder-2',
    title: 'Coming Soon',
    description: '',
    technologies: [],
    isPlaceholder: true,
    githubUrl: 'https://github.com/michael-chen12',
    featured: false,
  },
];

export const SKILLS_EXPERIENCE = [
  {
    icon: 'Code2',
    title: 'Frontend Development',
    description:
      'Proficient in React, JavaScript/TypeScript, and modern CSS frameworks. Experienced in building responsive, accessible user interfaces with attention to performance and user experience.',
  },
  {
    icon: 'Database',
    title: 'Full-Stack Capabilities',
    description:
      'Comfortable with Node.js, Express, and MongoDB for backend development. Familiar with RESTful API design, authentication, and database modeling.',
  },
  {
    icon: 'Briefcase',
    title: 'Professional Experience',
    description:
      'Frontend Developer at Memopresso (June 2023 - November 2024). Developed responsive web applications, integrated APIs, and collaborated with cross-functional teams.',
  },
  {
    icon: 'GraduationCap',
    title: 'Education',
    description:
      'B.A. in Information Management from National Taiwan University of Science and Technology.',
  },
];
