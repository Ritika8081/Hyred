'use client';

import { Star } from 'lucide-react';
import { Skill } from '@/types/portfolio';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/animated-section';

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const skillCategories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryTitles = {
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Database',
    tools: 'Tools & DevOps',
    languages: 'Languages',
    frameworks: 'Frameworks',
    ai: 'AI / Machine Learning'
  };

  const categoryColors = {
    frontend: 'from-blue-500 to-cyan-500',
    backend: 'from-green-500 to-emerald-500',
    database: 'from-orange-500 to-red-500',
    tools: 'from-brand-500 to-coral-500',
    languages: 'from-yellow-500 to-orange-500',
    frameworks: 'from-indigo-500 to-blue-500',
    ai: 'from-coral-500 to-yellow-500'
  };

  const renderStars = (proficiency: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < proficiency
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Skills & Technologies
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive overview of my technical skills and proficiency levels
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skillCategories).map(([category, categorySkills]) => (
            <StaggerContainer key={category}>
              <StaggerItem>
                <Card className="h-full flex flex-col justify-between">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} flex items-center justify-center mb-4 mx-auto`}>
                      <span className="text-white font-bold text-lg">
                        {categoryTitles[category as keyof typeof categoryTitles]?.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                      {categoryTitles[category as keyof typeof categoryTitles]}
                    </h3>
                    <div className="space-y-4 flex-1">
                      {categorySkills
                        .sort((a, b) => b.proficiency - a.proficiency)
                        .map((skill) => (
                          <div key={skill.id} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">{skill.name}</span>
                              <div className="flex space-x-1">
                                {renderStars(skill.proficiency)}
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600">
                              <span>{skill.yearsOfExperience} year{skill.yearsOfExperience !== 1 ? 's' : ''} experience</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                Level {skill.proficiency}/5
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            </StaggerContainer>
          ))}
        </div>
      </div>
    </section>
  );
}