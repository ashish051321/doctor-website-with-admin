import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { DoctorInfo, WebsiteData } from '../../services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
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
}
