import { useState } from 'react';
import infoData from '../../../../data/info.json';
import itemsData from '../../../../data/items.json';

function Items() {
  const [selectedCategory, setSelectedCategory] = useState('melee');
  const { wounds_and_damage } = infoData;
  const { prices } = itemsData;

  // Melee weapons with game stats
  const meleeWeapons = [
    { name: 'Combat Knife / Fighting Knife', strength: 2, range: 'Melee', price: '$5–12', notes: 'Military issue; depends on quality.' },
    { name: 'Bayonet', strength: 2, range: 'Melee', price: '$7–15', notes: 'Military surplus; attachable to rifles.' },
    { name: 'Brass Knuckles', strength: 2, range: 'Melee', price: '$2–5', notes: 'Illegal in some states; low cost.' },
    { name: 'Pocket Knife / Switchblade', strength: 2, range: 'Melee', price: '$1–8', notes: 'Folding knives popular with civilians.' },
    { name: 'Baseball Bat', strength: 3, range: 'Melee', price: '$3–10', notes: 'Wood bat; sporting goods.' },
    { name: 'Crowbar', strength: 3, range: 'Melee', price: '$2–6', notes: 'Standard tool; widely available.' },
    { name: 'Machete', strength: 3, range: 'Melee', price: '$5–12', notes: 'Agricultural or military variant.' },
    { name: 'Sledgehammer / Firefighter Axe', strength: 4, range: 'Melee', price: '$10–20', notes: 'Heavy duty tools; some surplus.' }
  ];

  // Firearms with game stats
  const firearms = {
    handguns: [
      { name: 'Colt M1911', strength: 3, range: 'Short', price: '$65–75', notes: 'Military or police issue. .45 caliber, 7 rounds.' },
      { name: 'Smith & Wesson M&P', strength: 3, range: 'Short', price: '$45–60', notes: 'Police/civilian revolver. 6 rounds.' },
      { name: 'Colt Woodsman', strength: 3, range: 'Short', price: '$30–40', notes: 'Civilian target pistol. .22 caliber.' }
    ],
    submachineguns: [
      { name: 'Thompson M1A1', strength: 4, range: 'Medium', price: '$200–250', notes: 'Military SMG; surplus cheaper than new. 30 round magazine.' },
      { name: 'M3 "Grease Gun"', strength: 4, range: 'Medium', price: '$100–150', notes: 'Military issue; inexpensive and effective. .45 caliber.' }
    ],
    rifles: [
      { name: 'M1 Garand', strength: 5, range: 'Long', price: '$85–100', notes: 'Military issue; government price. 8 round clip.' },
      { name: 'M1 Carbine', strength: 4, range: 'Medium', price: '$60–75', notes: 'Lightweight service rifle. 15 round magazine.' },
      { name: 'Springfield M1903A3', strength: 5, range: 'Long', price: '$75–90', notes: 'Older military rifle; surplus. Bolt-action, 5 rounds.' },
      { name: 'Winchester Model 70', strength: 5, range: 'Long', price: '$65–80', notes: 'Civilian hunting rifle. Bolt-action.' },
      { name: 'Krag–Jørgensen', strength: 4, range: 'Long', price: '$50–65', notes: 'Older surplus rifle; slower. Bolt-action.' }
    ],
    shotguns: [
      { name: 'Remington 870', strength: 4, range: 'Short', price: '$55–70', notes: 'Civilian / police variant. Pump action, 5 rounds.' },
      { name: 'Winchester Model 12', strength: 4, range: 'Short', price: '$50–65', notes: 'Pump action; military/civilian.' },
      { name: 'Ithaca 37', strength: 4, range: 'Short', price: '$55–70', notes: 'Reliable pump action.' },
      { name: 'Winchester Model 1897', strength: 4, range: 'Short', price: '$45–60', notes: 'Older trench gun; surplus.' }
    ],
    machineguns: [
      { name: 'Browning M1919', strength: 6, range: 'Long', price: '$500–650', notes: 'Heavy military support weapon; unlikely civilian. Belt-fed.' },
      { name: 'Browning M2', strength: 7, range: 'Extreme', price: '$1000+', notes: 'Extremely rare; military vehicle mounted. .50 caliber.' },
      { name: 'BAR M1918A2', strength: 6, range: 'Long', price: '$400–550', notes: 'Squad automatic; military issue. 20 round magazine.' },
      { name: 'Browning M1917', strength: 6, range: 'Long', price: '$450–600', notes: 'Water cooled; military support. Belt-fed.' }
    ]
  };

  const armor = [
    { name: 'Leather Jacket', protection: 'Light', effect: 'Reduces Direct wounds to scratches against melee' },
    { name: 'Kevlar Vest (Prototype)', protection: 'Moderate', effect: 'Reduces pistol/knife Direct wounds by one step' },
    { name: 'Military Body Armor', protection: 'Heavy', effect: 'Reduces rifle Direct wounds by one step, Torso only' },
    { name: 'Riot Shield', protection: 'Variable', effect: '+2 dice to defense, covers one location' },
    { name: 'Supernatural Ward', protection: 'Special', effect: 'Protects against specific supernatural attacks' }
  ];

  const equipment = [
    { 
      category: 'Personal Gear',
      items: [
        { name: 'Flashlight', price: '$3–10', effect: 'Illuminate dark areas, removes darkness penalties', notes: 'Battery powered; civilian or police.' },
        { name: 'Compass', price: '$1–5', effect: 'Navigation aid', notes: 'Civilian or military type.' },
        { name: 'Pocket Watch', price: '$15–50', effect: 'Timekeeping', notes: 'Quality depends on brand.' },
        { name: 'Binoculars', price: '$10–40', effect: '+1 die perception at distance', notes: 'Civilian or military type.' },
        { name: 'Maps / Atlases', price: '$1–3', effect: 'Navigation, planning', notes: 'Paper maps; inexpensive.' }
      ]
    },
    {
      category: 'Survival / Utility',
      items: [
        { name: 'Rope / Cord', price: '$1–3', effect: 'Climbing, restraining', notes: 'Standard utility rope.' },
        { name: 'Crowbar', price: '$2–6', effect: 'Force entry, improvised weapon (Str 3)', notes: 'Tool; also usable as weapon.' },
        { name: 'Pocket Tools / Multi tool', price: '$5–15', effect: 'Various utility functions', notes: 'Basic or higher quality versions.' },
        { name: 'First Aid Kit', price: '$5–15', effect: 'Stabilize wounds, stop bleeding', notes: 'Civilian or field kit. 3-5 uses.' },
        { name: 'Canteen / Water Bottle', price: '$2–6', effect: 'Hydration', notes: 'Military or civilian.' }
      ]
    },
    {
      category: 'Combat / Defense',
      items: [
        { name: 'Gas Mask', price: '$15–25', effect: 'Protection from gas/smoke', notes: 'Military surplus; some civilian.' },
        { name: 'Helmet (Military)', price: '$10–20', effect: '+1 defense vs head wounds', notes: 'Steel; surplus cheap.' },
        { name: 'Body Armor (Flak Vest)', price: '$50–100', effect: 'Reduces Torso Direct wounds by one step', notes: 'Limited protection; rare civilian.' },
        { name: 'Grenades (Smoke / Fragmentation)', price: '$5–15', effect: 'Str 5 damage, 15ft radius / concealment', notes: 'Military only; civilian possession illegal.' }
      ]
    },
    {
      category: 'Occult / Ritual',
      items: [
        { name: 'Holy Water', price: '$1–5', effect: 'Damages demons/undead, purifies', notes: 'Blessed by clergy; effects vary.' },
        { name: 'Silver Bullets (per round)', price: '$2–5', effect: 'Effective against lycanthropes', notes: 'Custom made; +1 wound severity vs werebeasts.' },
        { name: 'Iron Nails', price: '$0.50–2', effect: 'Wards against fae and spirits', notes: 'Cold iron; place at entry points.' },
        { name: 'Ritual Chalk', price: '$1–3', effect: 'Draw protective circles', notes: 'For circles and symbols.' },
        { name: 'Blessed Cross', price: '$5–20', effect: 'Repels lesser undead', notes: 'Religious symbol; varies by quality.' },
        { name: 'Grimoire / Occult Book', price: '$50–500', effect: '+1 die Occult checks, ritual knowledge', notes: 'Rare texts; price varies wildly.' },
        { name: 'Sage Bundle', price: '$2–5', effect: 'Cleanse area of minor spiritual influence', notes: 'For cleansing rituals. 4 uses.' }
      ]
    }
  ];

  const vehicles = [
    { name: 'Sedan (Used)', price: '$500–1500', speed: 'Standard', notes: 'Common civilian car; 4-5 passengers.' },
    { name: 'Truck (Used)', price: '$800–2000', speed: 'Slow', notes: 'Utility vehicle; cargo capacity.' },
    { name: 'Motorcycle', price: '$300–800', speed: 'Fast', notes: 'Fast, maneuverable; 1-2 passengers.' },
    { name: 'Police Car', price: '$1200–2000', speed: 'Fast', notes: 'Radio equipped; official use.' },
    { name: 'Military Jeep', price: '$1000–1800', speed: 'Standard', notes: 'Surplus; rugged all-terrain.' }
  ];

  const renderMelee = () => (
    <div className="items-section">
      <h3>Melee Weapons</h3>
      <p className="section-note">Weapon Strength + 1d6 vs Archetype Thresholds determines wound severity</p>
      
      <table className="items-table">
        <thead>
          <tr>
            <th>Weapon</th>
            <th>Strength</th>
            <th>Price</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {meleeWeapons.map((weapon, idx) => (
            <tr key={idx}>
              <td><strong>{weapon.name}</strong></td>
              <td>{weapon.strength}</td>
              <td>{weapon.price}</td>
              <td>{weapon.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="reference-box">
        <h4>Quick Reference: Archetype Thresholds</h4>
        <table className="mini-table">
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
    </div>
  );

  const renderFirearms = () => (
    <div className="items-section">
      <h3>Firearms</h3>
      <p className="section-note">Weapon Strength + 1d6 vs Archetype Thresholds determines wound severity</p>
      
      <h4>Handguns</h4>
      <table className="items-table">
        <thead>
          <tr>
            <th>Weapon</th>
            <th>Strength</th>
            <th>Range</th>
            <th>Price</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {firearms.handguns.map((weapon, idx) => (
            <tr key={idx}>
              <td><strong>{weapon.name}</strong></td>
              <td>{weapon.strength}</td>
              <td>{weapon.range}</td>
              <td>{weapon.price}</td>
              <td>{weapon.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Submachine Guns</h4>
      <table className="items-table">
        <thead>
          <tr>
            <th>Weapon</th>
            <th>Strength</th>
            <th>Range</th>
            <th>Price</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {firearms.submachineguns.map((weapon, idx) => (
            <tr key={idx}>
              <td><strong>{weapon.name}</strong></td>
              <td>{weapon.strength}</td>
              <td>{weapon.range}</td>
              <td>{weapon.price}</td>
              <td>{weapon.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Rifles</h4>
      <table className="items-table">
        <thead>
          <tr>
            <th>Weapon</th>
            <th>Strength</th>
            <th>Range</th>
            <th>Price</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {firearms.rifles.map((weapon, idx) => (
            <tr key={idx}>
              <td><strong>{weapon.name}</strong></td>
              <td>{weapon.strength}</td>
              <td>{weapon.range}</td>
              <td>{weapon.price}</td>
              <td>{weapon.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Shotguns</h4>
      <table className="items-table">
        <thead>
          <tr>
            <th>Weapon</th>
            <th>Strength</th>
            <th>Range</th>
            <th>Price</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {firearms.shotguns.map((weapon, idx) => (
            <tr key={idx}>
              <td><strong>{weapon.name}</strong></td>
              <td>{weapon.strength}</td>
              <td>{weapon.range}</td>
              <td>{weapon.price}</td>
              <td>{weapon.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Machine Guns</h4>
      <table className="items-table">
        <thead>
          <tr>
            <th>Weapon</th>
            <th>Strength</th>
            <th>Range</th>
            <th>Price</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {firearms.machineguns.map((weapon, idx) => (
            <tr key={idx}>
              <td><strong>{weapon.name}</strong></td>
              <td>{weapon.strength}</td>
              <td>{weapon.range}</td>
              <td>{weapon.price}</td>
              <td>{weapon.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="reference-box">
        <h4>Quick Reference: Archetype Thresholds</h4>
        <table className="mini-table">
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
    </div>
  );

  const renderArmor = () => (
    <div className="items-section">
      <h3>Armor & Protection</h3>
      <div className="armor-grid">
        {armor.map((item, idx) => (
          <div key={idx} className="armor-card">
            <h4>{item.name}</h4>
            <p className="armor-protection"><strong>Protection:</strong> {item.protection}</p>
            <p className="armor-effect">{item.effect}</p>
          </div>
        ))}
      </div>
      <p className="section-note">
        Armor reduces wound severity or provides defensive bonuses. Heavy armor may impose mobility penalties.
      </p>
    </div>
  );

  const renderEquipment = () => (
    <div className="items-section">
      <h3>Equipment & Gear</h3>
      {equipment.map((category, catIdx) => (
        <div key={catIdx} className="equipment-category">
          <h4>{category.category}</h4>
          <div className="equipment-grid">
            {category.items.map((item, itemIdx) => (
              <div key={itemIdx} className="equipment-card">
                <h5>{item.name}</h5>
                <p className="item-price"><strong>Price:</strong> {item.price}</p>
                <p><strong>Effect:</strong> {item.effect}</p>
                <p className="item-notes">{item.notes}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderVehicles = () => (
    <div className="items-section">
      <h3>Vehicles</h3>
      <p className="section-note">All prices reflect used vehicle market in post-war America (1947-1955)</p>
      
      <table className="items-table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Price</th>
            <th>Speed</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle, idx) => (
            <tr key={idx}>
              <td><strong>{vehicle.name}</strong></td>
              <td>{vehicle.price}</td>
              <td>{vehicle.speed}</td>
              <td>{vehicle.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="items-container">
      <nav className="items-nav">
        <button
          className={selectedCategory === 'melee' ? 'active' : ''}
          onClick={() => setSelectedCategory('melee')}
        >
          Melee Weapons
        </button>
        <button
          className={selectedCategory === 'firearms' ? 'active' : ''}
          onClick={() => setSelectedCategory('firearms')}
        >
          Firearms
        </button>
        <button
          className={selectedCategory === 'armor' ? 'active' : ''}
          onClick={() => setSelectedCategory('armor')}
        >
          Armor
        </button>
        <button
          className={selectedCategory === 'equipment' ? 'active' : ''}
          onClick={() => setSelectedCategory('equipment')}
        >
          Equipment
        </button>
        <button
          className={selectedCategory === 'vehicles' ? 'active' : ''}
          onClick={() => setSelectedCategory('vehicles')}
        >
          Vehicles
        </button>
      </nav>

      <div className="items-content">
        {selectedCategory === 'melee' && renderMelee()}
        {selectedCategory === 'firearms' && renderFirearms()}
        {selectedCategory === 'armor' && renderArmor()}
        {selectedCategory === 'equipment' && renderEquipment()}
        {selectedCategory === 'vehicles' && renderVehicles()}
      </div>

      <section className="items-section">
        <h3>Custom Items</h3>
        <p>
          Game Masters can create custom items using these guidelines:
        </p>
        <ul>
          <li><strong>Weapons:</strong> Assign Strength 2-6 based on lethality and size</li>
          <li><strong>Armor:</strong> Reduce wound severity by 1 step or grant +1-2 defense dice</li>
          <li><strong>Tools:</strong> Grant +1 die to specific actions or enable new possibilities</li>
          <li><strong>Occult Items:</strong> Provide supernatural effects with appropriate costs</li>
        </ul>
      </section>
    </div>
  );
}

export default Items;
