import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const Careers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Careers at Neura Paint</h1>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Open Positions Currently</h2>
              <p className="text-muted-foreground">
                We're not actively hiring at the moment, but we're always interested in connecting with talented individuals.
              </p>
              <p className="mt-4">
                If you're passionate about AI, art, and technology, feel free to send your resume to <span className="font-medium">careers@neurapaint.com</span> and we'll keep you in mind for future opportunities.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Why Work With Us?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="font-medium text-lg mb-2">Innovative Technology</h3>
                <p className="text-muted-foreground">Work at the cutting edge of AI and art technology, helping to shape the future of creative expression.</p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-medium text-lg mb-2">Remote-First Culture</h3>
                <p className="text-muted-foreground">Enjoy the flexibility of our remote-first approach, allowing you to work from anywhere in the world.</p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-medium text-lg mb-2">Collaborative Environment</h3>
                <p className="text-muted-foreground">Join a team that values diverse perspectives and encourages open communication and collaboration.</p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-medium text-lg mb-2">Growth Opportunities</h3>
                <p className="text-muted-foreground">Develop your skills and advance your career in a supportive environment that invests in your professional growth.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
