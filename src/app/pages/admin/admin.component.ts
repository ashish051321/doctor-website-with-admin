import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { DoctorInfo, Treatment, Testimonial, ContactInfo, Stat, Location } from '../../services/storage.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  activeTab: string = '';
  
  // Data arrays
  treatments: Treatment[] = [];
  testimonials: Testimonial[] = [];
  locations: Location[] = [];
  stats: Stat[] = [];
  
  // Forms data
  doctorInfo: DoctorInfo = {
    name: '',
    title: '',
    experience: '',
    education: [],
    currentPractice: '',
    description: ''
  };
  
  contactInfo: ContactInfo = {
    phone: '',
    email: '',
    locations: []
  };
  
  siteSettings: any = {
    siteName: '',
    primaryColor: '#2c5aa0',
    secondaryColor: '#f8f9fa'
  };
  
  educationText: string = '';

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const websiteData = this.dataService.getWebsiteData();
    this.doctorInfo = websiteData.doctorInfo;
    this.educationText = this.doctorInfo.education.join('\n');
    this.treatments = [...websiteData.treatments];
    this.testimonials = [...websiteData.testimonials];
    this.contactInfo = websiteData.contactInfo;
    this.locations = [...websiteData.contactInfo.locations];
    this.stats = [...websiteData.stats];
    this.siteSettings = websiteData.siteSettings;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getTabTitle(): string {
    const titles: { [key: string]: string } = {
      'doctor': 'Doctor Information',
      'treatments': 'Treatments',
      'testimonials': 'Testimonials',
      'contact': 'Contact Information',
      'stats': 'Statistics',
      'settings': 'Site Settings'
    };
    return titles[this.activeTab] || '';
  }

  previewSite() {
    this.router.navigate(['/']);
  }

  resetToDefault() {
    if (confirm('Are you sure you want to reset all data to default? This action cannot be undone.')) {
      this.dataService.resetToDefault();
      this.loadData();
      alert('Data has been reset to default values.');
    }
  }

  // Treatment methods
  addTreatment() {
    const newTreatment: Treatment = {
      id: Date.now(),
      title: '',
      description: '',
      icon: 'fas fa-medical'
    };
    this.treatments.push(newTreatment);
  }

  removeTreatment(index: number) {
    this.treatments.splice(index, 1);
  }

  saveTreatments() {
    this.dataService.updateTreatments(this.treatments);
    alert('Treatments saved successfully!');
  }

  // Testimonial methods
  addTestimonial() {
    const newTestimonial: Testimonial = {
      id: Date.now(),
      name: '',
      role: 'Patient',
      content: '',
      rating: 5
    };
    this.testimonials.push(newTestimonial);
  }

  removeTestimonial(index: number) {
    this.testimonials.splice(index, 1);
  }

  saveTestimonials() {
    this.dataService.updateTestimonials(this.testimonials);
    alert('Testimonials saved successfully!');
  }

  // Location methods
  addLocation() {
    const newLocation: Location = {
      name: '',
      address: '',
      phone: '',
      hours: ''
    };
    this.locations.push(newLocation);
  }

  removeLocation(index: number) {
    this.locations.splice(index, 1);
  }

  saveContactInfo() {
    const contactInfo: ContactInfo = {
      phone: this.contactInfo.phone,
      email: this.contactInfo.email,
      locations: this.locations
    };
    console.log('Saving contact info:', contactInfo);
    this.dataService.updateContactInfo(contactInfo);
    alert('Contact information saved successfully!');
  }

  // Stat methods
  addStat() {
    const newStat: Stat = {
      id: Date.now(),
      number: '',
      label: '',
      icon: 'fas fa-chart-bar'
    };
    this.stats.push(newStat);
  }

  removeStat(index: number) {
    this.stats.splice(index, 1);
  }

  saveStats() {
    this.dataService.updateStats(this.stats);
    alert('Statistics saved successfully!');
  }

  // Doctor info methods
  updateEducation(text: string) {
    this.doctorInfo.education = text.split('\n').filter(line => line.trim() !== '');
  }

  saveDoctorInfo() {
    this.updateEducation(this.educationText);
    this.dataService.updateDoctorInfo(this.doctorInfo);
    alert('Doctor information saved successfully!');
  }

  // Site settings methods
  saveSettings() {
    this.dataService.updateSiteSettings(this.siteSettings);
    alert('Site settings saved successfully!');
  }
}
