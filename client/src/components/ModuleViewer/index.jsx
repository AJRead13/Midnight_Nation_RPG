import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './moduleViewer.css';

const ModuleViewer = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    loadModule();
  }, [moduleId]);

  const loadModule = async () => {
    try {
      setLoading(true);
      // Load from public modules folder
      const response = await fetch(`/modules/${moduleId}.json`);
      if (!response.ok) throw new Error('Module not found');
      const data = await response.json();
      setModuleData(data);
    } catch (error) {
      console.error('Error loading module:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div className="module-viewer loading">
        <div className="loading-spinner"></div>
        <p>Loading module...</p>
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="module-viewer error">
        <h2>Module Not Found</h2>
        <button onClick={() => navigate('/modules')}>Back to Modules</button>
      </div>
    );
  }

  const { metadata, overview, factions, sessions, npcs, locations, handouts, rewards, gm_guidance } = moduleData;

  return (
    <div className="module-viewer">
      {/* Header */}
      <header className="module-header">
        <button className="back-button" onClick={() => navigate('/modules')}>
          ← Back to Modules
        </button>
        <div className="module-title-block">
          <h1 className="module-title">{metadata.title}</h1>
          <p className="module-subtitle">{metadata.subtitle}</p>
        </div>
        <div className="module-meta">
          <span className="meta-badge">{metadata.system}</span>
          <span className="meta-badge">{metadata.players} Players</span>
          <span className="meta-badge">Level {metadata.recommendedLevel}</span>
          <span className="meta-badge">{metadata.sessionLength}</span>
          <span className="meta-badge difficulty">{metadata.difficulty}</span>
        </div>
        <div className="module-tone">
          <strong>Tone:</strong> {metadata.tone}
        </div>
        <div className="module-themes">
          {metadata.themes.map((theme, idx) => (
            <span key={idx} className="theme-tag">{theme}</span>
          ))}
        </div>
      </header>

      {/* Overview */}
      <section className="module-section overview">
        <h2>Adventure Overview</h2>
        <div className="tagline">{overview.tagline}</div>
        <p className="synopsis">{overview.synopsis}</p>
        <p className="premise">{overview.premise}</p>
      </section>

      {/* Factions */}
      <section className="module-section factions">
        <h2>Factions</h2>
        <div className="faction-grid">
          {factions.map((faction, idx) => (
            <div key={idx} className="faction-card">
              <h3>{faction.name}</h3>
              <div className="faction-detail">
                <strong>Agenda:</strong> {faction.agenda}
              </div>
              <div className="faction-detail">
                <strong>Approach:</strong> {faction.approach}
              </div>
              <div className="faction-detail">
                <strong>Resources:</strong> {faction.resources}
              </div>
              <div className="faction-detail">
                <strong>Contact:</strong> {faction.key_npc}
              </div>
              <div className="recruitment-pitch">
                <em>"{faction.recruitment_pitch}"</em>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sessions Navigation */}
      <section className="module-section sessions-nav">
        <h2>Sessions</h2>
        <div className="session-buttons">
          {sessions.map((session) => (
            <button
              key={session.number}
              className={`session-button ${activeSession === session.number ? 'active' : ''}`}
              onClick={() => setActiveSession(activeSession === session.number ? null : session.number)}
            >
              Session {session.number}: {session.title}
            </button>
          ))}
        </div>
      </section>

      {/* Session Details */}
      {activeSession && (
        <section className="module-section session-detail">
          {sessions
            .filter(s => s.number === activeSession)
            .map((session) => (
              <div key={session.number} className="session-content">
                <h2>Session {session.number}: {session.title}</h2>
                <div className="session-meta">
                  <strong>Focus:</strong> {session.focus}
                </div>
                <p className="session-summary">{session.summary}</p>

                {/* Hooks */}
                {session.hooks && (
                  <div className="session-hooks">
                    <h3>Opening Hooks (Choose One)</h3>
                    {session.hooks.map((hook, idx) => (
                      <div key={idx} className="hook-card">
                        <h4>{hook.title}</h4>
                        <p>{hook.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Opening */}
                {session.opening && (
                  <div className="session-opening">
                    <h3>Opening</h3>
                    <p>{session.opening}</p>
                  </div>
                )}

                {/* Scenes */}
                {session.scenes && (
                  <div className="scenes">
                    <h3>Scenes</h3>
                    {session.scenes.map((scene, idx) => (
                      <div key={idx} className="scene-card">
                        <h4>{scene.title}</h4>
                        {scene.location && (
                          <div className="scene-location">
                            <strong>Location:</strong> {scene.location}
                          </div>
                        )}
                        {scene.atmosphere && (
                          <div className="scene-atmosphere">
                            <em>{scene.atmosphere}</em>
                          </div>
                        )}
                        <p>{scene.description}</p>

                        {/* Clues */}
                        {scene.clues && (
                          <div className="scene-clues">
                            <h5>Investigation Clues</h5>
                            <table className="clues-table">
                              <thead>
                                <tr>
                                  <th>Clue</th>
                                  <th>Skill</th>
                                  <th>DC</th>
                                  <th>Success</th>
                                </tr>
                              </thead>
                              <tbody>
                                {scene.clues.map((clue, cidx) => (
                                  <tr key={cidx}>
                                    <td>{clue.clue}</td>
                                    <td>{clue.skill}</td>
                                    <td>{clue.dc}</td>
                                    <td>{clue.success}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Bloodline Triggers */}
                        {scene.bloodline_triggers && (
                          <div className="bloodline-triggers">
                            <h5>Bloodline Awakening Triggers</h5>
                            {scene.bloodline_triggers.map((trigger, tidx) => (
                              <div key={tidx} className="trigger-card">
                                <strong>{trigger.bloodline}:</strong>
                                <p>{trigger.trigger}</p>
                                <div className="mechanical-effect">
                                  <em>Effect: {trigger.mechanical_effect}</em>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Combat Encounter */}
                        {scene.enemy && (
                          <div className="combat-encounter">
                            <h5>Combat Encounter</h5>
                            <div className="enemy-info">
                              <strong>{scene.enemy.name}</strong> (Qty: {scene.enemy.quantity})
                              <p><em>Tactics:</em> {scene.enemy.tactics}</p>
                              <p><em>Motivation:</em> {scene.enemy.motivation}</p>
                            </div>
                            {scene.environment && (
                              <p><strong>Environment:</strong> {scene.environment}</p>
                            )}
                          </div>
                        )}

                        {/* Combat Encounter (detailed) */}
                        {scene.combat_encounter && (
                          <div className="combat-encounter-detailed">
                            <h5>Combat Encounter</h5>
                            {scene.combat_encounter.enemies.map((enemy, eidx) => (
                              <div key={eidx} className="enemy-block">
                                <strong>{enemy.name}</strong> x{enemy.quantity}
                                <p><em>{enemy.tactics}</em></p>
                              </div>
                            ))}
                            {scene.combat_encounter.terrain && (
                              <p><strong>Terrain:</strong> {scene.combat_encounter.terrain}</p>
                            )}
                            {scene.combat_encounter.complications && (
                              <div className="complications">
                                <strong>Complications:</strong>
                                <ul>
                                  {scene.combat_encounter.complications.map((comp, cidx) => (
                                    <li key={cidx}>{comp}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Boss Encounter */}
                        {scene.boss_encounter && (
                          <div className="boss-encounter">
                            <h5>Boss Encounter</h5>
                            <div className="boss-stats">
                              <h6>{scene.boss_encounter.enemy.name}</h6>
                              <p><strong>Wound Threshold:</strong> {scene.boss_encounter.enemy.wound_threshold}</p>
                              <div className="abilities">
                                <strong>Abilities:</strong>
                                <ul>
                                  {scene.boss_encounter.enemy.abilities.map((ability, aidx) => (
                                    <li key={aidx}>{ability}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="tactics">
                                <strong>Tactics:</strong> {scene.boss_encounter.enemy.tactics}
                              </div>
                              {scene.boss_encounter.enemy.weaknesses && (
                                <div className="weaknesses">
                                  <strong>Weaknesses:</strong>
                                  <ul>
                                    {scene.boss_encounter.enemy.weaknesses.map((weak, widx) => (
                                      <li key={widx}>{weak}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            {scene.boss_encounter.minions && (
                              <div className="minions">
                                <strong>Minions:</strong>
                                {scene.boss_encounter.minions.map((minion, midx) => (
                                  <span key={midx} className="minion-tag">
                                    {minion.name} x{minion.quantity}
                                  </span>
                                ))}
                              </div>
                            )}
                            {scene.boss_encounter.battlefield && (
                              <div className="battlefield">
                                <strong>Battlefield Features:</strong>
                                <ul>
                                  {scene.boss_encounter.battlefield.features.map((feature, fidx) => (
                                    <li key={fidx}>{feature}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Skill Challenges */}
                        {scene.skill_challenges && (
                          <div className="skill-challenges">
                            <h5>Skill Challenges</h5>
                            {scene.skill_challenges.map((challenge, chidx) => (
                              <div key={chidx} className="challenge-card">
                                <strong>{challenge.challenge}</strong>
                                <p>Skill: {challenge.skill} (DC {challenge.dc})</p>
                                <p><em>Success:</em> {challenge.success}</p>
                                <p><em>Failure:</em> {challenge.failure}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* NPCs Present */}
                        {scene.npcs_present && (
                          <div className="npcs-present">
                            <h5>NPCs Present</h5>
                            {scene.npcs_present.map((npc, nidx) => (
                              <div key={nidx} className="npc-present">
                                <strong>{npc.name}:</strong> {npc.description}
                                <p><em>{npc.attitude}</em></p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Choices */}
                        {scene.choices && (
                          <div className="scene-choices">
                            <h5>Player Choices</h5>
                            {scene.choices.map((choice, chidx) => (
                              <div key={chidx} className="choice-card">
                                <strong>{choice.option}</strong>
                                <p><em>Consequence:</em> {choice.consequence}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* GM Guidance */}
                        {scene.gm_guidance && (
                          <div className="scene-gm-guidance">
                            <strong>GM Note:</strong> <em>{scene.gm_guidance}</em>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Session End */}
                {session.session_end && (
                  <div className="session-end">
                    <h3>Session End</h3>
                    {session.session_end.cliffhanger && (
                      <div className="cliffhanger">
                        <strong>Cliffhanger:</strong>
                        <p><em>{session.session_end.cliffhanger}</em></p>
                      </div>
                    )}
                    <div className="xp-reward">
                      <strong>XP Reward:</strong> {session.session_end.xp_reward}
                    </div>
                  </div>
                )}

                {/* Epilogue (Session 5) */}
                {session.epilogue && (
                  <div className="epilogue">
                    <h3>Epilogue</h3>
                    <p>{session.epilogue.text}</p>
                    <div className="final-rewards">
                      <strong>Final Rewards:</strong>
                      <ul>
                        {session.epilogue.final_rewards.map((reward, ridx) => (
                          <li key={ridx}>{reward}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </section>
      )}

      {/* NPCs */}
      <section className="module-section npcs">
        <h2 onClick={() => toggleSection('npcs')} className="collapsible-header">
          NPCs {expandedSections.npcs ? '−' : '+'}
        </h2>
        {expandedSections.npcs && (
          <div className="npc-grid">
            {npcs.map((npc, idx) => (
              <div key={idx} className="npc-card">
                <h3>{npc.name}</h3>
                <div className="npc-faction">{npc.faction} • {npc.role}</div>
                <p>{npc.description}</p>
                <div className="npc-personality">
                  <strong>Personality:</strong> {npc.personality}
                </div>
                {npc.backstory && (
                  <div className="npc-backstory">
                    <strong>Background:</strong> {npc.backstory}
                  </div>
                )}
                {npc.combat_stats && (
                  <div className="npc-stats">
                    <strong>Combat Stats:</strong>
                    <ul>
                      <li>Wound Threshold: {npc.combat_stats.wound_threshold}</li>
                      <li>Weapons: {npc.combat_stats.weapons.join(', ')}</li>
                      <li>Skills: {npc.combat_stats.skills.join(', ')}</li>
                    </ul>
                  </div>
                )}
                {npc.quotes && (
                  <div className="npc-quotes">
                    <strong>Quotes:</strong>
                    <ul>
                      {npc.quotes.map((quote, qidx) => (
                        <li key={qidx}><em>"{quote}"</em></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Locations */}
      <section className="module-section locations">
        <h2 onClick={() => toggleSection('locations')} className="collapsible-header">
          Locations {expandedSections.locations ? '−' : '+'}
        </h2>
        {expandedSections.locations && (
          <div className="location-grid">
            {locations.map((location, idx) => (
              <div key={idx} className="location-card">
                <h3>{location.name}</h3>
                <p>{location.description}</p>
                <div className="location-atmosphere">
                  <strong>Atmosphere:</strong> <em>{location.atmosphere}</em>
                </div>
                {location.secrets && (
                  <div className="location-secrets">
                    <strong>Secrets:</strong> {location.secrets}
                  </div>
                )}
                {location.hazards && (
                  <div className="location-hazards">
                    <strong>Hazards:</strong> {location.hazards}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Handouts */}
      <section className="module-section handouts">
        <h2 onClick={() => toggleSection('handouts')} className="collapsible-header">
          Player Handouts {expandedSections.handouts ? '−' : '+'}
        </h2>
        {expandedSections.handouts && (
          <div className="handout-grid">
            {handouts.map((handout, idx) => (
              <div key={idx} className="handout-card">
                <h4>{handout.title}</h4>
                <p>{handout.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Rewards */}
      <section className="module-section rewards">
        <h2 onClick={() => toggleSection('rewards')} className="collapsible-header">
          Rewards & Items {expandedSections.rewards ? '−' : '+'}
        </h2>
        {expandedSections.rewards && (
          <div className="reward-grid">
            {rewards.map((reward, idx) => (
              <div key={idx} className="reward-card">
                <h4>{reward.name}</h4>
                <div className="reward-type">{reward.type}</div>
                {reward.stats && <p><strong>Stats:</strong> {reward.stats}</p>}
                {reward.effect && <p><strong>Effect:</strong> {reward.effect}</p>}
                <p className="reward-description">{reward.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* GM Guidance */}
      <section className="module-section gm-guidance">
        <h2 onClick={() => toggleSection('guidance')} className="collapsible-header">
          GM Guidance {expandedSections.guidance ? '−' : '+'}
        </h2>
        {expandedSections.guidance && (
          <div className="guidance-content">
            <div className="guidance-block">
              <h4>Tone</h4>
              <p>{gm_guidance.tone}</p>
            </div>
            <div className="guidance-block">
              <h4>Pacing</h4>
              <p>{gm_guidance.pacing}</p>
            </div>
            <div className="guidance-block">
              <h4>Faction Balance</h4>
              <p>{gm_guidance.faction_balance}</p>
            </div>
            <div className="guidance-block">
              <h4>Player Agency</h4>
              <p>{gm_guidance.player_agency}</p>
            </div>
            <div className="guidance-block">
              <h4>Horror Elements</h4>
              <p>{gm_guidance.horror_elements}</p>
            </div>
            <div className="guidance-block">
              <h4>Adaptation</h4>
              <p>{gm_guidance.adaptation}</p>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="module-footer">
        <p>Midnight Nation RPG • Module by AJ Scrivner</p>
        <p>For personal use in campaigns. Have fun!</p>
      </footer>
    </div>
  );
};

export default ModuleViewer;
