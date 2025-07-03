
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Car, Globe, Users, LogIn, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      {/* Header */}
      <div className="absolute top-6 right-6">
        {user ? (
          <Link to="/dashboard">
            <Button variant="outline" className="lightsaber-glow bg-black/50 border-red-600 text-white hover:bg-red-600/20">
              <User className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/auth">
            <Button variant="outline" className="lightsaber-glow bg-black/50 border-red-600 text-white hover:bg-red-600/20">
              <LogIn className="w-4 h-4 mr-2" />
              Join the Empire
            </Button>
          </Link>
        )}
      </div>

      {/* Main Content */}
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <h1 className="sith-title mb-6">VITravelBuddy</h1>
        <p className="text-xl md:text-2xl sith-text mb-4">
          Find your perfect travel companion across the galaxy
        </p>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Built by VITians from the Dark Side to unite travelers across Earth and beyond.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        <Link to="/cabbuddy" className="group">
          <div className="force-card rounded-xl p-8 text-center h-64 flex flex-col justify-center items-center">
            <Car className="w-16 h-16 mb-4 text-red-500 group-hover:text-red-400 transition-colors" />
            <h3 className="text-2xl font-bold sith-text mb-2">🚕 CabBuddy</h3>
            <p className="text-gray-300 group-hover:text-white transition-colors">
              Share rides to airports and stations across the galaxy
            </p>
          </div>
        </Link>

        <Link to="/tripbuddy" className="group">
          <div className="force-card rounded-xl p-8 text-center h-64 flex flex-col justify-center items-center">
            <Globe className="w-16 h-16 mb-4 text-purple-500 group-hover:text-purple-400 transition-colors" />
            <h3 className="text-2xl font-bold sith-text mb-2">🌍 TripBuddy</h3>
            <p className="text-gray-300 group-hover:text-white transition-colors">
              Plan epic journeys to distant worlds and planets
            </p>
          </div>
        </Link>

        <Link to="/outingbuddy" className="group">
          <div className="force-card rounded-xl p-8 text-center h-64 flex flex-col justify-center items-center">
            <Users className="w-16 h-16 mb-4 text-blue-500 group-hover:text-blue-400 transition-colors" />
            <h3 className="text-2xl font-bold sith-text mb-2">🧍 OutingBuddy</h3>
            <p className="text-gray-300 group-hover:text-white transition-colors">
              Join local adventures and explore the unknown
            </p>
          </div>
        </Link>
      </div>

      {/* About Timeline */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold sith-text text-center mb-8">Your Journey to the Dark Side</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'List', desc: 'Post your travel plans', icon: '📝' },
            { step: '2', title: 'Discover', desc: 'Find compatible companions', icon: '🔍' },
            { step: '3', title: 'Join', desc: 'Connect with fellow travelers', icon: '🤝' },
            { step: '4', title: 'Travel', desc: 'Embark on epic adventures', icon: '🚀' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-600 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-red-400 mb-2">{item.title}</h4>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
