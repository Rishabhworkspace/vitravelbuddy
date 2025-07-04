
import { useEffect, useState } from 'react';

interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ParallaxContainer = ({ children, className = "" }: ParallaxContainerProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      className={`parallax-container ${className}`}
      style={{
        transform: `
          translate3d(${mousePosition.x * 2}px, ${mousePosition.y * 2}px, 0) 
          rotateX(${mousePosition.y * 0.5}deg) 
          rotateY(${mousePosition.x * 0.5}deg)
        `,
        transformStyle: 'preserve-3d'
      }}
    >
      <div 
        className="parallax-layer parallax-back"
        style={{
          transform: `translateZ(-100px) translateY(${scrollY * 0.1}px) scale(1.1)`
        }}
      />
      <div 
        className="parallax-layer parallax-mid"
        style={{
          transform: `translateZ(-50px) translateY(${scrollY * 0.05}px) scale(1.05)`
        }}
      />
      <div 
        className="parallax-layer parallax-front"
        style={{
          transform: `translateZ(0) translateY(${scrollY * 0.02}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ParallaxContainer;
