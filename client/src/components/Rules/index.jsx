import { useState } from 'react';
import infoData from '../../../../info.json';
import boonsData from '../../../../boons.json';
import talentsData from '../../../../talents.json';

function Rules() {
  const [activeSection, setActiveSection] = useState('overview');

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
    { id: 'fate-pool', title: 'Fate Pool' }
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
      
      <div className="classes-grid">
        {classes.list.map((classItem, idx) => (
          <div key={idx} className="class-card">
            <h4>{classItem.name}</h4>
            <p className="class-die"><strong>Die:</strong> {classItem.die}</p>
            <p className="class-role">{classItem.role}</p>
            {classItem.archetype && <p className="class-archetype"><em>Archetype: {classItem.archetype}</em></p>}
          </div>
        ))}
      </div>

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

export default Rules;
