import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { StadeService } from '../../core/services/stade.service';
import { StadeMarkerDTO } from '../../core/models/stade.model';
import { StadeDrawerComponent } from './stade-drawer/stade-drawer.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, StadeDrawerComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, OnDestroy {
  private stadeService = inject(StadeService);
  private map!: L.Map;
  private markerClusterGroup!: L.MarkerClusterGroup;

  drawerVisible = false;
  selectedStadeId: number | null = null;

  ngOnInit(): void {
    this.initMap();
    this.loadMarkers();
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.0, 35.0],
      zoom: 6,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    this.markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 60,
    });

    this.map.addLayer(this.markerClusterGroup);
  }

  private loadMarkers(): void {
    this.stadeService.getMarkers().subscribe({
      next: (stades) => this.addMarkers(stades),
      error: (err) => console.error('Erreur chargement markers:', err),
    });
  }

  private addMarkers(stades: StadeMarkerDTO[]): void {
  const icon = L.divIcon({
  className: '',
  html: `
    <div class="stadium-pin">
      <svg class="stadium-pin__svg" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0 C9 0 0 9 0 20 C0 33 20 52 20 52 C20 52 40 33 40 20 C40 9 31 0 20 0Z"
              fill="#3d2e00" stroke="#ffc800" stroke-width="1.5"/>
        <circle cx="20" cy="20" r="14" fill="#1a3a1a"/>
        <ellipse cx="20" cy="20" rx="11" ry="8" fill="#2d5a27"/>
        <ellipse cx="20" cy="20" rx="11" ry="8" fill="none" stroke="#4CAF50" stroke-width="1"/>
        <line x1="20" y1="12" x2="20" y2="28" stroke="white" stroke-width="0.8" opacity="0.8"/>
        <ellipse cx="20" cy="20" rx="3.5" ry="2.5" stroke="white" stroke-width="0.8" fill="none" opacity="0.8"/>
        <line x1="9" y1="17" x2="9" y2="23" stroke="white" stroke-width="0.8" opacity="0.8"/>
        <line x1="31" y1="17" x2="31" y2="23" stroke="white" stroke-width="0.8" opacity="0.8"/>
        <rect x="9" y="17" width="5" height="6" fill="none" stroke="white" stroke-width="0.6" opacity="0.6"/>
        <rect x="26" y="17" width="5" height="6" fill="none" stroke="white" stroke-width="0.6" opacity="0.6"/>
      </svg>
    </div>
  `,
  iconSize: [24, 32],
  iconAnchor: [12, 32],
});

  stades.forEach((stade) => {
    const marker = L.marker([stade.latitude, stade.longitude], { icon })
      .bindTooltip(stade.nom, {
        permanent: false,
        className: 'custom-tooltip',
        offset: [0, -50],
      })
      .on('click', () => this.onMarkerClick(stade.id));

    this.markerClusterGroup.addLayer(marker);
  });
}

  private onMarkerClick(stadeId: number): void {
    this.selectedStadeId = stadeId;
    this.drawerVisible = true;
  }

  onDrawerClose(): void {
    this.drawerVisible = false;
    this.selectedStadeId = null;
  }
}