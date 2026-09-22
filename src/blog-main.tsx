import React from 'react';
import ReactDOM from 'react-dom/client';
import { BlogPage } from './components/BlogPage';
import { LangProvider } from './i18n/LangContext';
import './index.css';
import './styles/portfolio.css';

ReactDOM.createRoot(document.getElementById('blog-root') as HTMLElement).render(
  <React.StrictMode>
    <LangProvider>
      <BlogPage />
    </LangProvider>
  </React.StrictMode>
);
