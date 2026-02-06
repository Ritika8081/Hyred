'use client';

import { useState } from 'react';
import { User, Mail, MapPin, Github, Linkedin, Globe, Save, Edit, X } from 'lucide-react';
import { PersonalInfo, Contact } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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
                  placeholder="e.g., Full Stack Developer"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Avatar/Photo URL</label>
                <input
                  type="url"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.personalInfo.avatar}
                  onChange={(e) => updatePersonalInfo('avatar', e.target.value)}
                  placeholder="https://example.com/your-photo.jpg"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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