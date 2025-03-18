import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { getUserOrders, Order as ApiOrder } from '@/lib/api';
import { ShoppingBag, Loader2, AlertCircle } from 'lucide-react';

// Define a local Order interface that matches the component's requirements
interface Order {
  id: string;
  artworkId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  commission: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  artwork?: {
    title: string;
    generated_image_url: string;
  };
  buyer?: {
    username?: string;
  };
  seller?: {
    username?: string;
  };
}

const OrdersTab = ({ userId }: { userId: string }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const apiOrders = await getUserOrders();
      
      // Convert API orders to the component's Order type
      const formattedOrders: Order[] = apiOrders.map(order => ({
        id: order.id,
        artworkId: order.artworkId,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        amount: order.amount,
        commission: order.commission,
        status: order.status,
        createdAt: order.createdAt,
        artwork: order.artwork,
        buyer: order.buyer,
        seller: order.seller,
      }));
      
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter orders for purchases and sales
  const purchased = orders.filter(order => order.buyerId === userId);
  const sold = orders.filter(order => order.sellerId === userId);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Orders</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Purchases</CardTitle>
            <CardDescription>Artworks you've purchased</CardDescription>
          </CardHeader>
          <CardContent>
            {purchased.length > 0 ? (
              <div className="space-y-4">
                {purchased.map((order) => (
                  <div key={order.id} className="flex gap-4 border-b pb-4">
                    <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden bg-muted">
                      {order.artwork?.generated_image_url ? (
                        <img 
                          src={order.artwork.generated_image_url} 
                          alt={order.artwork.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="h-full w-full p-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{order.artwork?.title || 'Untitled Artwork'}</h4>
                      <p className="text-sm text-muted-foreground">
                        From: {order.seller?.username || 'Unknown Artist'}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-sm">{formatDate(order.createdAt)}</span>
                        <span className="font-medium">${order.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  You haven't purchased any artworks yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>My Sales</CardTitle>
            <CardDescription>Artworks you've sold</CardDescription>
          </CardHeader>
          <CardContent>
            {sold.length > 0 ? (
              <div className="space-y-4">
                {sold.map((order) => (
                  <div key={order.id} className="flex gap-4 border-b pb-4">
                    <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden bg-muted">
                      {order.artwork?.generated_image_url ? (
                        <img 
                          src={order.artwork.generated_image_url} 
                          alt={order.artwork.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="h-full w-full p-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{order.artwork?.title || 'Untitled Artwork'}</h4>
                      <p className="text-sm text-muted-foreground">
                        To: {order.buyer?.username || 'Unknown Buyer'}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-sm">{formatDate(order.createdAt)}</span>
                        <div className="text-right">
                          <div className="font-medium">${order.amount.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">
                            Commission: ${order.commission.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  You haven't sold any artworks yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrdersTab;
