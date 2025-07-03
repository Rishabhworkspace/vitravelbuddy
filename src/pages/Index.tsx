
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Car, Globe, Users, Rocket, Zap, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Index = () => {
  const { user } = useAuth();
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    // Random Star Wars quotes Easter Egg
    const quotes = [
      "The Force is strong with this one...",
      "I find your lack of travel disturbing.",
      "Do or do not, there is no try... to find a travel buddy!",
      "These aren't the rides you're looking for... or are they?",
      "Help me Obi-Wan Kenobi, you're my only hope... for a good trip!"
    ];

    // Random chance to show quote
    if (Math.random() < 0.2) {
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
  }, []);

  const triggerDeathStarEasterEgg = () => {
    setShowEasterEgg(true);
    toast.error("That's no moon... it's a space station! 💀", {
      duration: 3000,
    });
    setTimeout(() => setShowEasterEgg(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Death Star Easter Egg */}
      {showEasterEgg && (
        <div className="fixed inset-0 bg-red-900/50 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-6xl animate-pulse">💀</div>
        </div>
      )}

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="mb-6 relative">
            <h1 className="sith-title mb-4 animate-fade-in">VITravelBuddy</h1>
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
              <Sparkles className="w-4 h-4 text-purple-400 animate-bounce" />
              <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
          
          <p className="text-xl md:text-2xl sith-text mb-4 animate-fade-in">
            Find your perfect travel companion across the galaxy
          </p>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8 animate-fade-in">
            Built by VITians from the Dark Side to unite travelers across Earth and beyond.
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/cabbuddy">
              <Button className="lightsaber-glow bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3">
                <Rocket className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={triggerDeathStarEasterEgg}
              className="lightsaber-glow border-purple-600 text-purple-400 hover:bg-purple-600/20 text-lg px-8 py-3"
            >
              <Zap className="w-5 h-5 mr-2" />
              Explore the Force
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Link to="/cabbuddy" className="group">
            <div className="force-card rounded-xl p-8 text-center h-72 flex flex-col justify-center items-center hover:scale-105 transition-all duration-500">
              <div className="relative mb-6">
                <Car className="w-20 h-20 text-red-500 group-hover:text-red-400 transition-colors" />
                <div className="absolute -top-2 -right-2 text-3xl animate-bounce">🚕</div>
              </div>
              <h3 className="text-2xl font-bold sith-text mb-3">CabBuddy</h3>
              <p className="text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                Share rides to airports and stations across the galaxy. Never travel alone when the Empire needs you!
              </p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-red-400 text-sm">→ Join the Squadron</span>
              </div>
            </div>
          </Link>

          <Link to="/tripbuddy" className="group">
            <div className="force-card rounded-xl p-8 text-center h-72 flex flex-col justify-center items-center hover:scale-105 transition-all duration-500">
              <div className="relative mb-6">
                <Globe className="w-20 h-20 text-purple-500 group-hover:text-purple-400 transition-colors" />
                <div className="absolute -top-2 -right-2 text-3xl animate-bounce">🌍</div>
              </div>
              <h3 className="text-2xl font-bold sith-text mb-3">TripBuddy</h3>
              <p className="text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                Plan epic journeys to distant worlds and planets. Explore the unknown territories of the galaxy!
              </p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-purple-400 text-sm">→ Chart New Worlds</span>
              </div>
            </div>
          </Link>

          <Link to="/outingbuddy" className="group">
            <div className="force-card rounded-xl p-8 text-center h-72 flex flex-col justify-center items-center hover:scale-105 transition-all duration-500">
              <div className="relative mb-6">
                <Users className="w-20 h-20 text-blue-500 group-hover:text-blue-400 transition-colors" />
                <div className="absolute -top-2 -right-2 text-3xl animate-bounce">🧍</div>
              </div>
              <h3 className="text-2xl font-bold sith-text mb-3">OutingBuddy</h3>
              <p className="text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                Join local adventures and explore the unknown. The Force is strong in group activities!
              </p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-blue-400 text-sm">→ Unite the Force</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold sith-text mb-6">About VITravelBuddy</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From a galaxy far, far away... actually, from VIT! 🎓 We're a team of Sith Lords and Jedi Masters 
              (also known as computer science students) who got tired of traveling alone to airports at 3 AM. 
              So we built this Death Star... I mean, travel platform! 🚀
            </p>
          </div>

          {/* Mission Statement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold sith-text mb-6">Our Mission</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                To bring balance to the Force... and your travel expenses! 💰 No more paying full cab fares 
                or traveling to distant planets alone. VITravelBuddy connects fellow VITians for shared 
                journeys, epic adventures, and legendary friendships.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Whether you're heading to Chennai airport, planning a trip to Goa, or just want to explore 
                the local cantinas (restaurants), we've got your back!
              </p>
            </div>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">🌟</span>
                </div>
              </div>
            </div>
          </div>

          {/* Journey Timeline */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold sith-text text-center mb-12">Your Journey to the Dark Side</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '1', title: 'List', desc: 'Post your travel plans like a true Sith Lord', icon: '📝', color: 'from-red-600 to-red-400' },
                { step: '2', title: 'Discover', desc: 'Find compatible companions across the galaxy', icon: '🔍', color: 'from-purple-600 to-purple-400' },
                { step: '3', title: 'Join', desc: 'Connect with fellow travelers and rebels', icon: '🤝', color: 'from-blue-600 to-blue-400' },
                { step: '4', title: 'Travel', desc: 'Embark on epic adventures and save credits!', icon: '🚀', color: 'from-green-600 to-green-400' }
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-bold text-red-400 mb-3">{item.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fun Facts */}
          <div className="bg-black/50 rounded-xl p-8 border border-red-600/30">
            <h3 className="text-2xl font-bold sith-text text-center mb-8">Fun Facts from the Empire</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="text-lg font-semibold text-purple-400 mb-2">Lightning Fast</h4>
                <p className="text-gray-300">Find travel companions faster than the Millennium Falcon in hyperspace!</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🛡️</div>
                <h4 className="text-lg font-semibold text-blue-400 mb-2">Rebel-Proof Security</h4>
                <p className="text-gray-300">Your data is more secure than the Death Star plans... wait, that's not saying much!</p>
              </div>
              <div>
                <div className="text-3xl mb-2">💸</div>
                <h4 className="text-lg font-semibold text-green-400 mb-2">Save Credits</h4>
                <p className="text-gray-300">Split costs and save more credits than a Jawa at a droid market!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black border-t border-red-600/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-2">
            Made with ❤️ (and lots of caffeine) by VIT Students
          </p>
          <p className="text-gray-500 text-sm">
            "May the Force be with your travels!" - Master Yoda (probably)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
