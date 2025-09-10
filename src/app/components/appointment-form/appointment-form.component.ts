import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ContactInfo, Location, WebsiteData } from '../../services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})
export class AppointmentFormComponent implements OnInit, OnDestroy {
  appointmentForm!: FormGroup;
  contactInfo: ContactInfo = {
    phone: '',
    email: '',
    locations: []
  };
  
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.loadData();
    this.initializeForm();
    
    // Subscribe to data changes
    this.subscription.add(
      this.dataService.getDataObservable().subscribe((data: WebsiteData) => {
        this.contactInfo = data.contactInfo;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadData() {
    this.contactInfo = this.dataService.getContactInfo();
  }

  initializeForm() {
    this.appointmentForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      appointmentDate: ['', Validators.required],
      treatment: ['', Validators.required],
      location: ['', Validators.required],
      time: ['', Validators.required],
      message: ['']
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.appointmentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      console.log('Appointment form submitted:', this.appointmentForm.value);
      // Here you would typically send the data to a backend service
      alert('Appointment request submitted successfully! We will contact you soon.');
      this.appointmentForm.reset();
      // Close modal
      const modal = document.getElementById('appointmentModal');
      if (modal) {
        const bootstrap = (window as any).bootstrap;
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.appointmentForm.controls).forEach(key => {
        this.appointmentForm.get(key)?.markAsTouched();
      });
    }
  }
}
