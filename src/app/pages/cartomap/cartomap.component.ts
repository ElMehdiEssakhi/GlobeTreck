import { Component, Input, Output, EventEmitter, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cartomap',
  templateUrl: './cartomap.component.html',
  styleUrls: ['./cartomap.component.css']
})
export class CartomapComponent implements AfterViewInit {
  private map: any;
  private L: any;
  private markers: any[] = [];
  private platformId = inject(PLATFORM_ID);

  @Input() initialCenter: [number, number] = [5, -5];
  @Input() zoom: number = 5;

  // Two-way binding property for selected coordinates
  @Input() selectedCoordinates: { lat: number, lng: number } | null = null;
  @Output() coordinatesSelected: EventEmitter<{ lat: number, lng: number }> = new EventEmitter();

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');
      this.L = L;
      this.initMap();
    }
  }

  private initMap(): void {
    // Create the map instance using input values
    this.map = this.L.map('map', {
      center: this.initialCenter,
      zoom: this.zoom
    });

    // Add Carto basemap
    this.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">Carto</a>'
    }).addTo(this.map);

    // When the map is clicked, update the selectedCoordinates via two-way binding
    this.map.on('click', (e: any) => {
      const latlng = e.latlng;
      this.addMarkerAtClick(latlng.lat, latlng.lng);
      const newCoords = { lat: latlng.lat, lng: latlng.lng };
      this.coordinatesSelected.emit(newCoords); // Emit the coordinates
    });
    
  }

  private addMarkerAtClick(lat: number, lng: number): void {
    // Remove existing markers
    if (this.markers.length > 0) {
      this.markers.forEach(marker => this.map.removeLayer(marker));
      this.markers = [];
    }
    // Add a new marker at the clicked location
    const marker = this.L.marker([lat, lng]);
    marker.addTo(this.map);
    marker.bindPopup(`Latitude: ${lat.toFixed(4)}<br>Longitude: ${lng.toFixed(4)}`).openPopup();
    this.markers.push(marker);
  }
}
