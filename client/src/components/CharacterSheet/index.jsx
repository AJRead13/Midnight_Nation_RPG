import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCharacters, fetchCharacterById, createCharacter, updateCharacter, deleteCharacter as deleteCharacterAPI } from '../../utils/characterService';
import infoData from '../../../../data/info.json';
import boonsData from '../../../../data/boons.json';
import talentsData from '../../../../data/talents.json';
import itemsData from '../../../../data/items.json';
import competenciesData from '../../../../data/competencies.json';
import bloodlinesData from '../../../../data/bloodlines.json';
import classesData from '../../../../data/classes.json';
import backgroundsData from '../../../../data/backgrounds.json';

function CharacterSheet() {
  const { id: characterId } = useParams();
  const navigate = useNavigate();
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

  const handleBackgroundClick = () => {
    setTempBackgroundSelection(character.background);
    setShowBackgroundModal(true);
  };

  const confirmBackgroundSelection = () => {
    const backgroundName = tempBackgroundSelection;
    
    // Get competencies for this background
    const bgData = backgroundsData.backgrounds[backgroundName];
    const newCompetencies = [];

    if (bgData && bgData.startingCompetencies) {
      bgData.startingCompetencies.forEach(compKey => {
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
    }

    setCharacter(prev => ({
      ...prev,
      background: backgroundName,
      competencies: newCompetencies
    }));
    setShowBackgroundModal(false);
  };

  const getAvailableBackgroundAbilities = () => {
    if (!character.background) return [];
    
    const bgData = backgroundsData.backgrounds[character.background];
    if (!bgData || !bgData.progression) return [];
    
    return bgData.progression.filter(ability => ability.level <= character.level);
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

  const handleClassClick = () => {
    setTempClassSelection(character.class);
    setShowClassModal(true);
  };

  const confirmClassSelection = () => {
    setCharacter(prev => ({
      ...prev,
      class: tempClassSelection
    }));
    setShowClassModal(false);
  };

  const getAvailableClassAbilities = () => {
    if (!character.class) return [];
    
    const classData = classesData.classes[character.class];
    if (!classData) return [];
    
    return classData.progression.filter(ability => ability.level <= character.level);
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
  const [showClassModal, setShowClassModal] = useState(false);
  const [tempClassSelection, setTempClassSelection] = useState('');
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [tempBackgroundSelection, setTempBackgroundSelection] = useState('');
  const [savedCharacters, setSavedCharacters] = useState([]);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [currentCharacterId, setCurrentCharacterId] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', 'error'
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const autoSaveTimeoutRef = useRef(null);
  const lastSavedCharacterRef = useRef(null);

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

  // Fetch user's saved characters
  const fetchUserCharacters = async () => {
    try {
      const characters = await fetchCharacters();
      setSavedCharacters(Array.isArray(characters) ? characters : []);
    } catch (error) {
      console.error('Error fetching characters:', error);
      setSavedCharacters([]);
    }
  };

  useEffect(() => {
    fetchUserCharacters();
    
    // Load character if editing existing one
    if (characterId) {
      loadCharacterFromDatabase(characterId);
    }
  }, [characterId]);

  // Auto-save functionality
  useEffect(() => {
    // Don't auto-save if:
    // 1. Auto-save is not enabled
    // 2. No character ID (new character not yet created)
    // 3. Character has no name
    // 4. Character hasn't changed since last save
    if (!autoSaveEnabled || !currentCharacterId || !character.name) {
      return;
    }

    // Check if character has actually changed
    const currentCharacterString = JSON.stringify(character);
    if (lastSavedCharacterRef.current === currentCharacterString) {
      return;
    }

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (2 seconds after last change)
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaveStatus('saving');
        await updateCharacter(currentCharacterId, character);
        lastSavedCharacterRef.current = JSON.stringify(character);
        setSaveStatus('saved');
        
        // Clear "saved" status after 2 seconds
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (error) {
        console.error('Auto-save error:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    }, 2000);

    // Cleanup timeout on unmount
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [character, currentCharacterId, autoSaveEnabled]);

  const saveCharacter = async () => {
    if (!character.name) {
      setSaveMessage('Please enter a character name');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    try {
      let savedChar;
      
      if (currentCharacterId) {
        savedChar = await updateCharacter(currentCharacterId, character);
        setSaveMessage('Character updated successfully!');
      } else {
        savedChar = await createCharacter(character);
        setSaveMessage('Character created successfully!');
        setCurrentCharacterId(savedChar._id);
        // Navigate to edit mode after creating
        navigate(`/character-sheet/${savedChar._id}`, { replace: true });
      }
      
      // Update last saved reference and enable auto-save
      lastSavedCharacterRef.current = JSON.stringify(character);
      setAutoSaveEnabled(true);
      
      fetchUserCharacters();
    } catch (error) {
      if (error.message === 'Not authenticated') {
        setSaveMessage('Please sign in to save characters');
      } else {
        setSaveMessage(error.message || 'Failed to save character');
      }
      console.error('Save error:', error);
    }

    setTimeout(() => setSaveMessage(''), 3000);
  };

  const saveCharacterToFile = () => {
    const json = JSON.stringify(character, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${character.name || 'character'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadCharacterFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedCharacter = JSON.parse(e.target.result);
          setCharacter(loadedCharacter);
          setCurrentCharacterId(null);
        } catch (error) {
          alert('Error loading character file');
        }
      };
      reader.readAsText(file);
    }
  };

  const loadCharacterFromDatabase = async (charId) => {
    try {
      const loadedChar = await fetchCharacterById(charId);
      setCharacter(loadedChar);
      setCurrentCharacterId(loadedChar._id);
      setShowLoadModal(false);
      
      // Enable auto-save and set reference for loaded character
      lastSavedCharacterRef.current = JSON.stringify(loadedChar);
      setAutoSaveEnabled(true);
    } catch (error) {
      console.error('Error loading character:', error);
      setSaveMessage('Failed to load character');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleDeleteCharacter = async (charId) => {
    if (!confirm('Are you sure you want to delete this character?')) return;

    try {
      await deleteCharacterAPI(charId);
      fetchUserCharacters();
      
      if (currentCharacterId === charId) {
        // If we're deleting the current character, reset to blank
        setCharacter({
          name: '',
          background: '',
          bloodline: '',
          bloodlineBranch: '',
          class: '',
          level: 1,
          attributes: { Mind: 40, Body: 40, Soul: 40 },
          fatePool: 1,
          wounds: {
            head: { direct: false, devastating: false, critical: false },
            torso: { direct: false, devastating: false, critical: false },
            leftArm: { direct: false, devastating: false, critical: false },
            rightArm: { direct: false, devastating: false, critical: false },
            leftLeg: { direct: false, devastating: false, critical: false },
            rightLeg: { direct: false, devastating: false, critical: false }
          },
          competencies: [],
          talents: [],
          boons: [],
          equipment: [],
          notes: ''
        });
        setCurrentCharacterId(null);
        navigate('/character-sheet', { replace: true });
      }
      
      setSaveMessage('Character deleted successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting character:', error);
      setSaveMessage('Failed to delete character');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const createNewCharacter = () => {
    setCharacter({
      name: '',
      background: '',
      bloodline: '',
      bloodlineBranch: '',
      class: '',
      level: 1,
      attributes: { Mind: 40, Body: 40, Soul: 40 },
      fatePool: 1,
      wounds: {
        head: { direct: false, devastating: false, critical: false },
        torso: { direct: false, devastating: false, critical: false },
        leftArm: { direct: false, devastating: false, critical: false },
        rightArm: { direct: false, devastating: false, critical: false },
        leftLeg: { direct: false, devastating: false, critical: false },
        rightLeg: { direct: false, devastating: false, critical: false }
      },
      competencies: [],
      talents: [],
      boons: [],
      equipment: [],
      notes: ''
    });
    setCurrentCharacterId(null);
  };

  return (
    <div className="character-sheet-container">
      <div className="sheet-controls">
        <button onClick={saveCharacter} className="btn-primary">
          {currentCharacterId ? 'Update Character' : 'Save Character'}
        </button>
        <button onClick={() => setShowLoadModal(true)} className="btn-secondary">
          Load Character
        </button>
        <button onClick={createNewCharacter} className="btn-secondary">
          New Character
        </button>
        <button onClick={saveCharacterToFile} className="btn-secondary">
          Export to File
        </button>
        <label className="btn-secondary">
          Import from File
          <input type="file" accept=".json" onChange={loadCharacterFromFile} style={{ display: 'none' }} />
        </label>
        
        {/* Auto-save status indicator */}
        {autoSaveEnabled && (
          <div className="auto-save-status">
            {saveStatus === 'saving' && (
              <span className="status-saving">
                <span className="spinner"></span> Saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="status-saved">
                ✓ Saved
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="status-error">
                ⚠ Save failed
              </span>
            )}
            {!saveStatus && currentCharacterId && (
              <span className="status-auto">
                Auto-save enabled
              </span>
            )}
          </div>
        )}
        
        {saveMessage && <span className="save-message">{saveMessage}</span>}
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

      {/* Campaigns Section */}
      {character.campaigns && character.campaigns.length > 0 && (
        <section className="sheet-section">
          <h3>Active Campaigns</h3>
          <div className="campaigns-list">
            {character.campaigns.map((campaignEntry, index) => (
              <div key={index} className="campaign-badge">
                <span className="campaign-name">
                  {campaignEntry.campaign?.name || 'Unknown Campaign'}
                </span>
                <span className={`campaign-status status-${campaignEntry.campaign?.status || 'planning'}`}>
                  {campaignEntry.campaign?.status || 'planning'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="sheet-section">
        <h3>Basic Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Background</label>
            <button 
              onClick={handleBackgroundClick} 
              className="bloodline-select-btn"
              type="button"
            >
              {character.background ? character.background : 'Select Background'}
            </button>
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
            <button 
              onClick={handleClassClick} 
              className="bloodline-select-btn"
              type="button"
            >
              {character.class ? character.class : 'Select Class'}
            </button>
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

      {character.background && (
        <section className="sheet-section background-section">
          <h3>Background: {character.background}</h3>
          
          {backgroundsData.backgrounds[character.background] && (
            <>
              <div className="background-info">
                <p className="background-description">{backgroundsData.backgrounds[character.background].shortDescription}</p>
                {backgroundsData.backgrounds[character.background].startingPerk && (
                  <div className="background-perk">
                    <h4>Starting Perk: {backgroundsData.backgrounds[character.background].startingPerk.name}</h4>
                    <p>{backgroundsData.backgrounds[character.background].startingPerk.effect}</p>
                  </div>
                )}
              </div>

              {getAvailableBackgroundAbilities().length > 0 && (
                <div className="background-abilities">
                  <h4>Available Abilities (Level {character.level})</h4>
                  {getAvailableBackgroundAbilities().map((ability, idx) => (
                    <div key={idx} className="background-ability unlocked">
                      <div className="ability-header">
                        <span className="ability-name">
                          {ability.name || ability.description || `Level ${ability.level} Progression`}
                        </span>
                        <span className="ability-type">{ability.type}</span>
                        <span className="ability-level">Level {ability.level}</span>
                      </div>
                      <p className="ability-effect">
                        {ability.effect || ability.description}
                        {ability.choices && ` (Choices: ${ability.choices.join(', ')})`}
                        {ability.talent && ` - Gain ${ability.talent.talent}: ${ability.talent.subTalent} (Rank ${ability.talent.rank})`}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {backgroundsData.backgrounds[character.background].progression &&
                backgroundsData.backgrounds[character.background].progression
                  .filter(ability => ability.level > character.level)
                  .length > 0 && (
                <div className="background-future">
                  <h4>Future Abilities</h4>
                  {backgroundsData.backgrounds[character.background].progression
                    .filter(ability => ability.level > character.level)
                    .map((ability, idx) => (
                      <div key={idx} className="background-ability locked">
                        <div className="ability-header">
                          <span className="ability-name">
                            {ability.name || ability.description || `Level ${ability.level} Progression`}
                          </span>
                          <span className="ability-type">{ability.type}</span>
                          <span className="ability-level">Level {ability.level}</span>
                        </div>
                        <p className="ability-effect">
                          {ability.effect || ability.description}
                          {ability.choices && ` (Choices: ${ability.choices.join(', ')})`}
                          {ability.talent && ` - Gain ${ability.talent.talent}: ${ability.talent.subTalent} (Rank ${ability.talent.rank})`}
                        </p>
                      </div>
                    ))
                  }
                </div>
              )}
            </>
          )}
        </section>
      )}

      {character.class && (
        <section className="sheet-section class-section">
          <h3>Class: {character.class}</h3>
          
          {classesData.classes[character.class] && (
            <>
              <div className="class-info">
                <p><strong>Wound Die:</strong> {classesData.classes[character.class].woundDie}</p>
                <p><strong>Combat Role:</strong> {classesData.classes[character.class].combatRole}</p>
                {classesData.classes[character.class].supernaturalRole && (
                  <p><strong>Supernatural Role:</strong> {classesData.classes[character.class].supernaturalRole}</p>
                )}
              </div>

              <div className="class-abilities">
                <h4>Available Abilities (Level {character.level})</h4>
                {getAvailableClassAbilities().map((ability, idx) => (
                  <div key={idx} className="class-ability unlocked">
                    <div className="ability-header">
                      <span className="ability-name">{ability.name}</span>
                      <span className="ability-type">{ability.type}</span>
                      <span className="ability-level">Level {ability.level}</span>
                    </div>
                    <p className="ability-effect">{ability.effect}</p>
                  </div>
                ))}
              </div>

              {classesData.classes[character.class].progression
                .filter(ability => ability.level > character.level)
                .length > 0 && (
                <div className="class-future">
                  <h4>Future Abilities</h4>
                  {classesData.classes[character.class].progression
                    .filter(ability => ability.level > character.level)
                    .map((ability, idx) => (
                      <div key={idx} className="class-ability locked">
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
            </>
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

      {/* Class Selection Modal */}
      {showClassModal && (
        <div className="modal-overlay" onClick={() => setShowClassModal(false)}>
          <div className="modal-content class-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowClassModal(false)}>×</button>
            <h3>Select Class</h3>
            
            <div className="equipment-modal-selector">
              <label>Class:</label>
              <select 
                value={tempClassSelection} 
                onChange={(e) => setTempClassSelection(e.target.value)}
                className="class-select"
              >
                <option value="">Select class...</option>
                {Object.keys(classesData.classes).map((className, idx) => (
                  <option key={idx} value={className}>{className}</option>
                ))}
              </select>
            </div>

            {tempClassSelection && classesData.classes[tempClassSelection] && (
              <div className="class-modal-details">
                <div className="class-description">
                  <h4>Description</h4>
                  <p>{classesData.classes[tempClassSelection].description}</p>
                  
                  <div className="class-stats">
                    <p><strong>Wound Die:</strong> {classesData.classes[tempClassSelection].woundDie}</p>
                    <p><strong>Combat Role:</strong> {classesData.classes[tempClassSelection].combatRole}</p>
                    {classesData.classes[tempClassSelection].supernaturalRole && (
                      <p><strong>Supernatural Role:</strong> {classesData.classes[tempClassSelection].supernaturalRole}</p>
                    )}
                    <p><strong>Primary Attributes:</strong> {classesData.classes[tempClassSelection].primaryAttributes.join(', ')}</p>
                    <p><strong>Secondary Attributes:</strong> {classesData.classes[tempClassSelection].secondaryAttributes.join(', ')}</p>
                    <p><strong>Signature Weapons:</strong> {classesData.classes[tempClassSelection].signatureWeapons.join(', ')}</p>
                  </div>
                </div>

                <div className="class-progression-preview">
                  <h4>Class Progression</h4>
                  {classesData.classes[tempClassSelection].progression.map((ability, idx) => (
                    <div key={idx} className="progression-ability-preview">
                      <strong>Level {ability.level}: {ability.name}</strong> ({ability.type})
                      <p>{ability.effect}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={confirmClassSelection} 
              className="btn-primary"
              disabled={!tempClassSelection}
              style={{ marginTop: '1rem', opacity: tempClassSelection ? 1 : 0.5 }}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      )}

      {/* Background Selection Modal */}
      {showBackgroundModal && (
        <div className="modal-overlay" onClick={() => setShowBackgroundModal(false)}>
          <div className="modal-content background-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBackgroundModal(false)}>×</button>
            <h3>Select Background</h3>
            
            <div className="equipment-modal-selector">
              <label>Background:</label>
              <select 
                value={tempBackgroundSelection} 
                onChange={(e) => setTempBackgroundSelection(e.target.value)}
                className="background-select"
              >
                <option value="">Select background...</option>
                {Object.keys(backgroundsData.backgrounds).map((bgName, idx) => (
                  <option key={idx} value={bgName}>{bgName}</option>
                ))}
              </select>
            </div>

            {tempBackgroundSelection && backgroundsData.backgrounds[tempBackgroundSelection] && (
              <div className="background-modal-details">
                <div className="background-description">
                  <h4>Description</h4>
                  <p>{backgroundsData.backgrounds[tempBackgroundSelection].shortDescription}</p>
                  
                  <div className="background-stats">
                    <p><strong>Starting Competencies:</strong> {backgroundsData.backgrounds[tempBackgroundSelection].startingCompetencies.join(', ')}</p>
                    
                    {backgroundsData.backgrounds[tempBackgroundSelection].startingTalents && (
                      <div className="starting-talents">
                        <p><strong>Starting Talents:</strong></p>
                        {backgroundsData.backgrounds[tempBackgroundSelection].startingTalents.map((talent, idx) => (
                          <p key={idx}>• {talent.talent}: {talent.subTalent} (Rank {talent.rank})</p>
                        ))}
                      </div>
                    )}

                    {backgroundsData.backgrounds[tempBackgroundSelection].startingPerk && (
                      <div className="starting-perk">
                        <p><strong>{backgroundsData.backgrounds[tempBackgroundSelection].startingPerk.name}:</strong></p>
                        <p>{backgroundsData.backgrounds[tempBackgroundSelection].startingPerk.effect}</p>
                      </div>
                    )}
                  </div>
                </div>

                {backgroundsData.backgrounds[tempBackgroundSelection].progression && (
                  <div className="background-progression-preview">
                    <h4>Background Progression</h4>
                    {backgroundsData.backgrounds[tempBackgroundSelection].progression.map((ability, idx) => (
                      <div key={idx} className="progression-ability-preview">
                        <strong>Level {ability.level}: {ability.name || ability.description}</strong> ({ability.type})
                        <p>
                          {ability.effect || ability.description}
                          {ability.choices && ` (Choices: ${ability.choices.join(', ')})`}
                          {ability.talent && ` - ${ability.talent.talent}: ${ability.talent.subTalent} (Rank ${ability.talent.rank})`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button 
              onClick={confirmBackgroundSelection} 
              className="btn-primary"
              disabled={!tempBackgroundSelection}
              style={{ marginTop: '1rem', opacity: tempBackgroundSelection ? 1 : 0.5 }}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      )}

      {/* Load Character Modal */}
      {showLoadModal && (
        <div className="modal-overlay" onClick={() => setShowLoadModal(false)}>
          <div className="modal-content load-character-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLoadModal(false)}>×</button>
            <h3>Load Character</h3>
            
            {savedCharacters.length === 0 ? (
              <p className="no-characters">You don't have any saved characters yet.</p>
            ) : (
              <div className="saved-characters-list">
                {savedCharacters.map((char) => (
                  <div key={char._id} className="saved-character-item">
                    <div className="character-info">
                      <h4>{char.name}</h4>
                      <p>
                        Level {char.level} {char.class && `${char.class}`}
                        {char.background && ` - ${char.background}`}
                      </p>
                      <p className="character-date">
                        Last updated: {new Date(char.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="character-actions">
                      <button 
                        onClick={() => loadCharacterFromDatabase(char._id)}
                        className="btn-primary btn-small"
                      >
                        Load
                      </button>
                      <button 
                        onClick={() => deleteCharacter(char._id)}
                        className="btn-danger btn-small"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterSheet;
