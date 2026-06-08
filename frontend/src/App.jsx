import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';

// Layouts / Routes
import ProtectedRoute from './routes/ProtectedRoute';
import SuperAdminRoute from './routes/SuperAdminRoute';
import DashboardLayout from './layouts/DashboardLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import { syncOfflineActions } from './utils/offlineSync';
import api from './services/api/axiosConfig';
import CookieConsent from './components/CookieConsent';

const LandingPage = React.lazy(() => import('./pages/public/LandingPage'));
const Pricing = React.lazy(() => import('./pages/public/Pricing'));
const Register = React.lazy(() => import('./pages/public/Register'));
const SecurityProtocol = React.lazy(() => import('./pages/public/SecurityProtocol'));
const SLAAgreement = React.lazy(() => import('./pages/public/SLAAgreement'));
const ForgotPassword = React.lazy(() => import('./pages/public/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/public/ResetPassword'));
const AboutUs = React.lazy(() => import('./pages/public/AboutUs'));
const GlobalPricing = React.lazy(() => import('./pages/public/GlobalPricing'));
const FreeTrial = React.lazy(() => import('./pages/public/FreeTrial'));
const GlobalMatrix = React.lazy(() => import('./pages/public/GlobalMatrix'));
const HelpCenter = React.lazy(() => import('./pages/public/HelpCenter'));
const ContactUs = React.lazy(() => import('./pages/public/ContactUs'));
const TermsOfUse = React.lazy(() => import('./pages/public/TermsOfUse'));
const PrivacyPolicy = React.lazy(() => import('./pages/public/PrivacyPolicy'));

