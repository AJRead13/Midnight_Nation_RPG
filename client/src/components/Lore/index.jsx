import { useState } from 'react';
import infoData from '../../../../data/info.json';
import organizationsData from '../../../../data/organizations.json';
import bloodlinesData from '../../../../data/bloodlines.json';
import backgroundsData from '../../../../data/backgrounds.json';
import classesData from '../../../../data/classes.json';

function Lore() {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showOrgModal, setShowOrgModal] = useState(false);

  const sections = [
    { id: 'overview', title: 'The World' },
    { id: 'secret-war', title: 'The Secret War' },
    { id: 'organizations', title: 'Organizations' },
    { id: 'bloodlines', title: 'Bloodlines' },
    { id: 'society', title: 'Society & Culture' },
    { id: 'professions', title: 'Professions & Roles' },
    { id: 'threats', title: 'Threats & Dangers' }
  ];

  const openOrgModal = (orgName) => {
    const orgData = organizationsData.organizations.find(org => org.name === orgName);
    setSelectedOrg(orgData);
    setShowOrgModal(true);
  };

  const closeOrgModal = () => {
    setShowOrgModal(false);
    setSelectedOrg(null);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'secret-war':
        return <SecretWarSection />;
      case 'organizations':
        return <OrganizationsSection openOrgModal={openOrgModal} />;
      case 'bloodlines':
        return <BloodlinesSection />;
      case 'society':
        return <SocietySection />;
      case 'professions':
        return <ProfessionsSection />;
      case 'threats':
        return <ThreatsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="lore-container">
      <nav className="lore-nav">
        <h3>Lore Sections</h3>
        <ul className="lore-menu">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                className={activeSection === section.id ? 'active' : ''}
                onClick={() => setActiveSection(section.id)}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="lore-content">
        {renderContent()}
      </div>
      
      {showOrgModal && selectedOrg && (
        <OrganizationModal selectedOrg={selectedOrg} closeOrgModal={closeOrgModal} />
      )}
    </div>
  );
}

function OverviewSection() {
  const { meta, core_concepts } = infoData;
  return (
    <section>
      <h3>Setting & Tone</h3>
      <div className="lore-subsection">
        <p><strong>Time Period:</strong> {meta.setting}</p>
        <p><strong>Tone:</strong> {meta.tone}</p>
        <p className="lore-description">{core_concepts.overview}</p>
      </div>

      <div className="lore-subsection">
        <h4>The Midnight Hour</h4>
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
        <p className="emphasis-text">
          <strong>Welcome to Midnight Nation. The war is real. Which side will you fight for?</strong>
        </p>
      </div>

      <div className="lore-subsection">
        <h4>Post-War America</h4>
        <p>
          The Second World War ended, but for those who know the truth, it never really stopped. 
          The boys came home with medals and nightmares, having seen things in bombed-out churches 
          and dark forests that no after-action report could explain. Europe's ancient horrors 
          followed them back across the Atlantic, mingling with America's own buried secrets.
        </p>
        <p>
          Cities are growing, highways are being built, television is entering homes, and rock 'n' 
          roll is on the radio. But beneath this veneer of prosperity and normalcy, the darkness 
          spreads. Every alleyway might hide a monster. Every government office might contain an 
          agent of something otherworldly. Every seemingly random death might be part of the 
          eternal struggle.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>The Veil</h4>
        <p>
          Most people go their entire lives without knowing the truth. There's a kind of psychic 
          barrier—some call it "the Veil"—that prevents ordinary minds from processing supernatural 
          events. They'll rationalize away vampires as gang violence, werewolves as wild dogs, and 
          demonic possessions as mental illness. It's not a conspiracy keeping them ignorant; it's 
          self-protection. The human mind wasn't meant to comprehend these horrors.
        </p>
        <p>
          But some people see through the Veil. Whether through trauma, bloodline, or sheer force 
          of will, they've awakened to the truth. They can never go back. The world of shadows and 
          monsters is now their reality, and they must choose how to survive in it—or fight against it.
        </p>
      </div>
    </section>
  );
}

