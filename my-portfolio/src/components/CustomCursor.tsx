"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  // State to track if the cursor is over a "pointer" element (links, buttons, etc.)
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Function to move the cursor
    const onMouseMove = (e: MouseEvent) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    // Functions to handle hover state changes
    const onMouseEnter = () => setIsPointer(true);
    const onMouseLeave = () => setIsPointer(false);

    // Add the main mousemove listener
    window.addEventListener('mousemove', onMouseMove);

    // Select all interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"], .pointer'
    );

    // Add and remove listeners for each interactive element
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    // Cleanup function to remove all listeners when the component unmounts
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Combine class names based on the isPointer state
  const cursorClasses = `custom-cursor ${isPointer ? 'pointer' : ''}`;

  return <div ref={cursorRef} className={cursorClasses} />;
}