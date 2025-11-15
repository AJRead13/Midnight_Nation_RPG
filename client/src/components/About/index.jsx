import infoData from '../../../../data/info.json';

function About() {
  return (
    <section id="aboutMe" className="my-5">
      <div className="my-2">
        <div className="about-header">
          <h2>Welcome to Midnight Nation</h2>
          <p className="subtitle">A Tabletop RPG of Supernatural Horror and Secret Wars</p>
        </div>
        
        <div className="about-content">
          <p>
            <strong>Setting:</strong> {infoData.meta.setting}
          </p>
          <p>
            <strong>Tone:</strong> {infoData.meta.tone}
          </p>
          
          <div className="about-description">
            <h3>What is Midnight Nation?</h3>
            <p>{infoData.core_concepts.overview}</p>
            
            <p>
              In the shadows of post-war America, a hidden conflict rages between heaven and hell, 
              hunters and monsters, secret organizations and supernatural forces. Players take on 
              the roles of hunters, investigators, soldiers, and those touched by supernatural bloodlines 
              as they navigate a world where the truth is stranger and more dangerous than anyone imagines.
            </p>

            <h3>Game Features</h3>
            <ul>
              <li><strong>Pulp Noir Atmosphere:</strong> Set in 1947-1955 America, combining detective stories, 
              gangster conflicts, and supernatural horror</li>
              <li><strong>Hybrid Characters:</strong> Play as mundane humans or those with supernatural heritage—
              celestials, lycanthropes, vampires, and more</li>
              <li><strong>Dynamic Dice System:</strong> Roll 2d6 with stacking dice mechanics based on your 
              competencies and talents</li>
              <li><strong>Location-Based Wounds:</strong> Inspired by tactical wargames, track damage to specific 
              body parts with severity levels</li>
              <li><strong>Fate Pool:</strong> Spend Fate points for cinematic heroics and desperate last stands</li>
              <li><strong>Secret Organizations:</strong> Join or oppose factions like the Ashwood Foundation, 
              Covenant of St. Michael, or Black Chamber</li>
            </ul>

            <h3>Get Started</h3>
            <p>
              Navigate through the pages to explore the <strong>Lore</strong> of this dark world, 
              learn the <strong>Rules</strong> for playing, create your <strong>Character</strong>, 
              and browse the <strong>Items</strong> available to your hunters and investigators.
            </p>
            
            <p className="version-info">
              <em>Version: {infoData.version} - {infoData.editorial_notes.status}</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