function SecretWarSection() {
  return (
    <section>
      <h3>The Secret War</h3>
      <div className="lore-subsection">
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

      <div className="lore-subsection">
        <h4>The Players</h4>
        <p>
          <strong>Heaven's Agenda:</strong> Angels and their agents work subtly, guiding humanity 
          toward redemption and enlightenment. They rarely intervene directly, preferring to inspire 
          and empower mortal champions. But when they do act, it's with devastating divine authority. 
          Heaven doesn't want to control humanity—it wants humanity to choose righteousness freely.
        </p>
        <p>
          <strong>Hell's Ambition:</strong> Demons seek to corrupt, possess, and ultimately claim 
          human souls. Unlike the popular conception, Hell isn't unified. Different demon lords pursue 
          different agendas: some want to drag humanity into damnation, others seek to overthrow the 
          divine order entirely, and a few simply revel in chaos for its own sake. What they have in 
          common is a profound understanding of human weakness.
        </p>
        <p>
          <strong>The Monsters:</strong> Not everything supernatural fits into the Heaven-Hell paradigm. 
          Vampires, werewolves, ghosts, cryptids, and stranger things have their own origins and 
          motivations. Some predate Christianity itself. They pursue survival, power, revenge, or 
          purposes incomprehensible to mortal minds. Many are just trying to exist in a world that 
          fears and hunts them.
        </p>
        <p>
          <strong>Humanity:</strong> Mortal humans are simultaneously the prize, the battlefield, and 
          increasingly, the warriors. Some fight to protect the innocent, others to gain power, and 
          still others simply to survive another day. Organizations like the Ashwood Foundation, the 
          Covenant of St. Michael, and the Black Chamber represent different philosophies on how to 
          deal with the supernatural—and they're often as much at odds with each other as with the 
          monsters they hunt.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>The Stakes</h4>
        <p>
          If the truth became public knowledge, civilization would collapse. Panic, witch hunts, and 
          societal breakdown would make the supernatural threats look tame by comparison. That's why 
          all sides—even most monsters—work to maintain secrecy. The war must remain hidden.
        </p>
        <p>
          But the balance is fragile. Every year brings new incursions, new cults, new horrors bubbling 
          up from the darkness. The organizations that fight this war are stretched thin, their members 
          dying faster than they can be replaced. Every victory is temporary; every defeat could be 
          catastrophic.
        </p>
        <p>
          And hanging over everything is the question: What happens if one side wins? Would humanity 
          really be better off under Heaven's benevolent dictatorship? Would Hell's triumph mean 
          eternal torment or just a different kind of freedom? And if humanity somehow won, driving 
          out all supernatural forces, what would they become in the process?
        </p>
      </div>
    </section>
  );
}

function OrganizationsSection({ openOrgModal }) {
  const { organizations } = infoData;
  return (
    <section>
      <h3>Organizations</h3>
      <p className="lore-description">
        Multiple factions wage the Secret War, each with their own philosophy, methods, and vision 
        for humanity's future. These organizations recruit, train, and deploy operatives across 
        America and beyond. Some are allies, some are enemies, and some are both depending on the 
        situation.
      </p>

      <div className="organizations-grid">
        <button 
          className="organization-card org-button"
          onClick={() => openOrgModal('Ashwood Foundation')}
        >
          <h4>Ashwood Foundation</h4>
          <p className="org-role">{organizations["Ashwood Foundation"].role}</p>
          <p className="org-tone"><em>{organizations["Ashwood Foundation"].tone}</em></p>
          <p>
            The Ashwood Foundation operates with a single-minded purpose: purge the abnormal. 
            Founded by wealthy industrialists and war veterans who witnessed the horrors of the 
            supernatural firsthand, they believe humanity's only hope lies in the complete eradication 
            of all non-human entities. Their motto rings clear: "Preservation through purgation." 
            No compromise, no negotiation, no mercy.
          </p>
          <p className="click-hint">Click to learn more...</p>
        </button>

        <button 
          className="organization-card org-button"
          onClick={() => openOrgModal('Covenant of St. Michael')}
        >
          <h4>Covenant of St. Michael</h4>
          <p className="org-role">{organizations["Covenant of St. Michael"].role}</p>
          <p className="org-tone"><em>{organizations["Covenant of St. Michael"].tone}</em></p>
          <p>
            Not all supernatural beings are evil, and the Covenant knows this. This ancient order 
            of investigators, exorcists, and spiritual warriors takes a more measured approach—distinguish 
            the truly malevolent from the misunderstood, then act with justice and mercy. Their members 
            include priests, scholars, and those touched by the divine. "In darkness, truth. In truth, mercy."
          </p>
          <p className="click-hint">Click to learn more...</p>
        </button>

        <button 
          className="organization-card org-button"
          onClick={() => openOrgModal('The Black Chamber')}
        >
          <h4>The Black Chamber</h4>
          <p className="org-role">{organizations["Black Chamber"].role}</p>
          <p className="org-tone"><em>{organizations["Black Chamber"].tone}</em></p>
          <p>
            A shadow government agency that emerged from wartime intelligence operations and Cold War 
            paranoia, the Black Chamber sees the supernatural as a resource to be exploited for national 
            security and strategic advantage. They capture creatures, weaponize occult forces, and recruit 
            gifted individuals—all in the name of keeping America ahead in the hidden war. "Knowledge is 
            power. Power is control."
          </p>
          <p className="click-hint">Click to learn more...</p>
        </button>
      </div>

      <div className="lore-subsection">
        <h4>Other Factions</h4>
        <p>
          Beyond the major organizations, countless smaller groups operate in the shadows: occult 
          societies preserving ancient knowledge, monster hunters working independently, criminal 
          enterprises exploiting supernatural assets, and cults worshiping dark powers. The landscape 
          is complex, ever-shifting, and deadly for the unprepared.
        </p>
      </div>
    </section>
  );
}

