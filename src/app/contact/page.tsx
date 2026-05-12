'use client';

import { useState } from 'react';
import { Mail, MapPin, Send, Github, Linkedin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AnimatedSection, FadeIn } from '@/components/ui/animated-section';
import CopyButton from '@/components/ui/copy-button';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: portfolioData, isLoading } = usePortfolioData();
  const { contact, personalInfo } = portfolioData;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: contact.location,
      href: null,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: contact.github,
      color: 'hover:bg-gray-100'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: contact.linkedin,
      color: 'hover:bg-blue-100'
    },
    {
      icon: Mail,
      label: 'Email',
      href: `mailto:${contact.email}`,
      color: 'hover:bg-red-100'
    }
  ].filter(link => link.href);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Let's Work Together
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              I'm always interested in new opportunities and exciting projects. 
              Whether you have a project in mind or just want to chat, I'd love to hear from you.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div >
            {/* Contact Information */}
            <FadeIn direction="right">
              <div className="space-y">
                {/* Contact Methods */}
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-bold text-gray-900">Get in Touch</h3>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {contactMethods.map((method) => {
                      const Icon = method.icon;
                      const isEmail = method.label === 'Email';
                      return (
                        <div key={`${method.label}-${method.value}`} className="flex items-start">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${method.color}`}>
                            {Icon ? <Icon size={20} /> : null}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900">{method.label}</h4>
                            <div className="flex items-center gap-3 flex-wrap">
                              {method.href ? (
                                <a
                                  href={method.href}
                                  className="text-blue-600 hover:text-blue-800 transition-colors break-all"
                                >
                                  {method.value}
                                </a>
                              ) : (
                                <span className="text-gray-600">{method.value}</span>
                              )}
                              {isEmail && method.value && (
                                <CopyButton value={method.value} label="email" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-bold text-gray-900">Connect With Me</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4">
                      {socialLinks.map((social) => {
                        const Icon = social.icon;
                        return (
                          <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-12 h-12 rounded-lg border-2 border-gray-200 flex items-center justify-center transition-colors ${social.color}`}
                            aria-label={social.label}
                          >
                            <Icon size={20} className="text-gray-600" />
                          </a>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Availability */}
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-bold text-gray-900">Availability</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-900 font-medium">Available for new projects</span>
                      </div>
                      <p className="text-gray-600 ml-6">
                        I'm currently accepting new freelance projects and full-time opportunities. 
                        Response time is typically within 24 hours.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Info */}
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-bold text-gray-900">Quick Info</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Response Time</span>
                      <span className="text-gray-900">Within 24 hours</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Preferred Contact</span>
                      <span className="text-gray-900">Email or LinkedIn</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Time Zone</span>
                      <span className="text-gray-900">IST</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Let's discuss how I can help bring your ideas to life with modern web technologies.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Get Started Today
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}