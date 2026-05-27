import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectorRef,ChangeDetectionStrategy } from '@angular/core'; 
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
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-stade-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  @Input() stadeId = 0;
  @Input() visible = false;
  @Output() closeDrawer = new EventEmitter<void>();

  private stadeService = inject(StadeService);
  private equipeService = inject(EquipeService);
  private joueurService = inject(JoueurService);
  private cdr = inject(ChangeDetectorRef);

  stade: StadeDetailDTO | null = null;
  equipe: EquipeDTO | null = null;
  coach: CoachDTO | null = null;
  joueurs: JoueurDTO[] = [];
  loading = false;

  ngOnChanges(changes: SimpleChanges): void {
    const visibleChange = changes['visible'];
    const stadeIdChange = changes['stadeId'];

    if (this.visible && this.stadeId) {
      if (visibleChange?.currentValue === true || stadeIdChange) {
        this.loadData();
      }
    }
  }

  get titulaires(): JoueurDTO[] {
    return this.joueurs.filter(j => !j.estRemplacant);
  }

  get remplacants(): JoueurDTO[] {
    return this.joueurs.filter(j => j.estRemplacant);
  }

  private loadData(): void {
    this.loading = true;
    this.stade = null;
    this.equipe = null;
    this.coach = null;
    this.joueurs = [];

    this.stadeService.getDetail(this.stadeId).subscribe({
      next: (stade) => {
        this.stade = stade;
        this.equipeService.getByStade(this.stadeId).subscribe({
          next: (equipe) => {
            this.equipe = equipe;
            forkJoin({
              joueurs: this.joueurService.getByEquipe(equipe.id),
              coach: this.equipeService.getCoach(equipe.id).pipe(
                catchError(() => of(null))
              ),
            }).subscribe({
              next: ({ joueurs, coach }) => {
                this.joueurs = joueurs;
                this.coach = coach;
                this.loading = false;
                this.cdr.markForCheck();
              },
              error: () => {
                this.loading = false;
                this.cdr.markForCheck();
              },
            });
          },
          error: () => {
            this.loading = false;
            this.cdr.markForCheck();
          },
        });
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  close(): void {
    this.closeDrawer.emit();
  }
}