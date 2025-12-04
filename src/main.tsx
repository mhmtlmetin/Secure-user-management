import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store'; 
import { BrowserRouter } from 'react-router-dom'; 
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!); 

root.render(
  <React.StrictMode>
    {/* Redux Store'u tüm uygulamaya sağlar */}
    <Provider store={store}>
      {/* Router'ı etkinleştirir */}
      <BrowserRouter> 
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);