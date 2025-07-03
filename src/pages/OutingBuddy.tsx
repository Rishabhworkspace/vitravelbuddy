
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Users, Calendar, MapPin, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Outing {
  id: string;
  outing_type: string;
  destination: string;
  people_count: number;
  meeting_point: string;
  time: string;
  created_by: string;
}

const outingTypes = [
  'Movie', 'Restaurant', 'Shopping', 'Adventure Sports', 'Trekking', 
  'Beach', 'Museum', 'Concert', 'Gaming', 'Study Group', 'Other'
];

const OutingBuddy = () => {
  const { user } = useAuth();
  const [outings, setOutings] = useState<Outing[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [newOuting, setNewOuting] = useState({
    outing_type: '',
    destination: '',
    people_count: 1,
    meeting_point: '',
    time: ''
  });

  const fetchOutings = async () => {
    const { data, error } = await supabase
      .from('outings')
      .select('*')
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching outings:', error);
      toast.error('Failed to fetch outings');
    } else {
      setOutings(data || []);
    }
  };

  useEffect(() => {
    fetchOutings();
  }, []);

  const handleCreateOuting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    const { error } = await supabase
      .from('outings')
      .insert({
        ...newOuting,
        created_by: user.id
      });

    if (error) {
      console.error('Error creating outing:', error);
      toast.error('Failed to create outing');
    } else {
      toast.success('Outing planned successfully! The rebellion grows stronger!');
      setNewOuting({
        outing_type: '',
        destination: '',
        people_count: 1,
        meeting_point: '',
        time: ''
      });
      fetchOutings();
    }
    
    setLoading(false);
  };

  const handleJoinOuting = async (outingId: string) => {
    if (!user) return;

    // Check if already joined
    const { data: existingJoin } = await supabase
      .from('join_requests')
      .select('*')
      .eq('user_id', user.id)
      .eq('listing_type', 'outing')
      .eq('listing_id', outingId)
      .single();

    if (existingJoin) {
      toast.error("You've already joined this rebel mission!");
      return;
    }

    // Add join request
    const { error: joinError } = await supabase
      .from('join_requests')
      .insert({
        user_id: user.id,
        listing_type: 'outing',
        listing_id: outingId
      });

    if (joinError) {
      console.error('Error joining outing:', joinError);
      toast.error('Failed to join outing');
      return;
    }

    toast.success("Welcome to the rebel alliance!");
    fetchOutings();
  };

  const handleDeleteOuting = async (outingId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('outings')
      .delete()
      .eq('id', outingId)
      .eq('created_by', user.id);

    if (error) {
      console.error('Error deleting outing:', error);
      toast.error('Failed to execute Order 66');
    } else {
      toast.success('Execute Order 66 - Mission terminated!');
      fetchOutings();
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/">
              <Button variant="outline" className="lightsaber-glow bg-black/50 border-blue-600 text-white hover:bg-blue-600/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Base
              </Button>
            </Link>
            <h1 className="text-4xl font-bold sith-text">🧍 OutingBuddy</h1>
          </div>

          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900 mb-8">
              <TabsTrigger value="browse">Choose Adventure</TabsTrigger>
              <TabsTrigger value="create">Plan Mission</TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {outings.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                    <p className="text-xl text-gray-400 mb-2">No rebel missions planned</p>
                    <p className="text-gray-500">Be the first to organize an adventure!</p>
                  </div>
                ) : (
                  outings.map((outing) => (
                    <Card key={outing.id} className="force-card border-blue-600/30 bg-black/80">
                      <CardHeader>
                        <CardTitle className="text-blue-400">{outing.outing_type}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-4 h-4 mr-2" />
                          {outing.destination}
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Users className="w-4 h-4 mr-2" />
                          {outing.people_count} rebels needed
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Activity className="w-4 h-4 mr-2" />
                          Meet at: {outing.meeting_point}
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(outing.time).toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleJoinOuting(outing.id)}
                            disabled={outing.created_by === user?.id}
                            className="flex-1 lightsaber-glow bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                          >
                            {outing.created_by === user?.id ? 'Your Mission' : 'Join Rebellion'}
                          </Button>
                          {outing.created_by === user?.id && (
                            <Button 
                              onClick={() => handleDeleteOuting(outing.id)}
                              variant="destructive"
                              className="lightsaber-glow"
                            >
                              Order 66
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="create">
              <Card className="max-w-2xl mx-auto force-card border-blue-600/30 bg-black/80">
                <CardHeader>
                  <CardTitle className="text-center sith-text">Plan Your Rebel Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateOuting} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Mission Type</label>
                        <Select value={newOuting.outing_type} onValueChange={(value) => setNewOuting({...newOuting, outing_type: value})}>
                          <SelectTrigger className="bg-gray-900 border-gray-700">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {outingTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Target Location</label>
                        <Input
                          placeholder="Where to?"
                          value={newOuting.destination}
                          onChange={(e) => setNewOuting({...newOuting, destination: e.target.value})}
                          required
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Rebels Needed</label>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          value={newOuting.people_count}
                          onChange={(e) => setNewOuting({...newOuting, people_count: parseInt(e.target.value)})}
                          required
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Mission Time</label>
                        <Input
                          type="datetime-local"
                          value={newOuting.time}
                          onChange={(e) => setNewOuting({...newOuting, time: e.target.value})}
                          required
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Meeting Point</label>
                      <Input
                        placeholder="Where to gather the troops?"
                        value={newOuting.meeting_point}
                        onChange={(e) => setNewOuting({...newOuting, meeting_point: e.target.value})}
                        required
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full lightsaber-glow bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loading ? 'Organizing Rebellion...' : 'Launch Rebel Mission'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OutingBuddy;
