
import { useEffect, useRef } from 'react';

const Starfield = () => {
  const starfieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (starfieldRef.current) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        // Calculate parallax offset based on mouse position
        const xOffset = (clientX - innerWidth / 2) / innerWidth * 20;
        const yOffset = (clientY - innerHeight / 2) / innerHeight * 20;
        
        starfieldRef.current.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) perspective(1000px)`;
      }
    };

    const handleScroll = () => {
      if (starfieldRef.current) {
        const scrollY = window.scrollY;
        // Create parallax scrolling effect
        starfieldRef.current.style.transform = `translate3d(0, ${scrollY * 0.5}px, 0) perspective(1000px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="starfield" ref={starfieldRef}>
      <div className="stars"></div>
      {/* Add floating space debris */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-400 rounded-full floating-element opacity-60"></div>
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full floating-element opacity-80"></div>
      <div className="absolute top-1/2 left-3/4 w-3 h-1 bg-gray-300 rounded-full floating-element opacity-40"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-2 bg-blue-400 rounded-full floating-element opacity-70"></div>
      <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-red-400 rounded-full floating-element opacity-50"></div>
    </div>
  );
};

export default Starfield;
