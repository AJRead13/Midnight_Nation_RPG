import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import infoData from '../../../../data/info.json';
import boonsData from '../../../../data/boons.json';
import talentsData from '../../../../data/talents.json';
import classesData from '../../../../data/classes.json';
import npcsData from '../../../../data/npcs.json';
import monstersData from '../../../../data/monsters.json';

function Rules() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('overview');
  const [highlightedItem, setHighlightedItem] = useState(null);

  // Handle navigation from search results
  useEffect(() => {
    if (location.state?.section) {
      // Map search result types to section IDs
      const sectionMap = {
        'monsters': 'monsters',
        'npcs': 'npcs',
        'classes': 'classes',
        'bloodlines': 'bloodlines',
        'backgrounds': 'backgrounds',
        'talents': 'talents',
        'boons': 'boons',
        'coreConcepts': 'overview',
        'attributes': 'attributes'
      };
      
      const sectionId = sectionMap[location.state.section] || location.state.section;
      setActiveSection(sectionId);
      setHighlightedItem(location.state.searchTerm);
      
      // Clear highlight after 3 seconds
      setTimeout(() => setHighlightedItem(null), 3000);
    }
  }, [location]);

  const sections = [
    { id: 'overview', title: 'Core Concepts' },
    { id: 'character-creation', title: 'Character Creation' },
    { id: 'attributes', title: 'Attributes' },
    { id: 'dice-resolution', title: 'Dice & Resolution' },
    { id: 'classes', title: 'Classes' },
    { id: 'bloodlines', title: 'Bloodlines' },
    { id: 'backgrounds', title: 'Backgrounds' },
    { id: 'talents', title: 'Talents & Competencies' },
    { id: 'boons', title: 'Boons' },
    { id: 'combat', title: 'Combat System' },
    { id: 'wounds', title: 'Wounds & Damage' },
    { id: 'fate-pool', title: 'Fate Pool' },
    { id: 'npcs', title: 'NPCs & Archetypes' },
    { id: 'monsters', title: 'Monsters & Creatures' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'character-creation':
        return <CharacterCreationSection />;
      case 'attributes':
        return <AttributesSection />;
      case 'dice-resolution':
        return <DiceResolutionSection />;
      case 'classes':
        return <ClassesSection />;
      case 'bloodlines':
        return <BloodlinesSection />;
      case 'backgrounds':
        return <BackgroundsSection />;
      case 'talents':
        return <TalentsSection />;
      case 'boons':
        return <BoonsSection />;
      case 'combat':
        return <CombatSection />;
      case 'wounds':
        return <WoundsSection />;
      case 'fate-pool':
        return <FatePoolSection />;
      case 'npcs':
        return <NPCsSection highlightedItem={highlightedItem} />;
      case 'monsters':
        return <MonstersSection highlightedItem={highlightedItem} />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="rules-container">
      <nav className="rules-nav">
        <h3>Rules Sections</h3>
        <ul className="rules-menu">
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
      <div className="rules-content">
        {renderContent()}
      </div>
    </div>
  );
}

function OverviewSection() {
  const { core_concepts } = infoData;
  return (
    <section>
      <h3>Core Concepts</h3>
      <p className="rules-description">{core_concepts.overview}</p>
      
      <div className="rules-subsection">
        <h4>Primary Attributes</h4>
        <ul>
          {core_concepts.primary_attributes.map((attr, idx) => (
            <li key={idx}><strong>{attr}</strong></li>
          ))}
        </ul>
        <p><strong>Scale:</strong> {core_concepts.attribute_scale}</p>
        <p><strong>Minimum Total:</strong> {core_concepts.minimum_total_attributes}</p>
      </div>

      <div className="rules-subsection">
        <h4>Attribute Benchmarks</h4>
        <ul>
          {Object.entries(core_concepts.attribute_benchmarks).map(([range, desc]) => (
            <li key={range}><strong>{range}:</strong> {desc}</li>
          ))}
        </ul>
      </div>

      <div className="rules-subsection">
        <h4>Core Mechanics</h4>
        <p><strong>Engine:</strong> {core_concepts.core_engine}</p>
        <p><strong>Dice Types:</strong> {core_concepts.dice_types.join(', ')}</p>
        <p><strong>Wounds System:</strong> {core_concepts.wounds_instead_of_HP}</p>
      </div>
    </section>
  );
}

