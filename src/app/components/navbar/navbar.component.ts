import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">SGA AABB</a>
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link" routerLink="/totem">Totem</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/atendente">Atendente</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/painel">Painel</a>
          </li>
        </ul>
      </div>
    </nav>
  `
})
export class NavbarComponent {}
