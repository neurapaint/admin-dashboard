import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const DMCA = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">DMCA Policy</h1>
        
        <div className="prose max-w-none space-y-8">
          <section>
            <p className="text-muted-foreground">Last updated: June 1, 2023</p>
            
            <p>
              Neura Paint Inc. respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we will respond expeditiously to claims of copyright infringement that are reported to our designated copyright agent.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">DMCA Notice of Alleged Infringement</h2>
            
            <p>
              If you are a copyright owner, or authorized on behalf of one, and you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please submit a notification pursuant to the DMCA by providing our copyright agent with the following information in writing:
            </p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
              <li>Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at a single online site are covered by a single notification, a representative list of such works at that site.</li>
              <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit the service provider to locate the material.</li>
              <li>Information reasonably sufficient to permit the service provider to contact the complaining party, such as an address, telephone number, and, if available, an electronic mail address at which the complaining party may be contacted.</li>
              <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
            </ul>
            
            <p className="mt-6">
              Please note that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material or activity is infr inging may be subject to liability.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Counter-Notice</h2>
            
            <p>
              If you believe that your content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law, to post and use the content, you may submit a counter-notice to our copyright agent with the following information:
            </p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Your physical or electronic signature.</li>
              <li>Identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled.</li>
              <li>A statement that you have a good faith belief that the content was removed or disabled as a result of mistake or a misidentification of the content.</li>
              <li>Your name, address, telephone number, and e-mail address, and a statement that you consent to the jurisdiction of the federal court in the United States for the judicial district in which your address is located, or if your address is outside of the United States, for any judicial district in which the service provider may be found, and that you will accept service of process from the person who provided notification of the alleged infringement.</li>
            </ul>
            
            <p className="mt-6">
              Please note that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material or activity was removed or disabled by mistake or misidentification may be subject to liability.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Repeat Infringers</h2>
            
            <p>
              It is our policy to terminate the accounts of users who are determined to be repeat infringers. A repeat infringer is a user who has been notified of infringing activity more than twice and/or has had content removed from the service more than twice.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            
            <p>
              Please contact our designated copyright agent at:
            </p>
            
            <p className="mt-4">
              DMCA Copyright Agent<br />
              Neura Paint Inc.<br />
              123 Innovation Drive<br />
              San Francisco, CA 94103<br />
              United States<br />
              Email: dmca@neurapaint.com
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DMCA;
