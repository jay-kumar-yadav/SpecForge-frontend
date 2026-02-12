import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SpecProvider } from './context/SpecContext';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import Dashboard from './pages/Dashboard';

function AppLayout() {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 p-1">
        <ThemeToggle />
      </div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SpecProvider>
          <AppLayout />
        </SpecProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
