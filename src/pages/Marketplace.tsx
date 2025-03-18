import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ShoppingBag, Heart, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getMarketplaceArtworks, purchaseArtwork, Artwork as ApiArtwork } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

interface Artwork {
  id: string;
  title: string;
  description?: string;
  generatedImageUrl: string;
  price: number;
  userId: string;
  artist?: string;
}

const ArtworkCard = ({ artwork, onPurchase }: { artwork: Artwork, onPurchase: (artwork: Artwork) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg">
      <div 
        className="relative aspect-square overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={artwork.generatedImageUrl} 
          alt={artwork.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button variant="secondary" className="rounded-full" onClick={() => onPurchase(artwork)}>
            View Details
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg truncate">{artwork.title}</h3>
            <p className="text-muted-foreground text-sm">by {artwork.artist || 'Unknown Artist'}</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Heart size={18} />
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <span className="font-semibold">${artwork.price.toFixed(2)}</span>
        <Button size="sm" onClick={() => onPurchase(artwork)}>
          <ShoppingBag size={16} className="mr-2" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};

const ArtworkCardSkeleton = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-2/5" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-9 w-1/3" />
      </div>
    </div>
  );
};

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
    fetchArtworks();
  }, []);
  
  useEffect(() => {
    const filtered = artworks.filter(artwork => 
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (artwork.artist && artwork.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (artwork.description && artwork.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    let sorted = [...filtered];
    
    switch (sortBy) {
      case 'newest':
        // Already sorted by newest in the API
        break;
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    setFilteredArtworks(sorted);
  }, [searchQuery, artworks, sortBy]);
  
  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const apiArtworks = await getMarketplaceArtworks();
      
      // Convert API artworks to the Marketplace component's Artwork type
      const formattedArtworks: Artwork[] = apiArtworks.map(art => ({
        id: art.id,
        title: art.title,
        description: art.description,
        generatedImageUrl: art.generatedImageUrl,
        price: art.price || 0, // Ensure price is always a number
        userId: art.userId,
        artist: art.artist,
      }));
      
      setArtworks(formattedArtworks);
      setFilteredArtworks(formattedArtworks);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      toast.error('Failed to load marketplace artworks');
    } finally {
      setLoading(false);
    }
  };
  
  const handleArtworkSelect = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setPurchaseDialogOpen(true);
  };
  
  const handlePurchase = async () => {
    if (!selectedArtwork) return;
    
    if (!isLoggedIn) {
      toast.error('Please sign in to purchase artwork');
      navigate('/auth');
      return;
    }
    
    try {
      setPurchaseLoading(true);
      await purchaseArtwork(selectedArtwork.id, selectedArtwork.userId, selectedArtwork.price);
      setPurchaseDialogOpen(false);
      toast.success('Artwork purchased successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to purchase artwork');
    } finally {
      setPurchaseLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">AI Art Marketplace</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover and collect unique AI-generated artwork from artists around the world
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    placeholder="Search artwork by title, artist, or style..." 
                    className="pl-10 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="h-12 flex items-center gap-2">
                  <Filter size={18} />
                  Filters
                  <ChevronDown size={16} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Artwork Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <ArtworkCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredArtworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtworks.map((artwork) => (
                <ArtworkCard 
                  key={artwork.id} 
                  artwork={artwork} 
                  onPurchase={handleArtworkSelect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No artworks found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
          
          {/* Purchase Dialog */}
          <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Purchase Artwork</DialogTitle>
                <DialogDescription>
                  You are about to purchase this AI-generated artwork.
                </DialogDescription>
              </DialogHeader>
              
              {selectedArtwork && (
                <div className="space-y-4">
                  <div className="aspect-square overflow-hidden rounded-md">
                    <img 
                      src={selectedArtwork.generatedImageUrl}
                      alt={selectedArtwork.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{selectedArtwork.title}</h3>
                    <p className="text-sm text-muted-foreground">by {selectedArtwork.artist || 'Unknown Artist'}</p>
                    {selectedArtwork.description && (
                      <p className="mt-2 text-sm">{selectedArtwork.description}</p>
                    )}
                    <p className="mt-4 font-semibold text-lg">${selectedArtwork.price.toFixed(2)}</p>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setPurchaseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePurchase} disabled={purchaseLoading}>
                  {purchaseLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Buy Now
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
