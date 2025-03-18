import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Loader2, AlertCircle, Tag } from 'lucide-react';
import { getUserArtworks } from '@/lib/api';
import MarketplaceListingForm from './MarketplaceListingForm';

interface Artwork {
  id: string;
  title: string;
  generatedImageUrl: string;
  isListed: boolean;
  price?: number;
}

const MyArtworksTab = ({ isVendor }: { isVendor: boolean }) => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    fetchArtworks();
  }, []);
  
  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const data = await getUserArtworks();
      setArtworks(data);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      toast.error('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter artworks based on tab
  const allArtworks = artworks;
  const listedArtworks = artworks.filter(artwork => artwork.isListed);
  const unlistedArtworks = artworks.filter(artwork => !artwork.isListed);
  
  const currentArtworks = () => {
    switch (activeTab) {
      case 'listed':
        return listedArtworks;
      case 'unlisted':
        return unlistedArtworks;
      default:
        return allArtworks;
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">My Creations</h2>
        <Button onClick={() => navigate('/generate')}>
          Create New Artwork
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All ({allArtworks.length})
          </TabsTrigger>
          <TabsTrigger value="listed">
            Listed ({listedArtworks.length})
          </TabsTrigger>
          <TabsTrigger value="unlisted">
            Unlisted ({unlistedArtworks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {currentArtworks().length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentArtworks().map((artwork) => (
                <Card key={artwork.id} className="overflow-hidden">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={artwork.generatedImageUrl} 
                      alt={artwork.title} 
                      className="h-full w-full object-cover"
                    />
                    {artwork.isListed && (
                      <div className="absolute top-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <Tag size={12} className="mr-1" />
                        ${artwork.price?.toFixed(2)}
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{artwork.title}</h3>
                      {isVendor && (
                        <MarketplaceListingForm 
                          artwork={artwork}
                          onSuccess={fetchArtworks}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Image className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No artworks yet</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start by generating your first AI artwork.
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => navigate('/generate')}
                  >
                    Create Artwork
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyArtworksTab;
