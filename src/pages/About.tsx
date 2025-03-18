import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">About Neura Paint</h1>
        
        <div className="space-y-8 prose max-w-none">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p>
              At Neura Paint, we're revolutionizing the way art is created, bought, and sold through the power of artificial intelligence. Our mission is to democratize artistic creation and enable anyone to bring their creative visions to life, regardless of their artistic skill level.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">The Platform</h2>
            <p>
              Neura Paint combines cutting-edge AI technology with an intuitive interface to help users generate stunning artwork based on text prompts or sketches. Whether you're a professional artist looking to expand your toolset or someone who has always wanted to create art but lacked the technical skills, Neura Paint is designed for you.
            </p>
            <p>
              Our platform also serves as a marketplace where creators can sell their AI-generated artworks to collectors around the world, fostering a new economy of digital art creation and collection.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p>
              Neura Paint was founded by a team of artists, engineers, and entrepreneurs who share a passion for the intersection of technology and creativity. We believe that AI is not replacing human creativity but enhancing it, opening new possibilities for artistic expression that were previously unimaginable.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Innovation:</strong> We push the boundaries of what's possible with AI art generation.</li>
              <li><strong>Accessibility:</strong> We make art creation accessible to everyone, regardless of skill level.</li>
              <li><strong>Community:</strong> We foster a supportive community of creators and collectors.</li>
              <li><strong>Fair Compensation:</strong> We ensure creators are fairly compensated for their work.</li>
              <li><strong>Ethical AI:</strong> We are committed to developing and using AI in an ethical and responsible manner.</li>
            </ul>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
