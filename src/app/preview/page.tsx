"use client";

import Link from "next/link";
import {
  ArrowRight,
  Download,
  Star,
  Code2,
  Award,
  Briefcase,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  Quote,
  Zap,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProjectCard from "@/components/project-card";
import SkillsSection from "@/components/skills-section";
import VideoEmbed from "@/components/ui/video-embed";
import Avatar from "@/components/ui/avatar";
import Typewriter from "@/components/ui/typewriter";
import CountUp from "@/components/ui/count-up";
import TechMarquee from "@/components/ui/tech-marquee";
import {
  AnimatedSection,
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animated-section";
import { motion } from "framer-motion";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export default function Home() {
  const { data, isLoading } = usePortfolioData();
  const {
    personalInfo,
    projects,
    skills,
    experience,
    testimonials,
    contact,
  } = data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);

  const accent = personalInfo.brand?.accent || "#2563eb";
  const gradFrom = personalInfo.brand?.gradientFrom || "#2563eb";
  const gradTo = personalInfo.brand?.gradientTo || "#0d9488";

  const stats = [
    {
      icon: Briefcase,
      label: "Years Experience",
      end: personalInfo.yearsOfExperience,
      suffix: "+",
      decimals: personalInfo.yearsOfExperience % 1 !== 0 ? 1 : 0,
    },
    {
      icon: Star,
      label: "Projects Shipped",
      end: projects.filter(p => p.status === "completed").length,
      suffix: "",
      decimals: 0,
    },
    {
      icon: Code2,
      label: "Technologies",
      end: skills.length,
      suffix: "+",
      decimals: 0,
    },
    {
      icon: Award,
      label: "Roles Held",
      end: experience.length,
      suffix: "",
      decimals: 0,
    },
  ];

  const showreelItems = [
    ...experience.filter(e => !!e.videoUrl).map(e => ({
      id: `exp-${e.id}`,
      url: e.videoUrl!,
      title: `${e.position} @ ${e.company}`,
      subtitle: e.description,
    })),
    ...projects.filter(p => !!p.videoUrl).map(p => ({
      id: `proj-${p.id}`,
      url: p.videoUrl!,
      title: p.title,
      subtitle: p.description,
      poster: p.image,
    })),
  ];

  const roles = personalInfo.roles && personalInfo.roles.length > 0
    ? personalInfo.roles
    : [personalInfo.title];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${gradFrom}0a 0%, #ffffff 50%, ${gradTo}0a 100%)`,
        }}
      >
        {/* Decorative blobs */}
        <div
          className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: gradFrom }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: gradTo }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div className="text-center lg:text-left">
                {personalInfo.openToWork && (
                  <motion.div
                    className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-green-100 border border-green-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                    </span>
                    <span className="text-sm font-medium text-green-800">
                      Open to opportunities
                    </span>
                  </motion.div>
                )}

                <motion.h1
                  className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Hi, I&apos;m{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
                    }}
                  >
                    {personalInfo.name}
                  </span>
                  {personalInfo.pronouns && (
                    <span className="ml-3 text-base font-normal text-gray-500 align-middle">
                      ({personalInfo.pronouns})
                    </span>
                  )}
                </motion.h1>

                <motion.h2
                  className="text-xl md:text-2xl text-gray-700 mb-6 min-h-[2em]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Typewriter words={roles} className="font-semibold" />
                </motion.h2>

                {personalInfo.tagline && (
                  <motion.p
                    className="text-lg italic text-gray-500 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    &ldquo;{personalInfo.tagline}&rdquo;
                  </motion.p>
                )}

                <motion.p
                  className="text-base text-gray-600 mb-6 max-w-xl whitespace-pre-line"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {personalInfo.bio}
                </motion.p>

                {personalInfo.highlights && personalInfo.highlights.length > 0 && (
                  <motion.ul
                    className="mb-8 space-y-2 max-w-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    {personalInfo.highlights.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2
                          size={18}
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: accent }}
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}

                <motion.div
                  className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Link href="/projects">
                    <Button size="lg" className="w-full sm:w-auto">
                      View My Work
                      <ArrowRight size={20} className="ml-2" />
                    </Button>
                  </Link>
                  <Link href="/resume">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      <FileText size={20} className="mr-2" />
                      View Resume
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                      <Mail size={20} className="mr-2" />
                      Hire Me
                    </Button>
                  </Link>
                </motion.div>

                {/* Social row */}
                <motion.div
                  className="flex justify-center lg:justify-start gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {contact.github && (
                    <a
                      href={contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-white shadow-md hover:shadow-lg hover:scale-110 transition text-gray-700"
                      aria-label="GitHub"
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {contact.linkedin && (
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-white shadow-md hover:shadow-lg hover:scale-110 transition text-gray-700"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="p-2.5 rounded-full bg-white shadow-md hover:shadow-lg hover:scale-110 transition text-gray-700"
                      aria-label="Email"
                    >
                      <Mail size={18} />
                    </a>
                  )}
                </motion.div>
              </div>
            </FadeIn>

            <FadeIn direction="right" className="flex justify-center">
              <div className="relative">
                <div
                  className="p-1 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
                  }}
                >
                  <div className="rounded-full bg-white p-1">
                    <Avatar
                      src={personalInfo.avatar}
                      name={personalInfo.name}
                      size={300}
                      rounded="full"
                      gradientFrom={gradFrom}
                      gradientTo={gradTo}
                      priority
                    />
                  </div>
                </div>
                <motion.div
                  className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-3 flex items-center gap-2"
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  style={{ willChange: "transform" }}
                >
                  <Sparkles className="text-yellow-500" size={20} />
                  <span className="text-xs font-semibold text-gray-700">
                    {projects.length} Projects
                  </span>
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-3 flex items-center gap-2"
                  animate={{ y: [8, -8, 8] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  style={{ willChange: "transform" }}
                >
                  <Code2 style={{ color: accent }} size={20} />
                  <span className="text-xs font-semibold text-gray-700">
                    {skills.length}+ Skills
                  </span>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ willChange: "transform" }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(stat => {
              const Icon = stat.icon;
              return (
                <StaggerItem key={stat.label}>
                  <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{
                          background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
                        }}
                      >
                        <Icon className="text-white" size={22} />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        <CountUp
                          end={stat.end}
                          suffix={stat.suffix}
                          decimals={stat.decimals}
                        />
                      </div>
                      <div className="text-gray-600 text-sm">{stat.label}</div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Tech marquee */}
      {skills.length > 0 && (
        <section className="bg-gray-50 py-6 border-y border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TechMarquee skills={skills} />
          </div>
        </section>
      )}

      {/* Currently Building */}
      {personalInfo.currentlyBuilding && (
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <Card className="overflow-hidden">
                <CardContent
                  className="p-8 relative"
                  style={{
                    background: `linear-gradient(135deg, ${gradFrom}08 0%, ${gradTo}08 100%)`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
                      }}
                    >
                      <Zap className="text-white" size={22} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                          Now
                        </h3>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {personalInfo.currentlyBuilding}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Showreel */}
      {showreelItems.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Showreel
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Quick video walkthroughs of work I&apos;ve shipped
              </p>
            </AnimatedSection>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {showreelItems.slice(0, 4).map(item => (
                <StaggerItem key={item.id}>
                  <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                    <VideoEmbed url={item.url} title={item.title} poster={(item as any).poster} />
                    <CardContent className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.subtitle}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A selection of my best work showcasing different technologies and problem-solving approaches
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project, index) => (
              <StaggerItem key={project.id}>
                <ProjectCard project={project} index={index} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="text-center">
            <Link href="/projects">
              <Button size="lg">
                View All Projects
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Skills */}
      <SkillsSection skills={skills} />

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What People Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Words from people I&apos;ve worked with
              </p>
            </AnimatedSection>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map(t => (
                <StaggerItem key={t.id}>
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-8">
                      <Quote className="mb-4" style={{ color: accent }} size={32} />
                      <p className="text-gray-700 italic mb-6 leading-relaxed">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-4 border-t pt-4">
                        <Avatar
                          src={t.avatar}
                          name={t.name}
                          size={48}
                          rounded="full"
                          gradientFrom={gradFrom}
                          gradientTo={gradTo}
                        />
                        <div>
                          <p className="font-bold text-gray-900">{t.name}</p>
                          <p className="text-sm text-gray-600">
                            {t.role} {t.company && `· ${t.company}`}
                          </p>
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

      {/* CTA */}
      <section
        className="py-20"
        style={{
          background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Let&apos;s build something together
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              I&apos;m {personalInfo.openToWork ? "actively looking for new opportunities" : "always interested in interesting problems"}. Reach out and let&apos;s chat.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="secondary">
                  Get In Touch
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
              {personalInfo.resume && (
                <a href={personalInfo.resume} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/40 hover:bg-white/20">
                    <Download size={20} className="mr-2" />
                    Resume
                  </Button>
                </a>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
