export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  image: string;
  images: string[]; // Multiple images for gallery
  githubUrl?: string;
  liveUrl?: string;
  category: 'web' | 'mobile' | 'desktop' | 'ai' | 'other';
  featured: boolean;
  createdDate: string;
  completedDate?: string;
  status: 'completed' | 'in-progress' | 'planned';
  challenges: string[];
  learnings: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'languages' | 'frameworks' | 'ai';
  proficiency: 1 | 2 | 3 | 4 | 5; // 1-5 rating
  icon?: string;
  yearsOfExperience: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string; // undefined if current
  description: string;
  achievements: string[];
  technologies: string[];
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  achievements: string[];
  coursework: string[];
}

export interface Contact {
  email: string;
  // phone removed
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  resume: string; // URL to resume file
  tagline: string;
  yearsOfExperience: number;
}

export interface Portfolio {
  personalInfo: PersonalInfo;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  contact: Contact;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  updatedDate?: string;
  tags: string[];
  readTime: number; // in minutes
  featured: boolean;
  image?: string;
}