
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Car, Globe, Users, Calendar, MapPin, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/ProtectedRoute';

interface UserListing {
  id: string;
  type: 'cab' | 'trip' | 'outing';
  title: string;
  details: string;
  date: string;
  status?: string;
}

interface UserJoin {
  id: string;
  type: 'cab' | 'trip' | 'outing';
  title: string;
  details: string;
  date: string;
  joined_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [myListings, setMyListings] = useState<UserListing[]>([]);
  const [myJoins, setMyJoins] = useState<UserJoin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyData = async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Fetch my listings
      const [cabRides, trips, outings] = await Promise.all([
        supabase.from('cab_rides').select('*').eq('created_by', user.id),
        supabase.from('trips').select('*').eq('created_by', user.id),
        supabase.from('outings').select('*').eq('created_by', user.id)
      ]);

      const listings: UserListing[] = [
        ...(cabRides.data || []).map(ride => ({
          id: ride.id,
          type: 'cab' as const,
          title: `To ${ride.to_location}`,
          details: `From ${ride.from_location} • ${ride.seats} seats`,
          date: ride.datetime,
          status: ride.status
        })),
        ...(trips.data || []).map(trip => ({
          id: trip.id,
          type: 'trip' as const,
          title: trip.destination,
          details: `${trip.district}, ${trip.state} • ${trip.people_count} people`,
          date: trip.start_date
        })),
        ...(outings.data || []).map(outing => ({
          id: outing.id,
          type: 'outing' as const,
          title: `${outing.outing_type} at ${outing.destination}`,
          details: `Meet at ${outing.meeting_point} • ${outing.people_count} people`,
          date: outing.time
        }))
      ];

      setMyListings(listings);

      // Fetch my joins
      const { data: joinRequests } = await supabase
        .from('join_requests')
        .select('*')
        .eq('user_id', user.id);

      if (joinRequests) {
        const joinDetails = await Promise.all(
          joinRequests.map(async (join) => {
            let details = '';
            let title = '';
            let date = '';

            if (join.listing_type === 'cab') {
              const { data: ride } = await supabase
                .from('cab_rides')
                .select('*')
                .eq('id', join.listing_id)
                .single();
              if (ride) {
                title = `Cab to ${ride.to_location}`;
                details = `From ${ride.from_location}`;
                date = ride.datetime;
              }
            } else if (join.listing_type === 'trip') {
              const { data: trip } = await supabase
                .from('trips')
                .select('*')
                .eq('id', join.listing_id)
                .single();
              if (trip) {
                title = `Trip to ${trip.destination}`;
                details = `${trip.district}, ${trip.state}`;
                date = trip.start_date;
              }
            } else if (join.listing_type === 'outing') {
              const { data: outing } = await supabase
                .from('outings')
                .select('*')
                .eq('id', join.listing_id)
                .single();
              if (outing) {
                title = `${outing.outing_type} at ${outing.destination}`;
                details = `Meet at ${outing.meeting_point}`;
                date = outing.time;
              }
            }

            return {
              id: join.id,
              type: join.listing_type as 'cab' | 'trip' | 'outing',
              title,
              details,
              date,
              joined_at: join.joined_at
            };
          })
        );

        setMyJoins(joinDetails.filter(join => join.title));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load dashboard data');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMyData();
  }, [user]);

  const handleDeleteListing = async (id: string, type: string) => {
    const table = type === 'cab' ? 'cab_rides' : type === 'trip' ? 'trips' : 'outings';
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    } else {
      toast.success('Listing deleted - Order 66 executed!');
      fetchMyData();
    }
  };

  const handleLeaveJoin = async (joinId: string) => {
    const { error } = await supabase
      .from('join_requests')
      .delete()
      .eq('id', joinId);

    if (error) {
      console.error('Error leaving join:', error);
      toast.error('Failed to leave');
    } else {
      toast.success('Left the mission successfully');
      fetchMyData();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'cab': return <Car className="w-5 h-5" />;
      case 'trip': return <Globe className="w-5 h-5" />;
      case 'outing': return <Users className="w-5 h-5" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cab': return 'text-red-400';
      case 'trip': return 'text-purple-400';
      case 'outing': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="sith-text">Loading Imperial Dashboard...</p>
        </div>
      </div>
    );
  }

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
            <div className="text-center">
              <h1 className="text-4xl font-bold sith-text">Imperial Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user?.email}</p>
            </div>
            <Button 
              onClick={signOut}
              variant="outline" 
              className="lightsaber-glow bg-black/50 border-gray-600 text-white hover:bg-gray-600/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Leave Empire
            </Button>
          </div>

          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900 mb-8">
              <TabsTrigger value="listings">My Listings ({myListings.length})</TabsTrigger>
              <TabsTrigger value="joins">My Joins ({myJoins.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="listings">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="text-6xl mb-4">🌌</div>
                    <p className="text-xl text-gray-400 mb-2">No active missions, Commander</p>
                    <p className="text-gray-500">Ready to deploy some Imperial transports?</p>
                  </div>
                ) : (
                  myListings.map((listing) => (
                    <Card key={listing.id} className="force-card border-gray-600/30 bg-black/80">
                      <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${getTypeColor(listing.type)}`}>
                          {getIcon(listing.type)}
                          {listing.title}
                        </CardTitle>
                        {listing.status && (
                          <span className={`text-sm px-2 py-1 rounded ${
                            listing.status === 'Open' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                          }`}>
                            {listing.status}
                          </span>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-gray-300">{listing.details}</p>
                        <div className="flex items-center text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(listing.date).toLocaleString()}
                        </div>
                        <Button 
                          onClick={() => handleDeleteListing(listing.id, listing.type)}
                          variant="destructive"
                          className="w-full lightsaber-glow"
                        >
                          Execute Order 66
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="joins">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myJoins.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="text-6xl mb-4">🚀</div>
                    <p className="text-xl text-gray-400 mb-2">No active missions joined, Padawan</p>
                    <p className="text-gray-500">Time to join the rebellion?</p>
                  </div>
                ) : (
                  myJoins.map((join) => (
                    <Card key={join.id} className="force-card border-gray-600/30 bg-black/80">
                      <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${getTypeColor(join.type)}`}>
                          {getIcon(join.type)}
                          {join.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-gray-300">{join.details}</p>
                        <div className="flex items-center text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(join.date).toLocaleString()}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin className="w-3 h-3 mr-1" />
                          Joined: {new Date(join.joined_at).toLocaleDateString()}
                        </div>
                        <Button 
                          onClick={() => handleLeaveJoin(join.id)}
                          variant="outline"
                          className="w-full lightsaber-glow border-gray-600 hover:bg-gray-800"
                        >
                          Leave Mission
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
