import { Injectable } from '@angular/core';
import { StorageService, Treatment, Testimonial, Blog, Stat, DoctorInfo, ContactInfo, WebsiteData } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private storageService: StorageService) { }

  getTreatments(): Treatment[] {
    return this.storageService.getWebsiteData().treatments;
  }

  getTestimonials(): Testimonial[] {
    return this.storageService.getWebsiteData().testimonials;
  }

  getBlogs(): Blog[] {
    return this.storageService.getWebsiteData().blogs;
  }

  getStats(): Stat[] {
    return this.storageService.getWebsiteData().stats;
  }

  getDoctorInfo(): DoctorInfo {
    return this.storageService.getWebsiteData().doctorInfo;
  }

  getContactInfo(): ContactInfo {
    return this.storageService.getWebsiteData().contactInfo;
  }

  getWebsiteData(): WebsiteData {
    return this.storageService.getWebsiteData();
  }

  getDataObservable(): Observable<WebsiteData> {
    return this.storageService.data$;
  }

  // Admin methods for updating data
  updateDoctorInfo(doctorInfo: DoctorInfo): void {
    this.storageService.updateDoctorInfo(doctorInfo);
  }

  updateTreatments(treatments: Treatment[]): void {
    this.storageService.updateTreatments(treatments);
  }

  updateTestimonials(testimonials: Testimonial[]): void {
    this.storageService.updateTestimonials(testimonials);
  }

  updateContactInfo(contactInfo: ContactInfo): void {
    this.storageService.updateContactInfo(contactInfo);
  }

  updateStats(stats: Stat[]): void {
    this.storageService.updateStats(stats);
  }

  updateSiteSettings(settings: any): void {
    this.storageService.updateSiteSettings(settings);
  }

  resetToDefault(): void {
    this.storageService.resetToDefault();
  }

  // New methods for assets functionality
  resetToDefaultFromAssets(): void {
    this.storageService.resetToDefaultFromAssets();
  }

  exportDataAsJson(): string {
    return this.storageService.exportDataAsJson();
  }

  saveDataToAssets(): void {
    this.storageService.saveDataToAssets();
  }

  updateWebsiteData(data: any): void {
    this.storageService.saveWebsiteData(data);
  }
}
