import { About, Certification, Experience, Project } from './types';

export const CREDLY_PROFILE_URL = 'https://www.credly.com/users/brandonkngill/badges';
export const GITHUB_URL = 'https://github.com/BGill8';
export const LINKEDIN_URL = 'https://linkedin.com/in/brandonkngill';
export const INSTAGRAM_URL = 'https://instagram.com/brandonkngill';
export const CONTACT_EMAIL = 'brandongill9432@gmail.com';

export const DEFAULT_ABOUT: About = {
  headline: "Brandon Gill",
  subheadline: "M.S. in Computer Science (Artificial Intelligence) at Oregon State University",
  bio: "Graduate student at Oregon State University specializing in Machine Learning and Artificial Intelligence. Building scalable autonomous agent workflows, distributed LLM orchestration pipelines, and cloud-native infrastructure.",
  resumeUrl: "/resume.pdf",
};

export const DEFAULT_CERTIFICATIONS: Certification[] = [
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

export const DEFAULT_EXPERIENCES: Experience[] = [
  {
    _id: 'exp-seed-ai',
    title: 'Artificial Intelligence Engineer Intern',
    organization: 'Seed-AI — Oregon State University',
    location: 'Corvallis, OR',
    dates: 'Feb 2026 – Present',
    description: [
      'Architected a Human-in-the-Loop (HITL) web application using FastAPI for an agricultural sorting pipeline, enabling domain experts to review automated seed trays, identify misclassifications, and seamlessly append corrected labels to active training datasets.',
      'Integrated foundation vision models (YOLO, SAM 2.1) with a modular database retrieval engine designed with decoupled adapters to fetch regulatory restrictions and physical identification metrics for verified seed species.',
    ],
    skills: ['FastAPI', 'Python', 'YOLO', 'SAM 2.1', 'Computer Vision', 'HITL', 'MLOps'],
    orderRank: 1,
  },
  {
    _id: 'exp-osu-research',
    title: 'HPC & AI Student Researcher',
    organization: 'Oregon State University – College of Engineering',
    location: 'Corvallis, OR',
    dates: 'Sept 2025 – June 2026',
    description: [
      'Built an automated pipeline to translate proprietary HPC kernels (CUDA) to modern parallel standards (OpenMP) using open-weight LLMs using zero shot prompting.',
      'Engineered an agentic feedback loop that parses compiler error logs to autonomously prompt the LLM for repairs, reducing manual debugging time by approx. 60%.',
      'Validated translation integrity against the HeCBench suite, implementing automated testing for semantic correctness and syntactic similarity.',
    ],
    skills: ['CUDA', 'OpenMP', 'LLMs', 'PyTorch', 'C/C++', 'Bash', 'Agentic Systems', 'HPC'],
    orderRank: 2,
  },
  {
    _id: 'exp-beaverhacks',
    title: 'Full Stack Developer',
    organization: 'Beaverhacks',
    location: 'Corvallis, OR',
    dates: 'May 2025 – Present',
    description: [
      'Optimized API endpoints and database queries within a 5-person Agile team, handling a 10x traffic spike with sub-200ms latency.',
      'Developed dynamic, role-based dashboards using Next.js and TypeScript, reducing administrative project management time by 50% through automated workflows.',
      "Engineered a full-stack web portal for Oregon State's BeaverHacks program, utilizing Next.js, React, and PostgreSQL for submissions and scoring.",
    ],
    skills: ['Next.js', 'TypeScript', 'React', 'PostgreSQL', 'Tailwind CSS', 'Agile'],
    orderRank: 3,
  },
  {
    _id: 'exp-eco-rep',
    title: 'Eco Representative',
    organization: 'Oregon State University',
    location: 'Corvallis, OR',
    dates: 'Oct 2024 – June 2025',
    description: [
      'Served as the primary sustainability leader for an on-campus community of 200+ residents, driving engagement through educational outreach and program management as part of a university-wide team that achieved over 14,000 student interactions.',
      'Established a tennis ball recycling program on campus that saved over 110 pounds of tennis balls from landfills.',
    ],
    skills: ['Leadership', 'Program Management', 'Community Outreach', 'Sustainability'],
    orderRank: 4,
  },
  {
    _id: 'exp-tennis-coach',
    title: 'Tennis Coach',
    organization: 'Eugene Swim and Tennis Club',
    location: 'Eugene, OR',
    dates: 'June 2023 – Sept 2023',
    description: [
      'Instructed youth athletes aged 4-17 in fundamental tennis mechanics, on-court mentality, and physical fitness in a dynamic summer camp environment.',
    ],
    skills: ['Coaching', 'Athletics Instruction', 'Mentorship', 'Communication'],
    orderRank: 5,
  },
];

export const DEFAULT_SKILL_CATEGORIES = [
  {
    category: 'Core',
    skills: [
      'Python',
      'TypeScript',
      'C++',
      'JavaScript',
      'Next.js',
      'React',
      'Git',
      'SQL',
      'NumPy',
      'Prisma ORM',
      'HTML',
      'CSS',
      'Tailwind CSS',
      'Matplotlib',
      'Figma',
      'R',
      'MongoDB',
    ],
  },
  {
    category: 'AI / Machine Learning & HPC',
    skills: [
      'PyTorch',
      'Computer Vision (SAM, YOLO, U-Net)',
      'Transformers',
      'LLMs',
      'OpenMP',
      'CUDA',
      'Slurm',
      'FastAPI',
      'Albumentations',
    ],
  },
  {
    category: 'Cloud & Infrastructure',
    skills: [
      'Amazon Web Services (AWS)',
      'Google Cloud Platform (GCP)',
      'AWS SageMaker',
      'Google Vertex AI',
      'Docker',
      'CI/CD Pipelines',
      'Linux / Bash',
    ],
  },
  {
    category: 'Full Stack & Database',
    skills: [
      'Next.js 15',
      'React 19',
      'Node.js',
      'Express.js',
      'PostgreSQL',
      'MongoDB',
      'Prisma ORM',
      'RESTful APIs',
    ],
  },
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    _id: 'proj-beaverhacks-gallery',
    title: 'Beaverhacks Project Gallery',
    description: 'Project gallery for present and past hackathons for beaverhacks - the hackathon club at Oregon State University.',
    technologies: ['TypeScript', 'React', 'TailwindCSS', 'Next.js'],
    githubUrl: 'https://github.com/OregonStateHackathonClub/judge',
    liveUrl: 'https://judge-phi.vercel.app/2026',
    orderRank: 1,
  },
  {
    _id: 'proj-hpc-migration',
    title: 'LLM-Driven HPC Migration Pipeline (Capstone)',
    description: "This project focused on modernizing High-Performance Computing code by building a pipeline that leverages open-source LLMs to translate legacy CUDA kernels into OpenMP. The key innovation was the implementation of an 'agentic feedback loop'—rather than a single-pass generation, the system attempts compilation, captures errors, and feeds them back to the LLM for autonomous self-correction. Results were validated against the HeCBench suite to ensure mathematical accuracy across diverse scientific domains.",
    technologies: ['Prompt Engineering', 'LLM Fine-Tuning', 'Bash', 'CUDA to OpenMP Translation', 'LLM-Evaluation'],
    githubUrl: 'https://github.com/ANSWER-OSU/LLM-Code-Migration',
    orderRank: 2,
  },
  {
    _id: 'proj-nuclei-segmentation',
    title: 'Automatic Cell Nuclei Instance Segmentation',
    description: 'Engineered a custom multi-task U-Net architecture from scratch to perform automated instance segmentation, simultaneously predicting semantic footprints and spatial distance maps across 670 microscopy images and 20,000+ individual nucleus masks. Combined a compound loss function (BCE, Dice, MSE) with Marker-Controlled Watershed post-processing to separate dense overlapping cellular structures, placing in the 72nd percentile of the 2018 Data Science Bowl.',
    technologies: ['Python', 'PyTorch', 'Multi-Task Learning', 'U-Net', 'Computer Vision'],
    githubUrl: 'https://github.com/BGill8',
    orderRank: 3,
  },
  {
    _id: 'proj-beaver-notes',
    title: 'Beaver Notes - AI Notes Converter',
    description: "For my teams' submission to BeaverHacks 2025, we created Beaver Notes! Beaver Notes is an AI-enhanced note-taking tool that allows the student to focus on learning the material, rather than scrambling to write everything that the professor spoke about.",
    technologies: ['Google Gemini API', 'RestAPI', 'JavaScript', 'HTML', 'CSS', 'MongoDB'],
    githubUrl: 'https://github.com/BGill8/beavernotes-ai-notetaking',
    liveUrl: 'https://www.youtube.com/watch?v=O1jytnXywMQ&t=2s',
    orderRank: 4,
  },
  {
    _id: 'proj-multiplayer-mafia',
    title: 'Multiplayer Mafia Web Game',
    description: 'As part of a four-person team, I engineered a real-time multiplayer version of the party game "Mafia" using NodeJS, Handlebars, and Socket.io. The application implements a turn-based state machine for special roles like the Mafia, Doctor, and Sheriff, and features a live chat and voting system for all players to deduce and eliminate the hidden Mafia.',
    technologies: ['JavaScript', 'Handlebars', 'CSS', 'Node.js', 'Socket.io'],
    githubUrl: 'https://github.com/osu-cs290-f24/final-project-the-mafia',
    orderRank: 5,
  },
  {
    _id: 'proj-portfolio',
    title: 'Personal Portfolio Website',
    description: 'I wanted to create a website where I could show my projects off, refine my web development skills, and create something awesome from scratch. This is the website you are currently viewing :)',
    technologies: ['Next.js', 'TypeScript', 'TailwindCSS', 'Vercel', 'CI/CD'],
    githubUrl: 'https://github.com/BGill8/portfolio-website',
    liveUrl: 'https://www.brandongill.dev/',
    orderRank: 6,
  },
];

