import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRss } from "@fortawesome/free-solid-svg-icons"; 
import { faFacebook, faLinkedin, faYoutube, faTwitter } from "@fortawesome/free-brands-svg-icons";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">CAIRN.INFO</h3>
          <p className="footer-description">
            Cairn.info, plateforme de référence pour les publications scientifiques
            francophones, vise à favoriser la découverte d'une recherche de qualité.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="/rss" aria-label="RSS Feed">
              <FontAwesomeIcon icon={faRss} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Navigation</h3>
          <Link to="/journals" className="footer-link">Revues</Link>
          <Link to="/books" className="footer-link">Ouvrages</Link>
          <Link to="/magazines" className="footer-link">Magazines</Link>
          <Link to="/collections" className="footer-link">Dossiers</Link>
          <Link to="/search" className="footer-link">Recherche avancée</Link>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Domaines</h3>
          <Link to="/disciplines/shs" className="footer-link">Sciences Humaines et Sociales</Link>
          <Link to="/disciplines/stm" className="footer-link">Sciences, techniques et médecine</Link>
          <Link to="/disciplines/law" className="footer-link">Droit et Administration</Link>
          <Link to="/disciplines/economics" className="footer-link">Économie et Gestion</Link>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Support</h3>
          <Link to="/contact" className="footer-link">Contact</Link>
          <Link to="/help" className="footer-link">Aide</Link>
          <Link to="/faq" className="footer-link">FAQ</Link>
          <Link to="/access" className="footer-link">Accès institutionnel</Link>
          <Link to="/pricing" className="footer-link">Abonnements</Link>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">À propos</h3>
          <Link to="/about" className="footer-link">Notre mission</Link>
          <Link to="/publishers" className="footer-link">Éditeurs partenaires</Link>
          <Link to="/team" className="footer-link">Équipe</Link>
          <Link to="/careers" className="footer-link">Carrières</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-legal">
          <Link to="/terms" className="footer-legal-link">Conditions d'utilisation</Link>
          <Link to="/privacy" className="footer-legal-link">Politique de confidentialité</Link>
          <Link to="/cookies" className="footer-legal-link">Préférences cookies</Link>
          <span className="footer-copyright">© {new Date().getFullYear()} Cairn.info</span>
        </div>
        <div className="footer-partners">
          <span>Avec le soutien de</span>
          <div className="partner-logos">
            <Link to="/partners/cnl" className="partner-logo">CNL</Link>
            <Link to="/partners/ministry" className="partner-logo">Ministère de la Culture</Link>
            <Link to="/partners/anu" className="partner-logo">ANR</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;