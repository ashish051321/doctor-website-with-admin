import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DataProviderService } from './data-provider.service';

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

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'medical_website_data';
  private dataSubject = new BehaviorSubject<WebsiteData>(this.getDefaultData());
  public data$ = this.dataSubject.asObservable();

  constructor(
    private http: HttpClient,
    private dataProvider: DataProviderService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    // Initialize with stored data or default
    this.initializeData();
  }

  private initializeData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.dataSubject.next(JSON.parse(stored));
        return;
      }
    }
    // For SSR/prerendering, use synchronous data loading
    if (!isPlatformBrowser(this.platformId)) {
      this.dataSubject.next(this.dataProvider.getDataSync());
      return;
    }
    // For browser with no stored data, try HTTP request as fallback
    this.loadDefaultDataFromAssets();
  }

  private loadDefaultDataFromAssets(): void {
    this.http.get<WebsiteData>('assets/default-data.json').subscribe({
      next: (data) => {
        this.dataSubject.next(data);
        // Save to localStorage for future use (only in browser)
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        }
      },
      error: (error) => {
        console.error('Error loading default data from assets:', error);
        // Fallback to imported data
        this.dataSubject.next(this.dataProvider.getDataSync());
      }
    });
  }

  // Get all website data
  getWebsiteData(): WebsiteData {
    return this.dataSubject.value;
  }

  // Save all website data
  saveWebsiteData(data: WebsiteData): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
    console.log('Storage service saved data and notifying subscribers:', data);
    this.dataSubject.next(data);
  }

  // Update specific sections
  updateDoctorInfo(doctorInfo: DoctorInfo): void {
    const data = this.getWebsiteData();
    data.doctorInfo = doctorInfo;
    this.saveWebsiteData(data);
  }

  updateTreatments(treatments: Treatment[]): void {
    const data = this.getWebsiteData();
    data.treatments = treatments;
    this.saveWebsiteData(data);
  }

  updateTestimonials(testimonials: Testimonial[]): void {
    const data = this.getWebsiteData();
    data.testimonials = testimonials;
    this.saveWebsiteData(data);
  }

  updateContactInfo(contactInfo: ContactInfo): void {
    const data = this.getWebsiteData();
    data.contactInfo = contactInfo;
    console.log('Storage service updating contact info:', contactInfo);
    this.saveWebsiteData(data);
  }

  updateStats(stats: Stat[]): void {
    const data = this.getWebsiteData();
    data.stats = stats;
    this.saveWebsiteData(data);
  }

  updateSiteSettings(settings: any): void {
    const data = this.getWebsiteData();
    data.siteSettings = { ...data.siteSettings, ...settings };
    this.saveWebsiteData(data);
  }

  updateHeroSettings(heroSettings: any): void {
    const data = this.getWebsiteData();
    data.heroSettings = { ...data.heroSettings, ...heroSettings };
    this.saveWebsiteData(data);
  }

  // Reset to default data
  resetToDefault(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  // Load default data from assets
  loadDefaultFromAssets(): Observable<WebsiteData> {
    return this.http.get<WebsiteData>('assets/default-data.json');
  }

  // Reset to default data from assets
  resetToDefaultFromAssets(): void {
    this.loadDefaultDataFromAssets();
  }

  // Export current data as JSON string
  exportDataAsJson(): string {
    const data = this.getWebsiteData();
    return JSON.stringify(data, null, 2);
  }

  // Save data to assets (for development purposes)
  saveDataToAssets(): void {
    if (isPlatformBrowser(this.platformId)) {
      const data = this.exportDataAsJson();
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'website-data.json';
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }

  // Get default data (fallback)
  private getDefaultData(): WebsiteData {
    return this.dataProvider.getDefaultData();
  }

  // Legacy method - keeping for backward compatibility
  private getDefaultDataLegacy(): WebsiteData {
    return {
      doctorInfo: {
        name: 'Dr. John Doe',
        title: 'Neurologist',
        experience: '10+ years',
        education: [
          'MBBS from Medical College',
          'MD in Medicine',
          'DNB in Neurology'
        ],
        currentPractice: 'General Hospital',
        description: 'Experienced neurologist with comprehensive training and expertise in neurological disorders.',
        experienceDetails: [
          {
            id: 1,
            title: 'Current Practice',
            organization: 'General Hospital',
            description: 'Currently practicing as a neurologist, providing comprehensive neurological care and treatment to patients.',
            icon: 'fas fa-hospital'
          },
          {
            id: 2,
            title: 'Experience',
            organization: '10+ Years',
            description: 'Over 10 years of experience in the medical field, specializing in neurological disorders and treatments.',
            icon: 'fas fa-clock'
          }
        ]
      },
      treatments: [
        {
          id: 1,
          title: 'Neuromuscular Disorders',
          description: 'Comprehensive treatment for neuromuscular conditions affecting the peripheral nervous system.',
          icon: 'fas fa-brain',
          slug: 'neuromuscular-disorders'
        },
        {
          id: 2,
          title: 'Headache Management',
          description: 'Specialized treatment for various types of headaches and migraines.',
          icon: 'fas fa-head-side-virus',
          slug: 'headache-management'
        },
        {
          id: 3,
          title: 'Stroke Care',
          description: 'Expert care for stroke patients with rehabilitation and prevention strategies.',
          icon: 'fas fa-heartbeat',
          slug: 'stroke-care'
        }
      ],
      testimonials: [
        {
          id: 1,
          name: 'Patient Name',
          role: 'Patient',
          content: 'Excellent care and treatment. Highly recommended!',
          rating: 5
        }
      ],
      blogs: [
        {
          id: 1,
          title: 'Understanding Neurological Health',
          excerpt: 'Learn about maintaining good neurological health and preventing disorders.',
          date: new Date().toLocaleDateString(),
          views: 10,
          image: 'assets/images/blog1.jpg'
        }
      ],
      stats: [
        {
          id: 1,
          number: '1000+',
          label: 'Happy Patients',
          icon: 'fas fa-smile'
        },
        {
          id: 2,
          number: '10+',
          label: 'Years of Experience',
          icon: 'fas fa-calendar-alt'
        },
        {
          id: 3,
          number: '1000+',
          label: 'Successful Treatment',
          icon: 'fas fa-check-circle'
        },
        {
          id: 4,
          number: '5+',
          label: 'Publications',
          icon: 'fas fa-book'
        }
      ],
      contactInfo: {
        phone: '+1234567890',
        email: 'info@doctor.com',
        locations: [
          {
            name: 'Main Clinic',
            address: '123 Medical Street, City, State 12345',
            phone: '+1234567890',
            hours: 'Mon-Fri: 9:00 AM - 5:00 PM'
          }
        ]
      },
      siteSettings: {
        siteName: 'Medical Practice',
        primaryColor: '#2c5aa0',
        secondaryColor: '#f8f9fa'
      },
      heroSettings: {
        videoBackground: {
          enabled: false,
          videoUrl: '',
          fallbackImage: '',
          overlayOpacity: 0.4,
          autoplay: true,
          muted: true,
          loop: true
        }
      }
    };
  }
}