function BloodlinesSection() {
  const { bloodlines } = bloodlinesData;
  return (
    <section>
      <h3>Bloodlines</h3>
      <p className="lore-description">
        Some individuals are born different—touched by powers beyond normal human understanding. 
        Whether through ancestral heritage, mystical curse, or divine intervention, these bloodlines 
        mark their bearers as something more than mortal. They walk between worlds, never fully 
        belonging to either.
      </p>

      <div className="lore-subsection">
        <h4>Celestial</h4>
        <p>
          {bloodlines.Celestial.description} The blood of Heaven and Hell runs strong in these 
          individuals, marking them as pawns—or players—in the eternal conflict between divine 
          and infernal forces.
        </p>
        <p>
          <strong>Angelic Heritage:</strong> {bloodlines.Celestial.branches.Angelic.description} 
          Born with an inner light that can never be fully extinguished, they serve as beacons of 
          hope in dark times. Yet the weight of purity can be crushing—one lie, one moral compromise 
          can shake their very soul. Many angelic-blooded struggle with the impossible standards 
          placed upon them, both by others and by themselves.
        </p>
        <p>
          <strong>Demonic Heritage:</strong> {bloodlines.Celestial.branches.Demonic.description} 
          They feel the whispers of Hell in their blood, urging them toward selfish impulses and 
          destructive choices. Some resist and become champions against their own nature. Others 
          embrace the darkness and become living nightmares. Most walk a precarious middle path, 
          using their infernal gifts while fighting to maintain their humanity.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>Lycanthrope</h4>
        <p>
          {bloodlines.Lycanthrope.description} The Beast is both curse and blessing—it grants 
          predatory power but demands savage tribute.
        </p>
        <p>
          <strong>Wolf-blooded:</strong> {bloodlines.Lycanthrope.branches.Wolf.description} They 
          understand pack dynamics instinctively, and their loyalty to chosen companions runs deeper 
          than blood. But the wolf's rage is always there, waiting. In combat, when adrenaline surges 
          and blood is spilled, the human mind can slip away, leaving only the predator. Learning to 
          control this transformation—or knowing when to let it loose—separates the survivors from 
          the casualties.
        </p>
        <p>
          <strong>Lion-blooded:</strong> {bloodlines.Lycanthrope.branches.Lion.description} Where 
          wolves hunt in coordinated packs, lions are apex predators who command through presence 
          alone. Their pride is legendary and dangerous—retreat is not in their vocabulary, backing 
          down feels like death. They naturally assume leadership roles, and others instinctively 
          defer to them. But this regal bearing makes it nearly impossible to hide or operate subtly.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>Vampire</h4>
        <p>
          {bloodlines.Vampire.description} They are predators wearing human faces, sustained by 
          blood and shadow. The transformation into vampire-hood—whether through birth or bite—
          fundamentally changes a person. They become stronger, faster, and nearly immortal, but 
          at a terrible cost.
        </p>
        <p>
          <strong>Daywalkers:</strong> {bloodlines.Vampire.branches.Daywalker.description} Through 
          some mutation or adaptation, they can endure sunlight, though it weakens them. This allows 
          them to pass as human more easily, to maintain connections to mortal life. But the trade-off 
          is a more intense and personal hunger—they often become fixated on specific individuals, 
          creating dangerous obsessions. The ability to walk in daylight doesn't make them human; 
          it just makes them better predators.
        </p>
        <p>
          <strong>Nightwalkers:</strong> {bloodlines.Vampire.branches.Nightwalker.description} 
          These are the classic vampires of legend—supreme predators of the night, but vulnerable 
          to the sun's cleansing fire. They are physically superior to daywalkers in darkness, with 
          powers that seem almost magical: transforming to mist, dominating mortal minds, commanding 
          shadows themselves. But dawn is their executioner, and they must carefully plan every night's 
          activities to ensure they have shelter before sunrise.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>Cryptid</h4>
        <p>
          {bloodlines.Cryptid.description} America is haunted by its own unique monsters, born from 
          regional legends, Native American spirits, and the collective fears of isolated communities. 
          Those who carry cryptid blood are truly unique—there might be only a handful of others like 
          them in the entire world.
        </p>
        <p>
          <strong>Mothman-touched:</strong> {bloodlines.Cryptid.branches.Mothman.description} They 
          see disaster coming before it strikes, feel the weight of tragedy yet to unfold. Their 
          glowing red eyes mark them as harbingers, and people react with instinctive dread even 
          before conscious thought. Some use this gift to save lives, arriving just in time to 
          prevent catastrophes. Others go mad from the visions, unable to prevent the horrors they 
          foresee. The burden of prophecy is not meant for mortal minds, yet they must carry it anyway.
        </p>
        <p>
          <em>Other cryptid bloodlines exist—Wendigo, Jersey Devil, Skunk Ape, and countless others—
          each tied to specific regions and legends. Work with your GM to create a unique bloodline 
          that fits your character's story and the campaign's setting.</em>
        </p>
      </div>

      <div className="lore-subsection">
        <h4>Living with the Blood</h4>
        <p>
          Bloodline characters face unique challenges. They must hide their nature from ordinary 
          humans while navigating the supernatural underworld. Organizations like Ashwood see them 
          as abominations to be destroyed. The Covenant might offer salvation or might judge them 
          as too dangerous. The Black Chamber would love to add them to its collection of assets.
        </p>
        <p>
          Worse, they must manage the internal struggle. The angelic-blooded feel guilt over every 
          impure thought. Lycanthropes fight not to lose themselves to the Beast. Vampires balance 
          humanity against hunger. Each day is a battle to remain more human than monster, and the 
          monster always seems to be winning.
        </p>
        <p>
          Yet there is power in the blood. In a world of horrors, they have the tools to fight back. 
          They understand the supernatural in ways ordinary humans never can. They are bridges between 
          worlds, capable of incredible heroism or terrible villainy. The bloodline doesn't determine 
          the person—how they choose to use it does.
        </p>
      </div>
    </section>
  );
}

