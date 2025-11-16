import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Error from './components/ErrorPage';
import About from './components/About';
import Lore from './components/Lore';
import Rules from './components/Rules';
import CharacterSheet from './components/CharacterSheet';
import CharacterList from './components/CharacterList';
import Items from './components/Items';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Resume from './components/Resume';
import CampaignDetail from './components/CampaignDetail';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <About />,
      },
      {
        path: 'lore',
        element: <Lore />,
      },
      {
        path: 'rules',
        element: <Rules />,
      },
      {
        path: 'character-sheet',
        element: <CharacterSheet />,
      },
      {
        path: 'character-sheet/:id',
        element: <CharacterSheet />,
      },
      {
        path: 'characters',
        element: <CharacterList />,
      },
      {
        path: 'items',
        element: <Items />,
      },
      {
        path: 'portfolio',
        element: <Portfolio />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'resume',
        element: <Resume />,
      },
      {
        path: 'campaign/:id',
        element: <CampaignDetail />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
