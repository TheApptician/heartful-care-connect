import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ClientSignup from "./pages/auth/ClientSignup";
import CarerSignup from "./pages/auth/CarerSignup";
import OrganisationSignup from "./pages/auth/OrganisationSignup";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Dashboard Pages
import ClientDashboard from "./pages/client/Dashboard";
import CarerDashboard from "./pages/carer/Dashboard";
import OrganisationDashboard from "./pages/organisation/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/client" element={<ClientSignup />} />
            <Route path="/signup/carer" element={<CarerSignup />} />
            <Route path="/signup/organisation" element={<OrganisationSignup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Client Routes */}
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            
            {/* Carer Routes */}
            <Route path="/carer/dashboard" element={<CarerDashboard />} />
            
            {/* Organisation Routes */}
            <Route path="/organisation/dashboard" element={<OrganisationDashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
