export interface DoctorInfo {
  name: string;
  title: string;
  experience: string;
  education: string[];
  currentPractice: string;
  description: string;
  experienceDetails: ExperienceItem[];
  image?: string;
}

export interface ExperienceItem {
  id: number;
  title: string;
  organization: string;
  description: string;
  icon: string;
}

export interface Treatment {
  id: number;
  title: string;
  description: string;
  icon: string;
  slug: string;
  detailedDescription?: string;
  symptoms?: string[];
  causes?: string[];
  treatments?: string[];
  prevention?: string[];
  whenToSeeDoctor?: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface Blog {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  views: number;
  image: string;
}

export interface Stat {
  id: number;
  number: string;
  label: string;
  icon: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  locations: Location[];
}

export interface Location {
  name: string;
  address: string;
  phone?: string;
  hours?: string;
}

export interface VideoBackground {
  enabled: boolean;
  videoUrl: string;
  fallbackImage: string;
  overlayOpacity: number;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
}

export interface WebsiteData {
  doctorInfo: DoctorInfo;
  treatments: Treatment[];
  testimonials: Testimonial[];
  blogs: Blog[];
  stats: Stat[];
  contactInfo: ContactInfo;
  siteSettings: {
    siteName: string;
    primaryColor: string;
    secondaryColor: string;
  };
  heroSettings: {
    videoBackground: VideoBackground;
  };
}