const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Assets = React.lazy(() => import('./pages/Assets'));
const WorkOrders = React.lazy(() => import('./pages/WorkOrders'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const Predictive = React.lazy(() => import('./pages/Predictive'));
const IoT = React.lazy(() => import('./pages/IoT'));
const AssetDetails = React.lazy(() => import('./pages/AssetDetails'));
const AuditLogs = React.lazy(() => import('./pages/AuditLogs'));
const Energy = React.lazy(() => import('./pages/Energy'));
const Procurement = React.lazy(() => import('./pages/Procurement'));
const TeamPerformance = React.lazy(() => import('./pages/TeamPerformance'));
const WarRoom = React.lazy(() => import('./pages/WarRoom'));
const EHS = React.lazy(() => import('./pages/EHS'));
const LogisticsTower = React.lazy(() => import('./pages/LogisticsTower'));
const NeuralAR = React.lazy(() => import('./pages/NeuralAR'));
const CarbonLedger = React.lazy(() => import('./pages/CarbonLedger'));
const Subcontracting = React.lazy(() => import('./pages/Subcontracting'));
const FinanceMatrix = React.lazy(() => import('./pages/FinanceMatrix'));
const CustomForms = React.lazy(() => import('./pages/CustomForms'));
const MfaSecurity = React.lazy(() => import('./pages/MfaSecurity'));
const NexusHub = React.lazy(() => import('./pages/NexusHub'));

const SafetyPermits = React.lazy(() => import('./pages/roadmap/SafetyPermits'));
const AssetFinance = React.lazy(() => import('./pages/roadmap/AssetFinance'));
const GISTelematics = React.lazy(() => import('./pages/roadmap/GISTelematics'));
const FleetTelematics = React.lazy(() => import('./pages/roadmap/FleetTelematics'));
const SkillMatrix = React.lazy(() => import('./pages/roadmap/SkillMatrix'));
const SmartWarehouse = React.lazy(() => import('./pages/roadmap/SmartWarehouse'));
const RealTimeCommand = React.lazy(() => import('./pages/roadmap/RealTimeCommand'));
const DigitalTwin = React.lazy(() => import('./pages/roadmap/DigitalTwin'));
const AugmentedWorkforce = React.lazy(() => import('./pages/roadmap/AugmentedWorkforce'));
const ProcurementSLA = React.lazy(() => import('./pages/roadmap/ProcurementSLA'));
const ESGCyber = React.lazy(() => import('./pages/roadmap/ESGCyber'));

const RootCauseAnalysis = React.lazy(() => import('./pages/nexus/RootCauseAnalysis'));
const FmeaAnalytics = React.lazy(() => import('./pages/nexus/FmeaAnalytics'));
const LotoProtocol = React.lazy(() => import('./pages/nexus/LotoProtocol'));
const CalibrationRegistry = React.lazy(() => import('./pages/nexus/CalibrationRegistry'));
const DocumentVault = React.lazy(() => import('./pages/nexus/DocumentVault'));
const AutonomousTPM = React.lazy(() => import('./pages/nexus/AutonomousTPM'));
const PredictiveInventory = React.lazy(() => import('./pages/nexus/PredictiveInventory'));
const BimExplorer = React.lazy(() => import('./pages/nexus/BimExplorer'));
const OfflineMatrix = React.lazy(() => import('./pages/nexus/OfflineMatrix'));

// Phase 5 Emerging Markets Components
const MicroGridTelemetry = React.lazy(() => import('./pages/phase5/MicroGridTelemetry'));
const UssdOfflineOps = React.lazy(() => import('./pages/phase5/UssdOfflineOps'));
const LeakDetection = React.lazy(() => import('./pages/phase5/LeakDetection'));
const DustPredictive = React.lazy(() => import('./pages/phase5/DustPredictive'));
const RouteRisk = React.lazy(() => import('./pages/phase5/RouteRisk'));
const SolarColdStorage = React.lazy(() => import('./pages/phase5/SolarColdStorage'));
const CommunityFault = React.lazy(() => import('./pages/phase5/CommunityFault'));
const MobileMoneyPayroll = React.lazy(() => import('./pages/phase5/MobileMoneyPayroll'));
const PipelineIntegrity = React.lazy(() => import('./pages/phase5/PipelineIntegrity'));
const OffGridResource = React.lazy(() => import('./pages/phase5/OffGridResource'));
const InflationPricingSync = React.lazy(() => import('./pages/phase5/InflationPricingSync'));
const AntiPoachingIoT = React.lazy(() => import('./pages/phase5/AntiPoachingIoT'));
const LowBandwidthTwin = React.lazy(() => import('./pages/phase5/LowBandwidthTwin'));

const CropYieldTracking = React.lazy(() => import('./pages/industry/CropYieldTracking'));
const SoilMoistureIoT = React.lazy(() => import('./pages/industry/SoilMoistureIoT'));
const MedicalEquipmentCompliance = React.lazy(() => import('./pages/industry/MedicalEquipmentCompliance'));
const CampusFacilityBooking = React.lazy(() => import('./pages/industry/CampusFacilityBooking'));
const HousekeepingSLA = React.lazy(() => import('./pages/industry/HousekeepingSLA'));
const StoreLayoutOptimization = React.lazy(() => import('./pages/industry/StoreLayoutOptimization'));
const SubsurfaceVentilation = React.lazy(() => import('./pages/industry/SubsurfaceVentilation'));
const CityInfrastructureMap = React.lazy(() => import('./pages/industry/CityInfrastructureMap'));

// Phase 3 Next-Level Features
const ProductionOEETracking = React.lazy(() => import('./pages/industry/ProductionOEETracking'));
const NegativePressureIoT = React.lazy(() => import('./pages/industry/NegativePressureIoT'));
const RenewableOutputForecasting = React.lazy(() => import('./pages/industry/RenewableOutputForecasting'));
const WaterQualityTelemetry = React.lazy(() => import('./pages/industry/WaterQualityTelemetry'));
const ITAssetLifecycle = React.lazy(() => import('./pages/industry/ITAssetLifecycle'));
const ColdChainLogistics = React.lazy(() => import('./pages/industry/ColdChainLogistics'));
const HeavyMachineryTelematics = React.lazy(() => import('./pages/industry/HeavyMachineryTelematics'));
const WarehouseRoboticsManager = React.lazy(() => import('./pages/industry/WarehouseRoboticsManager'));
const GuestAmenityMaintenance = React.lazy(() => import('./pages/industry/GuestAmenityMaintenance'));
const VisualMerchandisingCompliance = React.lazy(() => import('./pages/industry/VisualMerchandisingCompliance'));
const ConveyorBeltYieldTracker = React.lazy(() => import('./pages/industry/ConveyorBeltYieldTracker'));
const WasteCollectionRouting = React.lazy(() => import('./pages/industry/WasteCollectionRouting'));

// Phase 4 Autonomy Features
const DroneFleetCommander = React.lazy(() => import('./pages/phase4/DroneFleetCommander'));
const AIProcurement = React.lazy(() => import('./pages/phase4/AIProcurement'));
const VisionDefectDetection = React.lazy(() => import('./pages/phase4/VisionDefectDetection'));

const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCompanies = React.lazy(() => import('./pages/admin/AdminCompanies'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const TenantSettings = React.lazy(() => import('./pages/admin/TenantSettings'));

// Nexus & Tools
const WorkflowAutomation = React.lazy(() => import('./pages/nexus/WorkflowAutomation'));
const ReportGenerator = React.lazy(() => import('./pages/nexus/ReportGenerator'));
const AdminPayments = React.lazy(() => import('./pages/admin/AdminPayments'));
const AdminLogs = React.lazy(() => import('./pages/admin/AdminLogs'));
const AdminRegistrations = React.lazy(() => import('./pages/admin/Registrations'));
const AICopilot = React.lazy(() => import('./pages/AICopilot'));

const App = () => {
    const { t } = useTranslation();

    useEffect(() => {
        const handleOnline = () => {
          console.log('🌐 Connection restored. Syncing data...');
            syncOfflineActions(api);
        };

        window.addEventListener('online', handleOnline);
        // Initial check on load
        if (navigator.onLine) syncOfflineActions(api);

        return () => window.removeEventListener('online', handleOnline);
    }, []);

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
        <Toaster position="top-right" toastOptions={{ className: 'font-black text-xs uppercase tracking-widest' }} />
        <BrowserRouter>
          <Routes>
            {/* Public Global SaaS Marketing Zone */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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
                <Route path="nexus" element={<NexusHub />} />
                <Route path="nexus/rca" element={<RootCauseAnalysis />} />
                <Route path="nexus/fmea" element={<FmeaAnalytics />} />
                <Route path="nexus/loto" element={<LotoProtocol />} />
                <Route path="nexus/calibration" element={<CalibrationRegistry />} />
                <Route path="nexus/dms" element={<DocumentVault />} />
                <Route path="nexus/tpm" element={<AutonomousTPM />} />
                <Route path="nexus/inventory" element={<PredictiveInventory />} />
                <Route path="nexus/bim" element={<BimExplorer />} />
                <Route path="nexus/offline" element={<OfflineMatrix />} />
                <Route path="crop-yield" element={<CropYieldTracking />} />
                <Route path="soil-iot" element={<SoilMoistureIoT />} />
                <Route path="medical-compliance" element={<MedicalEquipmentCompliance />} />
                <Route path="campus-facilities" element={<CampusFacilityBooking />} />
                <Route path="housekeeping" element={<HousekeepingSLA />} />
                <Route path="store-layout" element={<StoreLayoutOptimization />} />
                <Route path="subsurface-ventilation" element={<SubsurfaceVentilation />} />
                <Route path="city-infrastructure" element={<CityInfrastructureMap />} />
                
                {/* Phase 3 Features */}
                <Route path="production-oee" element={<ProductionOEETracking />} />
                <Route path="negative-pressure" element={<NegativePressureIoT />} />
                <Route path="renewable-output" element={<RenewableOutputForecasting />} />
                <Route path="water-quality" element={<WaterQualityTelemetry />} />
                <Route path="it-lifecycle" element={<ITAssetLifecycle />} />
                <Route path="cold-chain" element={<ColdChainLogistics />} />
                <Route path="machinery-telematics" element={<HeavyMachineryTelematics />} />
                <Route path="robotics-manager" element={<WarehouseRoboticsManager />} />
                <Route path="guest-amenity" element={<GuestAmenityMaintenance />} />
                <Route path="visual-merchandising" element={<VisualMerchandisingCompliance />} />
                <Route path="belt-yield" element={<ConveyorBeltYieldTracker />} />
                <Route path="waste-routing" element={<WasteCollectionRouting />} />
                
                {/* Enterprise Autonomy & Advanced Features (Mapped from Admin) */}
                <Route path="ai-copilot" element={<AICopilot />} />
                <Route path="settings" element={<TenantSettings />} />
                <Route path="workflows" element={<WorkflowAutomation />} />
                <Route path="reports" element={<ReportGenerator />} />
                <Route path="drone-fleet" element={<DroneFleetCommander />} />
                <Route path="ai-procurement" element={<AIProcurement />} />
                <Route path="vision-defect" element={<VisionDefectDetection />} />
                
                {/* Phase 5 Emerging Markets Hub */}
                <Route path="micro-grid" element={<MicroGridTelemetry />} />
                <Route path="ussd-offline" element={<UssdOfflineOps />} />
                <Route path="leak-detection" element={<LeakDetection />} />
                <Route path="dust-predictive" element={<DustPredictive />} />
                <Route path="route-risk" element={<RouteRisk />} />
                <Route path="solar-cold" element={<SolarColdStorage />} />
                <Route path="community-fault" element={<CommunityFault />} />
                <Route path="mobile-money" element={<MobileMoneyPayroll />} />
                <Route path="pipeline-integrity" element={<PipelineIntegrity />} />
                <Route path="off-grid" element={<OffGridResource />} />
                <Route path="inflation-sync" element={<InflationPricingSync />} />
                <Route path="anti-poaching" element={<AntiPoachingIoT />} />
                <Route path="low-bandwidth-twin" element={<LowBandwidthTwin />} />
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
                <Route path="/admin/ai-copilot" element={<AICopilot />} />
                <Route path="/admin/mfa-security" element={<MfaSecurity />} />
                <Route path="/admin/settings" element={<TenantSettings />} />
                <Route path="/admin/workflows" element={<WorkflowAutomation />} />
                <Route path="/admin/reports" element={<ReportGenerator />} />
                
                {/* Phase 4 Autonomy Features (Admin Super) */}
                <Route path="/admin/drone-fleet" element={<DroneFleetCommander />} />
                <Route path="/admin/ai-procurement" element={<AIProcurement />} />
                <Route path="/admin/vision-defect" element={<VisionDefectDetection />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <CookieConsent />
        </BrowserRouter>
      </AuthProvider>
    </React.Suspense>
  );
};

export default App;
