import { SanityAbout, SanityCertification, SanityExperience, SanityProject } from './types';

export const CREDLY_PROFILE_URL = 'https://www.credly.com/users/brandonkngill/badges';
export const GITHUB_URL = 'https://github.com/BGill8';
export const LINKEDIN_URL = 'https://linkedin.com/in/brandonkngill';
export const INSTAGRAM_URL = 'https://instagram.com/brandonkngill';
export const CONTACT_EMAIL = 'brandongill9432@gmail.com';

export const DEFAULT_ABOUT: SanityAbout = {
  headline: "Hi, I'm Brandon Gill",
  subheadline: "M.S. in Computer Science (Artificial Intelligence) at Oregon State University",
  bio: "Graduate student in Computer Science at Oregon State University specializing in Artificial Intelligence and Machine Learning. Experienced in building production-ready machine learning pipelines, generative AI solutions, autonomous agents, and scalable web architectures. Passionate about solving high-impact problems through intelligent computing.",
  resumeUrl: "/resume.pdf",
};

export const DEFAULT_CERTIFICATIONS: SanityCertification[] = [
  {
    _id: 'cert-aws-mle',
    title: 'AWS Certified Machine Learning Engineer – Associate',
    issuer: 'Amazon Web Services Training and Certification',
    issueDate: 'Apr 2026',
    expiryDate: 'Apr 2029',
    credlyUrl: 'https://www.credly.com/badges/6e95ecb5-3e4d-4229-84d4-b6bbc85d7c4a',
    localBadgeUrl: '/badges/aws-ml-engineer.png',
    description: 'Demonstrated expertise in developing, deploying, optimizing, and monitoring end-to-end machine learning solutions on AWS. Validates hands-on skills in data pipeline engineering, model training, ML operationalization (MLOps), and cloud security.',
    skills: ['Machine Learning', 'AWS SageMaker', 'MLOps', 'Data Ingestion', 'Model Evaluation', 'Cloud Security'],
    orderRank: 10,
  },
  {
    _id: 'cert-aws-aip',
    title: 'AWS Certified AI Practitioner',
    issuer: 'Amazon Web Services Training and Certification',
    issueDate: 'Feb 2026',
    expiryDate: 'Apr 2029',
    credlyUrl: 'https://www.credly.com/badges/e3e0a8ec-2876-410b-8f93-cd563e9c81ed',
    localBadgeUrl: '/badges/aws-ai-practitioner.png',
    description: 'Validates foundational knowledge of artificial intelligence, machine learning, and generative AI methodologies, responsible AI principles, and AWS AI/ML services ecosystem.',
    skills: ['Artificial Intelligence', 'Generative AI', 'Responsible AI', 'AWS AI Services', 'Foundation Models'],
    orderRank: 20,
  },
  {
    _id: 'cert-gcp-genai',
    title: 'Generative AI Leader Certification',
    issuer: 'Google Cloud',
    issueDate: 'Jan 2026',
    expiryDate: 'Jan 2029',
    credlyUrl: 'https://www.credly.com/badges/f355544e-f740-4f62-9f0b-f220f324585f',
    localBadgeUrl: '/badges/gcp-genai-leader.png',
    description: 'Recognizes strategic and technical understanding of enterprise generative AI adoption, Google Cloud AI infrastructure (Vertex AI), model lifecycle governance, and innovative business transformation.',
    skills: ['Generative AI', 'Google Cloud Platform', 'Vertex AI', 'AI Strategy', 'Enterprise AI Adoption'],
    orderRank: 30,
  },
];

