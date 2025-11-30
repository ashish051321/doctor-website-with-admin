import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit, OnDestroy {
  images: GalleryImage[] = [];
  selectedImage: GalleryImage | null = null;
  isLightboxOpen = false;
  currentIndex = 0;

  // List of images to load from assets folder
  private imageList = [
    { src: '/assets/gallery/doctor_pic.jpg', alt: 'Doctor Photo', title: 'Doctor Profile' },
    { src: '/assets/gallery/pexels-cdc-library-3992931.jpg', alt: 'Medical Library', title: 'Medical Library' },
    { src: '/assets/gallery/pexels-cedric-fauntleroy-4266931.jpg', alt: 'Medical Care', title: 'Medical Care' },
    { src: '/assets/gallery/pexels-cedric-fauntleroy-4269203.jpg', alt: 'Healthcare Service', title: 'Healthcare Service' },
    { src: '/assets/gallery/pexels-cottonbro-7578803.jpg', alt: 'Medical Consultation', title: 'Medical Consultation' },
    { src: '/assets/gallery/pexels-jonathanborba-3259629.jpg', alt: 'Medical Facility', title: 'Medical Facility' },
    { src: '/assets/gallery/pexels-pixabay-263337.jpg', alt: 'Healthcare', title: 'Healthcare' },
    { src: '/assets/gallery/pexels-shkrabaanthony-5215017.jpg', alt: 'Medical Practice', title: 'Medical Practice' }
  ];

  constructor() {}

  ngOnInit() {
    this.loadImages();
  }

  ngOnDestroy() {}

  loadImages() {
    // Load images from assets folder with collage sizes
    // Sizes: small, medium, large, wide, tall
    const sizes: Array<'small' | 'medium' | 'large' | 'wide' | 'tall'> = [
      'large', 'medium', 'wide', 'tall', 'small', 'medium', 'large', 'wide'
    ];
    
    this.images = this.imageList.map((img, index) => ({
      src: img.src,
      alt: img.alt,
      title: img.title,
      size: sizes[index % sizes.length] || 'medium'
    }));
  }

  getSizeClass(image: GalleryImage): string {
    return `gallery-item-${image.size || 'medium'}`;
  }

  openLightbox(image: GalleryImage, index: number) {
    this.selectedImage = image;
    this.currentIndex = index;
    this.isLightboxOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeLightbox() {
    this.isLightboxOpen = false;
    this.selectedImage = null;
    document.body.style.overflow = ''; // Restore scrolling
  }

  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.selectedImage = this.images[this.currentIndex];
    }
  }

  previousImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.selectedImage = this.images[this.currentIndex];
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isLightboxOpen) {
      if (event.key === 'Escape') {
        this.closeLightbox();
      } else if (event.key === 'ArrowRight') {
        this.nextImage();
      } else if (event.key === 'ArrowLeft') {
        this.previousImage();
      }
    }
  }
}

