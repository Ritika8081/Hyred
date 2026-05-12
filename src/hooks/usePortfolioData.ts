'use client';

import { useState, useEffect } from 'react';
import { portfolioData } from '@/data/portfolio';
import { Portfolio } from '@/types/portfolio';
import { readPortfolioFromHash } from '@/lib/share';

const STORAGE_KEYS = {
  projects: 'portfolioProjects',
  personalInfo: 'portfolioPersonalInfo',
  contact: 'portfolioContact',
  skills: 'portfolioSkills',
  experience: 'portfolioExperience',
  education: 'portfolioEducation',
  testimonials: 'portfolioTestimonials',
  certifications: 'portfolioCertifications',
} as const;

export function usePortfolioData() {
  const [data, setData] = useState<Portfolio>(portfolioData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // If a shared portfolio URL was loaded, hydrate from the hash
      const shared = readPortfolioFromHash();
      if (shared) {
        setData(shared);
        setIsLoading(false);
        return;
      }

      const updated: Portfolio = {
        ...portfolioData,
        personalInfo: { ...portfolioData.personalInfo },
        contact: { ...portfolioData.contact },
      };

      const loadJSON = <K extends keyof Portfolio>(key: keyof typeof STORAGE_KEYS, field: K) => {
        const raw = localStorage.getItem(STORAGE_KEYS[key]);
        if (!raw) return;
        try {
          const parsed = JSON.parse(raw);
          if (parsed) {
            if (Array.isArray(parsed)) {
              (updated as any)[field] = parsed;
            } else {
              (updated as any)[field] = { ...(updated as any)[field], ...parsed };
            }
          }
        } catch (e) {
          console.error(`Failed to parse ${key}`, e);
        }
      };

      loadJSON('projects', 'projects');
      loadJSON('personalInfo', 'personalInfo');
      loadJSON('contact', 'contact');
      loadJSON('skills', 'skills');
      loadJSON('experience', 'experience');
      loadJSON('education', 'education');
      loadJSON('testimonials', 'testimonials');
      loadJSON('certifications', 'certifications');

      setData(updated);
    } catch (error) {
      console.error('Error loading portfolio data from localStorage:', error);
      setData(portfolioData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const makeUpdater = <K extends keyof Portfolio>(field: K, storageKey: keyof typeof STORAGE_KEYS) =>
    (value: Portfolio[K]) => {
      try {
        localStorage.setItem(STORAGE_KEYS[storageKey], JSON.stringify(value));
        setData(prev => ({ ...prev, [field]: value }));
      } catch (error) {
        console.error(`Error saving ${String(field)} to localStorage:`, error);
      }
    };

  const updateProjects = makeUpdater('projects', 'projects');
  const updatePersonalInfo = makeUpdater('personalInfo', 'personalInfo');
  const updateContact = makeUpdater('contact', 'contact');
  const updateSkills = makeUpdater('skills', 'skills');
  const updateExperience = makeUpdater('experience', 'experience');
  const updateEducation = makeUpdater('education', 'education');
  const updateTestimonials = makeUpdater('testimonials', 'testimonials');
  const updateCertifications = makeUpdater('certifications', 'certifications');

  const clearAllData = () => {
    try {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
      setData(portfolioData);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  const exportAllData = () => data;

  const importAllData = (importedData: Portfolio) => {
    try {
      const merged: Portfolio = {
        ...portfolioData,
        ...importedData,
        personalInfo: { ...portfolioData.personalInfo, ...(importedData.personalInfo || {}) },
        contact: { ...portfolioData.contact, ...(importedData.contact || {}) },
        testimonials: importedData.testimonials || [],
        certifications: importedData.certifications || [],
      };
      localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(merged.projects));
      localStorage.setItem(STORAGE_KEYS.personalInfo, JSON.stringify(merged.personalInfo));
      localStorage.setItem(STORAGE_KEYS.contact, JSON.stringify(merged.contact));
      localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(merged.skills));
      localStorage.setItem(STORAGE_KEYS.experience, JSON.stringify(merged.experience));
      localStorage.setItem(STORAGE_KEYS.education, JSON.stringify(merged.education));
      localStorage.setItem(STORAGE_KEYS.testimonials, JSON.stringify(merged.testimonials));
      localStorage.setItem(STORAGE_KEYS.certifications, JSON.stringify(merged.certifications));
      setData(merged);
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  };

  return {
    data,
    isLoading,
    updateProjects,
    updatePersonalInfo,
    updateContact,
    updateSkills,
    updateExperience,
    updateEducation,
    updateTestimonials,
    updateCertifications,
    clearAllData,
    exportAllData,
    importAllData,
  };
}