function SocietySection() {
  return (
    <section>
      <h3>Society & Culture</h3>
      <div className="lore-subsection">
        <h4>1950s America on the Surface</h4>
        <p>
          To the average citizen, life in post-war America seems idyllic. The economy is booming, 
          suburban homes are springing up everywhere, and the future looks bright. Families gather 
          around new television sets to watch <em>I Love Lucy</em> and <em>The Ed Sullivan Show</em>. 
          Teenagers dance to Elvis and Chuck Berry. The space race has captured the national imagination.
        </p>
        <p>
          But this prosperity is built on quicksand. The Korean War brought fresh trauma. The Red Scare 
          has everyone suspicious of their neighbors. Civil rights tensions are beginning to boil over. 
          And beneath it all, the supernatural war rages unnoticed by most.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>The Awakened Community</h4>
        <p>
          Those who see through the Veil form an invisible society within American society. They meet 
          in places the supernatural gather: certain jazz clubs where vampires hold court, diners that 
          serve as neutral ground, occult bookshops where real grimoires hide among the fake ones.
        </p>
        <p>
          There are unwritten rules to this shadow society. Don't expose the truth to the masses. Don't 
          start supernatural incidents that can't be covered up. Respect neutral ground. These rules 
          aren't enforced by any central authority—break them and you'll find yourself targeted by 
          multiple factions who depend on secrecy for survival.
        </p>
        <p>
          Within this community, reputation matters immensely. A monster hunter who honors deals is 
          more valuable than one who simply kills efficiently. A supernatural being who restrains their 
          nature can find allies among humans. Trust is rare and precious; betrayal is never forgotten.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>Urban Supernatural Hotspots</h4>
        <p>
          <strong>The Big Cities:</strong> New York, Chicago, Los Angeles, and other major metropolitan 
          areas are teeming with supernatural activity. Population density provides both hunting grounds 
          for predators and crowds to hide in. Every city has its vampire courts, werewolf packs claiming 
          territories, demonic cults in the penthouses and slums alike.
        </p>
        <p>
          <strong>The Highways:</strong> America's new interstate highway system is a double-edged sword. 
          It allows supernatural threats to spread faster than ever before. Hitchhiking vampires, cursed 
          travelers, and things that hunt along the lonely roads. But it also enables hunters to respond 
          more quickly to emerging threats.
        </p>
        <p>
          <strong>The Old Places:</strong> Pre-Columbian sacred sites, Civil War battlefields, Salem and 
          other locations of historical tragedy—these places have power. The Veil is thinner there. Spirits 
          linger. Rituals are more potent. Both monsters and hunters seek control of these power nexuses.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>Technology and Magic</h4>
        <p>
          The post-war technological boom hasn't gone unnoticed by the supernatural community. Some 
          embrace it: vampires using radio networks for communication, demons possessing televisions 
          to spread influence, the Black Chamber developing occult-tech hybrids.
        </p>
        <p>
          Others resist, claiming technology weakens pure magic or that it attracts unwanted attention. 
          Traditional rituals require candles and chalk, not transistors and vacuum tubes. Yet even the 
          most traditional practitioners are finding ways to adapt—ancient spells tattooed using modern 
          inks, protective wards powered by car batteries, divination performed through static on radio 
          frequencies.
        </p>
        <p>
          The truth is that magic and technology aren't opposites—they're just different tools for 
          manipulating reality. The question is which side will learn to use both most effectively first.
        </p>
      </div>
    </section>
  );
}

