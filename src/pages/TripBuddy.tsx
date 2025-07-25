
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Globe, Users, Calendar, MapPin, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Trip {
  id: string;
  state: string;
  district: string;
  destination: string;
  people_count: number;
  accommodation: string;
  start_date: string;
  return_date: string;
  created_by: string;
}

const stateDistrictMap: { [key: string]: string[] } = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kadapa", "Anantapur", "Vizianagaram"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Tezu", "Seppa", "Aalo", "Changlang"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Karimganj", "Sivasagar"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", "Katihar"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Korba", "Bilaspur", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh", "Ambikapur", "Mahasamund"],
  "Goa": ["Panaji", "Vasco da Gama", "Margao", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Sanquelim", "Valpoi", "Quepem"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar", "Junagadh", "Anand", "Bharuch"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Hamirpur", "Una", "Bilaspur", "Chamba", "Kangra"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh", "Giridih", "Ramgarh", "Medininagar"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary", "Bijapur", "Shimoga"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Malappuram", "Kannur", "Kasaragod"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Thane", "Amravati", "Kolhapur", "Sangli"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching", "Ukhrul", "Senapati", "Tamenglong", "Jiribam", "Chandel"],
  "Meghalaya": ["Shillong", "Tura", "Nongstoin", "Jowai", "Baghmara", "Ampati", "Resubelpara", "Mawkyrwat", "Williamnagar", "Khliehriat"],
  "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip", "Lawngtlai", "Mamit", "Saitual", "Khawzawl"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Phek", "Kiphire", "Longleng", "Peren"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda"],
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Firozpur", "Hoshiarpur", "Batala"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Jorethang", "Naya Bazar", "Rangpo", "Singtam", "Tadong", "Pakyong"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet"],
  "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailasahar", "Belonia", "Khowai", "Ambassa", "Ranir Bazar", "Sonamura", "Sabroom"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Aligarh", "Moradabad"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Kotdwar", "Ramnagar", "Manglaur"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Baharampur", "Habra", "Kharagpur"],
  // Union Territories
  "Andaman and Nicobar Islands": ["Port Blair", "Rangat", "Mayabunder", "Diglipur", "Car Nicobar", "Nancowry", "Campbell Bay", "Hut Bay", "Bamboo Flat", "Garacharma"],
  "Chandigarh": ["Chandigarh", "Sector 17", "Sector 22", "Sector 35", "Panchkula", "Mohali"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa", "Vapi", "Dadra", "Nagar Haveli"],
  "Delhi": ["New Delhi", "Central Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "North East Delhi", "North West Delhi", "South East Delhi", "South West Delhi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kupwara", "Pulwama", "Rajouri", "Kathua", "Udhampur", "Doda"],
  "Ladakh": ["Leh", "Kargil", "Nubra Valley", "Zanskar", "Changthang", "Drass", "Sankoo", "Padum", "Khaltse", "Nyoma"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Minicoy", "Amini", "Andrott", "Kalpeni", "Kadmat", "Kiltan", "Chetlat", "Bitra"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam", "Villianur", "Ariyankuppam", "Bahour", "Nettapakkam", "Mannadipet", "Ozhukarai"]
};

const TripBuddy = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  
  const [newTrip, setNewTrip] = useState({
    state: '',
    district: '',
    destination: '',
    people_count: 1,
    accommodation: '',
    start_date: '',
    return_date: ''
  });

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching trips:', error);
      toast.error('Failed to fetch trips');
    } else {
      setTrips(data || []);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    // May the 4th Easter Egg
    const today = new Date();
    if (today.getMonth() === 4 && today.getDate() === 4) { // May 4th
      toast.success("May the Fourth be with you!");
    }

    // Death Star Easter Egg - random chance
    if (Math.random() < 0.1) {
      setTimeout(() => {
        toast("That's no moon... it's a space station!", {
          duration: 4000,
        });
      }, 3000);
    }
  }, []);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    const { error } = await supabase
      .from('trips')
      .insert({
        ...newTrip,
        created_by: user.id
      });

    if (error) {
      console.error('Error creating trip:', error);
      toast.error('Failed to create trip');
    } else {
      toast.success('Trip listed successfully! Ready for hyperspace jump!');
      setNewTrip({
        state: '',
        district: '',
        destination: '',
        people_count: 1,
        accommodation: '',
        start_date: '',
        return_date: ''
      });
      setSelectedState('');
      fetchTrips();
    }
    
    setLoading(false);
  };

  const handleJoinTrip = async (tripId: string, currentCount: number) => {
    if (!user) return;

    // Check if already joined
    const { data: existingJoin } = await supabase
      .from('join_requests')
      .select('*')
      .eq('user_id', user.id)
      .eq('listing_type', 'trip')
      .eq('listing_id', tripId)
      .single();

    if (existingJoin) {
      toast.error("You've already joined this galactic expedition!");
      return;
    }

    // Add join request
    const { error: joinError } = await supabase
      .from('join_requests')
      .insert({
        user_id: user.id,
        listing_type: 'trip',
        listing_id: tripId
      });

    if (joinError) {
      console.error('Error joining trip:', joinError);
      toast.error('Failed to join trip');
      return;
    }

    // Yoda wisdom Easter Egg
    const yodaQuotes = [
      "Welcome to the expedition, young Padawan!",
      "Strong with the Force you are!",
      "Adventure, excitement... a Jedi craves not these things. But travel? Yes!",
      "Your journey to the destination, begun it has!"
    ];
    toast.success(yodaQuotes[Math.floor(Math.random() * yodaQuotes.length)]);
    fetchTrips();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/">
              <Button variant="outline" className="lightsaber-glow bg-black/50 border-purple-600 text-white hover:bg-purple-600/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Base
              </Button>
            </Link>
            <h1 className="text-4xl font-bold sith-text">🌍 TripBuddy</h1>
          </div>

          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900 mb-8">
              <TabsTrigger value="browse">Choose Your Quest</TabsTrigger>
              <TabsTrigger value="create">Plan Expedition</TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Globe className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                    <p className="text-xl text-gray-400 mb-2">No expeditions planned to distant worlds</p>
                    <p className="text-gray-500">Be the first to plan an epic journey!</p>
                  </div>
                ) : (
                  trips.map((trip) => (
                    <Card key={trip.id} className="force-card border-purple-600/30 bg-black/80">
                      <CardHeader>
                        <CardTitle className="text-purple-400">{trip.destination}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-4 h-4 mr-2" />
                          {trip.district}, {trip.state}
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Users className="w-4 h-4 mr-2" />
                          {trip.people_count} travelers needed
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Home className="w-4 h-4 mr-2" />
                          {trip.accommodation}
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.return_date).toLocaleDateString()}
                        </div>
                        <Button 
                          onClick={() => handleJoinTrip(trip.id, trip.people_count)}
                          disabled={trip.created_by === user?.id}
                          className="w-full lightsaber-glow bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                        >
                          {trip.created_by === user?.id ? 'Your Expedition' : 'Join the Quest'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="create">
              <Card className="max-w-2xl mx-auto force-card border-purple-600/30 bg-black/80">
                <CardHeader>
                  <CardTitle className="text-center sith-text">Plan Your Galactic Expedition</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateTrip} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">State/Union Territory</label>
                        <Select value={newTrip.state} onValueChange={(value) => {
                          setNewTrip({...newTrip, state: value, district: ''});
                          setSelectedState(value);
                        }}>
                          <SelectTrigger className="bg-gray-900 border-gray-700">
                            <SelectValue placeholder="Select state/UT" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700 max-h-64">
                            {Object.keys(stateDistrictMap).sort().map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">District/Region</label>
                        <Select 
                          value={newTrip.district} 
                          onValueChange={(value) => setNewTrip({...newTrip, district: value})}
                          disabled={!selectedState}
                        >
                          <SelectTrigger className="bg-gray-900 border-gray-700">
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700 max-h-64">
                            {selectedState && stateDistrictMap[selectedState]?.map((district) => (
                              <SelectItem key={district} value={district}>{district}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Destination</label>
                        <Input
                          placeholder="Specific location"
                          value={newTrip.destination}
                          onChange={(e) => setNewTrip({...newTrip, destination: e.target.value})}
                          required
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Fellow Travelers Needed</label>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          value={newTrip.people_count}
                          onChange={(e) => setNewTrip({...newTrip, people_count: parseInt(e.target.value)})}
                          required
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Accommodation</label>
                      <Input
                        placeholder="Hotel, Resort, Homestay, etc."
                        value={newTrip.accommodation}
                        onChange={(e) => setNewTrip({...newTrip, accommodation: e.target.value})}
                        required
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Start Date</label>
                        <Input
                          type="date"
                          value={newTrip.start_date}
                          onChange={(e) => setNewTrip({...newTrip, start_date: e.target.value})}
                          required
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Return Date</label>
                        <Input
                          type="date"
                          value={newTrip.return_date}
                          onChange={(e) => setNewTrip({...newTrip, return_date: e.target.value})}
                          required
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full lightsaber-glow bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {loading ? 'Charting Hyperspace Route...' : 'Launch Expedition'}
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

export default TripBuddy;
