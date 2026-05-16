'use client';

import { useState, useEffect } from 'react';
import { Download, Upload, Save, Settings, RefreshCw, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { Project } from '@/types/portfolio';
import ProjectManager from '@/components/project-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AnimatedSection } from '@/components/ui/animated-section';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function AdminPage() {
  const { 
    data: portfolioData, 
    isLoading,
    updateProjects,
    exportAllData,
    importAllData,
    clearAllData
  } = usePortfolioData();

  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    if (!isLoading) {
      setLocalProjects(portfolioData.projects);
    }
  }, [portfolioData.projects, isLoading]);

  useEffect(() => {
    // Check if there are changes compared to stored data
    const hasChanges = JSON.stringify(localProjects) !== JSON.stringify(portfolioData.projects);
    setHasChanges(hasChanges);
  }, [localProjects, portfolioData.projects]);

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleProjectsUpdate = (updatedProjects: Project[]) => {
    setLocalProjects(updatedProjects);
  };

  const handleExportData = () => {
    try {
      const dataToExport = exportAllData();
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showMessage('success', 'Portfolio data exported successfully!');
    } catch (error) {
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
          if (importedData.projects && Array.isArray(importedData.projects)) {
            importAllData(importedData);
            setLocalProjects(importedData.projects);
            showMessage('success', 'Data imported successfully! Your changes are now live.');
          } else {
            showMessage('error', 'Invalid data format. Please ensure the file contains valid portfolio data.');
          }
        } catch (error) {
          showMessage('error', 'Error parsing JSON file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
    // Reset the input
    event.target.value = '';
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    try {
      updateProjects(localProjects);
      showMessage('success', 'Changes saved successfully! Your portfolio is now updated.');
      setHasChanges(false);
    } catch (error) {
      showMessage('error', 'Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToOriginal = () => {
    if (window.confirm('Are you sure you want to reset all data to the original portfolio? This will clear all your customizations.')) {
      clearAllData();
      setLocalProjects(portfolioData.projects);
      showMessage('info', 'Portfolio data has been reset to original state.');
    }
  };

  const generateInstructions = () => {
    const instructions = `
# Portfolio Management Guide

## Quick Start
1. Access the admin panel at yourwebsite.com/admin
2. Click "Add Project" to create new projects
3. Edit existing projects by clicking the edit icon
4. Click "Save Changes" to make your updates live

## Data Management
- **Save Changes**: Updates your live portfolio immediately
- **Export Data**: Download your portfolio data as a backup
- **Import Data**: Upload previously exported data
- **Reset**: Restore to original portfolio template

## Adding Images
1. Upload images to public/images/ folder on your server
2. Reference them as "/images/your-image.jpg" in project forms
3. Or use external URLs (like Unsplash, GitHub, etc.)

## Tips
- Always export your data before making major changes
- Use descriptive project titles and tags
- Keep descriptions concise but informative
- Test your changes before sharing your portfolio

## Deployment
Your changes are saved locally and will persist when you deploy to:
- Vercel, Netlify, or other hosting platforms
- Make sure to include your updated data when deploying

For technical support, check the documentation in your project folder.
    `;

    const blob = new Blob([instructions], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-management-guide.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Portfolio Admin Panel
            </h1>
            <p className="text-xl text-gray-600">
              Manage your portfolio projects and content. Changes are saved instantly and reflected on your live website.
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800'
                : message.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <CheckCircle className="mr-2" size={20} />
                ) : (
                  <AlertCircle className="mr-2" size={20} />
                )}
                {message.text}
              </div>
            </div>
          )}

          {/* Admin Actions */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-2xl font-bold flex items-center">
                <Settings className="mr-2" />
                Quick Actions
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Button
                  onClick={handleSaveChanges}
                  disabled={!hasChanges || isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                  ) : (
                    <Save size={16} className="mr-2" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                  {hasChanges && <span className="ml-1 text-xs">●</span>}
                </Button>

                <Button
                  onClick={handleExportData}
                  variant="outline"
                  className="w-full"
                >
                  <Download size={16} className="mr-2" />
                  Export Backup
                </Button>

                <div className="relative">
                  <Button
                    onClick={() => document.getElementById('import-file')?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload size={16} className="mr-2" />
                    Import Data
                  </Button>
                  <input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                <Button
                  onClick={generateInstructions}
                  variant="ghost"
                  className="w-full"
                >
                  📖 Guide
                </Button>

                <Button
                  onClick={handleResetToOriginal}
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-2" />
                  Reset All
                </Button>
              </div>

              {hasChanges && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm flex items-center">
                    <AlertCircle className="mr-2" size={16} />
                    You have unsaved changes. Click "Save Changes" to make them live on your website.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Manager */}
          <ProjectManager 
            projects={localProjects} 
            onUpdate={handleProjectsUpdate}
          />

          {/* Portfolio Statistics */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold">Portfolio Statistics</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {localProjects.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {localProjects.filter(p => p.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {localProjects.filter(p => p.status === 'in-progress').length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-600">
                    {localProjects.filter(p => p.featured).length}
                  </div>
                  <div className="text-sm text-gray-600">Featured</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="mt-8">
            <CardHeader>
              <h3 className="text-xl font-bold">Need Help?</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  This admin panel allows you to manage your portfolio content without touching any code. 
                  All changes are saved to your browser's local storage and will persist across visits.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Getting Started:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Add your first project using the "Add Project" button</li>
                      <li>• Upload images to the public/images folder</li>
                      <li>• Use the export feature to backup your data</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Pro Tips:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Use high-quality images for best results</li>
                      <li>• Keep project descriptions concise</li>
                      <li>• Regular exports help prevent data loss</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}