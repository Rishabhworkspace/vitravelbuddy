import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Car, Globe, Users, Rocket, Zap, Star, Sparkles, Orbit, Atom, Satellite } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Index = () => {
  const { user } = useAuth();
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Random Star Wars quotes Easter Egg
    const quotes = [
      "The Force is strong with this one...",
      "I find your lack of travel disturbing.",
      "Do or do not, there is no try... to find a travel buddy!",
      "These aren't the rides you're looking for... or are they?",
      "Help me Obi-Wan Kenobi, you're my only hope... for a good trip!",
      "Your journey to the dark side of travel begins now...",
      "The Imperial Fleet awaits your command, young Padawan!",
      "Join the Rebellion... against expensive solo travel!"
    ];

    // Random chance to show quote
    if (Math.random() < 0.3) {
      setTimeout(() => {
        toast(quotes[Math.floor(Math.random() * quotes.length)], {
          duration: 4000,
        });
      }, 2000);
    }

    // Special date Easter Eggs
    const today = new Date();
    if (today.getMonth() === 4 && today.getDate() === 4) { // May 4th
      toast.success("🌟 May the Fourth be with you! 🌟");
    }

    if (today.getMonth() === 4 && today.getDate() === 25) { // May 25th (Star Wars Day)
      toast.success("🚀 Happy Star Wars Day! The adventure begins! 🚀");
    }

    // Mouse tracking for 3D effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Update CSS custom properties for card hover effects
      document.documentElement.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`);
    };

    // Parallax scroll effect
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        parallaxRef.current.style.transform = `translate3d(0, ${rate}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const triggerDeathStarEasterEgg = () => {
    setShowEasterEgg(true);
    toast.error("That's no moon... it's a space station! 💀", {
      duration: 3000,
    });
    setTimeout(() => setShowEasterEgg(false), 3000);
  };

  const triggerForceEasterEgg = () => {
    toast.success("🌟 You have unlocked the Force! Use it wisely, young Padawan. 🌟", {
      duration: 4000,
    });
    // Add screen flash effect
    document.body.style.background = 'radial-gradient(circle, rgba(0,123,255,0.3) 0%, transparent 70%)';
    setTimeout(() => {
      document.body.style.background = '';
    }, 200);
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Death Star Easter Egg with 3D effect */}
      {showEasterEgg && (
        <div className="fixed inset-0 bg-red-900/50 flex items-center justify-center z-50 pointer-events-none">
          <div className="death-star-3d"></div>
        </div>
      )}

      {/* Parallax Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 parallax-container" ref={parallaxRef}>
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="mb-6 relative">
            <h1 className="sith-title mb-4 animate-fade-in-3d">VITravelBuddy</h1>
            <div className="flex justify-center items-center space-x-4 mb-6">
              <Star className="w-8 h-8 text-yellow-400 animate-pulse floating-element" />
              <Sparkles className="w-6 h-6 text-purple-400 animate-bounce floating-element" />
              <Orbit className="w-8 h-8 text-blue-400 interactive-3d" />
              <Sparkles className="w-6 h-6 text-purple-400 animate-bounce floating-element" />
              <Star className="w-8 h-8 text-yellow-400 animate-pulse floating-element" />
            </div>
          </div>
          
          <p className="text-xl md:text-2xl sith-text mb-4 animate-fade-in-3d hologram-effect">
            Find your perfect travel companion across the galaxy
          </p>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8 animate-fade-in-3d">
            Built by VITians from the Dark Side to unite travelers across Earth and beyond.
          </p>

          {/* Enhanced Call to Action with 3D effects */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link to="/cabbuddy">
              <Button className="lightsaber-glow bg-red-600 hover:bg-red-700 text-white text-lg px-10 py-4 interactive-3d">
                <Rocket className="w-6 h-6 mr-3" />
                Start Your Journey
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={triggerDeathStarEasterEgg}
              className="lightsaber-glow border-purple-600 text-purple-400 hover:bg-purple-600/20 text-lg px-10 py-4 interactive-3d"
            >
              <Zap className="w-6 h-6 mr-3" />
              Explore the Force
            </Button>
            <Button 
              variant="ghost" 
              onClick={triggerForceEasterEgg}
              className="lightsaber-glow text-blue-400 hover:bg-blue-600/20 text-lg px-10 py-4 interactive-3d"
            >
              <Atom className="w-6 h-6 mr-3" />
              Unlock Powers
            </Button>
          </div>
        </div>

        {/* Enhanced 3D Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto mb-20">
          <Link to="/cabbuddy" className="group">
            <div className="force-card rounded-xl p-10 text-center h-80 flex flex-col justify-center items-center transition-all duration-700">
              <div className="relative mb-8">
                <Car className="w-24 h-24 text-red-500 group-hover:text-red-400 transition-colors floating-element" />
                <div className="absolute -top-3 -right-3 text-4xl animate-bounce">🚕</div>
                <Satellite className="absolute -bottom-2 -left-2 w-6 h-6 text-yellow-400 floating-element" />
              </div>
              <h3 className="text-3xl font-bold sith-text mb-4">CabBuddy</h3>
              <p className="text-gray-300 group-hover:text-white transition-colors leading-relaxed text-lg">
                Share rides to airports and stations across the galaxy. Never travel alone when the Empire needs you!
              </p>
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                <span className="text-red-400 text-lg font-semibold">→ Join the Squadron</span>
              </div>
            </div>
          </Link>

          <Link to="/tripbuddy" className="group">
            <div className="force-card rounded-xl p-10 text-center h-80 flex flex-col justify-center items-center transition-all duration-700">
              <div className="relative mb-8">
                <Globe className="w-24 h-24 text-purple-500 group-hover:text-purple-400 transition-colors floating-element" />
                <div className="absolute -top-3 -right-3 text-4xl animate-bounce">🌍</div>
                <Orbit className="absolute -bottom-2 -left-2 w-6 h-6 text-blue-400 floating-element" />
              </div>
              <h3 className="text-3xl font-bold sith-text mb-4">TripBuddy</h3>
              <p className="text-gray-300 group-hover:text-white transition-colors leading-relaxed text-lg">
                Plan epic journeys to distant worlds and planets. Explore the unknown territories of the galaxy!
              </p>
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                <span className="text-purple-400 text-lg font-semibold">→ Chart New Worlds</span>
              </div>
            </div>
          </Link>

          <Link to="/outingbuddy" className="group">
            <div className="force-card rounded-xl p-10 text-center h-80 flex flex-col justify-center items-center transition-all duration-700">
              <div className="relative mb-8">
                <Users className="w-24 h-24 text-blue-500 group-hover:text-blue-400 transition-colors floating-element" />
                <div className="absolute -top-3 -right-3 text-4xl animate-bounce">🧍</div>
                <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-purple-400 floating-element" />
              </div>
              <h3 className="text-3xl font-bold sith-text mb-4">OutingBuddy</h3>
              <p className="text-gray-300 group-hover:text-white transition-colors leading-relaxed text-lg">
                Join local adventures and explore the unknown. The Force is strong in group activities!
              </p>
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                <span className="text-blue-400 text-lg font-semibold">→ Unite the Force</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-black via-gray-900 to-black relative overflow-hidden">
        {/* Floating 3D elements in background */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-red-500 rounded-full floating-element opacity-30"></div>
        <div className="absolute top-1/3 right-20 w-6 h-2 bg-blue-400 rounded-full floating-element opacity-40"></div>
        <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-purple-500 rounded-full floating-element opacity-50"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold sith-text mb-8 interactive-3d">About VITravelBuddy</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed hologram-effect">
              From a galaxy far, far away... actually, from VIT! 🎓 We're a team of Sith Lords and Jedi Masters 
              (also known as computer science students) who got tired of traveling alone to airports at 3 AM. 
              So we built this Death Star... I mean, travel platform! 🚀
            </p>
          </div>

          {/* Enhanced Mission Statement with 3D effects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="interactive-3d">
              <h3 className="text-4xl font-bold sith-text mb-8">Our Mission</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 hologram-effect">
                To bring balance to the Force... and your travel expenses! 💰 No more paying full cab fares 
                or traveling to distant planets alone. VITravelBuddy connects fellow VITians for shared 
                journeys, epic adventures, and legendary friendships.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Whether you're heading to Chennai airport, planning a trip to Goa, or just want to explore 
                the local cantinas (restaurants), we've got your back!
              </p>
            </div>
            <div className="text-center relative">
              <div className="relative inline-block interactive-3d">
                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 rounded-full opacity-30 animate-pulse-glow-3d"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl floating-element">🌟</span>
                </div>
                {/* Orbiting elements */}
                <div className="absolute top-1/4 right-0 w-4 h-4 bg-yellow-400 rounded-full floating-element"></div>
                <div className="absolute bottom-1/4 left-0 w-3 h-3 bg-red-400 rounded-full floating-element"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Journey Timeline with 3D transformations */}
          <div className="mb-20">
            <h3 className="text-4xl font-bold sith-text text-center mb-16 interactive-3d">Your Journey to the Dark Side</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { step: '1', title: 'List', desc: 'Post your travel plans like a true Sith Lord', icon: '📝', color: 'from-red-600 to-red-400' },
                { step: '2', title: 'Discover', desc: 'Find compatible companions across the galaxy', icon: '🔍', color: 'from-purple-600 to-purple-400' },
                { step: '3', title: 'Join', desc: 'Connect with fellow travelers and rebels', icon: '🤝', color: 'from-blue-600 to-blue-400' },
                { step: '4', title: 'Travel', desc: 'Embark on epic adventures and save credits!', icon: '🚀', color: 'from-green-600 to-green-400' }
              ].map((item, index) => (
                <div key={index} className="text-center group interactive-3d">
                  <div className={`w-24 h-24 mx-auto mb-8 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-4xl transform group-hover:scale-125 transition-all duration-500 floating-element`}>
                    {item.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-red-400 mb-4 sith-text">{item.title}</h4>
                  <p className="text-gray-400 leading-relaxed text-lg">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Fun Facts with 3D cards */}
          <div className="force-card rounded-2xl p-12 border border-red-600/40 interactive-3d">
            <h3 className="text-3xl font-bold sith-text text-center mb-12">Fun Facts from the Empire</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              <div className="interactive-3d group">
                <div className="text-5xl mb-4 floating-element">⚡</div>
                <h4 className="text-xl font-semibold text-purple-400 mb-4 sith-text">Lightning Fast</h4>
                <p className="text-gray-300 group-hover:text-white transition-colors">Find travel companions faster than the Millennium Falcon in hyperspace!</p>
              </div>
              <div className="interactive-3d group">
                <div className="text-5xl mb-4 floating-element">🛡️</div>
                <h4 className="text-xl font-semibold text-blue-400 mb-4 sith-text">Rebel-Proof Security</h4>
                <p className="text-gray-300 group-hover:text-white transition-colors">Your data is more secure than the Death Star plans... wait, that's not saying much!</p>
              </div>
              <div className="interactive-3d group">
                <div className="text-5xl mb-4 floating-element">💸</div>
                <h4 className="text-xl font-semibold text-green-400 mb-4 sith-text">Save Credits</h4>
                <p className="text-gray-300 group-hover:text-white transition-colors">Split costs and save more credits than a Jawa at a droid market!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer with 3D effects */}
      <footer className="py-12 px-4 bg-black border-t border-red-600/30 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 animate-pulse-glow-3d"></div>
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-3 text-lg hologram-effect">
            Made with ❤️ (and lots of caffeine) by VIT Students
          </p>
          <p className="text-gray-500 interactive-3d">
            "May the Force be with your travels!" - Master Yoda (probably)
          </p>
          {/* Floating footer elements */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-red-400 rounded-full floating-element opacity-60"></div>
          <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full floating-element opacity-60"></div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
