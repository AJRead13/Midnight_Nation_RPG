import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../utils/helpers';
import infoData from '../../../../info.json';
import itemsData from '../../../../items.json';
import boonsData from '../../../../boons.json';

function Nav({ currentPage }) {
  const pages = ['lore', 'rules', 'character-sheet', 'items'];
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const formatPageName = (page) => {
    if (page === 'character-sheet') return 'Character Sheet';
    return capitalizeFirstLetter(page);
  };

  const searchContent = (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const results = [];
    const lowerQuery = query.toLowerCase();

    // Search in info.json
    // Search classes
    if (infoData.classes) {
      Object.entries(infoData.classes).forEach(([className, classData]) => {
        if (className.toLowerCase().includes(lowerQuery) || 
            classData.description?.toLowerCase().includes(lowerQuery)) {
          results.push({
            title: className,
            description: classData.description,
            page: 'rules',
            section: 'classes',
            type: 'Class'
          });
        }
      });
    }

    // Search bloodlines
    if (infoData.bloodlines) {
      Object.entries(infoData.bloodlines).forEach(([bloodlineName, bloodlineData]) => {
        if (bloodlineName.toLowerCase().includes(lowerQuery) || 
            bloodlineData.description?.toLowerCase().includes(lowerQuery)) {
          results.push({
            title: bloodlineName,
            description: bloodlineData.description,
            page: 'rules',
            section: 'bloodlines',
            type: 'Bloodline'
          });
        }
      });
    }

    // Search backgrounds
    if (infoData.backgrounds) {
      infoData.backgrounds.forEach((background) => {
        if (background.name.toLowerCase().includes(lowerQuery) || 
            background.description?.toLowerCase().includes(lowerQuery)) {
          results.push({
            title: background.name,
            description: background.description,
            page: 'rules',
            section: 'backgrounds',
            type: 'Background'
          });
        }
      });
    }

    // Search talents
    if (infoData.talents) {
      Object.entries(infoData.talents).forEach(([talentName, talentDesc]) => {
        if (talentName.toLowerCase().includes(lowerQuery) || 
            talentDesc.toLowerCase().includes(lowerQuery)) {
          results.push({
            title: talentName,
            description: talentDesc,
            page: 'rules',
            section: 'talents',
            type: 'Talent'
          });
        }
      });
    }

    // Search boons
    if (boonsData.boons) {
      Object.entries(boonsData.boons).forEach(([category, boonsList]) => {
        boonsList.forEach((boon) => {
          if (boon.name.toLowerCase().includes(lowerQuery) || 
              boon.effect.toLowerCase().includes(lowerQuery)) {
            results.push({
              title: boon.name,
              description: boon.effect,
              page: 'rules',
              section: 'boons',
              type: `${capitalizeFirstLetter(category)} Boon`
            });
          }
        });
      });
    }

    // Search items
    if (itemsData.items) {
      Object.entries(itemsData.items).forEach(([category, itemsList]) => {
        itemsList.forEach((item) => {
          if (item.name.toLowerCase().includes(lowerQuery) || 
              item.damage?.toLowerCase().includes(lowerQuery) ||
              item.description?.toLowerCase().includes(lowerQuery)) {
            results.push({
              title: item.name,
              description: item.damage || item.description || item.armor || '',
              page: 'items',
              section: category,
              type: capitalizeFirstLetter(category.replace(/_/g, ' '))
            });
          }
        });
      });
    }

    // Search lore content
    const loreSearchTerms = [
      { key: 'setting', section: 'setting' },
      { key: 'organizations', section: 'organizations' }
    ];

    loreSearchTerms.forEach(({ key, section }) => {
      if (infoData[key]) {
        const content = JSON.stringify(infoData[key]).toLowerCase();
        if (content.includes(lowerQuery)) {
          results.push({
            title: capitalizeFirstLetter(section),
            description: 'Found in lore section',
            page: 'lore',
            section: section,
            type: 'Lore'
          });
        }
      }
    });

    setSearchResults(results.slice(0, 10)); // Limit to 10 results
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchContent(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  const handleResultClick = (result) => {
    navigate(`/${result.page}`);
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
  };

  const handleSearchBlur = () => {
    // Delay to allow click on results
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <nav>
      <ul className="flex-row">
        <li
          className={`mx-5 ${currentPage === '/' && 'navActive'}`}
          key="about"
        >
          <Link to="/">Home</Link>
        </li>
        {pages.map((Page) => (
          <li
            className={`mx-5 ${currentPage === `/${Page}` && 'navActive'}`}
            key={Page}
          >
            <Link to={`/${Page}`}>{formatPageName(Page)}</Link>
          </li>
        ))}
        <li className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            onBlur={handleSearchBlur}
          />
          {showResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result, idx) => (
                <div
                  key={idx}
                  className="search-result-item"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="result-header">
                    <span className="result-title">{result.title}</span>
                    <span className="result-type">{result.type}</span>
                  </div>
                  <div className="result-description">{result.description}</div>
                </div>
              ))}
            </div>
          )}
          {showResults && searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="search-results">
              <div className="search-result-item no-results">
                No results found for "{searchQuery}"
              </div>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
