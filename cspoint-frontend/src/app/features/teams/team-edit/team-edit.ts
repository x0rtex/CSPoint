import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Team } from '../team.interface';
import { TeamService } from '../team.service';
import { TeamFormComponent } from '../team-form/team-form';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-team-edit',
  imports: [CommonModule, MatProgressSpinner, AsyncPipe, TeamFormComponent],
  templateUrl: './team-edit.html',
  styleUrl: './team-edit.scss',
})
export class TeamEditComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private teamService: TeamService = inject(TeamService);

  team$!: Observable<Team>;

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.team$ = this.teamService.getTeam(id);
    }
  }
}
