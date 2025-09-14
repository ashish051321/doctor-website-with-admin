import { Injectable } from '@angular/core';
import { WebsiteData } from './storage.service';
import defaultData from '../../assets/default-data.json';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  private readonly defaultData: WebsiteData = defaultData as WebsiteData;

  getDefaultData(): WebsiteData {
    return this.defaultData;
  }

  // Method to get data synchronously (for SSR/prerendering)
  getDataSync(): WebsiteData {
    return this.defaultData;
  }
}
