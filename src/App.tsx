import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Features from "./pages/Features";
import UseCases from "./pages/UseCases";
import Impact from "./pages/Impact";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import { useAuth } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Translator from "./pages/Translator";
import Talk from "./pages/Talk";
import ContinueLearning from './pages/ContinueLearning';

function App() {
  const { user } = useAuth();

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-background font-sans antialiased">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="/talk" element={<Talk />} />
            <Route path="/translator" element={<Translator />} />
            <Route path="/learning" element={<ContinueLearning />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/dashboard" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/support" element={<Support />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Sonner />
    </TooltipProvider>
  );
}

export default App;
