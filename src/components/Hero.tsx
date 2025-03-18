import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = event;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      containerRef.current.style.setProperty('--mouse-x', x.toString());
      containerRef.current.style.setProperty('--mouse-y', y.toString());
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-6 overflow-hidden"
      style={{
        background: 'radial-gradient(circle at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%), rgba(240, 240, 255, 0.15), transparent 25%)'
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dot-pattern bg-[length:20px_20px] opacity-50"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-[20%] left-[15%] w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-[20%] right-[15%] w-72 h-72 bg-brand-purple/10 rounded-full blur-3xl animate-float" style={{animationDelay: '-3s'}}></div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-block mb-6">
          <div className="glass-card-light rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2">
            <span className="bg-brand-blue/10 text-brand-blue p-1 rounded-full">
              <Sparkles size={14} />
            </span>
            <span>Transform your sketches into masterpieces with AI</span>
          </div>
        </div>
        
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight fade-in">
          <span className="block">Where Imagination Meets</span>
          <span className="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent animate-gradient-shift">
            Artificial Intelligence
          </span>
        </h1>
        
        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-10 slide-up" style={{animationDelay: '0.1s'}}>
          Sketch your ideas and let our AI transform them into stunning artwork. 
          Join our creative marketplace and turn your imagination into income.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 slide-up" style={{animationDelay: '0.2s'}}>
          <Button size="lg" className="rounded-full h-14 px-8 text-base" asChild>
            <Link to="/generate">
              Start Creating <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
          
          <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base" asChild>
            <Link to="/marketplace">Explore Marketplace</Link>
          </Button>
        </div>
      </div>
      
      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
