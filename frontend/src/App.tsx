// frontend/src/App.tsx
import React, { Component, ErrorInfo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/components/ui/Toast';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';

// Page components
import LoginPage from '@/pages/LoginPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { MonitoringPage } from '@/pages/MonitoringPage';
import AttackDetectionClassificationPage from '@/pages/AttackDetectionClassificationPage';
import { RcaPage } from '@/pages/RcaPage';
import ThreatPredictionPage from '@/pages/ThreatPredictionPage';
import MaintenancePage from '@/pages/MaintenancePage';
import ResponsesPage from '@/pages/ResponsesPage';
import ModelsLearningPage from '@/pages/ModelsLearningPage';
import ReportsAuditPage from '@/pages/ReportsAuditPage';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-lg font-bold text-white">AdaptiveCloud UI Recovery</h2>
            <p className="text-xs text-zinc-400">
              The application encountered a transient render exception. You can reload or proceed to monitoring.
            </p>
            {this.state.error && (
              <div className="bg-black/80 border border-zinc-800 rounded-lg p-3 text-[11px] font-mono text-zinc-400 text-left overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/monitoring';
                }}
                className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-200 transition-all"
              >
                Go to Fleet Monitoring
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-white font-semibold text-xs rounded-xl transition-all"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token || s.accessToken);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <RequireAuth>
                  <Layout />
                </RequireAuth>
              }
            >
              <Route path="/" element={<OverviewPage />} />
              <Route path="/monitoring" element={<MonitoringPage />} />
              <Route path="/detections" element={<AttackDetectionClassificationPage />} />
              <Route path="/classifications" element={<AttackDetectionClassificationPage />} />
              <Route path="/rca" element={<RcaPage />} />
              <Route path="/predictions" element={<ThreatPredictionPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/responses" element={<ResponsesPage />} />
              <Route path="/learning" element={<ModelsLearningPage />} />
              <Route path="/reports" element={<ReportsAuditPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
