'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, User, Briefcase, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Portfolio, PersonalInfo, Contact } from '@/types/portfolio';

interface SetupWizardProps {
  onComplete: (portfolioData: Portfolio) => void;
  onSkip: () => void;
}

export default function SetupWizard({ onComplete, onSkip }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [portfolioData, setPortfolioData] = useState<Partial<Portfolio>>({
    personalInfo: {
      name: '',
      title: '',
      bio: '',
      avatar: '',
      resume: '',
      tagline: '',
      yearsOfExperience: 0
    },
    contact: {
      email: '',
      location: '',
    },
    projects: [],
    skills: [],
    experience: [],
    education: []
  });

  const steps = [
    { title: 'Personal Info', icon: User, description: 'Tell us about yourself' },
    { title: 'Contact', icon: Briefcase, description: 'How can people reach you?' },
    { title: 'Preferences', icon: Settings, description: 'Configure your portfolio' },
    { title: 'Complete', icon: CheckCircle, description: 'All set!' }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePersonalInfo = (updates: Partial<PersonalInfo>) => {
    setPortfolioData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo!, ...updates }
    }));
  };

  const updateContact = (updates: Partial<Contact>) => {
    setPortfolioData(prev => ({
      ...prev,
      contact: { ...prev.contact!, ...updates }
    }));
  };

  const handleComplete = () => {
    const completeData: Portfolio = {
      personalInfo: portfolioData.personalInfo as PersonalInfo,
      contact: portfolioData.contact as Contact,
      projects: portfolioData.projects || [],
      skills: portfolioData.skills || [],
      experience: portfolioData.experience || [],
      education: portfolioData.education || []
    };
    onComplete(completeData);
  };

  const generateStarterContent = () => {
    const starterContent = `
# Welcome to Your Portfolio!

## Getting Started

Your portfolio is now set up with your basic information. Here's what you can do next:

### 1. Add Your Projects
- Click "Add Project" in the admin panel
- Upload project images to /public/images/
- Add detailed descriptions and tech stacks

### 2. Customize Your Skills
- Update your skills and proficiency levels
- Add new categories as needed
- Set your years of experience for each skill

### 3. Add Work Experience
- Include your professional history
- Highlight key achievements
- List technologies used in each role

### 4. Configure Deployment
- Set up GitHub integration for easy updates
- Configure your preferred save method
- Export/import data as needed

### 5. Make It Your Own
- Customize colors and styling
- Add your brand elements
- Update social media links

## Your Information
- **Name:** ${portfolioData.personalInfo?.name}
- **Title:** ${portfolioData.personalInfo?.title}
- **Email:** ${portfolioData.contact?.email}
- **Location:** ${portfolioData.contact?.location}

Happy building! 🚀
    `;

    const blob = new Blob([starterContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-getting-started.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Portfolio Setup
          </h1>
          <p className="text-xl text-gray-600">
            Let's get your portfolio configured in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.description}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mt-6 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} style={{ minWidth: '50px' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {currentStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                      value={portfolioData.personalInfo?.name || ''}
                      onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Professional Title *</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Full Stack Developer"
                      value={portfolioData.personalInfo?.title || ''}
                      onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Professional Bio *</label>
                    <textarea
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="I'm a passionate developer with expertise in modern web technologies..."
                      value={portfolioData.personalInfo?.bio || ''}
                      onChange={(e) => updatePersonalInfo({ bio: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tagline</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Building the web, one pixel at a time"
                      value={portfolioData.personalInfo?.tagline || ''}
                      onChange={(e) => updatePersonalInfo({ tagline: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Experience</label>
                    <input
                      type="number"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="5"
                      value={portfolioData.personalInfo?.yearsOfExperience || ''}
                      onChange={(e) => updatePersonalInfo({ yearsOfExperience: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                      value={portfolioData.contact?.email || ''}
                      onChange={(e) => updateContact({ email: e.target.value })}
                    />
                  </div>
                  <div>
                    {/* Phone field removed */}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Delhi, India"
                      value={portfolioData.contact?.location || ''}
                      onChange={(e) => updateContact({ location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://linkedin.com/in/johndoe"
                      value={portfolioData.contact?.linkedin || ''}
                      onChange={(e) => updateContact({ linkedin: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub URL</label>
                    <input
                      type="url"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://github.com/johndoe"
                      value={portfolioData.contact?.github || ''}
                      onChange={(e) => updateContact({ github: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Website URL</label>
                    <input
                      type="url"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://johndoe.dev"
                      value={portfolioData.contact?.website || ''}
                      onChange={(e) => updateContact({ website: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Portfolio Preferences</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">🎨 Customization</h3>
                    <p className="text-sm text-gray-600">
                      You can customize colors, fonts, and layout after completing the setup by editing the Tailwind configuration.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold mb-2">📊 Content Management</h3>
                    <p className="text-sm text-gray-600">
                      Use the admin panel (/admin) to add projects, update skills, and manage your portfolio content without touching code.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold mb-2">🚀 Deployment</h3>
                    <p className="text-sm text-gray-600">
                      Deploy to Vercel, Netlify, or any platform that supports Next.js. GitHub integration allows you to update content directly.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold mb-2">💾 Data Management</h3>
                    <p className="text-sm text-gray-600">
                      Choose between local storage, database/API, or direct GitHub updates for managing your portfolio content.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold">Setup Complete!</h2>
                <p className="text-gray-600">
                  Your portfolio is ready to go. You can now start adding your projects, skills, and experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleComplete} size="lg">
                    Go to Admin Panel
                    <ArrowRight size={20} className="ml-2" />
                  </Button>
                  <Button onClick={generateStarterContent} variant="outline" size="lg">
                    <Download size={20} className="mr-2" />
                    Download Guide
                  </Button>
                </div>
              </div>
            )}

            {currentStep < 3 && (
              <div className="flex justify-between mt-8">
                <div>
                  {currentStep > 0 && (
                    <Button onClick={prevStep} variant="outline">
                      <ArrowLeft size={20} className="mr-2" />
                      Previous
                    </Button>
                  )}
                </div>
                <div className="flex space-x-4">
                  <Button onClick={onSkip} variant="ghost">
                    Skip Setup
                  </Button>
                  <Button onClick={nextStep}>
                    {currentStep === 2 ? 'Finish' : 'Next'}
                    <ArrowRight size={20} className="ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}