function ProfessionsSection() {
  const { backgrounds } = backgroundsData;
  return (
    <section>
      <h3>Professions & Roles</h3>
      <p className="lore-description">
        People come to the Secret War from all walks of life. Each profession brings unique skills, 
        perspectives, and connections that prove valuable in the fight against darkness—or the pursuit 
        of power.
      </p>

      <div className="lore-subsection">
        <h4>The Warriors</h4>
        <p>
          <strong>Soldiers:</strong> {backgrounds.Soldier.shortDescription} They've seen combat, 
          whether in WWII foxholes or Korean hills, and adapted those skills to a different kind of 
          warfare. When a vampire doesn't go down from a gunshot, they improvise. When squad tactics 
          face a demonic entity, they adapt. Military discipline and combat experience make them 
          natural survivors in the Secret War.
        </p>
        <p>
          <strong>Street Fighters:</strong> Not everyone learned to fight in the military. Some grew 
          up in neighborhoods where violence was a daily fact of life. They know how to read a room, 
          sense trouble before it starts, and finish fights quickly and brutally. Against supernatural 
          threats, that street-level cunning often proves more valuable than formal training.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>The Investigators</h4>
        <p>
          <strong>Private Eyes:</strong> {backgrounds.PrivateEye.shortDescription} They're used to 
          following leads through the city's underbelly, dealing with people who don't want to be 
          found, and piecing together truth from lies. When those cases turn supernatural, they have 
          the skills to investigate without losing their minds—or their lives. Usually.
        </p>
        <p>
          <strong>Journalists:</strong> The fourth estate has access most people don't—police reports, 
          city records, morgue photos. A journalist investigating what looks like a serial killer might 
          stumble onto a vampire's hunting pattern. The question then becomes: do they expose the truth 
          and risk societal collapse, or do they become part of the cover-up? Some journalists become 
          valuable assets to various organizations, using their access to track supernatural activity.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>The Professionals</h4>
        <p>
          <strong>Mechanics:</strong> {backgrounds.Mechanic.shortDescription} In the modern world, 
          staying mobile means staying alive. Mechanics keep the cars running, modify weapons, and 
          understand how to build the custom equipment hunters need. When you need a flamethrower 
          mounted on a Buick or an engine that can outrun a pursuing horror, you call a mechanic.
        </p>
        <p>
          <strong>Medics & Doctors:</strong> Supernatural combat leaves unusual wounds. Burns that 
          won't heal, cursed injuries, victims who've been partially drained of blood or life force. 
          Medical professionals who understand both mundane trauma and occult afflictions are worth 
          their weight in gold. They're also often the first to notice when something supernatural is 
          happening in their city—unusual death patterns, injuries that don't match the official story.
        </p>
        <p>
          <strong>Academics & Librarians:</strong> Knowledge is the most powerful weapon against the 
          unknown. Those who research ancient texts, track historical patterns, and connect dots across 
          centuries provide crucial intelligence. They identify what type of creature is hunting, what 
          its weaknesses are, and how to banish it. Their work saves lives, even if they never fire a shot.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>The Gifted</h4>
        <p>
          <strong>Mediums & Psychics:</strong> Some people are born with the ability to perceive beyond 
          the physical world. They see ghosts, sense demonic presences, or receive premonitions. Many 
          spend years thinking they're crazy before finding others like them. Once awakened to the truth, 
          they become invaluable scouts and early warning systems.
        </p>
        <p>
          <strong>Performers:</strong> Singers, actors, and artists who've mastered the manipulation of 
          emotion often find those skills translate surprisingly well to dealing with supernatural entities. 
          Vampires respect charisma. Demons can be bargained with. Even monsters respond to confidence. 
          A silver tongue can be as useful as a silver bullet.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>The Outcasts</h4>
        <p>
          <strong>Criminals:</strong> The underworld and the supernatural world have always overlapped. 
          Thieves who can slip past any lock, con artists who can sell anything, and enforcers who know 
          how to make problems disappear all find their skills valuable in the Secret War. Morality becomes 
          complicated when you're already working outside the law.
        </p>
        <p>
          <strong>The Haunted:</strong> Some people don't choose to enter the Secret War—it chooses them. 
          Trauma survivors, those who've lost loved ones to supernatural predators, individuals who've been 
          marked by dark forces. They carry scars, both physical and psychological. But those scars also 
          grant them insight and drive that others lack. They know what they're fighting for because they've 
          already lost so much.
        </p>
      </div>
    </section>
  );
}

