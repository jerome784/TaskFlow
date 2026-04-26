import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// Layout
import MainLayout from "../layouts/MainLayout";

// Public Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

// Shared Protected
import Onboarding from "../pages/Onboarding";
import Profile from "../pages/Profile";

// Team Pages
import TeamDashboard from "../pages/team/TeamDashboard";
import Tasks from "../pages/Tasks";
import Projects from "../pages/Projects";
import Reports from "../pages/Reports";
import Admin from "../pages/Admin";

// Individual Pages
import PersonalDashboard from "../pages/individual/PersonalDashboard";
import Planner from "../pages/individual/Planner";
import Habits from "../pages/individual/Habits";
import Journal from "../pages/individual/Journal";

function ProtectedRoute({ children }) {
  const { isAuthenticated, purpose } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Force onboarding if purpose is not set and not currently on onboarding
  if (!purpose && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

export default function AppRoutes() {
  const { purpose } = useAuthStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Onboarding */}
      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } 
      />

      {/* Protected Routes inside MainLayout */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route 
          index 
          element={<Navigate to={purpose === 'TEAM' ? '/app/team-dashboard' : '/app/personal-dashboard'} replace />} 
        />
        
        {/* Team Routes */}
        <Route path="team-dashboard" element={<TeamDashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="projects" element={<Projects />} />
        <Route path="reports" element={<Reports />} />
        <Route path="admin" element={<Admin />} />

        {/* Individual Routes */}
        <Route path="personal-dashboard" element={<PersonalDashboard />} />
        <Route path="planner" element={<Planner />} />
        <Route path="habits" element={<Habits />} />
        <Route path="journal" element={<Journal />} />

        {/* Shared */}
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
