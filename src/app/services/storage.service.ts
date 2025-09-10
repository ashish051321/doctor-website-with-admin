import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'medical_website_data';
  private dataSubject = new BehaviorSubject<WebsiteData>(this.getDefaultData());
  public data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient) { 
    // Initialize with stored data or default
    this.dataSubject.next(this.getWebsiteData());
  }

  // Get all website data
  getWebsiteData(): WebsiteData {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return this.getDefaultData();
  }

  // Save all website data
  saveWebsiteData(data: WebsiteData): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
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

  // Reset to default data
  resetToDefault(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Load default data from assets
  loadDefaultFromAssets(): Observable<WebsiteData> {
    return this.http.get<WebsiteData>('assets/default-data.json');
  }

  // Reset to default data from assets
  resetToDefaultFromAssets(): void {
    this.loadDefaultFromAssets().subscribe({
      next: (data) => {
        this.saveWebsiteData(data);
        console.log('Data reset to default from assets');
      },
      error: (error) => {
        console.error('Error loading default data from assets:', error);
        // Fallback to hardcoded default data
        this.resetToDefault();
        this.dataSubject.next(this.getDefaultData());
      }
    });
  }

  // Export current data as JSON string
  exportDataAsJson(): string {
    const data = this.getWebsiteData();
    return JSON.stringify(data, null, 2);
  }

  // Save data to assets (for development purposes)
  saveDataToAssets(): void {
    const data = this.exportDataAsJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'website-data.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Get default data (fallback)
  private getDefaultData(): WebsiteData {
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
          icon: 'fas fa-brain'
        },
        {
          id: 2,
          title: 'Headache Management',
          description: 'Specialized treatment for various types of headaches and migraines.',
          icon: 'fas fa-head-side-virus'
        },
        {
          id: 3,
          title: 'Stroke Care',
          description: 'Expert care for stroke patients with rehabilitation and prevention strategies.',
          icon: 'fas fa-heartbeat'
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
      }
    };
  }
}
