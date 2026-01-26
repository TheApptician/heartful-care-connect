import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Auth Protection
import RoleGuard from "@/components/auth/RoleGuard";
import ScrollToTop from "@/components/shared/ScrollToTop";

// Loading Fallback Component
// Minimal loading fallback - nearly invisible to prevent flash
// Returns null initially, only shows spinner after a delay
const PageLoader = () => null;

// ============================================
// PUBLIC PAGES - Eagerly loaded for SEO/fast initial load
// ============================================
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import ForCarers from "./pages/ForCarers";

import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/public/HowItWorks";
import TypesOfCare from "./pages/public/TypesOfCare";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

import Security from "./pages/public/Security";
import Privacy from "./pages/public/Privacy";
import Terms from "./pages/public/Terms";
import UserGuide from "./pages/public/UserGuide";
import SafetyGuidelines from "./pages/public/SafetyGuidelines";
import Blog from "./pages/public/Blog";
import BlogPost from "./pages/public/BlogPost";

// AUTH PAGES - Eagerly loaded for fast login experience
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ClientSignup from "./pages/auth/ClientSignup";
import CarerSignup from "./pages/auth/CarerSignup";
import OrganisationSignup from "./pages/auth/OrganisationSignup";
import SignupSuccess from "./pages/auth/SignupSuccess";
import ForgotPassword from "./pages/auth/ForgotPassword";

// ============================================
// DASHBOARD PAGES - Lazy loaded for faster initial load
// ============================================

// Client Pages
const ClientDashboard = lazy(() => import("./pages/client/Dashboard"));
const SearchCarers = lazy(() => import("./pages/client/SearchCarers"));
const SearchEnhanced = lazy(() => import("./pages/client/SearchEnhanced"));
const ClientBookings = lazy(() => import("./pages/client/Bookings"));
const CreateBooking = lazy(() => import("./pages/client/CreateBooking"));
const CarePlans = lazy(() => import("./pages/client/CarePlans"));
const ClientPayments = lazy(() => import("./pages/client/Payments"));
const ClientProfile = lazy(() => import("./pages/client/Profile"));
const ClientSettings = lazy(() => import("./pages/client/Settings"));
const PostJob = lazy(() => import("./pages/client/PostJob"));

// Public Pages (Lazy Loaded)
const LegalPage = lazy(() => import("./pages/public/Legal"));

// Carer Pages
const CarerDashboard = lazy(() => import("./pages/carer/Dashboard"));
const CarerAvailability = lazy(() => import("./pages/carer/Availability"));
const CarerBookings = lazy(() => import("./pages/carer/BookingsEnhanced"));
const CarerEarnings = lazy(() => import("./pages/carer/Earnings"));
const EarningsEnhanced = lazy(() => import("./pages/carer/EarningsEnhanced"));
const CarerDocuments = lazy(() => import("./pages/carer/Documents"));
const DocumentsNew = lazy(() => import("./pages/carer/DocumentsNew"));
const CarerProfile = lazy(() => import("./pages/carer/Profile"));
const ProfileEnhanced = lazy(() => import("./pages/carer/ProfileEnhanced"));

