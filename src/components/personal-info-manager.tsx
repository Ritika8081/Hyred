'use client';

import { useState } from 'react';
import { User, Mail, MapPin, Github, Linkedin, Globe, Save, Edit, X, Palette, Briefcase } from 'lucide-react';
import { PersonalInfo, Contact } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import StringListInput from '@/components/ui/string-list-input';
import AIRewriteButton from '@/components/ui/ai-rewrite-button';
import ImageUpload from '@/components/ui/image-upload';

interface PersonalInfoManagerProps {
  personalInfo: PersonalInfo;
  contact: Contact;
  onUpdate: (personalInfo: PersonalInfo, contact: Contact) => void;
}

export default function PersonalInfoManager({ personalInfo, contact, onUpdate }: PersonalInfoManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: { ...personalInfo },
    contact: { ...contact }
  });

  const handleSave = () => {
    onUpdate(formData.personalInfo, formData.contact);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      personalInfo: { ...personalInfo },
      contact: { ...contact }
    });
    setIsEditing(false);
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: any) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateContact = (field: keyof Contact, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  if (isEditing) {
    return (
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-xl font-bold flex items-center">
            <User className="mr-2" />
            Edit Personal Information
          </h3>
          <div className="flex space-x-2">
            <Button onClick={handleSave} size="sm">
              <Save size={16} className="mr-1" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X size={16} className="mr-1" />
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Personal Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.personalInfo.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title *</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.personalInfo.title}
                  onChange={(e) => updatePersonalInfo('title', e.target.value)}
                  placeholder="e.g., Software Developer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.personalInfo.tagline}
                onChange={(e) => updatePersonalInfo('tagline', e.target.value)}
                placeholder="A catchy tagline that describes you"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Bio *</label>
                <AIRewriteButton
                  value={formData.personalInfo.bio}
                  onResult={(v) => updatePersonalInfo('bio', v)}
                  context="This is the bio shown on the portfolio hero — should feel personal and showcase strengths."
                />
              </div>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                value={formData.personalInfo.bio}
                onChange={(e) => updatePersonalInfo('bio', e.target.value)}
                placeholder="Tell people about yourself, your skills, and what you do..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.personalInfo.yearsOfExperience}
                  onChange={(e) => updatePersonalInfo('yearsOfExperience', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <ImageUpload
                  label="Avatar / Photo"
                  value={formData.personalInfo.avatar}
                  onChange={(v) => updatePersonalInfo('avatar', v)}
                  shape="round"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resume URL</label>
              <input
                type="url"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.personalInfo.resume}
                onChange={(e) => updatePersonalInfo('resume', e.target.value)}
                placeholder="Link to your resume/CV"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pronouns</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={formData.personalInfo.pronouns || ''}
                  onChange={(e) => updatePersonalInfo('pronouns', e.target.value)}
                  placeholder="she/her, he/him, they/them"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded text-green-600"
                    checked={!!formData.personalInfo.openToWork}
                    onChange={(e) => updatePersonalInfo('openToWork', e.target.checked)}
                  />
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Briefcase size={16} className="text-green-600" />
                    Open to opportunities
                  </span>
                </label>
              </div>
            </div>

            <StringListInput
              label="Hero Roles (rotating typewriter)"
              values={formData.personalInfo.roles || []}
              onChange={(v) => updatePersonalInfo('roles', v)}
              placeholder="e.g. Full-Stack Engineer"
            />

            <StringListInput
              label="Highlights (max 3 — punchy impact bullets for recruiter scan)"
              values={formData.personalInfo.highlights || []}
              onChange={(v) => updatePersonalInfo('highlights', v.slice(0, 3))}
              placeholder="e.g. Shipped X used by Y users; reduced Z by N%"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currently Building <span className="text-xs text-gray-500 font-normal">(Now widget — what you&apos;re working on this week)</span>
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                value={formData.personalInfo.currentlyBuilding || ''}
                onChange={(e) => updatePersonalInfo('currentlyBuilding', e.target.value)}
                placeholder="A one-liner about what you're focused on right now"
              />
            </div>

            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h5 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Palette size={16} />
                Brand Colors
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Accent</label>
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                    value={formData.personalInfo.brand?.accent || '#2563eb'}
                    onChange={(e) => updatePersonalInfo('brand', { ...formData.personalInfo.brand, accent: e.target.value } as any)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Gradient From</label>
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                    value={formData.personalInfo.brand?.gradientFrom || '#2563eb'}
                    onChange={(e) => updatePersonalInfo('brand', { ...formData.personalInfo.brand, gradientFrom: e.target.value } as any)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Gradient To</label>
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                    value={formData.personalInfo.brand?.gradientTo || '#0d9488'}
                    onChange={(e) => updatePersonalInfo('brand', { ...formData.personalInfo.brand, gradientTo: e.target.value } as any)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4 border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.contact.email}
                  onChange={(e) => updateContact('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                {/* Phone field removed */}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Location
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.contact.location}
                onChange={(e) => updateContact('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Github className="inline w-4 h-4 mr-1" />
                  GitHub URL
                </label>
                <input
                  type="url"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.contact.github || ''}
                  onChange={(e) => updateContact('github', e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Linkedin className="inline w-4 h-4 mr-1" />
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.contact.linkedin || ''}
                  onChange={(e) => updateContact('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline w-4 h-4 mr-1" />
                  Website URL
                </label>
                <input
                  type="url"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.contact.website || ''}
                  onChange={(e) => updateContact('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                <input
                  type="url"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.contact.twitter || ''}
                  onChange={(e) => updateContact('twitter', e.target.value)}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-xl font-bold flex items-center">
          <User className="mr-2" />
          Personal Information
        </h3>
        <Button onClick={() => setIsEditing(true)} size="sm">
          <Edit size={16} className="mr-1" />
          Edit Info
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Info Display */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Personal Details</h4>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Name:</span>
                <p className="text-gray-900">{personalInfo.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Title:</span>
                <p className="text-gray-900">{personalInfo.title}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Tagline:</span>
                <p className="text-gray-900">{personalInfo.tagline}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Bio:</span>
                <p className="text-gray-900 text-sm leading-relaxed">{personalInfo.bio}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Experience:</span>
                <p className="text-gray-900">{personalInfo.yearsOfExperience} years</p>
              </div>
            </div>
          </div>

          {/* Contact Info Display */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-gray-900">{contact.email}</span>
              </div>
              {/* Phone display removed */}
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-gray-900">{contact.location}</span>
              </div>
              {contact.github && (
                <div className="flex items-center">
                  <Github className="w-4 h-4 mr-2 text-gray-500" />
                  <a href={contact.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    GitHub
                  </a>
                </div>
              )}
              {contact.linkedin && (
                <div className="flex items-center">
                  <Linkedin className="w-4 h-4 mr-2 text-gray-500" />
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    LinkedIn
                  </a>
                </div>
              )}
              {contact.website && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-gray-500" />
                  <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}