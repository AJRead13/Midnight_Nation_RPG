import { useNavigate } from 'react-router-dom';
import './terms.css';

function Terms() {
  const navigate = useNavigate();

  return (
    <div className="terms-page">
      <div className="terms-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <header className="terms-header">
          <h1>Terms & License</h1>
          <p className="terms-subtitle">Midnight Nation License (v1.0)</p>
          <p className="copyright">Copyright © 2025 Andrew Read. All rights reserved.</p>
        </header>

        <div className="terms-content">
          <section className="terms-intro">
            <p>
              Midnight Nation is an original tabletop role-playing game system and setting created by Andrew Read, 
              including but not limited to its game mechanics, world lore, character options, terminology, visual 
              branding, artwork, factions, and supernatural constructs.
            </p>
            <p>
              This project and all official Midnight Nation content are protected under international copyright 
              and intellectual property law.
            </p>
          </section>

          <section className="terms-section">
            <h2>Personal Use & Play</h2>
            <p>You are permitted to:</p>
            <ul>
              <li>Download, print, and copy Midnight Nation materials for personal use.</li>
              <li>Run games privately or publicly (home, online, conventions, streams).</li>
              <li>Stream, record, or broadcast gameplay sessions.</li>
              <li>Create and share free fan-made content that references or is compatible with Midnight Nation.</li>
            </ul>
            
            <div className="attribution-box">
              <h4>Attribution Required for Fan Content:</h4>
              <blockquote>
                "Midnight Nation © 2025 by Andrew Read. Used under the Midnight Nation Community License."
              </blockquote>
            </div>
            
            <p className="warning">
              You may <strong>not</strong> claim official status or authorship for any unofficial/fan material.
            </p>
          </section>

          <section className="terms-section">
            <h2>Community Content License (Fan Works)</h2>
            <p>You may create Midnight Nation–compatible content (adventures, items, NPCs, locations, etc.) as long as:</p>
            <ul>
              <li>It is distributed <strong>for free</strong>.</li>
              <li>It does <strong>not</strong> use official logos, symbols, or layout/assets from official books.</li>
              <li>It does not imply that it is official or endorsed by the creator.</li>
              <li>It includes the attribution line shown above.</li>
            </ul>

            <div className="info-box">
              <h4>You may use phrases like:</h4>
              <ul>
                <li>"Compatible with Midnight Nation"</li>
                <li>"Inspired by Midnight Nation"</li>
              </ul>
            </div>

            <p className="warning">
              You may <strong>not</strong> title your work in a way that suggests it is an official Midnight Nation 
              product (e.g. "Midnight Nation: Chicago Blackout") without written permission.
            </p>
          </section>

          <section className="terms-section commercial-section">
            <h2>Commercial Use</h2>
            <p>
              Any <strong>commercial</strong> use of Midnight Nation content requires a <strong>separate written 
              license</strong> from the creator.
            </p>

            <p>Commercial use includes (but is not limited to):</p>
            <ul>
              <li>Selling PDFs, books, or zines using Midnight Nation mechanics or setting.</li>
              <li>Crowdfunding (Kickstarter, BackerKit, etc.) for Midnight Nation–based projects.</li>
              <li>Paid VTT modules or digital assets using Midnight Nation IP.</li>
              <li>Patreon or subscription access to Midnight Nation–branded or dependent content.</li>
            </ul>

            <div className="contact-box">
              <h4>To request a commercial license, contact:</h4>
              <p>Email: <a href="mailto:contact@midnightnationrpg.com">contact@midnightnationrpg.com</a></p>
              <p>Website: <a href="https://www.midnightnationrpg.com" target="_blank" rel="noopener noreferrer">
                www.midnightnationrpg.com
              </a></p>
            </div>

            <p className="warning">
              Without explicit written permission, commercial distribution is <strong>prohibited</strong>.
            </p>
          </section>

          <section className="terms-section">
            <h2>Patreon Content</h2>
            <p>
              Content distributed through the official Midnight Nation Patreon is licensed for <strong>personal 
              use only</strong>.
            </p>
            
            <p>Subscribers may not:</p>
            <ul>
              <li>Re-upload, mirror, or redistribute paid content.</li>
              <li>Sell or repackage Patreon PDFs, modules, or assets.</li>
              <li>Claim Patreon-exclusive content as their own original work.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>Trademarks & Branding</h2>
            <p>The following are trademarks of Andrew Read:</p>
            <ul className="trademark-list">
              <li>"Midnight Nation"</li>
              <li>"Ashwood Foundation"</li>
              <li>"Covenant of St. Michael"</li>
              <li>"The Black Chamber"</li>
              <li>Their respective logos, seals, and iconography</li>
            </ul>
            
            <p className="warning">
              These may not be used in marketing, branding, or as imitated logos without written permission.
            </p>
          </section>

          <section className="terms-section revocation-section">
            <h2>Revocation</h2>
            <p>This license may be revoked for:</p>
            <ul>
              <li>Malicious use</li>
              <li>Copyright or trademark infringement</li>
              <li>False claims of official affiliation</li>
              <li>Commercial exploitation without permission</li>
            </ul>
          </section>

          <section className="terms-section contact-section">
            <h2>Contact</h2>
            <p>For permissions, licensing inquiries, or business proposals:</p>
            <div className="contact-info">
              <p>
                <strong>Email:</strong> <a href="mailto:contact@midnightnationrpg.com">contact@midnightnationrpg.com</a>
              </p>
              <p>
                <strong>Website:</strong> <a href="https://www.midnightnationrpg.com" target="_blank" rel="noopener noreferrer">
                  www.midnightnationrpg.com
                </a>
              </p>
            </div>
          </section>
        </div>

        <footer className="terms-footer">
          <p>Last Updated: November 2025</p>
          <p>Midnight Nation © 2025 Andrew Read. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Terms;
