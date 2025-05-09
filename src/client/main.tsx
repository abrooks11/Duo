import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import App from './App';
// import styles
import './styles/AppLayout.scss';
import './styles/UI.scss';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <BrowserRouter>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </BrowserRouter>
  // </StrictMode>,
);