function CharacterCreationSection() {
  const { character_creation } = infoData;
  return (
    <section>
      <h3>Character Creation</h3>
      
      <div className="rules-subsection">
        <h4>Steps</h4>
        <ol>
          {character_creation.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="rules-subsection">
        <h4>Attributes Generation (Option D)</h4>
        <p><strong>Baseline:</strong> {character_creation.attributes_generation_option_d.baseline}</p>
        <p><strong>Roll Method:</strong> {character_creation.attributes_generation_option_d.roll_method}</p>
        <p><strong>Example:</strong> {character_creation.attributes_generation_option_d.example_roll}</p>
        <p><strong>Bonus Pool:</strong> {character_creation.attributes_generation_option_d.bonus_pool} points (max {character_creation.attributes_generation_option_d.bonus_pool_max_per_attribute} per attribute)</p>
        <p><strong>Expected Range:</strong> {character_creation.attributes_generation_option_d.final_expected_range}</p>
        <p className="rules-note">{character_creation.attributes_generation_option_d.notes}</p>
      </div>

      <div className="rules-subsection">
        <h4>Fate Pool</h4>
        <p><strong>Starting Formula:</strong> {character_creation.fate_pool_start_formula}</p>
      </div>

      <div className="rules-subsection">
        <h4>Starting Equipment</h4>
        <p>{character_creation.starting_equipment}</p>
      </div>
    </section>
  );
}

function AttributesSection() {
  const { attributes } = infoData;
  return (
    <section>
      <h3>Attributes</h3>
      
      {Object.entries(attributes).map(([attr, details]) => {
        if (attr === 'modifier_rule') return null;
        return (
          <div key={attr} className="rules-subsection attribute-card">
            <h4>{attr}</h4>
            <p>{details.description}</p>
          </div>
        );
      })}

      <div className="rules-subsection">
        <h4>Modifier Rule</h4>
        <p>{attributes.modifier_rule}</p>
      </div>
    </section>
  );
}

function DiceResolutionSection() {
  const { dice_resolution } = infoData;
  return (
    <section>
      <h3>Dice Resolution</h3>
      
      <div className="rules-subsection">
        <h4>Base Check</h4>
        <p>{dice_resolution.base_check.description}</p>
        <p><strong>Success Threshold:</strong> {dice_resolution.base_check.success_threshold}</p>
        <p><strong>Critical Success:</strong> {dice_resolution.base_check.critical_success}</p>
        <p><strong>Critical Failure:</strong> {dice_resolution.base_check.critical_failure}</p>
      </div>

      <div className="rules-subsection">
        <h4>Positive Modifiers</h4>
        <ul>
          <li><strong>Competency:</strong> {dice_resolution.modifiers.positive.competency}</li>
          <li><strong>Talent Rank:</strong> {dice_resolution.modifiers.positive.talent_rank}</li>
          <li><strong>Positioning:</strong> {dice_resolution.modifiers.positive.positioning}</li>
        </ul>
      </div>

      <div className="rules-subsection">
        <h4>Negative Modifiers</h4>
        <ul>
          <li><strong>Darkness:</strong> {dice_resolution.modifiers.negative.darkness}</li>
          <li><strong>Wounds:</strong> {dice_resolution.modifiers.negative.wounds}</li>
          <li><strong>Cover:</strong> {dice_resolution.modifiers.negative.cover}</li>
        </ul>
      </div>

      <div className="rules-subsection">
        <h4>Keep Highest Rule</h4>
        <p>{dice_resolution.modifiers.keep_highest_rule}</p>
      </div>

      <div className="rules-subsection">
        <h4>Negative Dice (Penalty Dice)</h4>
        <p>When a character has negative modifiers but no positive bonuses, they may be forced to roll <strong>penalty dice</strong> instead of bonus dice. In these situations:</p>
        <ul>
          <li><strong>Roll additional dice</strong> based on the penalties (wounds, environmental factors, etc.)</li>
          <li><strong>Keep the two LOWEST dice</strong> instead of the two highest</li>
          <li>Add the attribute modifier to the sum of the two lowest dice</li>
        </ul>
        <p className="example-text"><strong>Example:</strong> A wounded character (−2 dice) attempts a task with no competencies or talents. They roll 4d6, keep the two <em>lowest</em> dice, sum them, and add their attribute modifier. If they roll 6, 4, 3, 2, they keep the 3 and 2 for a sum of 5, then add their modifier.</p>
      </div>

      <div className="rules-subsection example-box">
        <h4>Example</h4>
        <p>{dice_resolution.example}</p>
      </div>
    </section>
  );
}

function ClassesSection() {
  const { classes } = infoData;
  return (
    <section>
      <h3>Classes</h3>
      <p className="rules-description">{classes.overview}</p>
      
      <div className="rules-subsection">
        <h4>Wound Toughness by Archetype</h4>
        <table className="archetype-table">
          <thead>
            <tr>
              <th>Archetype</th>
              <th>Direct</th>
              <th>Devastating</th>
              <th>Critical</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(classes.archetype_wound_toughness_map).map(([type, thresholds]) => (
              <tr key={type}>
                <td><strong>{type}</strong></td>
                <td>{thresholds.direct_threshold}</td>
                <td>{thresholds.devastating_threshold}</td>
                <td>{thresholds.critical_threshold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="classes-detailed">
        {Object.entries(classesData.classes).map(([className, classData]) => (
          <div key={className} className="class-detail-card">
            <h4>{className}</h4>
            <p className="class-description">{classData.description}</p>
            
            <div className="class-stats-grid">
              <div className="class-stat">
                <strong>Wound Die:</strong> {classData.woundDie}
              </div>
              <div className="class-stat">
                <strong>Combat Role:</strong> {classData.combatRole}
              </div>
              {classData.supernaturalRole && (
                <div className="class-stat">
                  <strong>Supernatural Role:</strong> {classData.supernaturalRole}
                </div>
              )}
              <div className="class-stat">
                <strong>Primary Attributes:</strong> {classData.primaryAttributes.join(', ')}
              </div>
              <div className="class-stat">
                <strong>Secondary Attributes:</strong> {classData.secondaryAttributes.join(', ')}
              </div>
              <div className="class-stat">
                <strong>Signature Weapons:</strong> {classData.signatureWeapons.join(', ')}
              </div>
            </div>

            <div className="class-progression">
              <h5>Progression</h5>
              {classData.progression.map((ability, idx) => (
                <div key={idx} className="progression-ability">
                  <div className="ability-header">
                    <span className="ability-name"><strong>{ability.name}</strong></span>
                    <span className="ability-meta">
                      <span className="ability-type">{ability.type}</span>
                      <span className="ability-level">Level {ability.level}</span>
                    </span>
                  </div>
                  <p className="ability-effect">{ability.effect}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rules-note">
        <p>{classes.notes}</p>
      </div>
    </section>
  );
}

function BloodlinesSection() {
  const { bloodlines } = infoData;
  return (
    <section>
      <h3>Bloodlines</h3>
      <p className="rules-description">{bloodlines.overview}</p>
      
      <div className="rules-subsection">
        <h4>Mechanics</h4>
        <p><strong>Level Unlocks:</strong> {bloodlines.mechanics.level_unlocks.join(', ')}</p>
        <p><strong>Power Types:</strong> {bloodlines.mechanics.power_types.join(', ')}</p>
        <p>{bloodlines.mechanics.costs_and_limits}</p>
      </div>

      {bloodlines.list.map((bloodline, idx) => (
        <div key={idx} className="bloodline-section">
          <h4>{bloodline.name}</h4>
          {bloodline.shared_passive && (
            <p className="bloodline-passive"><strong>Shared Trait:</strong> {bloodline.shared_passive}</p>
          )}
          {bloodline.shared_trait && (
            <p className="bloodline-passive"><strong>Shared Trait:</strong> {bloodline.shared_trait}</p>
          )}
          {bloodline.overview && (
            <p className="bloodline-overview"><em>{bloodline.overview}</em></p>
          )}
          
          {bloodline.branches && bloodline.branches.map((branch, branchIdx) => (
            <div key={branchIdx} className="branch-card">
              <h5>{branch.branch}</h5>
              
              {branch.level1 && (
                <div className="level-power">
                  <strong>Level 1:</strong>
                  {branch.level1.passive && <p className="passive-ability">{branch.level1.passive}</p>}
                  {branch.level1.description && <p><em>{branch.level1.description}</em></p>}
                </div>
              )}
              
              {branch.level3 && (
                <div className="level-power">
                  <strong>Level 3:</strong>
                  {branch.level3.choices ? (
                    <ul>
                      {branch.level3.choices.map((choice, choiceIdx) => (
                        <li key={choiceIdx}>
                          <strong>{choice.name}:</strong> {choice.effect}
                        </li>
                      ))}
                    </ul>
                  ) : branch.level3.choice ? (
                    <p>{branch.level3.choice}</p>
                  ) : null}
                </div>
              )}
              
              {branch.level6 && (
                <div className="level-power">
                  <strong>Level 6:</strong>
                  {branch.level6.choices ? (
                    <ul>
                      {branch.level6.choices.map((choice, choiceIdx) => (
                        <li key={choiceIdx}>
                          <strong>{choice.name}:</strong> {choice.effect}
                        </li>
                      ))}
                    </ul>
                  ) : branch.level6.choice ? (
                    <p>{branch.level6.choice}</p>
                  ) : null}
                </div>
              )}
              
              {branch.level10 && (
                <div className="level-power">
                  <strong>Level 10:</strong>
                  {branch.level10.signature && (
                    <p className="signature-ability">
                      <strong>{branch.level10.signature.name}:</strong> {branch.level10.signature.effect}
                    </p>
                  )}
                </div>
              )}
              
              {branch.drawback && (
                <p className="drawback"><strong>Drawback:</strong> {branch.drawback}</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

function BackgroundsSection() {
  const { backgrounds } = infoData;
  return (
    <section>
      <h3>Backgrounds</h3>
      <p className="rules-description">{backgrounds.overview}</p>
      
      <div className="backgrounds-grid">
        {backgrounds.core_10_backgrounds.map((bg, idx) => (
          <div key={idx} className="background-card">
            <h4>{bg.name}</h4>
            
            <div className="bg-level">
              <strong>Level 1:</strong>
              <ul>
                <li><strong>Competencies:</strong> {bg.level1.competencies.join(', ')}</li>
                <li><strong>Talent:</strong> {Object.entries(bg.level1.talent).map(([talent, rank]) => `${talent} (${rank})`).join(', ')}</li>
                <li><strong>Perk:</strong> {bg.level1.perk}</li>
              </ul>
            </div>
            
            {bg.level3 && (
              <div className="bg-level">
                <strong>Level 3:</strong>
                <p>{bg.level3.upgrade || bg.level3.talent || bg.level3.competency}</p>
              </div>
            )}
            
            {bg.level6 && (
              <div className="bg-level">
                <strong>Level 6:</strong>
                <p>{bg.level6.talent_gain || bg.level6.competency || bg.level6.talent}</p>
              </div>
            )}
            
            {bg.level10 && (
              <div className="bg-level">
                <strong>Level 10:</strong>
                <p className="signature-ability">{bg.level10.signature}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function TalentsSection() {
  const { Talents } = talentsData;
  
  return (
    <section>
      <h3>Talents</h3>
      <p className="rules-intro">
        Talents represent specialized training and expertise in various fields. Each talent provides specific mechanical benefits and narrative permissions.
      </p>

      <div className="talents-display">
        {Object.entries(Talents).map(([talentName, talentData]) => (
          <div key={talentName} className="talent-detail-card">
            <h4>{talentName}</h4>
            <p className="talent-description">{talentData.description}</p>
            
            {talentData.effects && (
              <div className="talent-effects">
                <strong>Effects:</strong>
                <ul>
                  {talentData.effects.map((effect, idx) => (
                    <li key={idx}>{effect}</li>
                  ))}
                </ul>
              </div>
            )}

            {talentData.subTalents && (
              <div className="sub-talents">
                <strong>Sub-Talents:</strong>
                {Object.entries(talentData.subTalents).map(([subName, subData]) => (
                  <div key={subName} className="sub-talent-card">
                    <h5>{subName}</h5>
                    <p>{subData.description}</p>
                    {subData.effects && (
                      <ul>
                        {subData.effects.map((effect, idx) => (
                          <li key={idx}>{effect}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rules-subsection">
        <h4>Competencies</h4>
        <p>{talents_and_competencies.competencies.definition}</p>
        <p><strong>Examples:</strong></p>
        <ul>
          {talents_and_competencies.competencies.examples.map((comp, idx) => (
            <li key={idx}>{comp}</li>
          ))}
        </ul>
        <p><strong>Stacking:</strong> {talents_and_competencies.competencies.stacking}</p>
      </div>

      <div className="rules-subsection">
        <h4>Advancement</h4>
        <div className="advancement-info">
          <h5>Competencies by Level</h5>
          {Object.entries(talents_and_competencies.advancement_rules.competencies_by_level).map(([level, desc]) => (
            <p key={level}><strong>{level}:</strong> {desc}</p>
          ))}
        </div>
        <div className="advancement-info">
          <h5>Talents by Level</h5>
          {Object.entries(talents_and_competencies.advancement_rules.talents_by_level).map(([level, desc]) => (
            <p key={level}><strong>{level}:</strong> {desc}</p>
          ))}
        </div>
        <div className="advancement-info">
          <h5>Dice Caps</h5>
          <p><strong>From Talents:</strong> Max {talents_and_competencies.advancement_rules.dice_caps.from_talents_max}</p>
          <p><strong>From Competencies:</strong> Max {talents_and_competencies.advancement_rules.dice_caps.from_competencies_max}</p>
        </div>
      </div>
    </section>
  );
}

function CombatSection() {
  const { advanced_combat } = infoData;
  return (
    <section>
      <h3>Advanced Combat</h3>
      
      {Object.entries(advanced_combat).map(([action, details]) => {
        if (typeof details === 'string') {
          return (
            <div key={action} className="rules-subsection">
              <h4>{action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
              <p>{details}</p>
            </div>
          );
        }
        return (
          <div key={action} className="combat-action-card">
            <h4>{action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
            {Object.entries(details).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
          </div>
        );
      })}
    </section>
  );
}

function WoundsSection() {
  const { wounds_and_damage } = infoData;
  return (
    <section>
      <h3>Wounds & Damage</h3>
      <p className="rules-description"><strong>Design Intent:</strong> {wounds_and_damage.design_intent}</p>
      
      <div className="rules-subsection">
        <h4>Weapon Strength</h4>
        <ul>
          {Object.entries(wounds_and_damage.weapon_strength).map(([weapon, strength]) => (
            <li key={weapon}>
              <strong>{weapon}:</strong> {typeof strength === 'object' ? (
                <ul>
                  {Object.entries(strength).map(([type, value]) => (
                    <li key={type}>{type}: {value}</li>
                  ))}
                </ul>
              ) : strength}
            </li>
          ))}
        </ul>
      </div>

      <div className="rules-subsection">
        <h4>Wound Roll Procedure</h4>
        <ol>
          {wounds_and_damage.wound_roll_procedure.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="rules-subsection">
        <h4>Archetype Thresholds</h4>
        <table className="wounds-table">
          <thead>
            <tr>
              <th>Archetype</th>
              <th>Direct</th>
              <th>Devastating</th>
              <th>Critical</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(wounds_and_damage.archetype_thresholds).map(([type, thresholds]) => (
              <tr key={type}>
                <td><strong>{type}</strong></td>
                <td>{thresholds.direct}</td>
                <td>{thresholds.devastating}</td>
                <td>{thresholds.critical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rules-subsection">
        <h4>Hit Location</h4>
        <p><strong>D6 Mapping:</strong></p>
        <ul>
          {Object.entries(wounds_and_damage.hit_location_die.d6_mapping).map(([roll, location]) => (
            <li key={roll}><strong>{roll}:</strong> {location}</li>
          ))}
        </ul>
      </div>

      <div className="rules-subsection">
        <h4>Severity Effects</h4>
        {Object.entries(wounds_and_damage.severity_effects).map(([severity, effects]) => (
          <div key={severity} className="severity-card">
            <h5>{severity.toUpperCase()}</h5>
            <p><strong>Wound Level:</strong> {effects.wound}</p>
            <p><strong>Mechanic:</strong> {effects.mechanic}</p>
            <p><strong>Healing Time:</strong> {effects.healing_time}</p>
          </div>
        ))}
      </div>

      <div className="rules-subsection">
        <h4>Wound Tracks</h4>
        <p><strong>Locations:</strong> {wounds_and_damage.wound_tracks_layout.locations.join(', ')}</p>
        <p><strong>Levels per Location:</strong> {wounds_and_damage.wound_tracks_layout.levels_per_location.join(', ')}</p>
      </div>

      <div className="rules-subsection">
        <h4>Bleed & Escalation</h4>
        <p>{wounds_and_damage.bleed_and_escalation.rule}</p>
        <p><strong>First Aid:</strong> {wounds_and_damage.bleed_and_escalation.first_aid}</p>
        <p><strong>Escalation Conditions:</strong> {wounds_and_damage.bleed_and_escalation.automatic_escalation_conditions.join(', ')}</p>
      </div>

      <div className="rules-subsection">
        <h4>Healing Rules</h4>
        <ul>
          {Object.entries(wounds_and_damage.healing_rules).map(([severity, time]) => (
            <li key={severity}><strong>{severity}:</strong> {time}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FatePoolSection() {
  const { fate_pool } = infoData;
  return (
    <section>
      <h3>Fate Pool</h3>
      
      <div className="rules-subsection">
        <h4>Formula</h4>
        <p className="formula-text">{fate_pool.formula}</p>
      </div>

      <div className="rules-subsection">
        <h4>Uses</h4>
        <ul>
          {fate_pool.uses.map((use, idx) => (
            <li key={idx}>{use}</li>
          ))}
        </ul>
      </div>

      <div className="rules-subsection">
        <h4>Refresh</h4>
        <p>{fate_pool.refresh}</p>
      </div>

      <div className="rules-subsection">
        <h4>Narrative</h4>
        <p>{fate_pool.narrative}</p>
      </div>
    </section>
  );
}

function BoonsSection() {
  const { boons } = boonsData;
  
  return (
    <section>
      <h3>Boons</h3>
      <p className="rules-intro">
        Boons are special abilities and traits that characters can acquire to enhance their capabilities. 
        They are divided into four categories: Mind, Body, Soul, and Supernatural.
      </p>

      <div className="rules-subsection">
        <h4>Mind Boons</h4>
        <div className="boons-grid">
          {boons.mind.map((boon, idx) => (
            <div key={idx} className="boon-card">
              <h5>{boon.name}</h5>
              <p>{boon.effect}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rules-subsection">
        <h4>Body Boons</h4>
        <div className="boons-grid">
          {boons.body.map((boon, idx) => (
            <div key={idx} className="boon-card">
              <h5>{boon.name}</h5>
              <p>{boon.effect}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rules-subsection">
        <h4>Soul Boons</h4>
        <div className="boons-grid">
          {boons.soul.map((boon, idx) => (
            <div key={idx} className="boon-card">
              <h5>{boon.name}</h5>
              <p>{boon.effect}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rules-subsection">
        <h4>Supernatural Boons</h4>
        <div className="boons-grid">
          {boons.supernatural.map((boon, idx) => (
            <div key={idx} className="boon-card">
              <h5>{boon.name}</h5>
              <p>{boon.effect}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NPCsSection() {
  const { npcSchema, archetypes } = npcsData;
  const [expandedNPC, setExpandedNPC] = useState(null);

  return (
    <section>
      <h3>NPCs & Archetypes</h3>
      <p className="rules-description">
        NPCs in Midnight Nation follow the same core mechanics as player characters but are designed 
        for quick deployment and dramatic encounters. This section provides common archetypes and templates 
        for various factions and roles.
      </p>

      <div className="rules-subsection">
        <h4>NPC Structure Overview</h4>
        <p className="rules-description">{npcSchema.description}</p>
        
        <div className="npc-schema-grid">
          <div className="schema-item">
            <strong>Tier System:</strong>
            <ul>
              <li><strong>Minion:</strong> Disposable threats, often drop in one good hit</li>
              <li><strong>Standard:</strong> Competent opposition, can take a few wounds</li>
              <li><strong>Elite:</strong> Serious threats with special abilities</li>
              <li><strong>Boss:</strong> Major antagonists with full wound tracks</li>
            </ul>
          </div>
          <div className="schema-item">
            <strong>Wound Profiles:</strong>
            <ul>
              <li><strong>Minion:</strong> 1-2 wounds before dropping</li>
              <li><strong>Human:</strong> Standard 6-location wound track</li>
              <li><strong>Tough:</strong> Extra resilience, harder to incapacitate</li>
              <li><strong>Supernatural:</strong> May ignore certain wound types</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rules-subsection">
        <h4>NPC Archetypes</h4>
        <p className="rules-description">
          These archetypes represent common NPCs encountered throughout Midnight Nation. 
          Game Masters can use them as-is or modify them to fit specific scenarios.
        </p>

        <div className="npcs-list">
          {archetypes.map((npc, idx) => (
            <div key={idx} className="npc-card">
              <div 
                className="npc-header"
                onClick={() => setExpandedNPC(expandedNPC === idx ? null : idx)}
              >
                <div className="npc-title-row">
                  <h5>{npc.name}</h5>
                  <span className={`tier-badge ${npc.tier}`}>{npc.tier}</span>
                </div>
                <div className="npc-quick-info">
                  <span className="faction-tag">{npc.faction}</span>
                  <span className="role-tag">{npc.role}</span>
                </div>
                <button className="expand-btn">
                  {expandedNPC === idx ? '−' : '+'}
                </button>
              </div>

              {expandedNPC === idx && (
                <div className="npc-details">
                  <div className="npc-details-grid">
                    <div className="detail-section">
                      <h6>Core Info</h6>
                      <p><strong>Background:</strong> {npc.background}</p>
                      <p><strong>Class:</strong> {npc.class}</p>
                      {npc.bloodline && (
                        <p><strong>Bloodline:</strong> {npc.bloodline}</p>
                      )}
                    </div>

                    <div className="detail-section">
                      <h6>Attributes</h6>
                      <div className="attributes-display">
                        <span><strong>Mind:</strong> {npc.attributes.mind}</span>
                        <span><strong>Body:</strong> {npc.attributes.body}</span>
                        <span><strong>Soul:</strong> {npc.attributes.soul}</span>
                      </div>
                    </div>

                    {npc.competencies && npc.competencies.length > 0 && (
                      <div className="detail-section">
                        <h6>Competencies</h6>
                        <div className="tags-list">
                          {npc.competencies.map((comp, i) => (
                            <span key={i} className="tag">{comp}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {npc.talents && npc.talents.length > 0 && (
                      <div className="detail-section">
                        <h6>Talents</h6>
                        <ul className="talents-list">
                          {npc.talents.map((talent, i) => (
                            <li key={i}>
                              {talent.talent}
                              {talent.subTalent && ` (${talent.subTalent})`}
                              {talent.rank && ` - Rank ${talent.rank}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {npc.boons && npc.boons.length > 0 && (
                      <div className="detail-section">
                        <h6>Boons</h6>
                        <div className="tags-list">
                          {npc.boons.map((boon, i) => (
                            <span key={i} className="tag boon-tag">{boon}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {npc.woundProfile && (
                      <div className="detail-section">
                        <h6>Wound Profile</h6>
                        <p><strong>Robustness:</strong> {npc.woundProfile.robustness}</p>
                        {npc.woundProfile.notes && (
                          <p className="notes-text">{npc.woundProfile.notes}</p>
                        )}
                      </div>
                    )}

                    {npc.equipment && (
                      <div className="detail-section full-width">
                        <h6>Equipment</h6>
                        {npc.equipment.weapons && npc.equipment.weapons.length > 0 && (
                          <p><strong>Weapons:</strong> {npc.equipment.weapons.join(', ')}</p>
                        )}
                        {npc.equipment.armor && (
                          <p><strong>Armor:</strong> {npc.equipment.armor}</p>
                        )}
                        {npc.equipment.gear && npc.equipment.gear.length > 0 && (
                          <p><strong>Gear:</strong> {npc.equipment.gear.join(', ')}</p>
                        )}
                      </div>
                    )}

                    {npc.tactics && (
                      <div className="detail-section full-width">
                        <h6>Tactics</h6>
                        <p className="tactics-text">{npc.tactics}</p>
                      </div>
                    )}

                    {npc.storyHooks && (
                      <div className="detail-section full-width">
                        <h6>Story Hooks</h6>
                        <p className="story-hooks-text">{npc.storyHooks}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rules-subsection">
        <h4>Using NPCs in Play</h4>
        <ul>
          <li><strong>Minions:</strong> Use in groups. They go down quickly but can overwhelm through numbers.</li>
          <li><strong>Standard NPCs:</strong> The baseline opposition. Use for guards, investigators, and routine encounters.</li>
          <li><strong>Elite NPCs:</strong> Feature one or two per major scene. They should challenge the party.</li>
          <li><strong>Boss NPCs:</strong> Session or arc climax encounters. Give them full character treatment.</li>
        </ul>
        <p className="rules-description">
          <strong>GM Tip:</strong> Adjust attributes and competencies on the fly to match your party's power level. 
          These archetypes are starting points, not rigid constraints.
        </p>
      </div>
    </section>
  );
}

function MonstersSection({ highlightedItem }) {
  const { monsterSchema, monsters } = monstersData;
  const [expandedMonster, setExpandedMonster] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  // Get unique categories
  const categories = ['all', ...new Set(monsters.map(m => m.category))];

  const filteredMonsters = filterCategory === 'all' 
    ? monsters 
    : monsters.filter(m => m.category === filterCategory);

  return (
    <section>
      <h3>Monsters & Creatures</h3>
      <p className="rules-description">
        The world of Midnight Nation is filled with supernatural threats, from demons and spirits to 
        experimental cryptids and urban legends made flesh. These monsters follow similar mechanical 
        foundations as NPCs but often possess unique abilities that bend or break the normal rules.
      </p>

      <div className="rules-subsection">
        <h4>Monster Structure Overview</h4>
        <p className="rules-description">{monsterSchema.description}</p>
        
        <div className="monster-schema-grid">
          <div className="schema-item">
            <strong>Threat Tiers:</strong>
            <ul>
              <li><strong>Minion:</strong> Swarm creatures, minor spirits, weak possessed</li>
              <li><strong>Standard:</strong> Lesser demons, restless ghosts, young cryptids</li>
              <li><strong>Elite:</strong> Greater demons, powerful undead, alpha beasts</li>
              <li><strong>Boss:</strong> Demon lords, ancient vampires, major entities</li>
              <li><strong>Ancient:</strong> World-ending threats, old gods, primordial horrors</li>
            </ul>
          </div>
          <div className="schema-item">
            <strong>Monster Categories:</strong>
            <ul>
              <li><strong>Demon:</strong> Beings from Hell or infernal dimensions</li>
              <li><strong>Undead:</strong> Risen corpses, ghosts, vampires, liches</li>
              <li><strong>Spirit:</strong> Incorporeal entities, poltergeists, wraiths</li>
              <li><strong>Beast:</strong> Supernatural animals, werewolves, cryptids</li>
              <li><strong>Celestial:</strong> Angels, divine servants, holy constructs</li>
              <li><strong>Construct:</strong> Golems, homunculi, animated objects</li>
              <li><strong>Hybrid:</strong> Chimeras, experiments, aberrations</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rules-subsection">
        <h4>Monster Bestiary</h4>
        <p className="rules-description">
          These creatures represent common supernatural threats in Midnight Nation. 
          Each entry provides game statistics, abilities, weaknesses, and story hooks for the Game Master.
        </p>

        <div className="monster-filter">
          <label htmlFor="categoryFilter">Filter by Category:</label>
          <select 
            id="categoryFilter"
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="category-filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="monsters-list">
          {filteredMonsters.map((monster, idx) => {
            const isHighlighted = highlightedItem && monster.name.toLowerCase().includes(highlightedItem.toLowerCase());
            return (
            <div 
              key={idx} 
              className={`monster-card ${isHighlighted ? 'highlighted' : ''}`}
              style={isHighlighted ? { backgroundColor: '#fff3cd', border: '2px solid #ffc107', transition: 'all 0.3s ease' } : {}}
            >
              <div 
                className="monster-header"
                onClick={() => setExpandedMonster(expandedMonster === idx ? null : idx)}
              >
                <div className="monster-title-row">
                  <h5>{monster.name}</h5>
                  <div className="monster-badges">
                    <span className={`threat-badge ${monster.threatTier}`}>{monster.threatTier}</span>
                    <span className="category-badge">{monster.category}</span>
                  </div>
                </div>
                {monster.origin && (
                  <p className="monster-origin">{monster.origin}</p>
                )}
                <button className="expand-btn">
                  {expandedMonster === idx ? '−' : '+'}
                </button>
              </div>

              {expandedMonster === idx && (
                <div className="monster-details">
                  <div className="monster-details-grid">
                    <div className="detail-section">
                      <h6>Attributes</h6>
                      <div className="attributes-display">
                        <span><strong>Mind:</strong> {monster.attributes.mind}</span>
                        <span><strong>Body:</strong> {monster.attributes.body}</span>
                        <span><strong>Soul:</strong> {monster.attributes.soul}</span>
                      </div>
                    </div>

                    {monster.competencies && monster.competencies.length > 0 && (
                      <div className="detail-section">
                        <h6>Competencies</h6>
                        <div className="tags-list">
                          {monster.competencies.map((comp, i) => (
                            <span key={i} className="tag">{comp}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {monster.abilities && monster.abilities.length > 0 && (
                      <div className="detail-section full-width">
                        <h6>Special Abilities</h6>
                        <div className="abilities-list">
                          {monster.abilities.map((ability, i) => (
                            <div key={i} className="ability-item">
                              <div className="ability-header">
                                <strong>{ability.name}</strong>
                                <span className={`ability-type ${ability.type}`}>{ability.type}</span>
                              </div>
                              <p>{ability.effect}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {monster.weaknesses && monster.weaknesses.length > 0 && (
                      <div className="detail-section full-width">
                        <h6>Weaknesses</h6>
                        <ul className="weaknesses-list">
                          {monster.weaknesses.map((weakness, i) => (
                            <li key={i}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {monster.woundProfile && (
                      <div className="detail-section">
                        <h6>Wound Profile</h6>
                        <p><strong>Robustness:</strong> {monster.woundProfile.robustness}</p>
                        {monster.woundProfile.notes && (
                          <p className="notes-text">{monster.woundProfile.notes}</p>
                        )}
                      </div>
                    )}

                    {monster.attacks && monster.attacks.length > 0 && (
                      <div className="detail-section full-width">
                        <h6>Attacks</h6>
                        <div className="attacks-list">
                          {monster.attacks.map((attack, i) => (
                            <div key={i} className="attack-item">
                              <div className="attack-header">
                                <strong>{attack.name}</strong>
                                <span className="attack-range">{attack.range}</span>
                              </div>
                              <p><strong>Bonus:</strong> +{attack.baseDiceBonus || 0} dice</p>
                              {attack.woundNotes && <p className="wound-notes">{attack.woundNotes}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {monster.tactics && (
                      <div className="detail-section full-width">
                        <h6>Tactics</h6>
                        <p className="tactics-text">{monster.tactics}</p>
                      </div>
                    )}

                    {monster.storyHooks && (
                      <div className="detail-section full-width">
                        <h6>Story Hooks</h6>
                        <p className="story-hooks-text">{monster.storyHooks}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      <div className="rules-subsection">
        <h4>Running Monsters in Combat</h4>
        <ul>
          <li><strong>Supernatural Threat:</strong> Many monsters ignore or reduce mundane damage. Players need special weapons, rituals, or tactics.</li>
          <li><strong>Fear Factor:</strong> Monsters often have abilities that target Soul or impose psychological effects. This isn't just combat.</li>
          <li><strong>Environmental Advantage:</strong> Use terrain and circumstances. Ghosts in haunted houses, demons in desecrated ground, etc.</li>
          <li><strong>Escalation:</strong> Start with minions to gauge party strength, then introduce elite or boss creatures as the threat grows.</li>
          <li><strong>Weaknesses Matter:</strong> Give players clues about weaknesses through investigation. Reward preparation and research.</li>
        </ul>
        <p className="rules-description">
          <strong>GM Tip:</strong> Monsters should feel alien and dangerous. Use their abilities to create memorable, 
          tense encounters rather than just stat blocks to overcome.
        </p>
      </div>
    </section>
  );
}

export default Rules;
