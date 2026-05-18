'use client';

import { useState, useEffect } from 'react';
import { Download, Upload, Save, Settings, RefreshCw, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { Project, PersonalInfo, Contact, Experience, Education, Skill, Testimonial, Certification } from '@/types/portfolio';
import ProjectManager from '@/components/project-manager';
import PersonalInfoManager from '@/components/personal-info-manager';
import ExperienceManager from '@/components/experience-manager';
import EducationManager from '@/components/education-manager';
import SkillsManager from '@/components/skills-manager';
import TestimonialsManager from '@/components/testimonials-manager';
import CertificationsManager from '@/components/certifications-manager';
import AISettings from '@/components/ai-settings';
import ATSScore from '@/components/ats-score';
import ThemePicker from '@/components/theme-picker';
import GitHubImporter from '@/components/github-importer';
import ResumeImporter from '@/components/resume-importer';
import SmartFill from '@/components/smart-fill';
import Confetti from '@/components/ui/confetti';
import WelcomeModal, { makeEmptyPortfolio } from '@/components/welcome-modal';
import SharePortfolio from '@/components/share-portfolio';
import LivePreview from '@/components/live-preview';
import { Portfolio } from '@/types/portfolio';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AnimatedSection } from '@/components/ui/animated-section';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function BuilderPage() {
  const {
    data: portfolioData,
    isLoading,
    updateProjects,
    updatePersonalInfo,
    updateContact,
    updateExperience,
    updateEducation,
    updateSkills,
    updateTestimonials,
    updateCertifications,
    exportAllData,
    importAllData,
    clearAllData,
  } = usePortfolioData();

  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [localPersonalInfo, setLocalPersonalInfo] = useState<PersonalInfo>(portfolioData.personalInfo);
  const [localContact, setLocalContact] = useState<Contact>(portfolioData.contact);
  const [localExperience, setLocalExperience] = useState<Experience[]>([]);
  const [localEducation, setLocalEducation] = useState<Education[]>([]);
  const [localSkills, setLocalSkills] = useState<Skill[]>([]);
  const [localTestimonials, setLocalTestimonials] = useState<Testimonial[]>([]);
  const [localCertifications, setLocalCertifications] = useState<Certification[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'experience' | 'education' | 'skills' | 'social-proof' | 'ai' | 'design'>('profile');
  const [celebrate, setCelebrate] = useState(0);
  const toast = useToast();

  const applyParsedPortfolio = (next: Portfolio) => {
    setLocalPersonalInfo(next.personalInfo);
    setLocalContact(next.contact);
    setLocalExperience(next.experience);
    setLocalEducation(next.education);
    setLocalSkills(next.skills);
    setLocalProjects(next.projects);
  };

  useEffect(() => {
    if (!isLoading) {
      setLocalProjects(portfolioData.projects);
      setLocalPersonalInfo(portfolioData.personalInfo);
      setLocalContact(portfolioData.contact);
      setLocalExperience(portfolioData.experience);
      setLocalEducation(portfolioData.education);
      setLocalSkills(portfolioData.skills);
      setLocalTestimonials(portfolioData.testimonials || []);
      setLocalCertifications(portfolioData.certifications || []);
    }
  }, [portfolioData, isLoading]);

  useEffect(() => {
    const changed =
      JSON.stringify(localProjects) !== JSON.stringify(portfolioData.projects) ||
      JSON.stringify(localPersonalInfo) !== JSON.stringify(portfolioData.personalInfo) ||
      JSON.stringify(localContact) !== JSON.stringify(portfolioData.contact) ||
      JSON.stringify(localExperience) !== JSON.stringify(portfolioData.experience) ||
      JSON.stringify(localEducation) !== JSON.stringify(portfolioData.education) ||
      JSON.stringify(localSkills) !== JSON.stringify(portfolioData.skills) ||
      JSON.stringify(localTestimonials) !== JSON.stringify(portfolioData.testimonials || []) ||
      JSON.stringify(localCertifications) !== JSON.stringify(portfolioData.certifications || []);
    setHasChanges(changed);
  }, [
    localProjects, localPersonalInfo, localContact, localExperience,
    localEducation, localSkills, localTestimonials, localCertifications,
    portfolioData,
  ]);

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
    if (type === 'success') toast.success(text);
    else if (type === 'error') toast.error(text);
    else toast.info(text);
  };

  const handleExportData = () => {
    try {
      const dataToExport = exportAllData();
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showMessage('success', 'Portfolio data exported successfully!');
    } catch {
      showMessage('error', 'Error exporting data. Please try again.');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          if (importedData && typeof importedData === 'object') {
            importAllData(importedData);
            showMessage('success', 'Data imported successfully!');
          } else {
            showMessage('error', 'Invalid data format.');
          }
        } catch {
          showMessage('error', 'Error parsing JSON file.');
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  // Tick "saved Xs ago" indicator every 5s
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);

  const persistAll = () => {
    updateProjects(localProjects);
    updatePersonalInfo(localPersonalInfo);
    updateContact(localContact);
    updateExperience(localExperience);
    updateEducation(localEducation);
    updateSkills(localSkills);
    updateTestimonials(localTestimonials);
    updateCertifications(localCertifications);
    setLastSavedAt(Date.now());
    setHasChanges(false);
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    try {
      persistAll();
      showMessage('success', 'Changes saved successfully!');
      setCelebrate(c => c + 1);
    } catch {
      showMessage('error', 'Error saving changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save: 1.5s debounce after the last change
  useEffect(() => {
    if (!hasChanges || isLoading) return;
    const t = setTimeout(() => {
      try {
        persistAll();
      } catch {
        // silent; manual save button still available
      }
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasChanges, localProjects, localPersonalInfo, localContact, localExperience, localEducation, localSkills, localTestimonials, localCertifications]);

  const savedAgo = lastSavedAt
    ? Math.max(0, Math.floor((now - lastSavedAt) / 1000))
    : null;

  const handleResetToOriginal = () => {
    if (window.confirm('Reset all data to the original template? This wipes your customizations.')) {
      clearAllData();
      showMessage('info', 'Portfolio data has been reset.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profile' },
    { id: 'experience' as const, label: `Experience (${localExperience.length})` },
    { id: 'projects' as const, label: `Projects (${localProjects.length})` },
    { id: 'education' as const, label: `Education (${localEducation.length})` },
    { id: 'skills' as const, label: `Skills (${localSkills.length})` },
    { id: 'social-proof' as const, label: `Social Proof (${localTestimonials.length + localCertifications.length})` },
    { id: 'design' as const, label: 'Design' },
    { id: 'ai' as const, label: '✨ AI Setup' },
  ];

  const previewPortfolio = {
    ...portfolioData,
    personalInfo: localPersonalInfo,
    contact: localContact,
    projects: localProjects,
    experience: localExperience,
    education: localEducation,
    skills: localSkills,
    testimonials: localTestimonials,
    certifications: localCertifications,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Confetti fire={celebrate > 0} />
      <LivePreview portfolio={previewPortfolio} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-600 mb-2">
              The Builder
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 mb-3 tracking-tighter">
              Build your portfolio.
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Fill in your info — or paste your resume to auto-fill everything in 30 seconds. Auto-saves to your browser. Open <strong className="text-gray-900">Live Preview</strong> any time to see how recruiters will see it.
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : message.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? <CheckCircle className="mr-2" size={20} /> : <AlertCircle className="mr-2" size={20} />}
                {message.text}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="text-2xl font-bold flex items-center">
                  <Settings className="mr-2" />
                  Quick Actions
                </h2>
                {/* Auto-save indicator */}
                <div className="flex items-center gap-1.5 text-xs">
                  {isSaving || hasChanges ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-amber-700 font-medium">Saving…</span>
                    </>
                  ) : lastSavedAt ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-gray-500">
                        Saved {savedAgo === 0 ? "just now" : `${savedAgo}s ago`}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-gray-300" />
                      <span className="text-gray-400">Auto-save ready</span>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button onClick={handleSaveChanges} disabled={!hasChanges || isSaving}>
                  {isSaving ? <RefreshCw size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                  {isSaving ? 'Saving…' : 'Save Changes'}
                  {hasChanges && <span className="ml-1">●</span>}
                </Button>
                <Button onClick={handleExportData} variant="outline">
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
                <div className="relative">
                  <Button onClick={() => document.getElementById('import-file')?.click()} variant="outline" className="w-full">
                    <Upload size={16} className="mr-2" />
                    Import
                  </Button>
                  <input id="import-file" type="file" accept=".json" onChange={handleImportData} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <Button onClick={handleResetToOriginal} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 size={16} className="mr-2" />
                  Reset
                </Button>
              </div>

              {hasChanges && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm flex items-center">
                    <AlertCircle className="mr-2" size={16} />
                    Unsaved changes. Click <strong className="mx-1">Save</strong> to publish them.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200 overflow-x-auto">
            <nav className="flex gap-1 min-w-max">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === t.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Welcome — only shows once for new users */}
          <WelcomeModal
            onStartFresh={() => applyParsedPortfolio(makeEmptyPortfolio())}
            onKeepDemo={() => {}}
          />

          {/* Resume Importer — full-width on Profile; sidebar copy on other tabs */}
          {activeTab === 'profile' && (
            <ResumeImporter
              current={previewPortfolio}
              onParsed={applyParsedPortfolio}
              defaultOpen
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {activeTab === 'profile' && (
                <PersonalInfoManager
                  personalInfo={localPersonalInfo}
                  contact={localContact}
                  onUpdate={(pi, c) => {
                    setLocalPersonalInfo(pi);
                    setLocalContact(c);
                  }}
                />
              )}

              {activeTab === 'experience' && (
                <ExperienceManager experiences={localExperience} onUpdate={setLocalExperience} />
              )}

              {activeTab === 'projects' && (
                <>
                  <GitHubImporter existing={localProjects} onImport={setLocalProjects} />
                  <ProjectManager projects={localProjects} onUpdate={setLocalProjects} />
                </>
              )}

              {activeTab === 'education' && (
                <EducationManager education={localEducation} onUpdate={setLocalEducation} />
              )}

              {activeTab === 'skills' && (
                <SkillsManager skills={localSkills} onUpdate={setLocalSkills} />
              )}

              {activeTab === 'social-proof' && (
                <>
                  <TestimonialsManager testimonials={localTestimonials} onUpdate={setLocalTestimonials} />
                  <CertificationsManager certifications={localCertifications} onUpdate={setLocalCertifications} />
                </>
              )}

              {activeTab === 'design' && (
                <ThemePicker
                  value={localPersonalInfo.brand}
                  onChange={(theme) => setLocalPersonalInfo({ ...localPersonalInfo, brand: theme })}
                />
              )}

              {activeTab === 'ai' && (
                <AISettings />
              )}
            </div>

            {/* Sidebar — always shows score + magic actions */}
            <aside className="lg:col-span-1 space-y-4">
              <div className="lg:sticky lg:top-24 space-y-4">
                <ATSScore portfolio={previewPortfolio} />
                <SmartFill portfolio={previewPortfolio} onChange={applyParsedPortfolio} />
                <SharePortfolio portfolio={previewPortfolio} />
                {activeTab !== "profile" && (
                  <ResumeImporter current={previewPortfolio} onParsed={applyParsedPortfolio} />
                )}
              </div>
            </aside>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
