"use client"; // Must be a client component to handle state and clicks

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Navbar = () => {
  // 1. Add the paths to your profile pictures here.
  //    Make sure these images are in your `/public` directory.
  const profileImages = [
    '/headshot.jpeg',
    '/stone.jpeg',
    '/mask.JPG',
    '/forehand.jpeg'
  ];

  // 2. State to keep track of which image is currently displayed
  const [imageIndex, setImageIndex] = useState(0);

  // 3. Click handler to cycle to the next image in the array
  const handleImageClick = () => {
    // The modulo operator (%) makes the index loop back to 0 at the end
    setImageIndex((prevIndex) => (prevIndex + 1) % profileImages.length);
  };

  return (
    <nav className="sticky top-0 z-50 p-4 flex justify-between items-center text-white max-w-7xl mx-auto border-b backdrop-blur-lg">
      <div className="flex items-center">
        <Link href="/" className="flex items-center space-x-3">
          {/* We use a <button> for accessibility, as this is an interactive element */}
          <button 
            onClick={handleImageClick} 
            className="w-8 h-8 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Change profile picture"
          >
            <Image
              // The `key` prop is essential. Changing it tells React to treat this
              // as a new element, which re-triggers the CSS animation.
              key={imageIndex}
              src={profileImages[imageIndex]}
              alt="Profile Picture"
              width={32}
              height={32}
              className="object-cover w-full h-full animate-flip-in"
            />
          </button>
          <span className="text-xl font-semibold">Brandon Gill</span>
        </Link>
      </div>
      <div className="flex space-x-6">
        <Link href="#about" className="hover:text-blue-500 transition-colors">
          About
        </Link>
        <Link href="#experience" className="hover:text-blue-500 transition-colors">
          Experience
        </Link>
        <Link href="#projects" className="hover:text-blue-500 transition-colors">
          Projects
        </Link>
        {/* Add your resume link back here */}
      </div>
    </nav>
  );
};

export default Navbar;