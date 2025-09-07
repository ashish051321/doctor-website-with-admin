import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { DoctorInfo, ContactInfo, WebsiteData } from '../../services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy {
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

  private subscription: Subscription = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
    // Subscribe to data changes
    this.subscription.add(
      this.dataService.getDataObservable().subscribe((data: WebsiteData) => {
        this.doctorInfo = data.doctorInfo;
        this.contactInfo = data.contactInfo;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadData() {
    this.doctorInfo = this.dataService.getDoctorInfo();
    this.contactInfo = this.dataService.getContactInfo();
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
