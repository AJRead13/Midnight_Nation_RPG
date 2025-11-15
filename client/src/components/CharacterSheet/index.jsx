import { useState } from 'react';
import infoData from '../../../../info.json';
import boonsData from '../../../../boons.json';
import talentsData from '../../../../talents.json';
import itemsData from '../../../../items.json';
import competenciesData from '../../../../competencies.json';
import bloodlinesData from '../../../../bloodlines.json';

function CharacterSheet() {
  const [character, setCharacter] = useState({
    name: '',
    background: '',
    bloodline: '',
    bloodlineBranch: '',
    class: '',
    level: 1,
    attributes: {
      Mind: 40,
      Body: 40,
      Soul: 40
    },
    fatePool: 1,
    wounds: {
      head: { direct: false, devastating: false, critical: false },
      torso: { direct: false, devastating: false, critical: false },
      leftArm: { direct: false, devastating: false, critical: false },
      rightArm: { direct: false, devastating: false, critical: false },
      leftLeg: { direct: false, devastating: false, critical: false },
      rightLeg: { direct: false, devastating: false, critical: false }
    },
    competencies: [], // Array of {name, description, effect, category}
    talents: [], // Array of {name, category, subTalent, applied, description, effects}
    boons: [],
    equipment: [],
    notes: ''
  });

  const calculateModifier = (attributeValue) => {
    return Math.floor((attributeValue - 50) / 10);
  };

  const handleAttributeChange = (attr, value) => {
    const numValue = parseInt(value) || 0;
    setCharacter(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attr]: numValue
      }
    }));
  };

  const handleWoundToggle = (location, severity) => {
    setCharacter(prev => ({
      ...prev,
      wounds: {
        ...prev.wounds,
        [location]: {
          ...prev.wounds[location],
          [severity]: !prev.wounds[location][severity]
        }
      }
    }));
  };

  const handleBackgroundChange = (backgroundName) => {
    // Get competencies for this background
    const bgCompetencies = competenciesData.backgroundCompetencies[backgroundName] || [];
    const newCompetencies = [];

    // Convert competency keys to full objects
    bgCompetencies.forEach(compKey => {
      // Search through all categories to find the competency
      Object.entries(competenciesData.competencies).forEach(([category, comps]) => {
        if (comps[compKey]) {
          newCompetencies.push({
            name: compKey,
            description: comps[compKey].description,
            effect: comps[compKey].effect,
            category: category
          });
        }
      });
    });

    setCharacter(prev => ({
      ...prev,
      background: backgroundName,
      competencies: newCompetencies
    }));
  };

  const addCompetency = () => {
    setShowCompetencyModal(true);
    setSelectedCompetency('');
  };

  const getAllCompetencies = () => {
    const allComps = [];
    Object.entries(competenciesData.competencies).forEach(([category, comps]) => {
      Object.entries(comps).forEach(([key, data]) => {
        allComps.push({
          name: key,
          description: data.description,
          effect: data.effect,
          category: category
        });
      });
    });
    return allComps;
  };

  const addCompetencyToSheet = () => {
    if (selectedCompetency) {
      const allComps = getAllCompetencies();
      const comp = allComps.find(c => c.name === selectedCompetency);
      if (comp && !character.competencies.find(c => c.name === comp.name)) {
        setCharacter(prev => ({
          ...prev,
          competencies: [...prev.competencies, comp]
        }));
        setShowCompetencyModal(false);
        setSelectedCompetency('');
      }
    }
  };

  const openCompetencyModal = (comp) => {
    setActiveCompetency(comp);
    setShowCompetencyDetailModal(true);
  };

  const handleBloodlineClick = () => {
    setTempBloodlineSelection({ bloodline: character.bloodline, branch: character.bloodlineBranch });
    setShowBloodlineModal(true);
  };

  const confirmBloodlineSelection = () => {
    setCharacter(prev => ({
      ...prev,
      bloodline: tempBloodlineSelection.bloodline,
      bloodlineBranch: tempBloodlineSelection.branch
    }));
    setShowBloodlineModal(false);
  };

  const getAvailableBloodlineAbilities = () => {
    if (!character.bloodline || !character.bloodlineBranch) return [];
    
    const bloodline = bloodlinesData.bloodlines[character.bloodline];
    if (!bloodline) return [];
    
    const branch = bloodline.branches[character.bloodlineBranch];
    if (!branch) return [];
    
    const abilities = [
      {
        level: 0,
        name: bloodline.sharedTrait.name,
        type: 'shared',
        effect: bloodline.sharedTrait.effect
      }
    ];
    
    branch.progression.forEach(ability => {
      if (ability.level <= character.level) {
        abilities.push(ability);
      }
    });
    
    return abilities;
  };

  const removeCompetency = (index) => {
    setCharacter(prev => ({
      ...prev,
      competencies: prev.competencies.filter((_, i) => i !== index)
    }));
  };

  const addTalent = () => {
    const talent = prompt('Enter talent (e.g., "Warfare: Firearms Rank 1"):');
    if (talent) {
      setCharacter(prev => ({
        ...prev,
        talents: [...prev.talents, talent]
      }));
    }
  };

  const removeTalent = (index) => {
    setCharacter(prev => ({
      ...prev,
      talents: prev.talents.filter((_, i) => i !== index)
    }));
  };

  const [selectedTalent, setSelectedTalent] = useState('');
  const [selectedTalentCategory, setSelectedTalentCategory] = useState('');
  const [showTalentModal, setShowTalentModal] = useState(false);
  const [activeTalent, setActiveTalent] = useState(null);
  const [showBoonModal, setShowBoonModal] = useState(false);
  const [activeBoon, setActiveBoon] = useState(null);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [selectedEquipmentCategory, setSelectedEquipmentCategory] = useState('');
  const [selectedEquipmentItem, setSelectedEquipmentItem] = useState('');
  const [showCompetencyModal, setShowCompetencyModal] = useState(false);
  const [selectedCompetency, setSelectedCompetency] = useState('');
  const [showCompetencyDetailModal, setShowCompetencyDetailModal] = useState(false);
  const [activeCompetency, setActiveCompetency] = useState(null);
  const [showBloodlineModal, setShowBloodlineModal] = useState(false);
  const [tempBloodlineSelection, setTempBloodlineSelection] = useState({ bloodline: '', branch: '' });

  const getAllTalents = () => {
    const allTalents = [];
    Object.entries(talentsData.Talents).forEach(([category, talentData]) => {
      if (talentData.subTalents) {
        Object.entries(talentData.subTalents).forEach(([subName, subData]) => {
          allTalents.push({
            name: subName,
            category: category,
            subTalent: true,
            description: subData.description,
            effects: subData.effects || []
          });
        });
      } else {
        allTalents.push({
          name: category,
          category: category,
          subTalent: false,
          description: talentData.description,
          effects: talentData.effects || []
        });
      }
    });
    return allTalents;
  };

  const addTalentToSheet = () => {
    if (selectedTalent) {
      const allTalents = getAllTalents();
      const talent = allTalents.find(t => t.name === selectedTalent);
      if (talent && !character.talents.find(t => t.name === talent.name)) {
        setCharacter(prev => ({
          ...prev,
          talents: [...prev.talents, { ...talent, applied: false }]
        }));
        setSelectedTalent('');
      }
    }
  };

  const toggleTalentApplied = (index) => {
    setCharacter(prev => ({
      ...prev,
      talents: prev.talents.map((t, i) => 
        i === index ? { ...t, applied: !t.applied } : t
      )
    }));
  };

  const openTalentModal = (talent) => {
    setActiveTalent(talent);
    setShowTalentModal(true);
  };

  const openBoonModal = (boon) => {
    setActiveBoon(boon);
    setShowBoonModal(true);
  };

  const [selectedBoon, setSelectedBoon] = useState('');
  const [selectedBoonCategory, setSelectedBoonCategory] = useState('mind');

  const getAllBoons = () => {
    const allBoons = [];
    Object.keys(boonsData.boons).forEach(category => {
      boonsData.boons[category].forEach(boon => {
        allBoons.push({ ...boon, category });
      });
    });
    return allBoons;
  };

  const addBoon = () => {
    if (selectedBoon) {
      const allBoons = getAllBoons();
      const boon = allBoons.find(b => b.name === selectedBoon);
      if (boon) {
        setCharacter(prev => ({
          ...prev,
          boons: [...prev.boons, { name: boon.name, effect: boon.effect, category: boon.category }]
        }));
        setSelectedBoon('');
      }
    }
  };

  const removeBoon = (index) => {
    setCharacter(prev => ({
      ...prev,
      boons: prev.boons.filter((_, i) => i !== index)
    }));
  };

  const addEquipment = () => {
    setShowEquipmentModal(true);
    setSelectedEquipmentCategory('');
    setSelectedEquipmentItem('');
  };

  const addEquipmentToSheet = () => {
    if (selectedEquipmentItem) {
      const category = selectedEquipmentCategory;
      const itemObj = itemsData.prices[category].find(i => i.item === selectedEquipmentItem);
      if (itemObj) {
        const itemString = `${itemObj.item} (${itemObj.price})`;
        setCharacter(prev => ({
          ...prev,
          equipment: [...prev.equipment, itemString]
        }));
        setShowEquipmentModal(false);
        setSelectedEquipmentCategory('');
        setSelectedEquipmentItem('');
      }
    }
  };

  const getEquipmentCategories = () => {
    return Object.keys(itemsData.prices);
  };

  const removeEquipment = (index) => {
    setCharacter(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  const saveCharacter = () => {
    const json = JSON.stringify(character, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${character.name || 'character'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadCharacter = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedCharacter = JSON.parse(e.target.result);
          setCharacter(loadedCharacter);
        } catch (error) {
          alert('Error loading character file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="character-sheet-container">
      <div className="sheet-controls">
        <button onClick={saveCharacter} className="btn-primary">Save Character</button>
        <label className="btn-secondary">
          Load Character
          <input type="file" accept=".json" onChange={loadCharacter} style={{ display: 'none' }} />
        </label>
      </div>

      <section className="sheet-section">
        <h3>Character Name</h3>
        <div className="form-group">
          <input
            type="text"
            value={character.name}
            onChange={(e) => setCharacter({ ...character, name: e.target.value })}
            placeholder="Enter character name"
          />
        </div>
      </section>

      <section className="sheet-section">
        <h3>Basic Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Background</label>
            <select
              value={character.background}
              onChange={(e) => handleBackgroundChange(e.target.value)}
            >
              <option value="">Select Background</option>
              {infoData.backgrounds.core_10_backgrounds.map((bg, idx) => (
                <option key={idx} value={bg.name}>{bg.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Bloodline</label>
            <button 
              onClick={handleBloodlineClick} 
              className="bloodline-select-btn"
              type="button"
            >
              {character.bloodline && character.bloodlineBranch 
                ? `${character.bloodline} - ${character.bloodlineBranch}` 
                : 'Select Bloodline'}
            </button>
          </div>

          <div className="form-group">
            <label>Class</label>
            <select
              value={character.class}
              onChange={(e) => setCharacter({ ...character, class: e.target.value })}
            >
              <option value="">Select Class</option>
              {infoData.classes.list.map((cls, idx) => (
                <option key={idx} value={cls.name}>{cls.name} ({cls.die})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Level</label>
            <input
              type="number"
              min="1"
              max="10"
              value={character.level}
              onChange={(e) => setCharacter({ ...character, level: parseInt(e.target.value) || 1 })}
            />
          </div>

          <div className="form-group">
            <label>Fate Pool</label>
            <input
              type="number"
              min="0"
              value={character.fatePool}
              onChange={(e) => setCharacter({ ...character, fatePool: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      </section>

      {character.bloodline && character.bloodlineBranch && (
        <section className="sheet-section bloodline-section">
          <h3>Bloodline: {character.bloodline} - {character.bloodlineBranch}</h3>
          
          {bloodlinesData.bloodlines[character.bloodline]?.branches[character.bloodlineBranch]?.drawback && (
            <div className="bloodline-drawback">
              <h4>Drawback</h4>
              <p>{bloodlinesData.bloodlines[character.bloodline].branches[character.bloodlineBranch].drawback}</p>
            </div>
          )}

          <div className="bloodline-abilities">
            <h4>Available Abilities (Level {character.level})</h4>
            {getAvailableBloodlineAbilities().map((ability, idx) => (
              <div key={idx} className={`bloodline-ability ${ability.level > character.level ? 'locked' : 'unlocked'}`}>
                <div className="ability-header">
                  <span className="ability-name">{ability.name}</span>
                  <span className="ability-type">{ability.type}</span>
                  {ability.level > 0 && <span className="ability-level">Level {ability.level}</span>}
                </div>
                <p className="ability-effect">{ability.effect}</p>
              </div>
            ))}
          </div>

          {bloodlinesData.bloodlines[character.bloodline]?.branches[character.bloodlineBranch]?.progression
            .filter(ability => ability.level > character.level)
            .length > 0 && (
            <div className="bloodline-future">
              <h4>Future Abilities</h4>
              {bloodlinesData.bloodlines[character.bloodline].branches[character.bloodlineBranch].progression
                .filter(ability => ability.level > character.level)
                .map((ability, idx) => (
                  <div key={idx} className="bloodline-ability locked">
                    <div className="ability-header">
                      <span className="ability-name">{ability.name}</span>
                      <span className="ability-type">{ability.type}</span>
                      <span className="ability-level">Level {ability.level}</span>
                    </div>
                    <p className="ability-effect">{ability.effect}</p>
                  </div>
                ))
              }
            </div>
          )}
        </section>
      )}

      <section className="sheet-section">
        <h3>Attributes</h3>
        <div className="attributes-grid">
          {Object.entries(character.attributes).map(([attr, value]) => (
            <div key={attr} className="attribute-box">
              <label>{attr}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleAttributeChange(attr, e.target.value)}
              />
              <div className="modifier">
                Modifier: {calculateModifier(value) >= 0 ? '+' : ''}{calculateModifier(value)}
              </div>
            </div>
          ))}
        </div>
        <p className="attribute-note">
          <strong>Total:</strong> {Object.values(character.attributes).reduce((a, b) => a + b, 0)}
        </p>
      </section>

      <section className="sheet-section">
        <h3>Wound Tracker</h3>
        <div className="wounds-tracker">
          {Object.entries(character.wounds).map(([location, wounds]) => (
            <div key={location} className="wound-location">
              <h4>{location.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <div className="wound-boxes">
                {Object.entries(wounds).map(([severity, checked]) => (
                  <label key={severity} className="wound-checkbox">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleWoundToggle(location, severity)}
                    />
                    {severity}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sheet-section">
        <h3>Competencies</h3>
        <button onClick={addCompetency} className="btn-add">+ Add Competency</button>
        <ul className="item-list competency-list">
          {character.competencies.map((comp, idx) => (
            <li key={idx}>
              <div className="competency-info" onClick={() => openCompetencyModal(comp)}>
                <strong>{comp.name}</strong>
                <span className="competency-category"> ({comp.category})</span>
              </div>
              <button onClick={() => removeCompetency(idx)} className="btn-remove">×</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="sheet-section">
        <h3>Talents</h3>
        <div className="talent-selector">
          <select 
            value={selectedTalent} 
            onChange={(e) => setSelectedTalent(e.target.value)}
            className="talent-select"
          >
            <option value="">Select a talent...</option>
            {getAllTalents().map((talent, idx) => (
              <option key={idx} value={talent.name}>
                {talent.name} {talent.subTalent ? `(${talent.category})` : ''}
              </option>
            ))}
          </select>
          {selectedTalent && (
            <button onClick={addTalentToSheet} className="btn-add">+ Add Talent</button>
          )}
        </div>
        <ul className="item-list talent-list">
          {character.talents.map((talent, idx) => (
            <li key={idx} className="talent-item">
              <div className="talent-info" onClick={() => openTalentModal(talent)}>
                <strong>{talent.name}</strong>
                {talent.subTalent && <span className="talent-category"> ({talent.category})</span>}
              </div>
              <div className="talent-controls">
                <button 
                  onClick={() => toggleTalentApplied(idx)} 
                  className={`btn-applied ${talent.applied ? 'active' : ''}`}
                >
                  {talent.applied ? 'Applied' : 'Not Applied'}
                </button>
                <button onClick={() => removeTalent(idx)} className="btn-remove">×</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="sheet-section">
        <h3>Boons</h3>
        <div className="boon-selector">
          <select 
            value={selectedBoonCategory} 
            onChange={(e) => setSelectedBoonCategory(e.target.value)}
            className="boon-category-select"
          >
            <option value="mind">Mind</option>
            <option value="body">Body</option>
            <option value="soul">Soul</option>
            <option value="supernatural">Supernatural</option>
          </select>
          <select 
            value={selectedBoon} 
            onChange={(e) => setSelectedBoon(e.target.value)}
            className="boon-select"
          >
            <option value="">Select a boon...</option>
            {boonsData.boons[selectedBoonCategory].map((boon, idx) => (
              <option key={idx} value={boon.name}>{boon.name}</option>
            ))}
          </select>
          {selectedBoon && (
            <button onClick={addBoon} className="btn-add">+ Add Boon</button>
          )}
        </div>
        <ul className="item-list boon-list">
          {character.boons.map((boon, idx) => (
            <li key={idx}>
              <div className="boon-item" onClick={() => openBoonModal(boon)}>
                <strong>{boon.name}</strong> <span className="boon-category">({boon.category})</span>
                <p>{boon.effect}</p>
              </div>
              <button onClick={() => removeBoon(idx)} className="btn-remove">×</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="sheet-section">
        <h3>Equipment</h3>
        <button onClick={addEquipment} className="btn-add">+ Add Equipment</button>
        <ul className="item-list">
          {character.equipment.map((item, idx) => (
            <li key={idx}>
              {item}
              <button onClick={() => removeEquipment(idx)} className="btn-remove">×</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="sheet-section">
        <h3>Notes</h3>
        <textarea
          value={character.notes}
          onChange={(e) => setCharacter({ ...character, notes: e.target.value })}
          placeholder="Character background, personality, goals, etc."
          rows="6"
        />
      </section>

      {/* Talent Modal */}
      {showTalentModal && activeTalent && (
        <div className="modal-overlay" onClick={() => setShowTalentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowTalentModal(false)}>×</button>
            <h3>{activeTalent.name}</h3>
            {activeTalent.subTalent && (
              <p className="talent-modal-category">Category: {activeTalent.category}</p>
            )}
            <p className="talent-modal-description">{activeTalent.description}</p>
            {activeTalent.effects && activeTalent.effects.length > 0 && (
              <div className="talent-modal-effects">
                <h4>Effects:</h4>
                <ul>
                  {activeTalent.effects.map((effect, idx) => (
                    <li key={idx}>{effect}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Boon Modal */}
      {showBoonModal && activeBoon && (
        <div className="modal-overlay" onClick={() => setShowBoonModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBoonModal(false)}>×</button>
            <h3>{activeBoon.name}</h3>
            <p className="talent-modal-category">Category: {activeBoon.category}</p>
            <div className="talent-modal-effects">
              <h4>Effect:</h4>
              <p className="talent-modal-description">{activeBoon.effect}</p>
            </div>
          </div>
        </div>
      )}

      {/* Competency Add Modal */}
      {showCompetencyModal && (
        <div className="modal-overlay" onClick={() => setShowCompetencyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCompetencyModal(false)}>×</button>
            <h3>Add Competency</h3>
            
            <div className="equipment-modal-selector">
              <label>Select Competency:</label>
              <select 
                value={selectedCompetency} 
                onChange={(e) => setSelectedCompetency(e.target.value)}
                className="competency-select"
              >
                <option value="">Select a competency...</option>
                {getAllCompetencies().map((comp, idx) => (
                  <option key={idx} value={comp.name}>
                    {comp.name} ({comp.category})
                  </option>
                ))}
              </select>
            </div>

            {selectedCompetency && (
              <div className="equipment-modal-info">
                <p><strong>Description:</strong> {getAllCompetencies().find(c => c.name === selectedCompetency)?.description}</p>
                <p><strong>Effect:</strong> {getAllCompetencies().find(c => c.name === selectedCompetency)?.effect}</p>
              </div>
            )}

            <button 
              onClick={addCompetencyToSheet} 
              className="btn-primary"
              disabled={!selectedCompetency}
              style={{ marginTop: '1rem', opacity: selectedCompetency ? 1 : 0.5 }}
            >
              Add to Character
            </button>
          </div>
        </div>
      )}

      {/* Competency Detail Modal */}
      {showCompetencyDetailModal && activeCompetency && (
        <div className="modal-overlay" onClick={() => setShowCompetencyDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCompetencyDetailModal(false)}>×</button>
            <h3>{activeCompetency.name}</h3>
            <p className="talent-modal-category">Category: {activeCompetency.category}</p>
            <p className="talent-modal-description">{activeCompetency.description}</p>
            <div className="talent-modal-effects">
              <h4>Effect:</h4>
              <p className="talent-modal-description">{activeCompetency.effect}</p>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Modal */}
      {showEquipmentModal && (
        <div className="modal-overlay" onClick={() => setShowEquipmentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowEquipmentModal(false)}>×</button>
            <h3>Add Equipment</h3>
            
            <div className="equipment-modal-selector">
              <label>Category:</label>
              <select 
                value={selectedEquipmentCategory} 
                onChange={(e) => {
                  setSelectedEquipmentCategory(e.target.value);
                  setSelectedEquipmentItem('');
                }}
                className="equipment-category-select"
              >
                <option value="">Select category...</option>
                {getEquipmentCategories().map((category, idx) => (
                  <option key={idx} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {selectedEquipmentCategory && (
              <div className="equipment-modal-selector">
                <label>Item:</label>
                <select 
                  value={selectedEquipmentItem} 
                  onChange={(e) => setSelectedEquipmentItem(e.target.value)}
                  className="equipment-item-select"
                >
                  <option value="">Select item...</option>
                  {itemsData.prices[selectedEquipmentCategory].map((item, idx) => (
                    <option key={idx} value={item.item}>
                      {item.item} - {item.price}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedEquipmentItem && (
              <div className="equipment-modal-info">
                <p><strong>Notes:</strong> {itemsData.prices[selectedEquipmentCategory].find(i => i.item === selectedEquipmentItem)?.notes}</p>
              </div>
            )}

            <button 
              onClick={addEquipmentToSheet} 
              className="btn-primary"
              disabled={!selectedEquipmentItem}
              style={{ marginTop: '1rem', opacity: selectedEquipmentItem ? 1 : 0.5 }}
            >
              Add to Character
            </button>
          </div>
        </div>
      )}

      {/* Bloodline Selection Modal */}
      {showBloodlineModal && (
        <div className="modal-overlay" onClick={() => setShowBloodlineModal(false)}>
          <div className="modal-content bloodline-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBloodlineModal(false)}>×</button>
            <h3>Select Bloodline</h3>
            
            <div className="equipment-modal-selector">
              <label>Bloodline:</label>
              <select 
                value={tempBloodlineSelection.bloodline} 
                onChange={(e) => setTempBloodlineSelection({ bloodline: e.target.value, branch: '' })}
                className="bloodline-category-select"
              >
                <option value="">Select bloodline...</option>
                {Object.keys(bloodlinesData.bloodlines).map((bloodlineName, idx) => (
                  <option key={idx} value={bloodlineName}>{bloodlineName}</option>
                ))}
              </select>
            </div>

            {tempBloodlineSelection.bloodline && (
              <>
                <div className="bloodline-description">
                  <h4>Description</h4>
                  <p>{bloodlinesData.bloodlines[tempBloodlineSelection.bloodline]?.description}</p>
                  <h4>Shared Trait</h4>
                  <p><strong>{bloodlinesData.bloodlines[tempBloodlineSelection.bloodline]?.sharedTrait?.name}:</strong> {bloodlinesData.bloodlines[tempBloodlineSelection.bloodline]?.sharedTrait?.effect}</p>
                </div>

                <div className="equipment-modal-selector">
                  <label>Branch:</label>
                  <select 
                    value={tempBloodlineSelection.branch} 
                    onChange={(e) => setTempBloodlineSelection({ ...tempBloodlineSelection, branch: e.target.value })}
                    className="bloodline-branch-select"
                  >
                    <option value="">Select branch...</option>
                    {Object.keys(bloodlinesData.bloodlines[tempBloodlineSelection.bloodline]?.branches || {}).map((branchName, idx) => (
                      <option key={idx} value={branchName}>{branchName}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {tempBloodlineSelection.branch && (
              <div className="bloodline-branch-details">
                <h4>{tempBloodlineSelection.branch}</h4>
                <p>{bloodlinesData.bloodlines[tempBloodlineSelection.bloodline]?.branches[tempBloodlineSelection.branch]?.description}</p>
                
                <div className="bloodline-drawback-preview">
                  <h5>Drawback</h5>
                  <p>{bloodlinesData.bloodlines[tempBloodlineSelection.bloodline]?.branches[tempBloodlineSelection.branch]?.drawback}</p>
                </div>

                <div className="bloodline-progression-preview">
                  <h5>Ability Progression</h5>
                  {bloodlinesData.bloodlines[tempBloodlineSelection.bloodline]?.branches[tempBloodlineSelection.branch]?.progression?.map((ability, idx) => (
                    <div key={idx} className="ability-preview">
                      <strong>Level {ability.level}: {ability.name}</strong> ({ability.type})
                      <p>{ability.effect}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={confirmBloodlineSelection} 
              className="btn-primary"
              disabled={!tempBloodlineSelection.bloodline || !tempBloodlineSelection.branch}
              style={{ marginTop: '1rem', opacity: (tempBloodlineSelection.bloodline && tempBloodlineSelection.branch) ? 1 : 0.5 }}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterSheet;
