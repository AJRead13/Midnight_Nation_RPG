import { useState, useEffect } from "react";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Page from "./components/Page";
import DiceRoller from "./components/DiceRoller";
import { useLocation, useNavigate } from "react-router-dom";

function App() {
  const currentPage = useLocation().pathname;
  const navigate = useNavigate();
  const [isDiceRollerOpen, setIsDiceRollerOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K: Open dice roller
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsDiceRollerOpen(true);
      }
      
      // Escape: Close dice roller
      if (e.key === 'Escape' && isDiceRollerOpen) {
        setIsDiceRollerOpen(false);
      }

      // Ctrl/Cmd + H: Go to home
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        navigate('/');
      }

      // Ctrl/Cmd + Shift + C: Go to character sheet
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        navigate('/character-sheet');
      }

      // Ctrl/Cmd + Shift + L: Go to characters list
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        navigate('/characters');
      }

      // Ctrl/Cmd + Shift + M: Go to campaigns
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        navigate('/campaigns');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDiceRollerOpen, navigate]);

  return (
    <div>
      <Header>
        <Nav currentPage={currentPage} />
      </Header>
      <main>
        <Page currentPage={currentPage} />
      </main>
      <Footer />
      
      {/* Floating Dice Button */}
      <button 
        className="floating-dice-btn" 
        onClick={() => setIsDiceRollerOpen(true)}
        title="Open Dice Roller (Ctrl+K)"
      >
        🎲
      </button>

      {/* Dice Roller Modal */}
      <DiceRoller 
        isOpen={isDiceRollerOpen} 
        onClose={() => setIsDiceRollerOpen(false)} 
      />
    </div>
  );
}

export default App;
