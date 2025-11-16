import { useState } from "react";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Page from "./components/Page";
import DiceRoller from "./components/DiceRoller";
import { useLocation } from "react-router-dom";

function App() {
  const currentPage = useLocation().pathname;
  const [isDiceRollerOpen, setIsDiceRollerOpen] = useState(false);

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
        title="Open Dice Roller"
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
