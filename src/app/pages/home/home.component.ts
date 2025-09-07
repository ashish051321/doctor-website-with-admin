import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { TreatmentsComponent } from '../../components/treatments/treatments.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { DataService } from '../../services/data.service';
import { Stat, WebsiteData } from '../../services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    TreatmentsComponent,
    TestimonialsComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  stats: Stat[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
    // Subscribe to data changes
    this.subscription.add(
      this.dataService.getDataObservable().subscribe((data: WebsiteData) => {
        this.stats = data.stats;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadData() {
    this.stats = this.dataService.getStats();
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
