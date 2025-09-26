export type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string; // Path to your project screenshot/image
  githubUrl?: string;
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    id: 'beaverhacks-web-design',
    title: 'BeaverHacks Web Design',
    description: 'A responsive full-stack web application built during the BeaverHacks event. This project showcases my ability to work on a tight deadline and deliver a functional, well-designed product using a modern tech stack.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    imageUrl: '/projects/beaverhacks.png', 
    githubUrl: 'https://github.com/yourusername/beaverhacks-project',
    liveUrl: 'https://beaverhacks-project.vercel.app',
  },
  {
    id: 'my-portfolio-website',
    title: 'My Portfolio Website',
    description: 'The very website you are viewing! This project was created to demonstrate a professional and elegant solution for showcasing my skills and projects, built from scratch with a focus on clean code and performance, using a modern tech stack.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    imageUrl: '/projects/portfolio.png',
    githubUrl: 'https://github.com/yourusername/my-portfolio',
    liveUrl: 'https://my-portfolio.vercel.app',
  },
  {
    id: 'internship-tool',
    title: 'Internal Management Tool',
    description: 'Developed a critical internal management tool during my volunteer internship. This involved implementing complex data visualizations and user authentication, significantly improving operational efficiency.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'API Integration'],
    imageUrl: '/projects/internship-tool.png',
    githubUrl: 'https://github.com/yourusername/internship-tool',
  },
  // Add more projects as needed
];