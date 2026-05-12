"use client";

import {
  Calendar,
  MapPin,
  Award,
  BookOpen,
  Briefcase,
  Download,
  ExternalLink,
  BadgeCheck,
  Video,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/ui/avatar";
import VideoEmbed from "@/components/ui/video-embed";
import {
  AnimatedSection,
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animated-section";
import { formatDate } from "@/lib/utils";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export default function AboutPage() {
  const { data, isLoading } = usePortfolioData();
  const {
    personalInfo,
    experience,
    education,
    skills,
    contact,
    certifications,
  } = data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const gradFrom = personalInfo.brand?.gradientFrom || "#2563eb";
  const gradTo = personalInfo.brand?.gradientTo || "#7c3aed";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section
        className="py-20"
        style={{
          background: `linear-gradient(135deg, ${gradFrom}0a 0%, #ffffff 50%, ${gradTo}0a 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  About Me
                </h1>
                <p className="text-xl text-gray-600 mb-8 whitespace-pre-line">
                  {personalInfo.bio}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={20} className="mr-3" style={{ color: gradFrom }} />
                    <span>Based in {contact.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={20} className="mr-3" style={{ color: gradFrom }} />
                    <span>
                      {personalInfo.yearsOfExperience}+ years of experience
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase size={20} className="mr-3" style={{ color: gradFrom }} />
                    <span>{experience.length} professional roles</span>
                  </div>
                </div>
                {personalInfo.resume && (
                  <div className="mt-8">
                    <a href={personalInfo.resume} target="_blank" rel="noopener noreferrer">
                      <Button size="lg">
                        <Download size={20} className="mr-2" />
                        Download Resume
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </FadeIn>

            <FadeIn direction="right" className="flex justify-center">
              <div
                className="p-1 rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
              >
                <div className="rounded-2xl bg-white p-1">
                  <Avatar
                    src={personalInfo.avatar}
                    name={personalInfo.name}
                    size={320}
                    rounded="2xl"
                    gradientFrom={gradFrom}
                    gradientTo={gradTo}
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              My journey through different roles and companies, building expertise and delivering results
            </p>
          </AnimatedSection>

          <StaggerContainer className="space-y-8">
            {experience.map(job => (
              <StaggerItem key={job.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-1">
                        <div className="flex items-center mb-2">
                          <Briefcase className="mr-2" style={{ color: gradFrom }} size={20} />
                          <span className="text-sm font-medium uppercase tracking-wide" style={{ color: gradFrom }}>
                            {job.type.replace("-", " ")}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {job.position}
                        </h3>
                        <p className="text-gray-700 font-medium mb-1">
                          {job.companyUrl ? (
                            <a
                              href={job.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline inline-flex items-center gap-1"
                            >
                              {job.company}
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            job.company
                          )}
                        </p>
                        {job.location && (
                          <p className="text-sm text-gray-500 mb-1">{job.location}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          {formatDate(job.startDate)} -{" "}
                          {job.endDate ? formatDate(job.endDate) : "Present"}
                        </p>
                      </div>

                      <div className="lg:col-span-2">
                        <p className="text-gray-600 mb-6">{job.description}</p>

                        {job.videoUrl && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900">
                              <Video size={16} style={{ color: gradFrom }} />
                              Walkthrough
                            </div>
                            <VideoEmbed url={job.videoUrl} title={`${job.position} at ${job.company}`} />
                          </div>
                        )}

                        {job.achievements.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Key Achievements:
                            </h4>
                            <ul className="space-y-2">
                              {job.achievements.map((achievement, idx) => (
                                <li key={idx} className="flex items-start">
                                  <Award
                                    className="text-green-600 mr-2 mt-0.5 flex-shrink-0"
                                    size={16}
                                  />
                                  <span className="text-gray-600">
                                    {achievement}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {job.technologies.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Technologies:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {job.technologies.map(tech => (
                                <span
                                  key={tech}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Certifications
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Verified credentials and badges
              </p>
            </AnimatedSection>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map(cert => (
                <StaggerItem key={cert.id}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
                        >
                          <BadgeCheck className="text-white" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-1">{cert.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{cert.issuer}</p>
                          <p className="text-xs text-gray-500">
                            Issued {formatDate(cert.issueDate)}
                            {cert.expiryDate && ` · Expires ${formatDate(cert.expiryDate)}`}
                          </p>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm font-medium mt-3"
                              style={{ color: gradFrom }}
                            >
                              Verify
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Education */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Education
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Academic foundation and continuous learning journey
            </p>
          </AnimatedSection>

          <StaggerContainer className="space-y-8">
            {education.map(edu => (
              <StaggerItem key={edu.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-1">
                        <div className="flex items-center mb-2">
                          <BookOpen className="mr-2" style={{ color: gradTo }} size={20} />
                          <span className="text-sm font-medium uppercase tracking-wide" style={{ color: gradTo }}>
                            Education
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {edu.degree}
                        </h3>
                        <p className="text-gray-700 font-medium mb-2">{edu.field}</p>
                        <p className="text-gray-600 mb-2">{edu.institution}</p>
                        <p className="text-sm text-gray-500 mb-2">
                          {formatDate(edu.startDate)} -{" "}
                          {edu.endDate ? formatDate(edu.endDate) : "Present"}
                        </p>
                        {edu.gpa && (
                          <p className="text-sm font-medium text-green-600">
                            GPA: {edu.gpa}
                          </p>
                        )}
                      </div>

                      <div className="lg:col-span-2">
                        {edu.achievements.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Achievements:
                            </h4>
                            <ul className="space-y-2">
                              {edu.achievements.map((achievement, idx) => (
                                <li key={idx} className="flex items-start">
                                  <Award className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                  <span className="text-gray-600">{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {edu.coursework.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Relevant Coursework:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {edu.coursework.map(course => (
                                <span
                                  key={course}
                                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                                >
                                  {course}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Skills overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technical Skills Overview
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive view of my technical expertise and proficiency levels
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.slice(0, 9).map((skill, index) => (
              <FadeIn key={skill.id} delay={index * 0.05}>
                <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
                    >
                      <span className="text-white font-bold text-lg">
                        {skill.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{skill.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {skill.yearsOfExperience} years experience
                    </p>
                    <div className="flex justify-center">
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < skill.proficiency ? "" : "bg-gray-300"
                            }`}
                            style={i < skill.proficiency ? { background: gradFrom } : undefined}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
