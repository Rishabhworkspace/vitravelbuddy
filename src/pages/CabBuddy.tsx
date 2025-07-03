
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Car, Users, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/ProtectedRoute';

interface CabRide {
  id: string;
  from_location: string;
  to_location: string;
  datetime: string;
  seats: number;
  vehicle_type: string;
  contact: string;
  status: string;
  created_by: string;
}

const CabBuddy = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState<CabRide[]>([]);
  const [loading, setLoading] = useState(false);
  const [rideType, setRideType] = useState<'airport' | 'station'>('airport');
  
  const [newRide, setNewRide] = useState({
    from_location: '',
    to_location: '',
    datetime: '',
    seats: 1,
    vehicle_type: '',
    contact: ''
  });

  const fetchRides = async () => {
    const { data, error } = await supabase
      .from('cab_rides')
      .select('*')
      .eq('status', 'Open')
      .order('datetime', { ascending: true });

    if (error) {
      console.error('Error fetching rides:', error);
      toast.error('Failed to fetch rides');
    } else {
      setRides(data || []);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleCreateRide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    const { error } = await supabase
      .from('cab_rides')
      .insert({
        ...newRide,
        created_by: user.id,
        to_location: rideType === 'airport' ? 'Airport' : 'Railway Station'
      });

    if (error) {
      console.error('Error creating ride:', error);
      toast.error('Failed to create ride');
    } else {
      toast.success('Ride listed successfully! May the Force be with you!');
      setNewRide({
        from_location: '',
        to_location: '',
        datetime: '',
        seats: 1,
        vehicle_type: '',
        contact: ''
      });
      fetchRides();
    }
    
    setLoading(false);
  };

  const handleJoinRide = async (rideId: string, currentSeats: number) => {
    if (!user) return;

    // Check if already joined
    const { data: existingJoin } = await supabase
      .from('join_requests')
      .select('*')
      .eq('user_id', user.id)
      .eq('listing_type', 'cab')
      .eq('listing_id', rideId)
      .single();

    if (existingJoin) {
      toast.error("You've already joined this ride!");
      return;
    }

    // Add join request
    const { error: joinError } = await supabase
      .from('join_requests')
      .insert({
        user_id: user.id,
        listing_type: 'cab',
        listing_id: rideId
      });

    if (joinError) {
      console.error('Error joining ride:', joinError);
      toast.error('Failed to join ride');
      return;
    }

    // Count total joins
    const { data: joins } = await supabase
      .from('join_requests')
      .select('*')
      .eq('listing_type', 'cab')
      .eq('listing_id', rideId);

    const totalJoins = (joins?.length || 0) + 1; // +1 for the creator

    // Update status if full
    if (totalJoins >= currentSeats) {
      await supabase
        .from('cab_rides')
        .update({ status: 'Full' })
        .eq('id', rideId);
    }

    toast.success("You're in! The Force is strong with this ride!");
    fetchRides();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/">
              <Button variant="outline" className="lightsaber-glow bg-black/50 border-red-600 text-white hover:bg-red-600/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Base
              </Button>
            </Link>
            <h1 className="text-4xl font-bold sith-text">🚕 CabBuddy</h1>
          </div>

          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900 mb-8">
              <TabsTrigger value="browse">Browse Rides</TabsTrigger>
              <TabsTrigger value="create">List New Ride</TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              <div className="mb-6">
                <div className="flex gap-4 mb-4">
                  <Button 
                    onClick={() => setRideType('airport')}
                    variant={rideType === 'airport' ? 'default' : 'outline'}
                    className="lightsaber-glow bg-red-600 hover:bg-red-700"
                  >
                    Airport Rides
                  </Button>
                  <Button 
                    onClick={() => setRideType('station')}
                    variant={rideType === 'station' ? 'default' : 'outline'}
                    className="lightsaber-glow bg-purple-600 hover:bg-purple-700"
                  >
                    Station Rides
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rides.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Car className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                    <p className="text-xl text-gray-400 mb-2">No speeders available in this sector</p>
                    <p className="text-gray-500">Be the first to list a ride to the {rideType}!</p>
                  </div>
                ) : (
                  rides
                    .filter(ride => 
                      rideType === 'airport' 
                        ? ride.to_location.toLowerCase().includes('airport')
                        : ride.to_location.toLowerCase().includes('station')
                    )
                    .map((ride) => (
                      <Card key={ride.id} className="force-card border-red-600/30 bg-black/80">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-red-400">To {ride.to_location}</span>
                            <span className="text-sm text-gray-400">{ride.status}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center text-gray-300">
                            <MapPin className="w-4 h-4 mr-2" />
                            From: {ride.from_location}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(ride.datetime).toLocaleString()}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Users className="w-4 h-4 mr-2" />
                            {ride.seats} seats available
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Car className="w-4 h-4 mr-2" />
                            {ride.vehicle_type || 'Any vehicle'}
                          </div>
                          <Button 
                            onClick={() => handleJoinRide(ride.id, ride.seats)}
                            disabled={ride.status === 'Full' || ride.created_by === user?.id}
                            className="w-full lightsaber-glow bg-red-600 hover:bg-red-700 disabled:opacity-50"
                          >
                            {ride.created_by === user?.id ? 'Your Ride' : 
                             ride.status === 'Full' ? 'Full' : 'Join the Force'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="create">
              <Card className="max-w-2xl mx-auto force-card border-red-600/30 bg-black/80">
                <CardHeader>
                  <CardTitle className="text-center sith-text">List Your Imperial Transport</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateRide} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Destination Type</label>
                        <Select value={rideType} onValueChange={(value: 'airport' | 'station') => setRideType(value)}>
                          <SelectTrigger className="bg-gray-900 border-gray-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="airport">Airport</SelectItem>
                            <SelectItem value="station">Railway Station</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">From Location</label>
                        <Input
                          placeholder="Starting point"
                          value={newRide.from_location}
                          onChange={(e) => setNewRide({...newRide, from_location: e.target.value})}
                          required
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Date & Time</label>
                        <Input
                          type="datetime-local"
                          value={newRide.datetime}
                          onChange={(e) => setNewRide({...newRide, datetime: e.target.value})}
                          required
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Available Seats</label>
                        <Input
                          type="number"
                          min="1"
                          max="8"
                          value={newRide.seats}
                          onChange={(e) => setNewRide({...newRide, seats: parseInt(e.target.value)})}
                          required
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Vehicle Type (Optional)</label>
                        <Input
                          placeholder="e.g., Sedan, SUV, Hatchback"
                          value={newRide.vehicle_type}
                          onChange={(e) => setNewRide({...newRide, vehicle_type: e.target.value})}
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Contact Info</label>
                        <Input
                          placeholder="Phone or WhatsApp"
                          value={newRide.contact}
                          onChange={(e) => setNewRide({...newRide, contact: e.target.value})}
                          required
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full lightsaber-glow bg-red-600 hover:bg-red-700 text-white"
                    >
                      {loading ? 'Deploying Speeder...' : 'Deploy Imperial Transport'}
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

export default CabBuddy;
