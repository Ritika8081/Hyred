export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  image: string;
  images: string[]; // Multiple images for gallery
  videoUrl?: string; // YouTube/Vimeo/Drive demo URL
  githubUrl?: string;
  liveUrl?: string;
  category: 'web' | 'mobile' | 'desktop' | 'ai' | 'other';
  featured: boolean;
  createdDate: string;
  completedDate?: string;
  status: 'completed' | 'in-progress' | 'planned';
  challenges: string[];
  learnings: string[];
  impact?: string; // measurable outcome / metric
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
  location?: string;
  companyUrl?: string;
  companyLogo?: string;
  startDate: string;
  endDate?: string; // undefined if current
  description: string;
  achievements: string[];
  technologies: string[];
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  videoUrl?: string; // showcase/demo video for this role
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
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

export interface BrandTheme {
  accent: string; // hex color e.g. "#2563eb"
  gradientFrom?: string;
  gradientTo?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  resume: string; // URL to resume file
  tagline: string;
  yearsOfExperience: number;
  pronouns?: string;
  openToWork?: boolean;
  roles?: string[]; // rotating titles in hero typewriter
  brand?: BrandTheme;
  highlights?: string[]; // 3 punchy impact bullets for recruiter scan
  currentlyBuilding?: string; // "Now" widget — what you're working on this week
}

export interface Testimonial {
  id: string;
  name: string;
  role: string; // job title
  company: string;
  quote: string;
  avatar?: string;
  linkedin?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  logo?: string;
}

export interface Portfolio {
  personalInfo: PersonalInfo;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  contact: Contact;
  testimonials: Testimonial[];
  certifications: Certification[];
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
