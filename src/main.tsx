import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import Router from './router.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router/>
      <ReactQueryDevtools /> {/**Componente que habilita la vista de react-query-devtools*/}
    </QueryClientProvider>
  </React.StrictMode>,
)
