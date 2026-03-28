
import React from 'react';
import Layout from '@/components/Layout';
import AnomalyDashboard from '@/components/anomaly/AnomalyDashboard';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingFlow from '@/components/OnboardingFlow';

const AnomalyDetectionPage = () => {
  const { showOnboarding, completeOnboarding } = useOnboarding();

  return (
    <Layout>
      {showOnboarding && <OnboardingFlow onComplete={completeOnboarding} />}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Anomaly Detection Console</h1>
            <p className="text-gray-600 mt-2">Monitor and manage incoming anomaly alerts in real-time</p>
          </div>
        </div>
        <AnomalyDashboard />
      </div>
    </Layout>
  );
};

export default AnomalyDetectionPage;
