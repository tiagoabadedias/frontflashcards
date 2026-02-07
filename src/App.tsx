import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CampaignsPage } from './pages/CampaignsPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { GroupsPage } from './pages/GroupsPage';
import { GroupQRCodePage } from './pages/GroupQRCodePage';
import { CampaignAnalyticsPage } from './pages/CampaignAnalyticsPage';
import { LoginPage } from './pages/LoginPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { LandingPage } from './pages/LandingPage';
import { LandingPage2 } from './pages/LandingPage2';
import { LandingPage3 } from './pages/LandingPage3';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            
            {/* Rotas Públicas */}
            <Route path="/" element={<LandingPage3 />} />
            <Route path="/v1" element={<LandingPage />} />
            <Route path="/v2" element={<LandingPage2 />} />
            <Route path="/v3" element={<LandingPage3 />} />
            <Route path="/groups/:id/qrcode" element={<GroupQRCodePage />} />
            
            {/* Rotas Protegidas */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/campaigns" element={
              <PrivateRoute>
                <Layout>
                  <CampaignsPage />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/campaigns/:id/analytics" element={
              <PrivateRoute>
                <Layout>
                  <CampaignAnalyticsPage />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/questions" element={
              <PrivateRoute>
                <Layout>
                  <QuestionsPage />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/groups" element={
              <PrivateRoute>
                <Layout>
                  <GroupsPage />
                </Layout>
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
