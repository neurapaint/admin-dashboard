import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        
        <div className="prose max-w-none space-y-8">
          <section>
            <p className="text-muted-foreground">Last updated: June 1, 2023</p>
            
            <p>
              Neura Paint Inc. ("us", "we", or "our") operates the Neura Paint website and service (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
            
            <p>
              We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Information Collection and Use</h2>
            
            <p>
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Types of Data Collected</h3>
            
            <h4 className="text-lg font-medium mt-4 mb-2">Personal Data</h4>
            <p>
              While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Username</li>
              <li>Payment information</li>
              <li>Cookies and Usage Data</li>
            </ul>
            
            <h4 className="text-lg font-medium mt-4 mb-2">Usage Data</h4>
            <p>
              We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
            </p>
            
            <h4 className="text-lg font-medium mt-4 mb-2">Generated Content Data</h4>
            <p>
              When you use our Service to generate content, we collect and store the prompts, parameters, and resulting generated content to provide, maintain, and improve our Service.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Use of Data</h2>
            
            <p>
              Neura Paint uses the collected data for various purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain the Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer care and support</li>
              <li>To provide analysis or valuable information so that we can improve the Service</li>
              <li>To monitor the usage of the Service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To process payments and maintain financial records</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            
            <p>
              Neura Paint will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
            </p>
            <p>
              We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of our Service, or we are legally obligated to retain this data for longer time periods.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Data Protection Rights</h2>
            
            <p>
              If you are a resident of the European Economic Area (EEA), you have certain data protection rights. Neura Paint aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
            </p>
            <p>
              If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please contact us.
            </p>
            <p>
              In certain circumstances, you have the following data protection rights:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The right to access, update or to delete the information we have on you</li>
              <li>The right of rectification</li>
              <li>The right to object</li>
              <li>The right of restriction</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
            
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
            <p>
              We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>By email: privacy@neurapaint.com</li>
              <li>By visiting the contact page on our website</li>
            </ul>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
