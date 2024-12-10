import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="privacypolicy-container">
      <header className="privacypolicy-header">
        <h1 className="privacypolicy-title">Privacy Policy</h1>
        <p className="privacypolicy-last-updated">Last updated: August 31, 2024</p>
      </header>

      <section className="privacypolicy-section">
        <p>
          This Privacy Policy describes our policies and procedures on the collection, use, and
          disclosure of your information when you use our service. It also informs you about your
          privacy rights and how the law protects you.
        </p>
        <p>
          We use your personal data to provide and improve the service. By using the service, you
          agree to the collection and use of information in accordance with this Privacy Policy.
        </p>
      </section>

      <section className="privacypolicy-section">
        <h2>Interpretation and Definitions</h2>
        <h3>Interpretation</h3>
        <p>
          Words with the initial letter capitalized have specific meanings. These definitions apply
          regardless of whether they appear in singular or plural form.
        </p>

        <h3>Definitions</h3>
        <p>For the purposes of this Privacy Policy:</p>
        <ul>
          <li>
            <strong>Account:</strong> A unique account created for you to access our service or parts
            of our service.
          </li>
          <li>
            <strong>Affiliate:</strong> An entity that controls, is controlled by, or is under
            common control with a party. "Control" means ownership of 50% or more of shares, equity
            interests, or voting rights for electing directors or managing authority.
          </li>
          <li>
            <strong>Cookies:</strong> Small files placed on your computer, mobile device, or other
            devices by a website.
          </li>
        </ul>
      </section>

      <section className="privacypolicy-section">
        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, you can contact us:</p>
        <ul>
          <li>
            <strong>By email:</strong> <a href="mailto:info@sandhut.in">info@sandhut.in</a>
          </li>
        </ul>
      </section>

      {/* <footer className="privacypolicy-footer">SandHut Sports Club &copy; 2024</footer> */}
    </div>
  );
};

export default PrivacyPolicy;