function ThreatsSection() {
  return (
    <section>
      <h3>Threats & Dangers</h3>
      <p className="lore-description">
        The Secret War is fought against countless enemies. Some are ancient evils that predate 
        civilization. Others are modern horrors born from humanity's darkest impulses. Understanding 
        what you face is the first step to survival.
      </p>

      <div className="lore-subsection">
        <h4>The Classic Monsters</h4>
        <p>
          <strong>Vampires:</strong> Not all vampires are the same. Elder vampires may be centuries 
          old, with political power and vast resources. Newly-turned vampires are feral, driven purely 
          by bloodlust until they learn control. Some vampires form courts, maintaining elaborate 
          hierarchies and territories. Others are solitary hunters. What they share is the hunger, 
          the inhuman strength, and the vulnerability to specific weaknesses—though not all vampires 
          share the same vulnerabilities.
        </p>
        <p>
          <strong>Werewolves & Shapeshifters:</strong> The curse of lycanthropy spreads through bites 
          and bloodlines. Some werewolves retain human intelligence even in beast form; others become 
          mindless killing machines. Pack structures vary wildly—some are organized like motorcycle 
          gangs, others like military units, still others like traditional wolf packs with alpha 
          dominance. The biggest danger isn't the physical threat but the loss of control, the moment 
          when the beast takes over and friend becomes prey.
        </p>
        <p>
          <strong>Ghosts & Spirits:</strong> The dead don't always stay dead. Some spirits linger due 
          to unfinished business, others are bound by powerful emotions or trauma. Many are harmless, 
          sad echoes of what once was. But some are malevolent, capable of possession, physical 
          manifestation, or driving the living insane. Dealing with ghosts requires understanding what 
          they want—and whether it's possible to give it to them.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>Demons & Angels</h4>
        <p>
          <strong>Demonic Entities:</strong> Demons vary enormously in power and intent. Lesser demons 
          might be bound into objects or trapped in specific locations. Greater demons command legions 
          and can reshape reality in their presence. They offer bargains that seem fair but always come 
          with hidden costs. Fighting a demon directly is often suicide—outthinking it or finding its 
          true name is the key to victory.
        </p>
        <p>
          <strong>Possession:</strong> When demons take human hosts, the results are horrific. The 
          possessed retain their appearance but their behavior becomes increasingly wrong—unnatural 
          movements, impossible knowledge, casual cruelty. Exorcism is possible but dangerous for both 
          the possessed and the exorcist. The question becomes: can you save the person without unleashing 
          the demon?
        </p>
        <p>
          <strong>Angels:</strong> Don't mistake angels for benevolent. They are weapons of divine will, 
          utterly convinced of their righteousness. An angel won't negotiate, won't compromise, and won't 
          show mercy to anything it deems corrupt. When an angel intervenes, reality itself bends. Those 
          who stand in their way are annihilated. The difference between being saved by an angel and being 
          destroyed by one often comes down to whether you happen to fit their definition of righteous at 
          that moment.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>Modern Horrors</h4>
        <p>
          <strong>Cultists:</strong> Humans worshiping dark powers are sometimes more dangerous than the 
          powers themselves. They have resources, connections, and the ability to move through society 
          undetected. Some cults are ancient, preserving forbidden knowledge through generations. Others 
          are new, cobbled together from occult books and delusion. Both types are deadly—the ancient 
          cults know what they're doing, while the new ones are unpredictable and likely to accidentally 
          summon something they can't control.
        </p>
        <p>
          <strong>Corrupted Humans:</strong> Exposure to supernatural power can warp ordinary people. 
          Those who drink vampire blood without being fully turned, survivors of demonic possession, 
          individuals who've used too much dark magic—they become something in-between, neither fully 
          human nor fully supernatural. Unstable, dangerous, and often pitiable, they're victims who've 
          become victimizers.
        </p>
        <p>
          <strong>Occult Technology:</strong> The Black Chamber isn't the only group trying to weaponize 
          the supernatural. Mad scientists, rogue agencies, and ambitious entrepreneurs all seek to 
          harness dark forces for power. Their experiments create abominations: possessed machines, 
          reality-warping devices, serums that grant supernatural abilities at terrible cost. When these 
          experiments escape containment—and they always do—the cleanup is nightmarish.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>The Unknown</h4>
        <p>
          <strong>Cryptids & Anomalies:</strong> America has its own homegrown horrors that don't fit 
          neat categories. Things spotted in forests, swamps, and deserts. Creatures that might be 
          aliens, might be ancient spirits, might be something else entirely. They don't follow the 
          rules vampires and demons do. There's no book to consult, no traditional weakness to exploit. 
          Facing the truly unknown requires improvisation and courage.
        </p>
        <p>
          <strong>Places of Power:</strong> Some locations are themselves threats. Buildings where too 
          many people died, crossroads where deals with the devil were struck, sites of ancient rituals. 
          These places warp reality around them, causing hallucinations, bad luck, or worse. They attract 
          supernatural entities like moths to flame. Destroying such a location might stop the threat—or 
          might unleash whatever was being contained there.
        </p>
      </div>

      <div className="lore-subsection">
        <h4>The Greatest Threat</h4>
        <p>
          In the end, the most dangerous threat might be humanity itself. Fear drives people to extremes. 
          Ashwood's genocidal crusade could kill innocents along with monsters. The Black Chamber's 
          experiments could doom everyone. Even well-meaning hunters can become what they fight against, 
          losing their humanity in the pursuit of victory.
        </p>
        <p>
          The Secret War doesn't have a front line or an end date. It's fought every night, in every city, 
          by people who rarely know the full picture. Victory is measured in lives saved and disasters 
          prevented. Defeat is measured in the slow erosion of hope, the moment when a hunter looks in 
          the mirror and sees a monster looking back.
        </p>
        <p>
          <strong>But as long as people are willing to stand against the darkness, the war continues. 
          And that might be humanity's greatest strength.</strong>
        </p>
      </div>
    </section>
  );
}

