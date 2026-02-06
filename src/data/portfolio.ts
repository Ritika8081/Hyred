import { Portfolio } from '@/types/portfolio';
import { placeholderImages } from '@/lib/placeholder-images';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const portfolioData: Portfolio = {
  personalInfo: {
    name: "Ritika Mishra",
    title: "Full Stack Developer",
    bio: "I'm a Software Engineer with experience building and owning full-stack applications end-to-end. I work on systems using React, Node.js, and MongoDB, and enjoy operating at the intersection of full-stack engineering, real-time data, and applied AI.\n\nI learn fast, take ownership seriously, and love turning ambiguous problems into reliable, scalable solutions.",
    avatar: `${BASE}/images/RitikaMishra.jpeg`,
    resume: "https://drive.google.com/file/d/12XcU6wWOhjkmWTtRLAuO1YVovbpxSaIO/view?usp=sharing",
    tagline: "I design, build, and own scalable software systems",
    yearsOfExperience: 1.7
  },
  contact: {
    email: "ritikamishra8081@gmail.com",
    // phone removed
    location: "Delhi, India",
    linkedin: "https://www.linkedin.com/in/ritika-mishra-a965251bb/",
    github: "https://github.com/Ritika8081",
    website: "https://ritika8081.github.io"
  },
  skills: [
    // ---------- Frontend ----------
    { id: "1", name: "Next.js", category: "frontend", proficiency: 5, yearsOfExperience: 2, icon: "nextjs" },
    { id: "2", name: "React", category: "frontend", proficiency: 5, yearsOfExperience: 2, icon: "react" },
    { id: "3", name: "TypeScript", category: "languages", proficiency: 5, yearsOfExperience: 2, icon: "typescript" },
    { id: "4", name: "JavaScript", category: "languages", proficiency: 5, yearsOfExperience: 3, icon: "javascript" },
    { id: "5", name: "Tailwind CSS", category: "frontend", proficiency: 4, yearsOfExperience: 2, icon: "tailwind" },
    { id: "6", name: "Web Workers", category: "frontend", proficiency: 4, yearsOfExperience: 1, icon: "webworkers" },
    { id: "8", name: "WebGL", category: "frontend", proficiency: 3, yearsOfExperience: 1, icon: "webgl" },

    // ---------- Backend ----------
    { id: "9", name: "Node.js", category: "backend", proficiency: 5, yearsOfExperience: 2, icon: "nodejs" },
    { id: "10", name: "Express.js", category: "backend", proficiency: 5, yearsOfExperience: 2, icon: "express" },
    { id: "11", name: "FastAPI", category: "backend", proficiency: 3, yearsOfExperience: 1, icon: "fastapi" },
    { id: "12", name: "REST API Design", category: "backend", proficiency: 5, yearsOfExperience: 2, icon: "api" },
    { id: "13", name: "JWT Authentication", category: "backend", proficiency: 4, yearsOfExperience: 2, icon: "jwt" },

    // ---------- Databases ----------
    { id: "14", name: "MongoDB", category: "database", proficiency: 4, yearsOfExperience: 2, icon: "mongodb" },
    { id: "16", name: "IndexedDB", category: "database", proficiency: 4, yearsOfExperience: 1, icon: "indexeddb" },
    { id: "17", name: "Redis", category: "database", proficiency: 2, yearsOfExperience: 0.5, icon: "redis" },

    // ---------- AI / Machine Learning ----------
    { id: "18", name: "Machine Learning", category: "ai", proficiency: 4, yearsOfExperience: 1.5, icon: "ml" },
    { id: "20", name: "TensorFlow.js", category: "ai", proficiency: 4, yearsOfExperience: 1, icon: "tensorflow" },
    { id: "22", name: "Time-Series Modeling", category: "ai", proficiency: 5, yearsOfExperience: 1.5, icon: "timeseries" },
    { id: "23", name: "Signal Processing", category: "ai", proficiency: 5, yearsOfExperience: 1.5, icon: "signal" },
    { id: "24", name: "LLMs & GenAI", category: "ai", proficiency: 4, yearsOfExperience: 1, icon: "llm" },

    // ---------- MLOps & Systems ----------
    { id: "26", name: "Docker", category: "tools", proficiency: 3, yearsOfExperience: 1, icon: "docker" },
    { id: "27", name: "CI/CD Fundamentals", category: "tools", proficiency: 3, yearsOfExperience: 1, icon: "cicd" },
    { id: "28", name: "Model Deployment", category: "tools", proficiency: 4, yearsOfExperience: 1, icon: "deployment" },
    { id: "29", name: "Low-Latency Optimization", category: "tools", proficiency: 5, yearsOfExperience: 1.5, icon: "latency" },

    // ---------- Tools ----------
    { id: "31", name: "Git", category: "tools", proficiency: 5, yearsOfExperience: 3, icon: "git" },
    { id: "32", name: "GitHub Actions", category: "tools", proficiency: 3, yearsOfExperience: 1, icon: "github-actions" },
    { id: "33", name: "VS Code", category: "tools", proficiency: 5, yearsOfExperience: 3, icon: "vscode" },
  ],
  projects: [
     {
      id: "chords-playground",
      title: "Chords Playground - Per-Channel Signal Processing Architecture",
      description: "Industry-grade Node-RED style signal processing with per-channel isolation, Web Workers DSP, and WebGL visualization.",
      longDescription: "Designed a Node-RED/LabVIEW-style system where each processing node handles exactly one signal channel, eliminating cross-channel interference, timing drift, and buffer alignment bugs. Refactored a 1000+ line monolithic component into 8 clean, single-responsibility modules. Implemented FFT, bandpower, PSD, and smoothing in Web Workers for real-time DSP while keeping UI fully responsive. Built high-performance WebGL charts for sustained streaming data with central pub/sub provider, bounded buffers, rate-limited publishing, and strict TypeScript typing.",
      technologies: ["TypeScript", "Web Workers", "WebGL", "Node-RED Architecture", "FFT", "DSP", "React", "Pub/Sub"],
      image: `${BASE}/images/Node_Playground.png`,
      images: [`${BASE}/images/Node_Playground.png`],
      githubUrl: "https://github.com/Ritika8081/Nodes_PlayGround",
      liveUrl: "https://ritika8081.github.io/Nodes_Playground/",
      category: "web",
      featured: true,
      createdDate: "2024-04-01",
      completedDate: "2024-06-30",
      status: "completed",
      challenges: [
        "Eliminating cross-channel interference and timing drift in multi-channel streaming",
        "Refactoring 1000+ line monolithic component into modular architecture",
        "Offloading real-time DSP to Web Workers without blocking UI",
        "Building WebGL visualizations for sustained high-frequency data streams"
      ],
      learnings: [
        "High-performance browser concurrency with Web Workers",
        "Production-ready data contracts with bounded buffers and lifecycle cleanup"
      ]
    },
    {
      id: "rpeak",
      title: "Rpeak - Real-Time ECG AI Analysis",
      description: "Browser-based ECG acquisition, visualization, and CNN heartbeat classification aligned to AAMI EC57.",
      longDescription: "Designed a Next.js application that streams ECG signals via Web Serial/WebSockets, visualizes them in real time with WebGL, and runs TensorFlow.js 1D CNN inference and retraining fully in the browser. Added data capture to IndexedDB, session playback, and exports to support clinical-grade workflows.",
      technologies: ["Next.js", "React", "TypeScript", "TensorFlow.js", "Web Serial API", "WebSockets", "Web Workers", "WebGL", "IndexedDB"],
      image: placeholderImages.dashboardMain,
      images: [placeholderImages.dashboard1, placeholderImages.dashboard2, placeholderImages.dashboard3],
      githubUrl: "https://github.com/Ritika8081/Rpeak/",
      liveUrl: "https://drive.google.com/file/d/1fST4VQEmSipdn0hT2I53Me_tOH_hJpst/view?usp=sharing",
      category: "ai",
      featured: true,
      createdDate: "2024-07-01",
      status: "completed",
      challenges: [
        "Maintaining low-latency streaming and visualization in the browser",
        "Training a robust 1D CNN for multi-class ECG beat classification",
        "Managing local session storage and replays with IndexedDB"
      ],
      learnings: [
        "Browser-first ML deployment with TensorFlow.js",
        "Signal normalization and windowing for ECG data",
        "Building resilient real-time pipelines with Web Workers"
      ]
    },
    {
      id: "gyroscop",
      title: "Gyroscop - Rotation-Invariant Motion Detection",
      description: "Edge motion classifier on BLE IMU data with <10 ms latency and orientation-proof features.",
      longDescription: "Built an offline gyroscope-based motion classifier using TensorFlow.js. Implemented orientation-invariant feature engineering (23+ features), data collection, model training, and on-device inference for BLE wearables to keep latency under 10 ms.",
      technologies: ["TensorFlow.js", "TypeScript", "BLE", "WebSockets", "Feature Engineering"],
      image: placeholderImages.fitnessMain,
      images: [placeholderImages.fitness1, placeholderImages.fitness2, placeholderImages.fitness3],
      githubUrl: "https://github.com/Ritika8081/ml-gyro-motion",
      liveUrl: "",
      category: "ai",
      featured: true,
      createdDate: "2024-10-01",
      completedDate: "2024-12-15",
      status: "completed",
      challenges: [
        "Ensuring rotation-invariant features across device orientations",
        "Keeping inference latency under 10 ms on edge hardware",
        "Balancing model size with accuracy for offline use"
      ],
      learnings: [
        "Efficient feature pipelines for IMU time-series",
        "Latency profiling and optimization for edge inference",
        "Data collection strategies for motion-class datasets"
      ]
    },
    {
      id: "cortex",
      title: "CortEx - Real-Time Neurofeedback (Frontend)",
      description: "Fast Next.js UI for BLE EEG/ECG with Web Workers, IndexedDB, offline PWA, and jsPDF exports.",
      longDescription: "Implemented the frontend for a neurofeedback tool handling BLE EEG/ECG streams. Offloaded filtering and inference to Web Workers, added Canvas/WebGL plotting, offline-first PWA shell, and IndexedDB session storage with export flows for clinicians and researchers.",
      technologies: ["Next.js", "TypeScript", "Web Workers", "WebGL", "IndexedDB", "PWA"],
      image: `${BASE}/images/Cortex.png`,
      images: [`${BASE}/images/Cortex.png`],
      githubUrl: "https://ritika8081.github.io/CortEX/",
      liveUrl: "https://youtu.be/O3F-0UWxNfA?si=73e9blexSLayV18J",
      category: "web",
      featured: true,
      createdDate: "2024-08-01",
      status: "completed",
      challenges: [
        "Keeping visualization smooth while running inference in workers",
        "Persisting and replaying multi-channel biosignal sessions",
        "Packaging offline/PWA support for field usage"
      ],
      learnings: [
        "Worker-based signal pipelines",
        "Canvas/WebGL rendering for biosignals",
        "Session export flows for clinicians"
      ]
    },
    {
      id: "chords",
      title: "Chords-Web - Bio-Potential Streaming Platform",
      description: "Open-source EMG/ECG/EEG/EOG streaming with low-latency bidirectional comms and IndexedDB capture.",
      longDescription: "Built a browser platform for multi-signal streaming that captures, stores, and replays sessions to accelerate ML dataset creation. Added bidirectional control channels, device management, and UX tuned for researchers capturing biosignals.",
      technologies: ["Next.js", "TypeScript", "WebSockets", "IndexedDB", "PWA"],
      image: placeholderImages.ecommerceMain,
      images: [placeholderImages.ecommerce1, placeholderImages.ecommerce2, placeholderImages.ecommerce3],
      githubUrl: "https://ritika8081.github.io/Chords-Web/",
      liveUrl: "https://ritika8081.github.io/Chords-Web/",
      category: "web",
      featured: false,
      createdDate: "2024-05-01",
      status: "completed",
      challenges: [
        "Reducing streaming latency while keeping recordings lossless",
        "Designing a UX that works for multiple biosignal modalities",
        "Persisting long-running sessions safely in the browser"
      ],
      learnings: [
        "Low-latency bidirectional WebSocket patterns",
        "Session durability with IndexedDB",
        "Optimizing streaming UI for scientific users"
      ]
    },
    {
      id: "hackathons-oss",
      title: "Hackathons and Open Source",
      description: "Showcased problem-solving at GFG hackathons and contributed in HacktoberFest'23 and GSSoC'23 with 50+ GitHub projects.",
      longDescription: "Participated in GFG hackathons to build and demo solutions under time constraints, collaborated in HacktoberFest'23 and GSSoC'23, and maintained a GitHub portfolio of 50+ projects focused on web, ML, and realtime signal tooling.",
      technologies: ["GitHub", "Open Source", "Hackathons", "TypeScript", "React", "Node.js"],
      image: placeholderImages.taskmanagerMain,
      images: [placeholderImages.taskmanager1, placeholderImages.taskmanager2, placeholderImages.taskmanager3],
      githubUrl: "https://github.com/Ritika8081",
      liveUrl: "https://ritika8081.github.io",
      category: "other",
      featured: false,
      createdDate: "2023-01-01",
      status: "completed",
      challenges: [
        "Delivering working prototypes within hackathon time limits",
        "Coordinating contributions across multiple open-source repos",
        "Balancing feature scope with quality for community PRs"
      ],
      learnings: [
        "Rapid problem framing and solution design",
        "Open-source collaboration workflows",
        "Maintaining project quality while iterating quickly"
      ]
    },
    {
      id: "property-app",
      title: "Property Listing App (MERN)",
      description: "Production-ready real estate platform with auth, Razorpay payments, and real-time chat.",
      longDescription: "Developed a MERN application for property listings with secure email/Google authentication, listing CRUD, search and filtering UX, Razorpay payment integration, and socket-based chat to connect buyers and agents.",
      technologies: ["MongoDB", "Express", "React", "Node.js", "TypeScript", "Razorpay", "WebSockets"],
      image: placeholderImages.fitnessMain,
      images: [placeholderImages.fitness1, placeholderImages.fitness2, placeholderImages.fitness3],
      githubUrl: "https://real-estate-application-law1.onrender.com/",
      liveUrl: "https://real-estate-application-law1.onrender.com/",
      category: "web",
      featured: false,
      createdDate: "2023-09-01",
      completedDate: "2023-11-30",
      status: "completed",
      challenges: [
        "Integrating secure payments with Razorpay",
        "Delivering responsive UI and fast search",
        "Keeping real-time chat lightweight for users"
      ],
      learnings: [
        "Production hardening for MERN stacks",
        "Payment gateway integration patterns",
        "Accessible, responsive component design"
      ]
    }
  ],
  experience: [
    {
      id: "1",
      company: "Upside Down Lab",
      position: "Software Developer",
      startDate: "2024-07-01",
      description: "Building browser-first health products for ECG/EEG acquisition, visualization, and ML.",
      achievements: [
        "Designed Rpeak for real-time ECG streaming, visualization, and CNN heartbeat classification",
        "Built CortEx frontend with worker-based signal processing, offline PWA, and WebGL charts",
        "Created Gyroscop edge pipeline with rotation-invariant features and <10 ms inference",
        "Hackathon enthusiast: showcased solutions at GFG hackathons",
        "Open-source contributor (HacktoberFest'23, GSSoC'23) with 50+ GitHub projects"
      ],
      technologies: ["Next.js", "React", "TypeScript", "TensorFlow.js", "WebSockets", "Web Workers", "IndexedDB", "Web Serial API"],
      type: "full-time"
    },
    {
      id: "2",
      company: "ReadyCoder",
      position: "Full Stack Intern - MERN Developer",
      startDate: "2023-09-01",
      endDate: "2023-11-30",
      description: "Delivered a production-ready laundry services platform on the MERN stack.",
      achievements: [
        "Implemented secure authentication, Razorpay payments, and real-time chat",
        "Optimized responsive UI components and accessibility to lift user engagement",
        "Shipped search and filter UX that improved discovery speed"
      ],
      technologies: ["MongoDB", "Express", "React", "Node.js", "TypeScript", "Razorpay", "WebSockets"],
      type: "internship"
    }
  ],
  education: [
    {
      id: "1",
      institution: "Dr. APJ Abdul Kalam Technical University, Lucknow",
      degree: "B.Tech.",
      field: "Computer Science and Engineering",
      startDate: "2020-07-01",
      endDate: "2024-06-30",
      achievements: [
        "Microsoft Tech Saksham Program - Full Stack Development"
      ],
      coursework: [
        "Data Structures and Algorithms",
        "Database Systems",
        "Web Development",
        "Software Engineering",
        "Machine Learning",
        "Computer Networks"
      ]
    }
  ]
};