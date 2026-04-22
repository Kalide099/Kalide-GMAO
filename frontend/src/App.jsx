import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useTranslation } from 'react-i18next';

// Layouts / Routes
import ProtectedRoute from './routes/ProtectedRoute';
import SuperAdminRoute from './routes/SuperAdminRoute';
import DashboardLayout from './layouts/DashboardLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';

// Pages (Public)
import LandingPage from './pages/public/LandingPage';
import Pricing from './pages/public/Pricing';
import Register from './pages/public/Register';
import SecurityProtocol from './pages/public/SecurityProtocol';
import SLAAgreement from './pages/public/SLAAgreement';
import ForgotPassword from './pages/public/ForgotPassword';
import AboutUs from './pages/public/AboutUs';
import GlobalPricing from './pages/public/GlobalPricing';
import FreeTrial from './pages/public/FreeTrial';
import GlobalMatrix from './pages/public/GlobalMatrix';

// Pages (Protected SaaS)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import WorkOrders from './pages/WorkOrders';
import Inventory from './pages/Inventory';
import Predictive from './pages/Predictive';
import IoT from './pages/IoT';
import AssetDetails from './pages/AssetDetails';
import AuditLogs from './pages/AuditLogs';
import Energy from './pages/Energy';
import Procurement from './pages/Procurement';
import TeamPerformance from './pages/TeamPerformance';
import WarRoom from './pages/WarRoom';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminLogs from './pages/admin/AdminLogs';
import AdminRegistrations from './pages/admin/Registrations';
import SafetyPermits from './pages/roadmap/SafetyPermits';
import AssetFinance from './pages/roadmap/AssetFinance';
import GISTelematics from './pages/roadmap/GISTelematics';
import FleetTelematics from './pages/roadmap/FleetTelematics';
import SkillMatrix from './pages/roadmap/SkillMatrix';
import SmartWarehouse from './pages/roadmap/SmartWarehouse';
import RealTimeCommand from './pages/roadmap/RealTimeCommand';
import DigitalTwin from './pages/roadmap/DigitalTwin';
import AugmentedWorkforce from './pages/roadmap/AugmentedWorkforce';
import ProcurementSLA from './pages/roadmap/ProcurementSLA';
import ESGCyber from './pages/roadmap/ESGCyber';
import EHS from './pages/EHS';
import LogisticsTower from './pages/LogisticsTower';
import NeuralAR from './pages/NeuralAR';
import CarbonLedger from './pages/CarbonLedger';
import HelpCenter from './pages/public/HelpCenter';
import ContactUs from './pages/public/ContactUs';
import TermsOfUse from './pages/public/TermsOfUse';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import Subcontracting from './pages/Subcontracting';
import FinanceMatrix from './pages/FinanceMatrix';
import CustomForms from './pages/CustomForms';
import SSOConfig from './pages/SSOConfig';

const App = () => {
    const { t } = useTranslation();
    return (
        <React.Suspense fallback={
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-2xl shadow-yellow-400/20"></div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-white font-black uppercase tracking-[0.3em] text-xs">{t('common.syncHQ')}</p>
              <div className="flex gap-1">
                  {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
              </div>
          </div>
      </div>
    }>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Global SaaS Marketing Zone */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/security" element={<SecurityProtocol />} />
            <Route path="/sla" element={<SLAAgreement />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/global-pricing" element={<GlobalPricing />} />
            <Route path="/free-trial" element={<FreeTrial />} />
            <Route path="/global-matrix" element={<GlobalMatrix />} />
            
            {/* Protected Main Application Area */}
            <Route path="/app" element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="assets" element={<Assets />} />
                <Route path="work-orders" element={<WorkOrders />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="predictive" element={<Predictive />} />
                <Route path="iot" element={<IoT />} />
                <Route path="audit" element={<AuditLogs />} />
                <Route path="energy" element={<Energy />} />
                <Route path="procurement" element={<Procurement />} />
                <Route path="performance" element={<TeamPerformance />} />
                <Route path="global" element={<WarRoom />} />
                <Route path="assets/:id" element={<AssetDetails />} />
                <Route path="safety" element={<SafetyPermits />} />
                <Route path="finance" element={<AssetFinance />} />
                <Route path="map" element={<GISTelematics />} />
                <Route path="fleet" element={<FleetTelematics />} />
                <Route path="skills" element={<SkillMatrix />} />
                <Route path="warehouse" element={<SmartWarehouse />} />
                <Route path="command" element={<RealTimeCommand />} />
                <Route path="twin" element={<DigitalTwin />} />
                <Route path="ar" element={<AugmentedWorkforce />} />
                <Route path="hub" element={<ProcurementSLA />} />
                <Route path="esg" element={<ESGCyber />} />
                <Route path="ehs-incident" element={<EHS />} />
                <Route path="logistics-tower" element={<LogisticsTower />} />
                <Route path="neural-ar" element={<NeuralAR />} />
                <Route path="carbon-ledger" element={<CarbonLedger />} />
                <Route path="subcontracting" element={<Subcontracting />} />
                <Route path="finance-matrix" element={<FinanceMatrix />} />
                <Route path="custom-forms" element={<CustomForms />} />
                <Route path="sso-config" element={<SSOConfig />} />
              </Route>
            </Route>

            {/* Root Master Area - Strictly Segregated */}
            <Route element={<SuperAdminRoute />}>
              <Route element={<SuperAdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/companies" element={<AdminCompanies />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/payments" element={<AdminPayments />} />
                <Route path="/admin/logs" element={<AdminLogs />} />
                <Route path="/admin/registrations" element={<AdminRegistrations />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </React.Suspense>
  );
};

export default App;
