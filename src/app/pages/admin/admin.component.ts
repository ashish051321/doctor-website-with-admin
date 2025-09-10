import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { DoctorInfo, Treatment, Testimonial, ContactInfo, Stat, Location, ExperienceItem } from '../../services/storage.service';

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
  experienceDetails: ExperienceItem[] = [];
  
  // Forms data
  doctorInfo: DoctorInfo = {
    name: '',
    title: '',
    experience: '',
    education: [],
    currentPractice: '',
    description: '',
    experienceDetails: []
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
    this.experienceDetails = [...websiteData.doctorInfo.experienceDetails];
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
      this.dataService.resetToDefaultFromAssets();
      this.loadData();
      alert('Data has been reset to default values from assets.');
    }
  }

  // New method to export data as JSON
  exportData() {
    this.dataService.saveDataToAssets();
    alert('Data exported successfully! Check your downloads folder.');
  }

  // Method to import JSON data
  importData(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (confirm('Are you sure you want to import this data? This will overwrite all current data.')) {
            // Validate the data structure
            if (this.validateImportedData(data)) {
              this.dataService.updateWebsiteData(data);
              this.loadData();
              alert('Data imported successfully!');
            } else {
              alert('Invalid data format. Please check the JSON file structure.');
            }
          }
        } catch (error) {
          alert('Error parsing JSON file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid JSON file.');
    }
    // Reset the input
    event.target.value = '';
  }

  // Validate imported data structure
  private validateImportedData(data: any): boolean {
    return data && 
           data.doctorInfo && 
           data.treatments && 
           data.testimonials && 
           data.contactInfo && 
           data.siteSettings;
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

  // Experience methods
  addExperience() {
    const newExperience: ExperienceItem = {
      id: Date.now(),
      title: '',
      organization: '',
      description: '',
      icon: 'fas fa-briefcase'
    };
    this.experienceDetails.push(newExperience);
  }

  removeExperience(index: number) {
    this.experienceDetails.splice(index, 1);
  }

  saveDoctorInfo() {
    // Validate experience details
    const validExperiences = this.experienceDetails.filter(exp => 
      exp.title && exp.title.trim() !== '' && 
      exp.organization && exp.organization.trim() !== ''
    );
    
    if (this.experienceDetails.length > 0 && validExperiences.length !== this.experienceDetails.length) {
      alert('Please fill in all required fields (Title and Organization) for experience items.');
      return;
    }
    
    this.updateEducation(this.educationText);
    this.doctorInfo.experienceDetails = validExperiences;
    this.dataService.updateDoctorInfo(this.doctorInfo);
    alert('Doctor information saved successfully!');
  }

  // Site settings methods
  saveSettings() {
    this.dataService.updateSiteSettings(this.siteSettings);
    alert('Site settings saved successfully!');
  }
}
