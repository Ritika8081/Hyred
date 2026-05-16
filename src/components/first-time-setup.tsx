"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Rocket, User, Briefcase, Mail, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

export default function FirstTimeSetup() {
  const [showSetup, setShowSetup] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  useEffect(() => {
    // Disabled — the new WelcomeModal in /build (which only shows on the builder)
    // handles first-time onboarding now. This older popup conflicted with marketing pages.
    setShowSetup(false);
  }, []);

  const handleComplete = () => {
    localStorage.setItem("portfolio-visited", "true");
    setShowSetup(false);
    router.push("/admin");
  };

  const handleSkip = () => {
    localStorage.setItem("portfolio-visited", "true");
    setShowSetup(false);
  };

  if (!showSetup) return null;

  const steps = [
    {
      icon: Rocket,
      title: "Welcome to Your Portfolio!",
      content: (
        <div>
          <p className="text-gray-600 mb-4">
            This portfolio website is ready to use, but you'll want to customize
            it with your own information.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              What you can customize:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✨ Personal information and bio</li>
              <li>📁 Your projects and work</li>
              <li>💼 Skills and experience</li>
              <li>📧 Contact information</li>
              <li>🎨 Colors and styling</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      icon: Settings,
      title: "Easy Editing Options",
      content: (
        <div>
          <p className="text-gray-600 mb-4">
            You can edit your portfolio in multiple ways:
          </p>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">🌐 Web Admin Panel (Easiest)</h4>
              <p className="text-sm text-gray-600">
                Edit everything through a user-friendly interface. No coding
                required!
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">📝 Direct File Editing</h4>
              <p className="text-sm text-gray-600">
                Edit the data files directly if you're comfortable with code.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">📤 Import/Export</h4>
              <p className="text-sm text-gray-600">
                Export your data, edit in any text editor, then import back.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: User,
      title: "Ready to Customize?",
      content: (
        <div>
          <p className="text-gray-600 mb-4">
            Let's get started! The admin panel will guide you through
            customizing your portfolio.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-green-900 mb-2">
              Quick Access Tips:
            </h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>
                • Press{" "}
                <kbd className="bg-green-200 px-1 rounded">Ctrl+Shift+A</kbd>{" "}
                anytime
              </li>
              <li>
                • Type <kbd className="bg-green-200 px-1 rounded">admin</kbd> on
                any page
              </li>
              <li>
                • Visit <kbd className="bg-green-200 px-1 rounded">/admin</kbd>{" "}
                directly
              </li>
              <li>• Click the ⚙️ icon in the footer</li>
            </ul>
          </div>
          <p className="text-sm text-gray-500">
            Don't worry - you can always access the admin panel later using any
            of the methods above.
          </p>
        </div>
      ),
    },
  ];

  const currentStep = steps[step - 1];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold">{currentStep.title}</h2>
          <div className="flex justify-center mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full mx-1 ${
                  index + 1 <= step ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {currentStep.content}

          <div className="flex justify-between mt-8">
            <div>
              {step > 1 && (
                <Button onClick={() => setStep(step - 1)} variant="outline">
                  Previous
                </Button>
              )}
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleSkip} variant="ghost">
                Skip Setup
              </Button>

              {step < steps.length ? (
                <Button onClick={() => setStep(step + 1)}>Next</Button>
              ) : (
                <Button onClick={handleComplete}>
                  <Settings size={16} className="mr-2" />
                  Open Admin Panel
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
