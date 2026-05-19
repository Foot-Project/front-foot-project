import { Component } from '@angular/core';
import { MapComponent } from './features/map/map.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './app.html',
})
export class App {}
