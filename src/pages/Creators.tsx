import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { useQuery } from '@tanstack/react-query';
import { getMarketplaceArtworks } from '@/lib/api';

// Mock creators data for demonstration
const mockCreators = [
  { 
    id: '1', 
    username: 'ArtisticGenius', 
    bio: 'Digital artist specializing in sci-fi and fantasy landscapes.',
    artworks: 24,
    followers: 843,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
  },
  { 
    id: '2', 
    username: 'ColorMaster', 
    bio: 'Abstract expressionist with a focus on vibrant colors and emotions.',
    artworks: 42,
    followers: 1247,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
  },
  { 
    id: '3', 
    username: 'NaturalVisions', 
    bio: 'Capturing the beauty of nature through digital brushstrokes.',
    artworks: 18,
    followers: 562,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6'
  },
  { 
    id: '4', 
    username: 'UrbanArtist', 
    bio: 'Street art inspired digital creations with a modern twist.',
    artworks: 35,
    followers: 921,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'
  },
  { 
    id: '5', 
    username: 'DreamScapes', 
    bio: 'Creating surreal dreamscapes from imagination to digital canvas.',
    artworks: 29,
    followers: 1053,
    avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce'
  },
  { 
    id: '6', 
    username: 'RetroFuturist', 
    bio: 'Blending retro aesthetics with futuristic themes.',
    artworks: 21,
    followers: 736,
    avatarUrl: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126'
  },
  { 
    id: '7', 
    username: 'PixelPerfect', 
    bio: 'Pixel art inspired by classic video games and modern trends.',
    artworks: 31,
    followers: 892,
    avatarUrl: 'https://images.unsplash.com/photo-1504593811423-6dd665756598'
  },
  { 
    id: '8', 
    username: 'MoonlightCreator', 
    bio: 'Nocturnal artist creating mysterious and enchanting scenes.',
    artworks: 16,
    followers: 478,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'
  }
];

const Creators = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-24 mb-16 px-4">
        <h1 className="text-3xl font-bold mb-2">Featured Creators</h1>
        <p className="text-muted-foreground mb-8">Discover talented artists who create amazing AI-assisted artwork</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCreators.map((creator) => (
            <Link to={`/creators/${creator.id}`} key={creator.id} className="group">
              <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                <div className="h-52 overflow-hidden bg-gradient-to-br from-brand-blue/20 to-brand-purple/20">
                  <img 
                    src={`${creator.avatarUrl}?w=400&h=300&fit=crop`} 
                    alt={creator.username} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative -mt-12">
                      <div className="h-16 w-16 rounded-full border-4 border-background overflow-hidden">
                        <img 
                          src={`${creator.avatarUrl}?w=100&h=100&fit=facearea&facepad=2`} 
                          alt={creator.username} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{creator.username}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>{creator.artworks} Artworks</span>
                        <span>{creator.followers} Followers</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-4 line-clamp-2">{creator.bio}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="w-full">
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[1, 2, 3].map((idx) => (
                        <div key={idx} className="h-16 rounded overflow-hidden bg-muted">
                          <img 
                            src={`https://images.unsplash.com/photo-${500 + (creator.id * 10) + idx}?w=100&h=100&fit=crop`} 
                            alt="Artwork preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback if image doesn't load
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Creators;
