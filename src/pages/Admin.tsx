import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, getCurrentUser } from '@/lib/api';
import { Ban, CheckCircle, DollarSign, Lock, ShieldAlert, Unlock, UserCog, Users } from 'lucide-react';

// Mock data for demonstration
const mockUsers = [
  { id: '1', email: 'user1@example.com', username: 'user1', isVendor: false, createdAt: '2023-05-15' },
  { id: '2', email: 'user2@example.com', username: 'user2', isVendor: true, createdAt: '2023-06-20', paypalEmail: 'paypal2@example.com' },
  { id: '3', email: 'user3@example.com', username: 'user3', isVendor: false, createdAt: '2023-07-10' },
  { id: '4', email: 'user4@example.com', username: 'user4', isVendor: true, createdAt: '2023-08-05', paypalEmail: 'paypal4@example.com' },
  { id: '5', email: 'rahulparathyagency@gmail.com', username: 'admin', isVendor: true, createdAt: '2023-04-01', paypalEmail: 'admin@paypal.com' },
];

const mockTransactions = [
  { id: '1', artworkId: 'a1', buyerId: '3', sellerId: '2', amount: 25.00, commission: 1.25, status: 'completed', createdAt: '2023-09-10' },
  { id: '2', artworkId: 'a2', buyerId: '1', sellerId: '4', amount: 30.00, commission: 1.50, status: 'completed', createdAt: '2023-09-15' },
  { id: '3', artworkId: 'a3', buyerId: '3', sellerId: '2', amount: 15.00, commission: 0.75, status: 'completed', createdAt: '2023-09-20' },
  { id: '4', artworkId: 'a4', buyerId: '1', sellerId: '4', amount: 40.00, commission: 2.00, status: 'pending', createdAt: '2023-09-25' },
];

const mockProducts = [
  { id: 'a1', title: 'Abstract Ocean', userId: '2', isListed: true, price: 25.00, createdAt: '2023-08-01' },
  { id: 'a2', title: 'Mountain Sunset', userId: '4', isListed: true, price: 30.00, createdAt: '2023-08-10' },
  { id: 'a3', title: 'Urban Landscape', userId: '2', isListed: true, price: 15.00, createdAt: '2023-08-15' },
  { id: 'a4', title: 'Fantasy World', userId: '4', isListed: false, price: 40.00, createdAt: '2023-08-20' },
];

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [dialogContent, setDialogContent] = useState<{ title: string; description: string; action: () => void } | null>(null);

  // Calculate metrics
  const totalUsers = mockUsers.length;
  const totalVendors = mockUsers.filter(user => user.isVendor).length;
  const totalSales = mockTransactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const totalEarnings = mockTransactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.commission, 0);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const currentUser = await getCurrentUser();
      // For demo purposes, we'll consider the user with email rahulparathyagency@gmail.com as admin
      if (currentUser?.email === 'rahulparathyagency@gmail.com') {
        setIsAdmin(true);
      } else {
        toast.error('You do not have permission to access this page');
        navigate('/');
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleAction = (title: string, description: string, action: () => void) => {
    setDialogContent({ title, description, action });
  };

  const handleConfirmAction = () => {
    if (dialogContent) {
      dialogContent.action();
      setDialogContent(null);
      toast.success('Action completed successfully');
    }
  };

  if (!isAdmin) {
    return <div className="flex justify-center items-center h-screen">Checking permissions...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-24 px-4 mb-16">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <UserCog className="mr-2 h-5 w-5 text-muted-foreground" />
                Total Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalVendors}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalSales.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                Platform Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalEarnings.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs Section */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-[600px] mb-8">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="vendors">Vendor Management</TabsTrigger>
            <TabsTrigger value="transactions">Transaction Log</TabsTrigger>
          </TabsList>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage registered users and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.isVendor ? 'Vendor' : 'User'}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAction(
                              'Ban User', 
                              `Are you sure you want to ban ${user.username}?`, 
                              () => console.log(`Banned user ${user.id}`)
                            )}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Ban
                          </Button>
                          
                          {!user.isVendor && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAction(
                                'Approve as Vendor', 
                                `Approve ${user.username} as a vendor?`, 
                                () => console.log(`Approved vendor ${user.id}`)
                              )}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve Vendor
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Vendors Tab */}
          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Management</CardTitle>
                <CardDescription>Manage vendor accounts and product listings</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-medium mb-4">Vendor Accounts</h3>
                <Table className="mb-8">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>PayPal Email</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.filter(user => user.isVendor).map(vendor => (
                      <TableRow key={vendor.id}>
                        <TableCell>{vendor.username}</TableCell>
                        <TableCell>{vendor.email}</TableCell>
                        <TableCell>{vendor.paypalEmail || 'Not provided'}</TableCell>
                        <TableCell>{new Date(vendor.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAction(
                              'Revoke Vendor Status', 
                              `Revoke vendor status for ${vendor.username}?`, 
                              () => console.log(`Revoked vendor ${vendor.id}`)
                            )}
                          >
                            <Lock className="h-4 w-4 mr-1" />
                            Revoke Status
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <h3 className="text-lg font-medium mb-4">Product Listings</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducts.map(product => {
                      const vendor = mockUsers.find(u => u.id === product.userId);
                      return (
                        <TableRow key={product.id}>
                          <TableCell>{product.title}</TableCell>
                          <TableCell>{vendor?.username || 'Unknown'}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>{product.isListed ? 'Listed' : 'Unlisted'}</TableCell>
                          <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="space-x-2">
                            <Button 
                              size="sm" 
                              variant={product.isListed ? "destructive" : "outline"}
                              onClick={() => handleAction(
                                product.isListed ? 'Remove Listing' : 'Approve Listing', 
                                product.isListed 
                                  ? `Remove ${product.title} from marketplace?` 
                                  : `Approve ${product.title} for marketplace?`, 
                                () => console.log(`${product.isListed ? 'Removed' : 'Approved'} product ${product.id}`)
                              )}
                            >
                              {product.isListed 
                                ? <Ban className="h-4 w-4 mr-1" /> 
                                : <CheckCircle className="h-4 w-4 mr-1" />
                              }
                              {product.isListed ? 'Remove' : 'Approve'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Log</CardTitle>
                <CardDescription>View and manage all platform transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map(transaction => {
                      const buyer = mockUsers.find(u => u.id === transaction.buyerId);
                      const seller = mockUsers.find(u => u.id === transaction.sellerId);
                      const product = mockProducts.find(p => p.id === transaction.artworkId);
                      
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{product?.title || 'Unknown'}</TableCell>
                          <TableCell>{buyer?.username || 'Unknown'}</TableCell>
                          <TableCell>{seller?.username || 'Unknown'}</TableCell>
                          <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                          <TableCell>${transaction.commission.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              transaction.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {transaction.status === 'pending' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleAction(
                                  'Process Payment', 
                                  `Manually process payment for transaction ${transaction.id}?`, 
                                  () => console.log(`Processed payment for ${transaction.id}`)
                                )}
                              >
                                <DollarSign className="h-4 w-4 mr-1" />
                                Process
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={!!dialogContent} onOpenChange={() => setDialogContent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent?.title}</DialogTitle>
            <DialogDescription>
              {dialogContent?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogContent(null)}>Cancel</Button>
            <Button onClick={handleConfirmAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Admin;