function OrganizationModal({ selectedOrg, closeOrgModal }) {
  return (
    <div className="org-modal-overlay" onClick={closeOrgModal}>
      <div className="org-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="org-modal-close" onClick={closeOrgModal}>×</button>
        
        <div className="org-modal-header">
          <h2>{selectedOrg.name}</h2>
          <p className="org-modal-motto">"{selectedOrg.motto}"</p>
          <p className="org-modal-founded">Founded: {selectedOrg.founded}</p>
        </div>

        <div className="org-modal-body">
          <section className="org-modal-section">
            <h3>Overview</h3>
            <p>{selectedOrg.overview}</p>
          </section>

          <section className="org-modal-section">
            <h3>History</h3>
            <p>{selectedOrg.history}</p>
          </section>

          <section className="org-modal-section">
            <h3>Philosophy & Beliefs</h3>
            <ul className="org-philosophy-list">
              {selectedOrg.philosophy.map((belief, idx) => (
                <li key={idx}>{belief}</li>
              ))}
            </ul>
          </section>

          <section className="org-modal-section">
            <h3>Organizational Structure</h3>
            <div className="org-structure-grid">
              {Object.entries(selectedOrg.structure).map(([role, description]) => (
                <div key={role} className="org-structure-item">
                  <h4>{role}</h4>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="org-modal-section">
            <h3>Methods & Operations</h3>
            <ul className="org-methods-list">
              {selectedOrg.methods.map((method, idx) => (
                <li key={idx}>{method}</li>
              ))}
            </ul>
          </section>

          <section className="org-modal-section">
            <h3>Key Locations</h3>
            <ul className="org-locations-list">
              {selectedOrg.locations.map((location, idx) => (
                <li key={idx}>{location}</li>
              ))}
            </ul>
          </section>

          <section className="org-modal-section">
            <h3>Notable Members</h3>
            <div className="org-npcs-grid">
              {selectedOrg.notableNPCs.map((npc, idx) => (
                <div key={idx} className="org-npc-card">
                  <h4>{npc.name}</h4>
                  <p className="npc-role">{npc.role}</p>
                  <p className="npc-description">{npc.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="org-modal-section org-secrets-section">
            <h3>Dark Secrets</h3>
            <p className="secrets-warning">
              <em>GM Eyes Only - These secrets can drive entire story arcs</em>
            </p>
            <ul className="org-secrets-list">
              {selectedOrg.secrets.map((secret, idx) => (
                <li key={idx}>{secret}</li>
              ))}
            </ul>
          </section>

          <section className="org-modal-section">
            <h3>Using This Organization</h3>
            <div className="org-gm-notes">
              {selectedOrg.name === 'Ashwood Foundation' && (
                <>
                  <p>
                    <strong>As Allies:</strong> The Ashwood Foundation can provide military-grade 
                    equipment, intelligence on monster locations, and backup in combat situations. 
                    However, they'll expect absolute loyalty and may demand PCs participate in 
                    morally questionable purges.
                  </p>
                  <p>
                    <strong>As Enemies:</strong> Ashwood makes for relentless antagonists who see 
                    any supernatural PC as a target for elimination. They're well-funded, heavily 
                    armed, and utterly convinced of their righteousness. If PCs try to protect an 
                    innocent supernatural being, Ashwood will brand them as traitors to humanity.
                  </p>
                  <p>
                    <strong>Story Hooks:</strong> Dr. Graves secretly reaches out to the PCs for help 
                    protecting a benevolent spirit. Marcus "Buckshot" Hale becomes obsessed with hunting 
                    a PC werewolf. Silas Vane recruits the party for a major operation, but the target 
                    isn't as monstrous as claimed.
                  </p>
                </>
              )}
              {selectedOrg.name === 'Covenant of St. Michael' && (
                <>
                  <p>
                    <strong>As Allies:</strong> The Covenant offers spiritual guidance, access to 
                    powerful rituals and holy artifacts, and a network of safe houses. They're the 
                    most reasonable faction and will judge PCs by their actions, not their nature. 
                    Supernatural PCs who prove themselves can find true acceptance here.
                  </p>
                  <p>
                    <strong>As Enemies:</strong> If PCs cross moral lines or ally with true evil, 
                    the Covenant becomes a formidable foe. Their exorcists can banish entities, their 
                    wards can trap the supernatural, and they have the patience to outlast any threat. 
                    They won't kill without cause, but they will imprison forever.
                  </p>
                  <p>
                    <strong>Story Hooks:</strong> Father Mercer asks the PCs to investigate whether 
                    a suspected demon is truly evil or just misunderstood. Sister Calista needs help 
                    preventing Ashwood from destroying an entire community of peaceful cryptids. The 
                    Choir sends a cryptic prophecy that points to one of the PCs.
                  </p>
                </>
              )}
              {selectedOrg.name === 'The Black Chamber' && (
                <>
                  <p>
                    <strong>As Allies:</strong> The Black Chamber can offer government resources, 
                    cutting-edge occult technology, and legal immunity for certain operations. They're 
                    useful for PCs who want to make deals with the devil—literally or figuratively. 
                    However, every favor comes with strings attached.
                  </p>
                  <p>
                    <strong>As Enemies:</strong> The Chamber has the full resources of the U.S. 
                    government behind it, plus captured supernatural assets. They can make people 
                    disappear, rewrite records, and deploy bound demons as weapons. Fighting them 
                    means fighting the system itself.
                  </p>
                  <p>
                    <strong>Story Hooks:</strong> Agent Harlow offers the PCs a deal: help capture 
                    a rogue supernatural, and he'll make their legal problems vanish. Dr. Locke's 
                    vampire unit escapes, and she needs deniable assets to clean up the mess. The 
                    PCs discover Project Seraphim is torturing an angel, forcing them to choose 
                    between national security and morality.
                  </p>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Lore;
