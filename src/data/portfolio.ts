// Demo seed data — purely illustrative. Replace the entire object with your
// own portfolio by importing a JSON in /admin or editing field-by-field in
// the Builder. Anything you change is saved to your browser's localStorage
// and never touches a server.
import { Portfolio } from '@/types/portfolio';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const portfolioData: Portfolio = {
  personalInfo: {
    name: "Alex Rivera",
    title: "Full-Stack Engineer",
    bio: "I'm a full-stack engineer who builds and ships polished web products end-to-end — frontend, API, deploy. I care about good UX, clean code, and shipping fast without breaking things.\n\nI work best in small teams where I can own features from idea to production. I'm always learning, always shipping, and always looking for the next problem worth solving.",
    avatar: `${BASE}/images/placeholder-avatar.svg`,
    resume: "",
    tagline: "I design, build, and ship software that people actually use",
    yearsOfExperience: 4,
    pronouns: "they/them",
    openToWork: true,
    roles: [
      "Full-Stack Engineer",
      "Frontend Specialist",
      "API + Infra",
      "Open Source Contributor"
    ],
    brand: {
      accent: "#0d9488",
      gradientFrom: "#0d9488",
      gradientTo: "#84cc16"
    },
    highlights: [
      "Shipped a realtime collaboration editor used by 200+ engineers daily",
      "Owned a payment-checkout rewrite that cut drop-off rate by 32%",
      "Maintained an open-source UI library with 1.5k stars and 40+ contributors"
    ],
    currentlyBuilding: "An open-source AI career toolkit (this site!) and learning Rust."
  },
  contact: {
    email: "hello@example.com",
    location: "Remote",
    linkedin: "https://linkedin.com/in/your-handle",
    github: "https://github.com/your-handle",
    website: "https://example.com",
    youtube: ""
  },
  skills: [
    // ---------- Frontend ----------
    { id: "1", name: "Next.js",      category: "frontend", proficiency: 5, yearsOfExperience: 3, icon: "nextjs" },
    { id: "2", name: "React",        category: "frontend", proficiency: 5, yearsOfExperience: 4, icon: "react" },
    { id: "3", name: "TypeScript",   category: "languages", proficiency: 5, yearsOfExperience: 4, icon: "typescript" },
    { id: "4", name: "JavaScript",   category: "languages", proficiency: 5, yearsOfExperience: 5, icon: "javascript" },
    { id: "5", name: "Tailwind CSS", category: "frontend", proficiency: 4, yearsOfExperience: 3, icon: "tailwind" },

    // ---------- Backend ----------
    { id: "6", name: "Node.js",          category: "backend", proficiency: 5, yearsOfExperience: 4, icon: "nodejs" },
    { id: "7", name: "Express.js",       category: "backend", proficiency: 4, yearsOfExperience: 3, icon: "express" },
    { id: "8", name: "REST API Design",  category: "backend", proficiency: 5, yearsOfExperience: 4, icon: "api" },
    { id: "9", name: "GraphQL",          category: "backend", proficiency: 3, yearsOfExperience: 2, icon: "graphql" },

    // ---------- Databases ----------
    { id: "10", name: "PostgreSQL", category: "database", proficiency: 4, yearsOfExperience: 3, icon: "postgres" },
    { id: "11", name: "MongoDB",    category: "database", proficiency: 4, yearsOfExperience: 2, icon: "mongodb" },
    { id: "12", name: "Redis",      category: "database", proficiency: 3, yearsOfExperience: 1, icon: "redis" },

    // ---------- AI / Machine Learning ----------
    { id: "13", name: "LLMs & GenAI",       category: "ai", proficiency: 4, yearsOfExperience: 1.5, icon: "llm" },
    { id: "14", name: "Vector databases",   category: "ai", proficiency: 3, yearsOfExperience: 1, icon: "vector" },

    // ---------- Tools / Infra ----------
    { id: "15", name: "Docker",          category: "tools", proficiency: 4, yearsOfExperience: 2, icon: "docker" },
    { id: "16", name: "AWS",             category: "tools", proficiency: 3, yearsOfExperience: 2, icon: "aws" },
    { id: "17", name: "Vercel",          category: "tools", proficiency: 5, yearsOfExperience: 3, icon: "vercel" },
    { id: "18", name: "Git",             category: "tools", proficiency: 5, yearsOfExperience: 5, icon: "git" },
  ],
  projects: [
    {
      id: "realtime-editor",
      title: "Realtime Collaboration Editor",
      description: "Figma-style multiplayer canvas with CRDT sync, presence, offline-first storage, and a plugin API.",
      longDescription: "Built from scratch as a hobby project that grew into an internal tool used by 200+ engineers daily. Uses Y.js for conflict-free merging, IndexedDB for offline persistence, and a tiny WebSocket relay (~150 LOC) for sync. Open-sourced the plugin API after our team kept asking for it.",
      technologies: ["Next.js", "TypeScript", "Y.js", "WebSocket", "IndexedDB", "WebGL"],
      image: `${BASE}/images/placeholder-project.svg`,
      images: [`${BASE}/images/placeholder-project.svg`],
      githubUrl: "https://github.com/your-handle/realtime-editor",
      liveUrl: "https://example.com/editor",
      category: "web",
      featured: true,
      createdDate: "2024-01-15",
      completedDate: "2024-08-30",
      status: "completed",
      challenges: [
        "Conflict-free merging across offline + online edits at scale",
        "Keeping the WebSocket relay under 200 LOC while supporting 50+ concurrent rooms",
        "Building a plugin API that's powerful enough to be useful but safe enough to expose"
      ],
      learnings: [
        "CRDTs in production — the gap between the paper and the real world is bigger than it looks",
        "Designing extensibility before you need it costs less than retrofitting it later"
      ]
    },
    {
      id: "open-ui",
      title: "Open UI Library",
      description: "Headless, accessible React component library with 1.5k stars and 40+ contributors.",
      longDescription: "A drop-in replacement for the parts of Radix + Headless UI that I wished worked differently. Focus: keyboard navigation, ARIA correctness, and zero-CSS defaults so you can style it however you want. Used in production by ~30 small teams.",
      technologies: ["TypeScript", "React", "Tailwind CSS", "Storybook", "Vitest"],
      image: `${BASE}/images/placeholder-project.svg`,
      images: [`${BASE}/images/placeholder-project.svg`],
      githubUrl: "https://github.com/your-handle/open-ui",
      liveUrl: "https://example.com/open-ui",
      category: "web",
      featured: true,
      createdDate: "2023-06-01",
      completedDate: "",
      status: "in-progress",
      challenges: [
        "Reviewing 40+ contributor PRs without losing the original design taste",
        "Documenting a11y patterns so contributors get it right by default"
      ],
      learnings: [
        "Maintainership is mostly about saying no kindly",
        "Good docs are the best CONTRIBUTING.md"
      ]
    },
    {
      id: "checkout-rewrite",
      title: "Checkout flow rewrite",
      description: "Owned a payment-checkout rewrite that cut drop-off rate by 32% and shipped two weeks ahead of schedule.",
      longDescription: "Inherited a 5-step checkout averaging 18 seconds per step. Reduced it to 3 steps, instrumented every drop-off point, and ran a 2-week canary. Final result: drop-off rate fell from 41% to 28%, average completion time fell from 73s to 31s. Wrote a postmortem the team uses as a template.",
      technologies: ["Next.js", "Stripe", "PostgreSQL", "Posthog"],
      image: `${BASE}/images/placeholder-project.svg`,
      images: [`${BASE}/images/placeholder-project.svg`],
      githubUrl: "",
      liveUrl: "",
      category: "web",
      featured: false,
      createdDate: "2023-09-01",
      completedDate: "2023-12-15",
      status: "completed",
      challenges: [
        "Migrating active sessions without breaking in-flight payments",
        "Instrumenting drop-off without harming page-load performance"
      ],
      learnings: [
        "Measure before you cut — the obvious bottleneck wasn't actually the bottleneck",
        "A boring rewrite that ships beats a clever rewrite that doesn't"
      ]
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "Example Corp",
      position: "Full-Stack Engineer",
      startDate: "2022-06-01",
      location: "Remote",
      type: "full-time",
      description: "Replace this with your most recent role. Lead with impact, not responsibilities.",
      achievements: [
        "Shipped a feature used by every customer within 6 weeks of joining",
        "Owned the migration from REST to GraphQL for 12 services",
        "Mentored 2 junior engineers — both now lead their own projects"
      ],
      technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"]
    },
    {
      id: "exp-2",
      company: "Earlier Co.",
      position: "Frontend Engineer",
      startDate: "2020-08-01",
      endDate: "2022-05-31",
      location: "Hybrid",
      type: "full-time",
      description: "Your previous role.",
      achievements: [
        "Built and launched the company's design system, adopted by 4 product teams",
        "Reduced bundle size 38% by code-splitting + tree-shaking the icon set"
      ],
      technologies: ["React", "TypeScript", "Storybook", "Webpack"]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Your University",
      degree: "B.S.",
      field: "Computer Science",
      startDate: "2016-09-01",
      endDate: "2020-06-30",
      achievements: [
        "GPA: 3.8/4.0",
        "Senior project: distributed cache for the campus library system"
      ],
      coursework: [
        "Data Structures and Algorithms",
        "Operating Systems",
        "Distributed Systems",
        "Machine Learning",
        "Compilers"
      ]
    }
  ],
  testimonials: [
    {
      id: "t1",
      name: "Add a recommender's name",
      role: "Engineering Manager",
      company: "Their company",
      quote: "Replace this with a real recommendation from a manager, mentor, or teammate. Pull it from LinkedIn or ask someone you've worked with — recruiters trust social proof more than any other section.",
      rating: 5
    },
    {
      id: "t2",
      name: "Second recommender",
      role: "Senior Engineer",
      company: "Their company",
      quote: "Short, specific, outcome-focused quotes work best. e.g. \"Owned the migration end-to-end and shipped two weeks ahead of schedule.\"",
      rating: 5
    }
  ],
  certifications: [
    {
      id: "c1",
      name: "AWS Certified Developer — Associate",
      issuer: "Amazon Web Services",
      issueDate: "2023-04-01",
      credentialUrl: ""
    }
  ]
};
