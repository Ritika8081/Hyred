"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, Calendar, Tag, Zap } from "lucide-react";
import { Project } from "@/types/portfolio";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/animated-section";
import { formatDate, withBasePath } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const categoryColors = {
    web: "bg-blue-100 text-blue-800",
    mobile: "bg-green-100 text-green-800",
    desktop: "bg-brand-100 text-brand-800",
    ai: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800",
  };

  const statusColors = {
    completed: "bg-green-100 text-green-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    planned: "bg-gray-100 text-gray-800",
  };

  return (
    <FadeIn delay={index * 0.1}>
      <Card className="h-full flex flex-col">
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={withBasePath(project.image)}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={index < 3}
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[project.category]}`}
            >
              {project.category}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}
            >
              {project.status.replace("-", " ")}
            </span>
          </div>
          {project.featured && (
            <div className="absolute top-4 right-4">
              <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                Featured
              </span>
            </div>
          )}
        </div>

        <CardContent className="flex-1 flex flex-col">
          {/* Project Title & Description */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {project.title}
          </h3>
          <p className="text-gray-600 mb-4 flex-1">{project.description}</p>

          {project.impact && (
            <div className="mb-4 flex items-start gap-2 p-2.5 rounded-md bg-green-50 border border-green-100">
              <Zap size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-green-800 font-medium leading-snug">
                {project.impact}
              </span>
            </div>
          )}

          {/* Technologies */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                >
                  <Tag size={12} className="mr-1" />
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{project.technologies.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Calendar size={14} className="mr-1" />
            {project.completedDate
              ? formatDate(project.completedDate)
              : `Started ${formatDate(project.createdDate)}`}
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex justify-between items-center w-full">
            <div className="flex space-x-2">
              {project.githubUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(project.githubUrl, "_blank")}
                >
                  <Github size={16} className="mr-1" />
                  Code
                </Button>
              )}
              {project.liveUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(project.liveUrl, "_blank")}
                >
                  <ExternalLink size={16} className="mr-1" />
                  Live Demo
                </Button>
              )}
            </div>
            <Link href={`/projects/${project.id}`}>
              <Button size="sm">View Details</Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </FadeIn>
  );
}
