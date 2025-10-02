import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 p-4 flex justify-between items-center text-white max-w-7xl mx-auto border-b backdrop-blur-lg">
      <div className="flex items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-600 rounded-lg" />
          <span className="text-xl font-semibold">Brandon Gill</span>
        </Link>
      </div>
      <div className="flex space-x-6">
        <Link href="/about" className="hover:text-blue-500 transition-colors">
          About Me
        </Link>
        <a href="https://linkedin.com/in/brandonkngill" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
          LinkedIn
        </a>
        <a href="/path-to-your-resume.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
          Resume
        </a>
      </div>
    </nav>
  );
};

export default Navbar;