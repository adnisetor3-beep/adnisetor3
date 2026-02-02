import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import AllEvents from './pages/AllEvents';
import PublicAllEvents from './pages/PublicAllEvents';
import Login from './pages/Login';
import { Loader2 } from 'lucide-react';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

// Component to handle global loading state
const AppContent = () => {
  const { loading, users } = useData();

  // Se não tem usuários e está carregando, mostra loader
  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-indigo-600">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Carregando dados...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/eventos-publicos" element={<PublicAllEvents />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/eventos"
        element={
          <ProtectedRoute>
            <AllEvents />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ToastProvider>
        <DataProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </DataProvider>
      </ToastProvider>
    </HashRouter>
  );
};

export default App;