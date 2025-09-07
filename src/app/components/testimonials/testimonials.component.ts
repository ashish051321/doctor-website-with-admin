import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Testimonial, WebsiteData } from '../../services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  testimonials: Testimonial[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
    // Subscribe to data changes
    this.subscription.add(
      this.dataService.getDataObservable().subscribe((data: WebsiteData) => {
        this.testimonials = data.testimonials;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadData() {
    this.testimonials = this.dataService.getTestimonials();
  }
}
