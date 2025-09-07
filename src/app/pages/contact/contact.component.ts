import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ContactInfo, DoctorInfo, WebsiteData } from '../../services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit, OnDestroy {
  contactInfo: ContactInfo = {
    phone: '',
    email: '',
    locations: []
  };
  
  doctorInfo: DoctorInfo = {
    name: '',
    title: '',
    experience: '',
    education: [],
    currentPractice: '',
    description: ''
  };

  private subscription: Subscription = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
    // Subscribe to data changes
    this.subscription.add(
      this.dataService.getDataObservable().subscribe((data: WebsiteData) => {
        console.log('Contact component received data:', data);
        this.contactInfo = data.contactInfo;
        this.doctorInfo = data.doctorInfo;
        console.log('Contact info updated:', this.contactInfo);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadData() {
    this.contactInfo = this.dataService.getContactInfo();
    this.doctorInfo = this.dataService.getDoctorInfo();
    console.log('Contact component loaded data:', { contactInfo: this.contactInfo, doctorInfo: this.doctorInfo });
  }

  openAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    if (modal) {
      const bootstrap = (window as any).bootstrap;
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    }
  }
}
