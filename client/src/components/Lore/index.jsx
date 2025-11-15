import infoData from '../../../../info.json';

function Lore() {
  const { meta, core_concepts, organizations } = infoData;

  return (
    <div className="lore-container">
      <section className="lore-section">
        <h3>Setting & Tone</h3>
        <div className="lore-content">
          <p><strong>Time Period:</strong> {meta.setting}</p>
          <p><strong>Tone:</strong> {meta.tone}</p>
          <p className="lore-description">{core_concepts.overview}</p>
        </div>
      </section>

      <section className="lore-section">
        <h3>The Secret War</h3>
        <div className="lore-content">
          <p>
            In the shadows of post-war America, a hidden conflict rages. Heaven and Hell are not 
            mere theological concepts—they are real, tangible forces locked in an eternal struggle. 
            Monsters that haunt folklore and nightmares walk among humanity, disguised or hiding in 
            plain sight.
          </p>
          <p>
            The war isn't fought on battlefields with armies, but in back alleys, abandoned warehouses, 
            smoky jazz clubs, and the corridors of power. Secret organizations work tirelessly to maintain 
            the veil of normalcy while combating supernatural threats that could tear civilization apart.
          </p>
        </div>
      </section>

      <section className="lore-section">
        <h3>Organizations</h3>
        <div className="organizations-grid">
          <div className="organization-card">
            <h4>Ashwood Foundation</h4>
            <p className="org-role">{organizations["Ashwood Foundation"].role}</p>
            <p className="org-tone"><em>{organizations["Ashwood Foundation"].tone}</em></p>
            <p>
              The Ashwood Foundation operates with a single-minded purpose: purge the abnormal. 
              Founded by wealthy industrialists who witnessed the horrors of the supernatural firsthand, 
              they believe humanity's only hope lies in the complete eradication of all non-human entities. 
              No compromise, no negotiation.
            </p>
          </div>

          <div className="organization-card">
            <h4>Covenant of St. Michael</h4>
            <p className="org-role">{organizations["Covenant of St. Michael"].role}</p>
            <p className="org-tone"><em>{organizations["Covenant of St. Michael"].tone}</em></p>
            <p>
              Not all supernatural beings are evil, and the Covenant knows this. This ancient order 
              of investigators and warriors takes a more measured approach—distinguish the truly 
              malevolent from the misunderstood, then act accordingly. Their members include priests, 
              scholars, and those touched by the divine.
            </p>
          </div>

          <div className="organization-card">
            <h4>Black Chamber</h4>
            <p className="org-role">{organizations["Black Chamber"].role}</p>
            <p className="org-tone"><em>{organizations["Black Chamber"].tone}</em></p>
            <p>
              A shadow government agency that emerged from wartime intelligence operations, the Black 
              Chamber sees the supernatural as a resource to be exploited for national security. They 
              recruit gifted individuals, capture and study creatures, and aren't afraid to make deals 
              with devils if it serves America's interests.
            </p>
          </div>
        </div>
      </section>

      <section className="lore-section">
        <h3>The Bloodlines</h3>
        <div className="lore-content">
          <p>
            Some individuals are born different. Celestial blood flows through the veins of those 
            descended from angels or demons. Lycanthropes carry the ancient curse that transforms 
            them into beasts. Vampires walk the line between humanity and monstrosity, forever 
            hungering for blood.
          </p>
          <p>
            These bloodlines grant extraordinary abilities, but they come with a price. The celestial-born 
            cannot lie without suffering. Lycanthropes risk losing themselves to the beast. Vampires 
            must constantly manage their thirst while hiding from sunlight—or learn to walk in it at 
            great cost.
          </p>
          <p>
            In this world, you might be the hunter or the hunted—or both.
          </p>
        </div>
      </section>

      <section className="lore-section">
        <h3>The Midnight Hour</h3>
        <div className="lore-content">
          <p>
            They call it the Midnight Hour—not a specific time, but a state of being. When the veil 
            between worlds grows thin. When ordinary people catch glimpses of the truth. When hunters 
            face down horrors in the darkness, hoping the sun will rise again.
          </p>
          <p>
            This is a world of noir detectives stumbling into occult mysteries, soldiers returning 
            from war only to find a different battlefield at home, and performers using their gifts 
            to manipulate both mortal and monster alike.
          </p>
          <p>
            <strong>Welcome to Midnight Nation. The war is real. Which side will you fight for?</strong>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Lore;
