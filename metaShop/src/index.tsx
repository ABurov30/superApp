import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './Components/App/App';
import Providers from '@Providers/Providers';

console.log('metaShop init');

let rootElement = document.getElementById('metaShopBlock');

console.log('launching metaShopBlock');
const root = createRoot(rootElement!);
root.render(
  <Providers>
    <App />
  </Providers>
);
