import React from "react";
import "./contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faClock,
  faPaperPlane,
  
} from "@fortawesome/free-solid-svg-icons";



const ContactPage = () => {
  return (
    <div className="contact-container">
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Reach out with questions, feedback, or partnership inquiries.</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-card">
            <div className="contact-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <h3>Email Us</h3>
            <p>For general inquiries</p>
            <a href="mailto:contact@journal.com">contact@journal.com</a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <FontAwesomeIcon icon={faPhone} />
            </div>
            <h3>Call Us</h3>
            <p>Monday to Friday</p>
            <a href="tel:+1234567890">+1 (234) 567-890</a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <h3>Visit Us</h3>
            <p>Our office location</p>
            <address>
              123 Academic Way<br />
              Knowledge City, KC 10101
            </address>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <h3>Hours</h3>
            <p>We're available</p>
            <div className="hours">
              <p>Mon-Fri: 9am - 5pm</p>
              <p>Sat-Sun: Closed</p>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send Us a Message</h2>
          <p>Fill out the form below and we'll get back to you as soon as possible.</p>
          
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" placeholder="Enter your name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" placeholder="What's this about?" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea id="message" rows="5" placeholder="Type your message here..." required></textarea>
            </div>
            
            <button type="submit" className="submit-btn">
              Send Message <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      </div>

      <div className="contact-map">
        <iframe 
          title="Office Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215256018243!2d-73.9878446845938!3d40.7484404793279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjQiTiA3M8KwNTknMTkuNiJX!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus" 
          allowFullScreen="" 
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactPage;