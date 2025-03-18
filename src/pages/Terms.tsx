import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
        
        <div className="prose max-w-none space-y-8">
          <section>
            <p className="text-muted-foreground">Last updated: June 1, 2023</p>
            
            <p>
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Neura Paint website and service operated by Neura Paint Inc. ("us", "we", "our").
            </p>
            
            <p>
              Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
            
            <p>
              By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Accounts</h2>
            
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            
            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
            </p>
            
            <p>
              You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Content Ownership and License</h2>
            
            <p>
              Our Service allows you to generate, post, link, store, share and otherwise make available certain information, text, graphics, or other material ("Content") using AI technology.
            </p>
            
            <p>
              When you generate artwork using our Service:
            </p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>You retain ownership of the Content you create using our Service.</li>
              <li>By posting Content on our marketplace for sale, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such Content in connection with the Service and our business operations.</li>
              <li>If you sell your Content through our marketplace, the buyer receives a license to use the Content as specified in the sale terms.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Prohibited Uses</h2>
            
            <p>
              You agree not to use the Service to:
            </p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Generate or distribute offensive, harmful, or illegal content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the intellectual property rights of others</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
              <li>Use the Service to harvest or collect user information</li>
              <li>Transmit viruses, malware, or other malicious code</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Marketplace and Payments</h2>
            
            <p>
              Our Service includes a marketplace where users can buy and sell AI-generated artwork. When using the marketplace feature:
            </p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Sellers are responsible for setting appropriate prices for their artwork</li>
              <li>We charge a 5% platform fee on all sales</li>
              <li>Payments are processed through our payment processors</li>
              <li>Sellers will receive payouts according to our payout schedule and policies</li>
              <li>All sales are final unless otherwise specified</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
            
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            
            <p>
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            
            <p>
              In no event shall Neura Paint Inc., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use or alteration of your transmissions or content</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Changes</h2>
            
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            
            <p>
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            
            <p>
              If you have any questions about these Terms, please contact us at legal@neurapaint.com.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
