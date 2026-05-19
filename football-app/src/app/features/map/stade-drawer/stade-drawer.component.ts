import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { StadeService } from '../../../core/services/stade.service';
import { EquipeService } from '../../../core/services/equipe.service';
import { JoueurService } from '../../../core/services/joueur.service';
import { StadeDetailDTO } from '../../../core/models/stade.model';
import { EquipeDTO } from '../../../core/models/equipe.model';
import { CoachDTO } from '../../../core/models/coach.model';
import { JoueurDTO } from '../../../core/models/joueur.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-stade-drawer',
  standalone: true,
  imports: [
    CommonModule,
    DrawerModule,
    TabsModule,
    TagModule,
    SkeletonModule,
    AvatarModule,
    BadgeModule,
  ],
  templateUrl: './stade-drawer.component.html',
  styleUrl: './stade-drawer.component.scss',
})
export class StadeDrawerComponent implements OnChanges {
  @Input() stadeId!: number;
  @Input() visible = false;
  @Output() closeDrawer = new EventEmitter<void>();

  private stadeService = inject(StadeService);
  private equipeService = inject(EquipeService);
  private joueurService = inject(JoueurService);

  stade: StadeDetailDTO | null = null;
  equipe: EquipeDTO | null = null;
  coach: CoachDTO | null = null;
  joueurs: JoueurDTO[] = [];
  loading = false;

  get titulaires(): JoueurDTO[] {
    return this.joueurs.filter(j => !j.estRemplacant);
  }

  get remplacants(): JoueurDTO[] {
    return this.joueurs.filter(j => j.estRemplacant);
  }

  ngOnChanges(): void {
    if (this.visible && this.stadeId) {
      this.loadData();
    }
  }

  private loadData(): void {
    this.loading = true;
    this.stade = null;
    this.equipe = null;
    this.coach = null;
    this.joueurs = [];

    // Charger le stade d'abord
    this.stadeService.getDetail(this.stadeId).subscribe({
      next: (stade) => {
        this.stade = stade;

        // Puis charger l'équipe liée au stade
        this.equipeService.getByStade(this.stadeId).subscribe({
          next: (equipe) => {
            this.equipe = equipe;

            // Puis joueurs + coach en parallèle
            forkJoin({
              joueurs: this.joueurService.getByEquipe(equipe.id),
              coach: this.equipeService.getCoach(equipe.id),
            }).subscribe({
              next: ({ joueurs, coach }) => {
                this.joueurs = joueurs;
                this.coach = coach;
                this.loading = false;
              },
              error: () => (this.loading = false),
            });
          },
          error: () => (this.loading = false),
        });
      },
      error: () => (this.loading = false),
    });
  }

  close(): void {
    this.closeDrawer.emit();
  }
}