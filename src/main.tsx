import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import { TooltipProvider } from "@/components/ui/tooltip"
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>

      <TooltipProvider>
        <Toaster position="top-right" richColors closeButton />
        <App />
      </TooltipProvider>

    </QueryClientProvider>
  </StrictMode>,
)