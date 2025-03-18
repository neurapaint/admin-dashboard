import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Image, 
  ShoppingCart, 
  DollarSign, 
  Settings, 
  LogOut,
  Brush,
  Users,
  Store,
  Loader2,
  ShoppingBag,
  CreditCard,
  Paintbrush
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getUserOrders } from '@/lib/api';
import MyArtworksTab from '@/components/MyArtworksTab';
import OrdersTab from '@/components/OrdersTab';
import BecomeCreatorDialog from '@/components/BecomeCreatorDialog';

const Sidebar = ({ activeTab, setActiveTab, isVendor }: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  isVendor: boolean;
}) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'orders', label: 'My Orders', icon: <ShoppingBag size={20} /> },
  ];
  
  menuItems.push({ id: 'artworks', label: 'My Creations', icon: <Image size={20} /> });
  
  if (isVendor) {
    menuItems.push(
      { id: 'earnings', label: 'Earnings', icon: <DollarSign size={20} /> }
    );
  }
  
  menuItems.push(
    { id: 'marketplace', label: 'Marketplace', icon: <Store size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  );
  
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(`Error signing out: ${error.message}`);
      return;
    }
    
    toast.success('Signed out successfully');
    navigate('/');
  };
  
  return (
    <div className="w-64 border-r border-border h-full hidden md:block">
      <div className="p-6">
        <h2 className="font-semibold mb-6">Dashboard</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-6 border-t mt-6">
        <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleSignOut}>
          <LogOut size={18} className="mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