export const DEFAULT_EXPERIENCES: SanityExperience[] = [
  {
    _id: 'exp-osu-grad',
    title: 'Graduate Student & AI Researcher',
    organization: 'Oregon State University',
    location: 'Corvallis, OR',
    dates: '2025 - Present',
    description: [
      'Pursuing Master of Science in Computer Science with a concentration in Artificial Intelligence.',
      'Conducting research in machine learning architectures, agentic AI frameworks, and distributed intelligent systems.',
      'Applying modern deep learning and cloud infrastructure to practical problems in computer science.',
    ],
    skills: ['Artificial Intelligence', 'PyTorch', 'Machine Learning', 'Research', 'Python'],
    orderRank: 10,
  },
  {
    _id: 'exp-osu-undergrad',
    title: 'B.S. in Computer Science (AI Option)',
    organization: 'Oregon State University',
    location: 'Corvallis, OR',
    dates: '2022 - 2025',
    description: [
      'Graduated with honors in Computer Science, specializing in Artificial Intelligence and Algorithms.',
      'Built end-to-end full-stack systems, machine learning models, and participated in collaborative software engineering projects.',
    ],
    skills: ['Computer Science', 'Algorithms', 'Data Structures', 'Full-Stack Development'],
    orderRank: 20,
  },
];

export const DEFAULT_SKILL_CATEGORIES = [
  {
    category: 'AI & Machine Learning',
    skills: [
      'PyTorch',
      'TensorFlow',
      'LLMs & Prompt Engineering',
      'Agentic Systems',
      'Retrieval-Augmented Generation (RAG)',
      'Computer Vision',
      'MLOps & Model Deployment',
      'Hugging Face',
    ],
  },
  {
    category: 'Cloud & Infrastructure',
    skills: [
      'Amazon Web Services (AWS)',
      'Google Cloud Platform (GCP)',
      'AWS SageMaker',
      'Google Vertex AI',
      'Docker & Containerization',
      'CI/CD Pipelines',
      'Linux / Bash',
    ],
  },
  {
    category: 'Languages & Core',
    skills: ['Python', 'TypeScript', 'JavaScript', 'C / C++', 'SQL (PostgreSQL)', 'HTML5 & Modern CSS'],
  },
  {
    category: 'Frameworks & Web Engineering',
    skills: ['Next.js 15', 'React 19', 'Node.js', 'Tailwind CSS', 'RESTful APIs', 'Sanity CMS', 'Git & GitHub'],
  },
];

export const DEFAULT_PROJECTS: SanityProject[] = [
  {
    _id: 'proj-ai-agent',
    title: 'Autonomous Multi-Agent AI Workflow Engine',
    description: 'An advanced orchestrator for cooperative autonomous AI agents executing multi-step reasoning, tool usage, memory management, and structured synthesis across heterogeneous LLM providers.',
    technologies: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'AWS'],
    githubUrl: 'https://github.com/BGill8',
    orderRank: 10,
  },
  {
    _id: 'proj-ml-pipeline',
    title: 'Scalable Cloud Machine Learning Pipeline',
    description: 'Automated ML pipeline for data preprocessing, distributed model training, hyperparameter optimization, and real-time inference endpoint serving on AWS infrastructure.',
    technologies: ['AWS SageMaker', 'Python', 'Docker', 'MLOps', 'PostgreSQL'],
    githubUrl: 'https://github.com/BGill8',
    orderRank: 20,
  },
  {
    _id: 'proj-portfolio',
    title: 'Modern AI Engineer Portfolio & Headless CMS',
    description: 'Executive web portfolio built with Next.js App Router, Tailwind CSS, and Sanity CMS featuring dynamic Credly verification integration and optimized responsive layouts.',
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Sanity CMS'],
    githubUrl: 'https://github.com/BGill8',
    orderRank: 30,
  },
  {
    _id: 'proj-dcf-engine',
    title: 'Bull/Base/Bear DCF Valuation Engine',
    description: 'Interactive 5-year Discounted Cash Flow financial valuation calculator with Yahoo Finance data ingestion, multi-scenario sensitivity modeling, and intrinsic share price estimation.',
    technologies: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Financial Modeling', 'yfinance'],
    githubUrl: 'https://github.com/BGill8',
    liveUrl: '/finance/dcf',
    orderRank: 40,
  },
];
