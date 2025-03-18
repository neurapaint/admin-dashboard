import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, UserCircle } from 'lucide-react';

const Blog = () => {
  const navigate = useNavigate();
  
  const blogPosts = [
    {
      id: 1,
      title: 'The Evolution of AI Art Generation',
      excerpt: 'A look at how AI art generation has evolved over the years and what it means for the future of creativity.',
      author: 'Sarah Chen',
      date: 'May 15, 2023',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=1200&h=800&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Creating Stunning Landscapes with Text Prompts',
      excerpt: 'Learn how to craft effective text prompts to generate beautiful landscape artwork with Neura Paint.',
      author: 'Michael Rodriguez',
      date: 'June 3, 2023',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&h=800&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'The Ethics of AI-Generated Art',
      excerpt: 'Exploring the ethical considerations and implications of creating and selling AI-generated artwork.',
      author: 'Alex Johnson',
      date: 'July 10, 2023',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200&h=800&auto=format&fit=crop'
    },
    {
      id: 4,
      title: "From Sketch to Masterpiece: Using Neura Paint's Sketch Feature",
      excerpt: 'A step-by-step guide to transforming your rough sketches into polished artwork with AI assistance.',
      author: 'Emily Wong',
      date: 'August 22, 2023',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&h=800&auto=format&fit=crop'
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2 text-center">Neura Paint Blog</h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Insights, tutorials, and news about AI art generation, digital creativity, and the future of artistic expression.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden h-full flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4" /> {post.author}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-0">
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <span className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" /> {post.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> {post.readTime}
                  </span>
                </div>
                <Button variant="outline" size="sm">Read More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
