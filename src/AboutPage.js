import React from "react";
import "./about.css";

const AboutPage = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1 className="about-title">About ScholarLib</h1>
        <p className="about-subtitle">Your gateway to academic excellence</p>
      </section>

      <section className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            ScholarLib is dedicated to providing open access to high-quality academic 
            resources across various disciplines. We believe knowledge should be 
            freely available to researchers, students, and lifelong learners worldwide.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Collection</h2>
          <p>
            We curate a diverse collection of peer-reviewed journals, research papers,
            and academic publications. Our platform currently hosts over 10,000 articles
            from leading institutions and independent researchers.
          </p>
        </div>

        <div className="about-section">
          <h2>For Researchers</h2>
          <p>
            ScholarLib provides tools for researchers to share their work, collaborate
            with peers, and track the impact of their publications. Our platform supports
            the entire research lifecycle from discovery to dissemination.
          </p>
        </div>

        <div className="about-team">
          <h2>Our Team</h2>
          <div className="team-members">
            <div className="team-card">
              <div className="team-avatar"></div>
              <h3>Dr. Salhi Abdelkader</h3>
              <p>Founder & Lead Researcher</p>
            </div>
            <div className="team-card">
              <div className="team-avatar"></div>
              <h3>Senouci Mohamed Arezki</h3>
              <p>ana huwa the founder and director</p>
            </div>
       
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;