const MobileTabs = ({ activeTab, setActiveTab, isVendor }: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  isVendor: boolean;
}) => {
  return (
    <div className="md:hidden overflow-x-auto py-4 px-6 border-b">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="artworks">Creations</TabsTrigger>
          {isVendor && (
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          )}
          <TabsTrigger value="marketplace">Market</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVendor, setIsVendor] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate('/auth');
          return;
        }
        
        setUser(user);
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else if (profile) {
          setIsVendor(profile.is_vendor);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      } else if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setOrdersLoading(true);
        const data = await getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setOrdersLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);
  
  const handleRoleUpdate = async () => {
    try {
      setLoading(true);
      
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        navigate('/auth');
        return;
      }
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else if (profile) {
        setIsVendor(profile.is_vendor);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-[calc(100vh-80px)]">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isVendor={isVendor} />
            
            <div className="flex-1 overflow-auto">
              <MobileTabs activeTab={activeTab} setActiveTab={setActiveTab} isVendor={isVendor} />
              
              <div className="p-6">
                <Tabs value={activeTab} className="space-y-6">
                  <TabsContent value="overview" className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Welcome, {user?.user_metadata?.username || 'User'}</h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {!isVendor && (
                          <Card className="col-span-full">
                            <CardHeader>
                              <CardTitle>Become a Creator</CardTitle>
                              <CardDescription>
                                Start selling your AI-generated artwork
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-between items-center">
                              <div className="space-y-2">
                                <p>Register as a creator to sell your artwork on the marketplace</p>
                              </div>
                              <BecomeCreatorDialog onSuccess={handleRoleUpdate} />
                            </CardContent>
                          </Card>
                        )}
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">My Orders</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {ordersLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                              ) : (
                                orders.filter(order => order.buyerId === user?.id).length
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Artworks purchased
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">My Creations</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {/* This would come from a query for artworks count */}
                              0
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Total AI artworks created
                            </p>
                          </CardContent>
                        </Card>
                        
                        {isVendor && (
                          <>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {ordersLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                  ) : (
                                    orders.filter(order => order.sellerId === user?.id).length
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Artworks sold
                                </p>
                              </CardContent>
                            </Card>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Get Started</CardTitle>
                        <CardDescription>Here's how to start with AI art</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <Brush size={16} />
                            </div>
                            <div>
                              <h4 className="font-medium">Create your first AI artwork</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                Go to the "Generate AI Art" page to create your first artwork using our AI-powered tools.
                              </p>
                              <Button 
                                size="sm" 
                                className="mt-2"
                                onClick={() => navigate('/generate')}
                              >
                                Create Artwork
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <Store size={16} />
                            </div>
                            <div>
                              <h4 className="font-medium">Browse the marketplace</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                Explore and purchase unique AI-generated artworks from creators.
                              </p>
                              <Button 
                                size="sm" 
                                className="mt-2"
                                variant="outline"
                                onClick={() => navigate('/marketplace')}
                              >
                                View Marketplace
                              </Button>
                            </div>
                          </div>
                          
                          {isVendor && (
                            <div className="flex items-start gap-4">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <ShoppingCart size={16} />
                              </div>
                              <div>
                                <h4 className="font-medium">List your artwork for sale</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  After creating artwork, list it on the marketplace to start earning.
                                </p>
                                <Button 
                                  size="sm" 
                                  className="mt-2"
                                  variant="outline"
                                  onClick={() => setActiveTab('artworks')}
                                >
                                  Manage Artworks
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="orders">
                    <OrdersTab userId={user?.id} />
                  </TabsContent>
                  
                  <TabsContent value="artworks">
                    <MyArtworksTab isVendor={isVendor} />
                  </TabsContent>
                  
                  <TabsContent value="marketplace">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold">AI Art Marketplace</h2>
                      <p className="text-muted-foreground">
                        Browse and purchase unique AI-generated artwork from creators around the world.
                      </p>
                      <div className="text-center py-8">
                        <Store className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">Visit the Marketplace</h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                          Explore our curated collection of AI-generated artwork available for purchase.
                        </p>
                        <Button 
                          className="mt-4"
                          onClick={() => navigate('/marketplace')}
                        >
                          Go to Marketplace
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {isVendor && (
                    <TabsContent value="earnings">
                      <h2 className="text-2xl font-bold mb-6">Earnings</h2>
                      <p className="text-muted-foreground mb-6">
                        Track your earnings and withdraw funds.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {ordersLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                              ) : (
                                `$${orders
                                  .filter(order => order.sellerId === user?.id)
                                  .reduce((total, order) => total + (order.amount - order.commission), 0)
                                  .toFixed(2)}`
                              )}
                            </div>
                            <Button size="sm" className="mt-2" disabled>
                              Withdraw Funds
                            </Button>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {ordersLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                              ) : (
                                `$${orders
                                  .filter(order => order.sellerId === user?.id)
                                  .reduce((total, order) => total + order.amount, 0)
                                  .toFixed(2)}`
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              All-time gross sales
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Marketplace Fee</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {ordersLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                              ) : (
                                `$${orders
                                  .filter(order => order.sellerId === user?.id)
                                  .reduce((total, order) => total + order.commission, 0)
                                  .toFixed(2)}`
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              10% platform commission
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Payment Information</CardTitle>
                          <CardDescription>
                            Manage your payment details for receiving earnings
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">PayPal Email</label>
                              <div className="flex gap-2">
                                <Input 
                                  value={user?.user_metadata?.paypal_email || ''} 
                                  readOnly 
                                  className="flex-1"
                                />
                                <Button variant="outline">Update</Button>
                              </div>
                            </div>
                            
                            <div className="border-t pt-4 mt-4">
                              <h4 className="font-medium">Payment Schedule</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                Payments are processed on the 1st of each month for all earnings from the previous month.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}
                  
                  <TabsContent value="settings">
                    <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                    <p className="text-muted-foreground mb-6">
                      Manage your account preferences and information.
                    </p>
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                          Update your account information
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <Input 
                              value={user?.user_metadata?.username || ''} 
                              readOnly 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input 
                              value={user?.email || ''} 
                              readOnly 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Account Type</label>
                            <div className="flex items-center gap-2">
                              {isVendor ? (
                                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                  <Paintbrush size={14} />
                                  Creator
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                                  <ShoppingBag size={14} />
                                  Collector
                                </div>
                              )}
                              
                              {!isVendor && (
                                <BecomeCreatorDialog onSuccess={handleRoleUpdate} />
                              )}
                            </div>
                          </div>
                          
                          {isVendor && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium">PayPal Email</label>
                              <Input 
                                value={user?.user_metadata?.paypal_email || ''} 
                                readOnly 
                              />
                            </div>
                          )}
                          
                          <div className="pt-4">
                            <Button>Update Profile</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
