import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { DoctorInfo, WebsiteData } from '../../services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit, OnDestroy {
  doctorInfo: DoctorInfo = {
    name: '',
    title: '',
    experience: '',
    education: [],
    currentPractice: '',
    description: '',
    experienceDetails: []
  };

  private subscription: Subscription = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
    // Subscribe to data changes
    this.subscription.add(
      this.dataService.getDataObservable().subscribe((data: WebsiteData) => {
        this.doctorInfo = data.doctorInfo;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadData() {
    this.doctorInfo = this.dataService.getDoctorInfo();
  }

  openAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    if (modal) {
      const bootstrap = (window as any).bootstrap;
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  getEducationIcon(index: number): string {
    const icons = [
      'fas fa-graduation-cap',
      'fas fa-user-md',
      'fas fa-brain',
      'fas fa-certificate',
      'fas fa-award',
      'fas fa-medal'
    ];
    return icons[index % icons.length];
  }

  getEducationTitle(education: string): string {
    // Extract the degree/qualification from the education string
    // Expected format: "MBBS from Medical College" or "MD in Medicine"
    const parts = education.split(' from ');
    if (parts.length > 1) {
      return parts[0].trim();
    }
    
    const inParts = education.split(' in ');
    if (inParts.length > 1) {
      return inParts[0].trim();
    }
    
    // If no clear separator, return first few words
    const words = education.split(' ');
    if (words.length > 3) {
      return words.slice(0, 3).join(' ');
    }
    
    return education;
  }

  getEducationDescription(education: string): string {
    // Extract the institution/description from the education string
    const fromParts = education.split(' from ');
    if (fromParts.length > 1) {
      return fromParts[1].trim();
    }
    
    const inParts = education.split(' in ');
    if (inParts.length > 1) {
      return inParts[1].trim();
    }
    
    // If no clear separator, return the full string as description
    return education;
  }
}
