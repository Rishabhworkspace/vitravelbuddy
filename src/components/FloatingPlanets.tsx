
import { useEffect, useState } from 'react';

const FloatingPlanets = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="floating-planets-container">
      {/* Large Planet */}
      <div 
        className="floating-planet planet-1"
        style={{
          transform: `translate3d(${mousePosition.x * 10}px, ${mousePosition.y * 15}px, 0) rotateY(${mousePosition.x * 20}deg)`
        }}
      />
      
      {/* Medium Planet */}
      <div 
        className="floating-planet planet-2"
        style={{
          transform: `translate3d(${mousePosition.x * -8}px, ${mousePosition.y * -12}px, 0) rotateX(${mousePosition.y * 15}deg)`
        }}
      />
      
      {/* Small Planet */}
      <div 
        className="floating-planet planet-3"
        style={{
          transform: `translate3d(${mousePosition.x * 6}px, ${mousePosition.y * 8}px, 0) rotate(${mousePosition.x * 10}deg)`
        }}
      />
      
      {/* Asteroid Belt */}
      <div className="asteroid-belt">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="asteroid"
            style={{
              animationDelay: `${i * 0.5}s`,
              transform: `translate3d(${mousePosition.x * (i % 2 ? 3 : -3)}px, ${mousePosition.y * (i % 2 ? 2 : -2)}px, 0)`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FloatingPlanets;
