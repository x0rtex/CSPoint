import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Player } from '../player.interface';
import { PlayerService } from '../player.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AsyncPipe, CommonModule } from '@angular/common';
import { PlayerFormComponent } from '../player-form/player-form';

@Component({
  selector: 'app-player-edit',
  imports: [CommonModule, MatProgressSpinner, AsyncPipe, PlayerFormComponent],
  templateUrl: './player-edit.html',
  styleUrl: './player-edit.scss',
})
export class PlayerEditComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private playerService: PlayerService = inject(PlayerService);

  player$!: Observable<Player>;

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.player$ = this.playerService.getPlayer(id);
    }
  }
}
