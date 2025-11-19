import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Error from './components/ErrorPage';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { SocketProvider } from './contexts/SocketContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import About from './components/About';
import Lore from './components/Lore';
import Rules from './components/Rules';
import CharacterSheet from './components/CharacterSheet';
import CharacterList from './components/CharacterList';
import Campaigns from './components/Campaigns';
import Items from './components/Items';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Resume from './components/Resume';
import CampaignDetail from './components/CampaignDetail';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Modules from './components/Modules';
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
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'character-sheet',
        element: (
          <ProtectedRoute>
            <CharacterSheet />
          </ProtectedRoute>
        ),
      },
      {
        path: 'character-sheet/:id',
        element: (
          <ProtectedRoute>
            <CharacterSheet />
          </ProtectedRoute>
        ),
      },
      {
        path: 'characters',
        element: (
          <ProtectedRoute>
            <CharacterList />
          </ProtectedRoute>
        ),
      },
      {
        path: 'campaigns',
        element: (
          <ProtectedRoute>
            <Campaigns />
          </ProtectedRoute>
        ),
      },
      {
        path: 'campaign/:id',
        element: (
          <ProtectedRoute>
            <CampaignDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: 'items',
        element: <Items />,
      },
      {
        path: 'modules',
        element: <Modules />,
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <ToastProvider>
      <AuthProvider>
        <SocketProvider>
          <RouterProvider router={router} />
        </SocketProvider>
      </AuthProvider>
    </ToastProvider>
  </ErrorBoundary>
);
