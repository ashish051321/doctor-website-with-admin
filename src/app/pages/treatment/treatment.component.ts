import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Treatment } from '../../services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-treatment',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './treatment.component.html',
  styleUrls: ['./treatment.component.scss']
})
export class TreatmentComponent implements OnInit, OnDestroy {
  treatment: Treatment | undefined;
  isLoading = true;
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.subscription.add(
      this.route.params.subscribe(params => {
        const treatmentSlug = params['type'];
        this.isLoading = true; // Show loading state when switching treatments
        this.loadTreatment(treatmentSlug);
      })
    );

    // Subscribe to data changes to reload treatment when data is updated
    // Only reload if we have a valid treatment slug
    this.subscription.add(
      this.dataService.getDataObservable().subscribe((data) => {
        const currentSlug = this.route.snapshot.params['type'];
        if (currentSlug) {
          this.loadTreatment(currentSlug);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadTreatment(slug: string): void {
    // Check if we're still on a treatment page
    if (!this.router.url.includes('/treatment/')) {
      console.log('Not on treatment page anymore, skipping loadTreatment');
      return;
    }

    if (!slug) {
      this.router.navigate(['/']);
      return;
    }

    // Set loading state
    this.isLoading = true;
    this.treatment = undefined; // Clear previous treatment data
    
    // Trigger change detection to show loading state immediately
    this.cdr.detectChanges();

    const treatments = this.dataService.getTreatments();
    this.treatment = treatments.find(t => t.slug === slug);
    
    if (!this.treatment) {
      // If treatment not found, redirect to home
      console.warn(`Treatment with slug '${slug}' not found`);
      this.router.navigate(['/']);
      return;
    }
    
    this.isLoading = false;
    
    // Manually trigger change detection to ensure template updates
    this.cdr.detectChanges();
    
    // Scroll to top when treatment changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  bookAppointment(): void {
    // This could open a modal or navigate to contact page
    this.router.navigate(['/contact']);
  }
}