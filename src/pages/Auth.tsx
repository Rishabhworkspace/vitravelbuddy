
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(signInData.email, signInData.password);
    
    if (!error) {
      navigate('/');
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    const { error } = await signUp(signUpData.email, signUpData.password, signUpData.name);
    
    if (!error) {
      navigate('/');
    }
    
    setLoading(false);
  };

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <Card className="w-full max-w-md bg-black/80 border-red-600/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl sith-text">Join the Empire</CardTitle>
          <CardDescription className="text-gray-400">
            Use the Force to access VITravelBuddy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Sith Lord Email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                  required
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                />
                <Input
                  type="password"
                  placeholder="Your Dark Secret"
                  value={signInData.password}
                  onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                  required
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full lightsaber-glow bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? 'Entering the Dark Side...' : 'Execute Order 66'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Your Sith Name"
                  value={signUpData.name}
                  onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                  required
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                />
                <Input
                  type="email"
                  placeholder="Empire Email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                  required
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                />
                <Input
                  type="password"
                  placeholder="Create Dark Password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                  required
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                />
                <Input
                  type="password"
                  placeholder="Confirm Dark Password"
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                  required
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full lightsaber-glow bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? 'Joining the Empire...' : 'Become a Sith Lord'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
