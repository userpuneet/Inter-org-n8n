
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, ArrowLeft, Users, MessageSquare, BarChart3, Settings } from "lucide-react";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to OrgThread",
    description: "Your comprehensive thread management system",
    icon: <MessageSquare className="h-8 w-8" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">
          OrgThread helps you manage customer support threads, collaborate with your team, 
          and track resolution progress all in one place.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800">Thread Management</h4>
            <p className="text-sm text-blue-600">Organize and prioritize support requests</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-medium text-green-800">Team Collaboration</h4>
            <p className="text-sm text-green-600">Work together to resolve issues faster</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Create Your First Thread",
    description: "Learn how to create and manage threads",
    icon: <MessageSquare className="h-8 w-8" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">
          Threads can be created manually or automatically from emails. Each thread contains:
        </p>
        <ul className="space-y-2">
          <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Title and description</li>
          <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Priority level</li>
          <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Organization assignment</li>
          <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Status tracking</li>
        </ul>
        <div className="bg-amber-50 p-3 rounded-lg">
          <p className="text-amber-700 text-sm">
            <strong>Email Integration:</strong> When customers email your support address, 
            threads are automatically created and replies sync seamlessly.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Team Collaboration",
    description: "Work together effectively",
    icon: <Users className="h-8 w-8" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">
          Collaborate with your team using these features:
        </p>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-3">
            <h4 className="font-medium">Thread Comments</h4>
            <p className="text-sm text-gray-600">Add replies and internal notes</p>
          </div>
          <div className="border-l-4 border-green-500 pl-3">
            <h4 className="font-medium">Assignment</h4>
            <p className="text-sm text-gray-600">Assign threads to team members</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-3">
            <h4 className="font-medium">ETA Setting</h4>
            <p className="text-sm text-gray-600">Set and communicate resolution timelines</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Analytics & Insights",
    description: "Track your team's performance",
    icon: <BarChart3 className="h-8 w-8" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">
          Monitor your support performance with built-in analytics:
        </p>
        <div className="grid grid-cols-1 gap-3">
          <Badge variant="outline" className="justify-start p-3">
            <span className="font-medium">Response Time Tracking</span>
          </Badge>
          <Badge variant="outline" className="justify-start p-3">
            <span className="font-medium">Resolution Analytics</span>
          </Badge>
          <Badge variant="outline" className="justify-start p-3">
            <span className="font-medium">Team Performance Metrics</span>
          </Badge>
          <Badge variant="outline" className="justify-start p-3">
            <span className="font-medium">Customer Satisfaction Trends</span>
          </Badge>
        </div>
      </div>
    )
  }
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = onboardingSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {step.icon}
          </div>
          <CardTitle>{step.title}</CardTitle>
          <CardDescription>{step.description}</CardDescription>
          <div className="flex justify-center space-x-2 mt-4">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {step.content}
          <div className="flex justify-between mt-6">
            <div>
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleSkip}>
                Skip Tour
              </Button>
              <Button onClick={handleNext}>
                {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < onboardingSteps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
