'use client';

import { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { Project } from '@/types/portfolio';
import ProjectCard from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/animated-section';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: portfolioData, isLoading } = usePortfolioData();
  const { projects } = portfolioData;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];
  const statuses = ['all', ...Array.from(new Set(projects.map(p => p.status)))];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const categoryColors: Record<string, string> = {
    all: 'bg-gray-600 hover:bg-gray-700',
    web: 'bg-blue-600 hover:bg-blue-700',
    mobile: 'bg-green-600 hover:bg-green-700',
    desktop: 'bg-brand-600 hover:bg-brand-700',
    ai: 'bg-orange-600 hover:bg-orange-700',
    other: 'bg-gray-600 hover:bg-gray-700'
  };

  const statusColors: Record<string, string> = {
    all: 'bg-gray-600 hover:bg-gray-700',
    completed: 'bg-green-600 hover:bg-green-700',
    'in-progress': 'bg-yellow-600 hover:bg-yellow-700',
    planned: 'bg-gray-600 hover:bg-gray-700'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              My Projects
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              A collection of projects showcasing my skills in full-stack development, 
              problem-solving, and creating impactful digital solutions.
            </p>
            <div className="flex justify-center">
              <div className="bg-white rounded-lg p-2 shadow-lg max-w-md w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search projects, technologies..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="text-gray-600 mr-2" size={20} />
              <span className="text-gray-600 font-medium mr-2">Category:</span>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? categoryColors[category] : ''}
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-600 font-medium mr-2">Status:</span>
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={selectedStatus === status ? statusColors[status] : ''}
                >
                  {status === 'all' ? 'All' : status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <StaggerItem key={project.id}>
                  <ProjectCard project={project} index={index} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-gray-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No projects found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your filters or search terms to find the projects you're looking for.
              </p>
              <div className="mt-8">
                <Button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedStatus('all');
                    setSearchTerm('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}