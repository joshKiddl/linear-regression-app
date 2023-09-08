import React from 'react';

function Policies() {
  return (
    <div style={{padding: '0% 10%', display: 'flex'}}>
      <section id="privacy-policy">
        <h3>Privacy Policy</h3>
        
        <h5>Information We Collect</h5>
        <p>
          The only personal information we collect is your Email Address.
        </p>
        
        <h5>How We Use Your Information</h5>
        <p>
          Your email address is used solely for account management purposes.
        </p>

        <h5>Disclosure of Your Information</h5>
        <p>
          We value your privacy. We do not share your personal information with any third parties.
        </p>

        <h5>Access and Control Over Your Information</h5>
        <p>
          Users can modify their personal information via the dashboard. For further changes or deletion requests, users can contact us directly through email.
        </p>

        <h5>Data Storage and Protection</h5>
        <p>
          All data, including personal information, is stored in Firebase Cloud Firestore and protected using Firestore's security protocols.
        </p>
      </section>

      <section id="terms-and-conditions">
        <h3>Terms and Conditions</h3>
        
        <h5>Usage Rules</h5>
        <p>
          Users are strictly prohibited from copying or replicating any part of our website or application.
        </p>

        <h5>Content & Intellectual Property</h5>
        <p>
          All content on this platform is protected under Firestore security protocols.
        </p>

        <h5>Age Restrictions</h5>
        <p>
          There are no age restrictions for using our platform.
        </p>

        <h5>Dispute Resolution</h5>
        <p>
          In case of any disputes or issues, users are advised to contact us directly.
        </p>

        <h5>Refund and Cancellation Policies</h5>
        <p>
          As our services are provided for free, there are no refund or cancellation policies in place.
        </p>
      </section>
    </div>
  );
}

export default Policies;
