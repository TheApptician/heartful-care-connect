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

// Client Pages
import ClientDashboard from "./pages/client/Dashboard";
import SearchCarers from "./pages/client/SearchCarers";
import ClientBookings from "./pages/client/Bookings";
import CarePlans from "./pages/client/CarePlans";
import ClientMessages from "./pages/client/Messages";
import ClientPayments from "./pages/client/Payments";

// Carer Pages
import CarerDashboard from "./pages/carer/Dashboard";
import CarerAvailability from "./pages/carer/Availability";
import CarerEarnings from "./pages/carer/Earnings";
import CarerDocuments from "./pages/carer/Documents";
import CarerProfile from "./pages/carer/Profile";

// Organisation Pages
import OrganisationDashboard from "./pages/organisation/Dashboard";
import OrganisationStaff from "./pages/organisation/Staff";
import OrganisationJobs from "./pages/organisation/Jobs";
import OrganisationCompliance from "./pages/organisation/Compliance";
import OrganisationAnalytics from "./pages/organisation/Analytics";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminVerifications from "./pages/admin/Verifications";
import AdminOrganisations from "./pages/admin/Organisations";
import AdminReports from "./pages/admin/Reports";

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
            <Route path="/client/search" element={<SearchCarers />} />
            <Route path="/client/bookings" element={<ClientBookings />} />
            <Route path="/client/care-plans" element={<CarePlans />} />
            <Route path="/client/messages" element={<ClientMessages />} />
            <Route path="/client/payments" element={<ClientPayments />} />
            
            {/* Carer Routes */}
            <Route path="/carer/dashboard" element={<CarerDashboard />} />
            <Route path="/carer/availability" element={<CarerAvailability />} />
            <Route path="/carer/earnings" element={<CarerEarnings />} />
            <Route path="/carer/documents" element={<CarerDocuments />} />
            <Route path="/carer/profile" element={<CarerProfile />} />
            
            {/* Organisation Routes */}
            <Route path="/organisation/dashboard" element={<OrganisationDashboard />} />
            <Route path="/organisation/staff" element={<OrganisationStaff />} />
            <Route path="/organisation/jobs" element={<OrganisationJobs />} />
            <Route path="/organisation/compliance" element={<OrganisationCompliance />} />
            <Route path="/organisation/analytics" element={<OrganisationAnalytics />} />
            
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
