import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { DoctorInfo, WebsiteData, Treatment } from '../../services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('navbarCollapse', { static: false }) navbarCollapse!: ElementRef<HTMLElement>;

  doctorInfo: DoctorInfo = {
    name: '',
    title: '',
    experience: '',
    education: [],
    currentPractice: '',
    description: '',
    experienceDetails: []
  };

  treatments: Treatment[] = [];

  private subscription: Subscription = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
    // Subscribe to data changes
    this.subscription.add(
      this.dataService.getDataObservable().subscribe((data: WebsiteData) => {
        this.doctorInfo = data.doctorInfo;
        this.treatments = data.treatments;
      })
    );
  }

  ngAfterViewInit() {
    // ViewChild is available after this lifecycle hook
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadData() {
    this.doctorInfo = this.dataService.getDoctorInfo();
    this.treatments = this.dataService.getTreatments();
  }

  openAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    if (modal) {
      const bootstrap = (window as any).bootstrap;
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  closeNavbar() {
    if (this.navbarCollapse?.nativeElement) {
      const navbarElement = this.navbarCollapse.nativeElement;
      if (navbarElement.classList.contains('show')) {
        const bootstrap = (window as any).bootstrap;
        if (bootstrap && bootstrap.Collapse) {
          const collapseInstance = bootstrap.Collapse.getInstance(navbarElement);
          if (collapseInstance) {
            collapseInstance.hide();
          } else {
            // Fallback: manually remove the show class
            navbarElement.classList.remove('show');
          }
        } else {
          // Fallback: manually remove the show class
          navbarElement.classList.remove('show');
        }
      }
    }
  }
}
