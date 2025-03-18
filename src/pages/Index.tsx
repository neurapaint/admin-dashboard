import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brush, ShoppingBag, Users, Wallet, Palette, Sparkles, Cpu, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <section className="py-24 px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <div className="inline-block mb-4">
              <div className="bg-primary/5 rounded-full px-4 py-2 text-sm font-medium inline-flex items-center gap-2">
                <Sparkles size={14} className="text-brand-blue" />
                <span>Powerful Features</span>
              </div>
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Everything you need to create and sell AI art
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform combines powerful AI tools with a seamless marketplace experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <FeatureCard 
              icon={<Brush className="text-brand-blue" size={24} />}
              title="Sketch to Masterpiece"
              description="Use our intuitive drawing tools to create a sketch, then let AI transform it into stunning artwork"
              index={0}
            />
            <FeatureCard 
              icon={<Cpu className="text-brand-purple" size={24} />}
              title="Advanced AI Models"
              description="Powered by Stability AI for unparalleled image generation quality and creative control"
              index={1}
            />
            <FeatureCard 
              icon={<ShoppingBag className="text-brand-blue" size={24} />}
              title="Built-in Marketplace"
              description="Sell your AI-generated artwork directly to buyers worldwide with secure transactions"
              index={2}
            />
            <FeatureCard 
              icon={<Wallet className="text-brand-purple" size={24} />}
              title="Simple Payments"
              description="Get paid via PayPal with our automatic payment system. We handle the hard stuff for you"
              index={3}
            />
            <FeatureCard 
              icon={<Image className="text-brand-blue" size={24} />}
              title="Portfolio Management"
              description="Organize and showcase your artwork with our intuitive dashboard and gallery tools"
              index={4}
            />
            <FeatureCard 
              icon={<Users className="text-brand-purple" size={24} />}
              title="Growing Community"
              description="Join a vibrant community of artists and collectors passionate about AI-generated art"
              index={5}
            />
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <div className="bg-primary/5 rounded-full px-4 py-2 text-sm font-medium inline-flex items-center gap-2">
                  <Palette size={14} className="text-brand-purple" />
                  <span>Simple Process</span>
                </div>
              </div>
              
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                How Bolt.diy Works
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From sketch to sale in just a few easy steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector Line (desktop only) */}
              <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-muted">
                <div className="absolute left-1/3 top-1/2 w-3 h-3 rounded-full bg-brand-blue -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute left-2/3 top-1/2 w-3 h-3 rounded-full bg-brand-purple -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              
              {/* Steps */}
              <div className="text-center p-6">
                <div className="w-14 h-14 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-6">
                  <span className="font-bold text-brand-blue">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Create</h3>
                <p className="text-muted-foreground">
                  Sketch your idea using our drawing tools or upload a reference image
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-14 h-14 rounded-full bg-brand-purple/10 flex items-center justify-center mx-auto mb-6">
                  <span className="font-bold text-brand-purple">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Generate</h3>
                <p className="text-muted-foreground">
                  Let our AI transform your sketch into a stunning, high-quality artwork
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-14 h-14 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-6">
                  <span className="font-bold text-brand-blue">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Sell</h3>
                <p className="text-muted-foreground">
                  List your creation on the marketplace and earn money from sales
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 px-6 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
              Ready to turn your imagination into art?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10">
              Join thousands of creators who are already using Bolt.diy to generate and sell amazing AI art
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" className="rounded-full h-14 px-8 text-base" asChild>
                <Link to="/generate">
                  Start Creating <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base border-primary-foreground/20 hover:bg-primary-foreground/10" asChild>
                <Link to="/marketplace">Explore Marketplace</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
