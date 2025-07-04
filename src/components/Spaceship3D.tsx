
import { useEffect, useState } from 'react';

const Spaceship3D = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calculate relative position from center (-1 to 1)
      const x = (e.clientX - centerX) / centerX;
      const y = (e.clientY - centerY) / centerY;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const spaceshipStyle = {
    transform: `
      translate(-50%, -50%) 
      rotateY(${mousePosition.x * 15}deg) 
      rotateX(${-mousePosition.y * 10}deg) 
      translateZ(${Math.abs(mousePosition.x) * 20 + Math.abs(mousePosition.y) * 20}px)
      translateX(${mousePosition.x * 20}px)
      translateY(${mousePosition.y * 20}px)
    `,
  };

  return (
    <div className="spaceship-container">
      <div className="spaceship" style={spaceshipStyle}>
        <div className="spaceship-body">
          <div className="spaceship-wing top"></div>
          <div className="spaceship-wing bottom"></div>
          <div className="spaceship-engine"></div>
          <div className="spaceship-cockpit"></div>
          <div className="spaceship-trail"></div>
        </div>
      </div>
    </div>
  );
};

export default Spaceship3D;
