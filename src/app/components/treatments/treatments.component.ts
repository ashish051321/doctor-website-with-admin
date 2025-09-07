import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Treatment, WebsiteData } from '../../services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-treatments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './treatments.component.html',
  styleUrl: './treatments.component.scss'
})
export class TreatmentsComponent implements OnInit, OnDestroy {
  treatments: Treatment[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
    // Subscribe to data changes
    this.subscription.add(
      this.dataService.getDataObservable().subscribe((data: WebsiteData) => {
        this.treatments = data.treatments;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadData() {
    this.treatments = this.dataService.getTreatments();
  }
}
