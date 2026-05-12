"use client";

import { Mail, MapPin, Globe, Linkedin, Github, Printer, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ResumePage() {
  const { data, isLoading } = usePortfolioData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const {
    personalInfo,
    contact,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = data;

  const handlePrint = () => window.print();

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, typeof skills>);

  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Action bar (hidden in print) */}
      <div className="print:hidden bg-white border-b sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm">
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Link>
          <div className="flex gap-2">
            <Button onClick={handlePrint} size="sm">
              <Printer size={16} className="mr-2" />
              Print / Save as PDF
            </Button>
            {personalInfo.resume && (
              <a href={personalInfo.resume} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline">
                  <Download size={16} className="mr-2" />
                  Download Original
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Resume sheet */}
      <main className="max-w-4xl mx-auto bg-white shadow-xl print:shadow-none my-8 print:my-0 p-10 print:p-8 text-gray-900 leading-relaxed">
        {/* Header */}
        <header className="border-b-2 border-gray-900 pb-5 mb-6">
          <h1 className="text-4xl font-bold tracking-tight mb-1">
            {personalInfo.name}
          </h1>
          <p className="text-lg text-gray-700 mb-3">
            {personalInfo.title}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-1.5 hover:text-gray-900">
                <Mail size={14} />
                {contact.email}
              </a>
            )}
            {contact.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                {contact.location}
              </span>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-gray-900">
                <Linkedin size={14} />
                LinkedIn
              </a>
            )}
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-gray-900">
                <Github size={14} />
                GitHub
              </a>
            )}
            {contact.website && (
              <a href={contact.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-gray-900">
                <Globe size={14} />
                Website
              </a>
            )}
          </div>
        </header>

        {/* Summary */}
        {personalInfo.bio && (
          <section className="mb-6">
            <h2 className="text-base font-bold uppercase tracking-wider mb-2 text-gray-900">Summary</h2>
            <p className="text-sm text-gray-700 whitespace-pre-line">{personalInfo.bio}</p>
          </section>
        )}

        {/* Highlights */}
        {personalInfo.highlights && personalInfo.highlights.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold uppercase tracking-wider mb-2 text-gray-900">Highlights</h2>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              {personalInfo.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold uppercase tracking-wider mb-3 text-gray-900">Experience</h2>
            <div className="space-y-4">
              {experience.map(job => (
                <div key={job.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-0.5 flex-wrap gap-x-2">
                    <h3 className="font-bold text-gray-900">
                      {job.position} <span className="font-normal text-gray-700">· {job.company}</span>
                    </h3>
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      {formatDate(job.startDate)} – {job.endDate ? formatDate(job.endDate) : "Present"}
                    </span>
                  </div>
                  {job.location && (
                    <p className="text-xs text-gray-500 mb-1">{job.location} · {job.type.replace("-", " ")}</p>
                  )}
                  <p className="text-sm text-gray-700 mb-1.5">{job.description}</p>
                  {job.achievements.length > 0 && (
                    <ul className="text-sm text-gray-700 space-y-0.5 list-disc list-inside ml-2">
                      {job.achievements.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  )}
                  {job.technologies.length > 0 && (
                    <p className="text-xs text-gray-600 mt-1.5">
                      <span className="font-semibold">Stack:</span> {job.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold uppercase tracking-wider mb-3 text-gray-900">Selected Projects</h2>
            <div className="space-y-3">
              {featuredProjects.map(p => (
                <div key={p.id} className="break-inside-avoid">
                  <h3 className="font-bold text-gray-900 text-sm">
                    {p.title}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="ml-2 font-normal text-blue-600 text-xs">
                        [live]
                      </a>
                    )}
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="ml-1 font-normal text-blue-600 text-xs">
                        [code]
                      </a>
                    )}
                  </h3>
                  <p className="text-sm text-gray-700">{p.description}</p>
                  {p.impact && (
                    <p className="text-xs text-gray-700 mt-0.5"><span className="font-semibold">Impact:</span> {p.impact}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-0.5">
                    <span className="font-semibold">Stack:</span> {p.technologies.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {Object.keys(skillsByCategory).length > 0 && (
          <section className="mb-6 break-inside-avoid">
            <h2 className="text-base font-bold uppercase tracking-wider mb-3 text-gray-900">Skills</h2>
            <div className="space-y-1.5 text-sm">
              {Object.entries(skillsByCategory).map(([cat, list]) => (
                <div key={cat}>
                  <span className="font-semibold capitalize text-gray-900">{cat}:</span>{" "}
                  <span className="text-gray-700">
                    {list.map(s => s.name).join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold uppercase tracking-wider mb-3 text-gray-900">Education</h2>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-x-2">
                    <h3 className="font-bold text-gray-900">
                      {edu.degree}{edu.field && `, ${edu.field}`}
                    </h3>
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : "Present"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{edu.institution}{edu.gpa && ` · GPA ${edu.gpa}`}</p>
                  {edu.achievements.length > 0 && (
                    <ul className="text-sm text-gray-700 list-disc list-inside ml-2 mt-1">
                      {edu.achievements.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section className="mb-2 break-inside-avoid">
            <h2 className="text-base font-bold uppercase tracking-wider mb-2 text-gray-900">Certifications</h2>
            <ul className="text-sm text-gray-700 space-y-0.5 list-disc list-inside">
              {certifications.map(c => (
                <li key={c.id}>
                  <span className="font-medium">{c.name}</span> — {c.issuer}
                  <span className="text-xs text-gray-500 ml-1">({formatDate(c.issueDate)})</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <style jsx global>{`
        @media print {
          @page {
            margin: 0.5in;
            size: letter;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          nav, footer, .print\\:hidden {
            display: none !important;
          }
          main {
            box-shadow: none !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
