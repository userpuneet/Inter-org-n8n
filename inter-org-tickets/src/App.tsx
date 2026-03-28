import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import AuthGuard from "@/components/AuthGuard";

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
const LoginPage               = lazy(() => import("./pages/LoginPage"));
const Index                   = lazy(() => import("./pages/Index"));
const NotFound                = lazy(() => import("./pages/NotFound"));
const ThreadsPage             = lazy(() => import("./pages/ThreadsPage"));
const CreateTicketPage        = lazy(() => import("./pages/CreateTicketPage"));
const GroupsPage              = lazy(() => import("./pages/GroupsPage"));
const ChannelsPage            = lazy(() => import("./pages/ChannelsPage"));
const CalendarPage            = lazy(() => import("./pages/CalendarPage"));
const AnnouncementsPage       = lazy(() => import("./pages/AnnouncementsPage"));
const AnomalyDetectionPage    = lazy(() => import("./pages/AnomalyDetectionPage"));
const UserManagementPage      = lazy(() => import("./pages/UserManagementPage"));
const ReportsPage             = lazy(() => import("./pages/ReportsPage"));
const ProjectsPage            = lazy(() => import("./pages/ProjectsPage"));
const KanbanBoardPage         = lazy(() => import("./pages/KanbanBoardPage"));
const IssuesPage              = lazy(() => import("./pages/IssuesPage"));
const AIRoutingPage           = lazy(() => import("./pages/features/AIRoutingPage"));
const SLAManagementPage       = lazy(() => import("./pages/features/SLAManagementPage"));
const OmnichannelPage         = lazy(() => import("./pages/features/OmnichannelPage"));
const CollaborativePage       = lazy(() => import("./pages/features/CollaborativePage"));
const ResourcesPage           = lazy(() => import("./pages/features/ResourcesPage"));
const AdvancedAnalyticsPage   = lazy(() => import("./pages/features/AdvancedAnalyticsPage"));
const WorkflowStudioPage      = lazy(() => import("./pages/features/WorkflowStudioPage"));
const FieldServicePage        = lazy(() => import("./pages/features/FieldServicePage"));
const IntegrationsPage        = lazy(() => import("./pages/features/IntegrationsPage"));
const N8NConfigPage           = lazy(() => import("./pages/admin/N8NConfigPage"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
    Loading…
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public route — no auth required */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes — all wrapped by AuthGuard */}
            <Route element={<AuthGuard />}>
              <Route path="/" element={<ThreadsPage />} />
              <Route path="/threads" element={<ThreadsPage />} />
              <Route path="/create-ticket" element={<CreateTicketPage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/channels" element={<ChannelsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/anomaly-detection" element={<AnomalyDetectionPage />} />
              <Route path="/user-management" element={<UserManagementPage />} />
              <Route path="/reports" element={<ReportsPage />} />

              {/* Project management */}
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:projectKey/board" element={<KanbanBoardPage />} />
              <Route path="/projects/:projectKey/issues" element={<IssuesPage />} />

              {/* Feature pages */}
              <Route path="/analytics" element={<AdvancedAnalyticsPage />} />
              <Route path="/ai-routing" element={<AIRoutingPage />} />
              <Route path="/sla-management" element={<SLAManagementPage />} />
              <Route path="/omnichannel" element={<OmnichannelPage />} />
              <Route path="/collaborative" element={<CollaborativePage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/workflow" element={<WorkflowStudioPage />} />
              <Route path="/field-service" element={<FieldServicePage />} />
              <Route path="/integrations" element={<IntegrationsPage />} />

              {/* Admin */}
              <Route path="/admin/n8n" element={<N8NConfigPage />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
