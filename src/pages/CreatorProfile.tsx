import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { Heart, Share2, Users } from 'lucide-react';

// Mock creator data
const mockCreators = [
  { 
    id: '1', 
    username: 'ArtisticGenius', 
    bio: 'Digital artist specializing in sci-fi and fantasy landscapes. I use AI tools to bring my imagination to life and create stunning visual experiences that transport viewers to other worlds.',
    followers: 843,
    following: 156,
    joined: 'May 2023',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
  },
  { 
    id: '2', 
    username: 'ColorMaster', 
    bio: 'Abstract expressionist with a focus on vibrant colors and emotions. Every piece tells a story through color psychology and dynamic compositions.',
    followers: 1247,
    following: 230,
    joined: 'March 2023',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    coverUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  },
  // ... other creators
];

// Mock artworks data
const mockArtworks = [
  {
    id: '1',
    creatorId: '1',
    title: 'Neon City Dreams',
    description: 'A futuristic cityscape bathed in neon lights and rain.',
    price: 35.00,
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    likes: 124,
    createdAt: '2023-08-15'
  },
  {
    id: '2',
    creatorId: '1',
    title: 'Cosmic Voyage',
    description: 'Exploring the depths of space through vibrant nebulas.',
    price: 42.00,
    imageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2',
    likes: 98,
    createdAt: '2023-08-20'
  },
  {
    id: '3',
    creatorId: '1',
    title: 'Ancient Temple',
    description: 'Mystical ruins overgrown with lush vegetation.',
    price: 28.50,
    imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25',
    likes: 76,
    createdAt: '2023-08-25'
  },
  {
    id: '4',
    creatorId: '1',
    title: 'Ocean Depths',
    description: 'Mysterious underwater world with bioluminescent creatures.',
    price: 31.75,
    imageUrl: 'https://images.unsplash.com/photo-1518301551107-8428e25e6dd3',
    likes: 112,
    createdAt: '2023-09-01'
  },
  {
    id: '5',
    creatorId: '1',
    title: 'Mountain Serenity',
    description: 'Peaceful mountain landscape at dawn.',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99',
    likes: 145,
    createdAt: '2023-09-05'
  },
  {
    id: '6',
    creatorId: '1',
    title: 'Desert Mirage',
    description: 'Surreal desert landscape with impossible architecture.',
    price: 45.50,
    imageUrl: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0',
    likes: 87,
    createdAt: '2023-09-10'
  },
  {
    id: '7',
    creatorId: '2',
    title: 'Vibrant Abstraction',
    description: 'Explosion of colors representing human emotions.',
    price: 50.00,
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
    likes: 165,
    createdAt: '2023-08-12'
  },
  {
    id: '8',
    creatorId: '2',
    title: 'Color Theory',
    description: 'Exploration of color relationships and harmony.',
    price: 47.25,
    imageUrl: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d',
    likes: 132,
    createdAt: '2023-08-18'
  },
  // ... other artworks
];

const CreatorProfile = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find creator by ID
  const creator = mockCreators.find(c => c.id === id);
  
  // Filter artworks by creator ID
  const creatorArtworks = mockArtworks.filter(a => a.creatorId === id);
  
  if (!creator) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto mt-24 px-4 text-center">
          <h1 className="text-3xl font-bold">Creator not found</h1>
          <p className="mt-4">The creator you're looking for doesn't exist or has been removed.</p>
          <Link to="/creators">
            <Button className="mt-6">Back to Creators</Button>
          </Link>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="w-full">
        {/* Cover Image */}
        <div className="h-64 w-full overflow-hidden">
          <img 
            src={creator.coverUrl} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Profile Section */}
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-20 mb-8 relative z-10">
            <div className="h-32 w-32 rounded-full border-4 border-background overflow-hidden bg-background shadow-md">
              <img 
                src={creator.avatarUrl} 
                alt={creator.username} 
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="mt-4 md:mt-0 md:ml-6 flex-grow">
              <h1 className="text-3xl font-bold">{creator.username}</h1>
              <div className="flex items-center gap-4 mt-1 text-muted-foreground">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{creator.followers} followers</span>
                </div>
                <div>Joined {creator.joined}</div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Follow
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium text-lg mb-2">About</h3>
                  <p className="text-muted-foreground">{creator.bio}</p>
                  
                  <div className="mt-6 pt-6 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Followers</div>
                        <div className="font-medium">{creator.followers}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Following</div>
                        <div className="font-medium">{creator.following}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              <Tabs defaultValue="artworks">
                <TabsList className="mb-6">
                  <TabsTrigger value="artworks">Artworks</TabsTrigger>
                  <TabsTrigger value="collections">Collections</TabsTrigger>
                </TabsList>
                
                <TabsContent value="artworks">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {creatorArtworks.map((artwork) => (
                      <Card key={artwork.id} className="overflow-hidden group cursor-pointer">
                        <div className="aspect-square overflow-hidden">
                          <img 
                            src={artwork.imageUrl} 
                            alt={artwork.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{artwork.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{artwork.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${artwork.price.toFixed(2)}</div>
                              <div className="text-sm text-muted-foreground flex items-center justify-end mt-1">
                                <Heart className="h-3 w-3 mr-1" />
                                {artwork.likes}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="collections">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No collections yet</h3>
                    <p className="text-muted-foreground mt-2">This creator hasn't created any collections yet.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatorProfile;