// Organisation Pages
const OrganisationDashboard = lazy(() => import("./pages/organisation/Dashboard"));
const OrganisationStaff = lazy(() => import("./pages/organisation/Staff"));
const OrganisationJobs = lazy(() => import("./pages/organisation/Jobs"));
const OrganisationBookings = lazy(() => import("./pages/organisation/Bookings"));
const OrganisationCompliance = lazy(() => import("./pages/organisation/Compliance"));
const OrganisationAnalytics = lazy(() => import("./pages/organisation/Analytics"));
const OrganisationSettings = lazy(() => import("./pages/organisation/Settings"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminVerifications = lazy(() => import("./pages/admin/Verifications"));
const VerificationsEnhanced = lazy(() => import("./pages/admin/VerificationsEnhanced"));
const AdminOrganisations = lazy(() => import("./pages/admin/Organisations"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const PhaseControl = lazy(() => import("./pages/admin/PhaseControl"));
const SystemLogs = lazy(() => import("./pages/admin/SystemLogs"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const Disputes = lazy(() => import("./pages/admin/Disputes"));
const AdminProfile = lazy(() => import("./pages/admin/Profile"));
const AdminCarers = lazy(() => import("./pages/admin/Carers"));
const AdminBookings = lazy(() => import("./pages/admin/Bookings"));
const AdminBlogManagement = lazy(() => import("./pages/admin/BlogManagement"));

// Shared Pages
const MessagesPage = lazy(() => import("./pages/shared/Messages"));
const Help = lazy(() => import("./pages/shared/Help"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/carers" element={<ForCarers />} />

              <Route path="/pricing" element={<Pricing />} />

              {/* New Public Pages */}
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/types-of-care" element={<TypesOfCare />} />
              <Route path="/about" element={<About />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/security" element={<Security />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/user-guide" element={<UserGuide />} />
              <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup/client" element={<ClientSignup />} />
              <Route path="/signup/carer" element={<CarerSignup />} />
              <Route path="/signup/organisation" element={<OrganisationSignup />} />
              <Route path="/signup/success" element={<SignupSuccess />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Client Routes - Protected for 'client' role only */}
              <Route path="/client/dashboard" element={
                <RoleGuard allowedRoles={['client', 'organisation']}>
                  <ClientDashboard />
                </RoleGuard>
              } />
              <Route path="/client/search" element={
                <RoleGuard allowedRoles={['client', 'organisation']}>
                  <SearchCarers />
                </RoleGuard>
              } />
              <Route path="/client/search-enhanced" element={
                <RoleGuard allowedRoles={['client', 'organisation']}>
                  <SearchEnhanced />
                </RoleGuard>
              } />
              <Route path="/client/bookings" element={
                <RoleGuard allowedRoles={['client']}>
                  <ClientBookings />
                </RoleGuard>
              } />
              <Route path="/client/post-job" element={
                <RoleGuard allowedRoles={['client']}>
                  <PostJob />
                </RoleGuard>
              } />
              <Route path="/client/book/:carerId" element={
                <RoleGuard allowedRoles={['client', 'organisation']}>
                  <CreateBooking />
                </RoleGuard>
              } />
              <Route path="/client/care-plans" element={
                <RoleGuard allowedRoles={['client']}>
                  <CarePlans />
                </RoleGuard>
              } />
              <Route path="/client/messages" element={
                <RoleGuard allowedRoles={['client']}>
                  <MessagesPage role="client" />
                </RoleGuard>
              } />
              <Route path="/client/payments" element={
                <RoleGuard allowedRoles={['client']}>
                  <ClientPayments />
                </RoleGuard>
              } />
              <Route path="/client/profile" element={
                <RoleGuard allowedRoles={['client']}>
                  <ClientProfile />
                </RoleGuard>
              } />
              <Route path="/client/settings" element={
                <RoleGuard allowedRoles={['client']}>
                  <ClientSettings />
                </RoleGuard>
              } />

              {/* Shared Routes */}
              <Route path="/help" element={<Help />} />

              {/* Carer Routes - Protected for 'carer' role only */}
              <Route path="/carer/dashboard" element={
                <RoleGuard allowedRoles={['carer']}>
                  <CarerDashboard />
                </RoleGuard>
              } />
              <Route path="/carer/availability" element={
                <RoleGuard allowedRoles={['carer']}>
                  <CarerAvailability />
                </RoleGuard>
              } />
              <Route path="/carer/bookings" element={
                <RoleGuard allowedRoles={['carer']}>
                  <CarerBookings />
                </RoleGuard>
              } />
              <Route path="/carer/earnings" element={
                <RoleGuard allowedRoles={['carer']}>
                  <CarerEarnings />
                </RoleGuard>
              } />
              <Route path="/carer/earnings-enhanced" element={
                <RoleGuard allowedRoles={['carer']}>
                  <EarningsEnhanced />
                </RoleGuard>
              } />
              <Route path="/carer/documents" element={
                <RoleGuard allowedRoles={['carer']}>
                  <CarerDocuments />
                </RoleGuard>
              } />
              <Route path="/carer/verification" element={
                <RoleGuard allowedRoles={['carer']}>
                  <DocumentsNew />
                </RoleGuard>
              } />
              <Route path="/carer/profile" element={
                <RoleGuard allowedRoles={['carer']}>
                  <CarerProfile />
                </RoleGuard>
              } />
              <Route path="/carer/profile-enhanced" element={
                <RoleGuard allowedRoles={['carer']}>
                  <ProfileEnhanced />
                </RoleGuard>
              } />
              <Route path="/carer/messages" element={
                <RoleGuard allowedRoles={['carer']}>
                  <MessagesPage role="carer" />
                </RoleGuard>
              } />
              <Route path="/carer/settings" element={
                <RoleGuard allowedRoles={['carer']}>
                  <CarerProfile />
                </RoleGuard>
              } />

              {/* Organisation Routes - Protected for 'organisation' role only */}
              <Route path="/organisation/dashboard" element={
                <RoleGuard allowedRoles={['organisation']}>
                  <OrganisationDashboard />
                </RoleGuard>
              } />
              <Route path="/organisation/staff" element={
                <RoleGuard allowedRoles={['organisation']}>
                  <OrganisationStaff />
                </RoleGuard>
              } />
              <Route path="/organisation/jobs" element={
                <RoleGuard allowedRoles={['organisation']}>
                  <OrganisationJobs />
                </RoleGuard>
              } />
              <Route path="/organisation/bookings" element={
                <RoleGuard allowedRoles={['organisation']}>
                  <OrganisationBookings />
                </RoleGuard>
              } />
              <Route path="/organisation/compliance" element={
                <RoleGuard allowedRoles={['organisation']}>
                  <OrganisationCompliance />
                </RoleGuard>
              } />
              <Route path="/organisation/analytics" element={
                <RoleGuard allowedRoles={['organisation']}>
                  <OrganisationAnalytics />
                </RoleGuard>
              } />
              <Route path="/organisation/profile" element={
                <RoleGuard allowedRoles={['organisation']}>
                  <OrganisationDashboard />
                </RoleGuard>
              } />
              <Route path="/organisation/messages" element={
                <RoleGuard allowedRoles={['organisation']}>
                  <MessagesPage role="organisation" />
                </RoleGuard>
              } />
              <Route path="/organisation/settings" element={
                <RoleGuard allowedRoles={['organisation']}>
                  <OrganisationSettings />
                </RoleGuard>
              } />

              {/* Admin Routes - Protected for 'admin' role only */}
              <Route path="/admin/dashboard" element={
                <RoleGuard allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleGuard>
              } />
              <Route path="/admin/users" element={
                <RoleGuard allowedRoles={['admin']}>
                  <AdminUsers />
                </RoleGuard>
              } />
              <Route path="/admin/verifications" element={
                <RoleGuard allowedRoles={['admin']}>
                  <AdminVerifications />
                </RoleGuard>
              } />
              <Route path="/admin/verification-queue" element={
                <RoleGuard allowedRoles={['admin']}>
                  <VerificationsEnhanced />
                </RoleGuard>
              } />
              <Route path="/admin/organisations" element={
                <RoleGuard allowedRoles={['admin']}>
                  <AdminOrganisations />
                </RoleGuard>
              } />
              <Route path="/admin/reports" element={
                <RoleGuard allowedRoles={['admin']}>
                  <AdminReports />
                </RoleGuard>
              } />
              <Route path="/admin/phase-control" element={
                <RoleGuard allowedRoles={['admin']}>
                  <PhaseControl />
                </RoleGuard>
              } />
              <Route path="/admin/messages" element={
                <RoleGuard allowedRoles={['admin']}>
                  <MessagesPage role="admin" />
                </RoleGuard>
              } />
              <Route path="/admin/system-logs" element={
                <RoleGuard allowedRoles={['admin']}>
                  <SystemLogs />
                </RoleGuard>
              } />
              <Route path="/admin/settings" element={
                <RoleGuard allowedRoles={['admin']}>
                  <Settings />
                </RoleGuard>
              } />
              <Route path="/admin/disputes" element={
                <RoleGuard allowedRoles={['admin']}>
                  <Disputes />
                </RoleGuard>
              } />
              <Route path="/admin/profile" element={
                <RoleGuard allowedRoles={['admin']}>
                  <AdminProfile />
                </RoleGuard>
              } />
              <Route path="/admin/carers" element={
                <RoleGuard allowedRoles={['admin']}>
                  <AdminCarers />
                </RoleGuard>
              } />
              <Route path="/admin/bookings" element={
                <RoleGuard allowedRoles={['admin']}>
                  <AdminBookings />
                </RoleGuard>
              } />
              <Route path="/admin/blog" element={
                <RoleGuard allowedRoles={['admin']}>
                  <AdminBlogManagement />
                </RoleGuard>
              } />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
