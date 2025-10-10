// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Router, Routes, RouterOutlet } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

// Componentes Standalone
import { TotemComponent } from './app/pages/totem/totem.component';
import { AtendenteComponent } from './app/pages/atendente/atendente.component';
import { PainelComponent } from './app/pages/painel/painel.component';
import { NavbarComponent } from './app/components/navbar/navbar.component';

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC-SsA_xWd_0LjdOCOOtKrQ4cmxsdceqh4",
  authDomain: "sga-aabb.firebaseapp.com",
  projectId: "sga-aabb",
  storageBucket: "sga-aabb.firebasestorage.app",
  messagingSenderId: "119025909759",
  appId: "1:119025909759:web:46bf1348664942807271ca"
};

// Layout principal
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <!-- Mostra navbar somente se não estiver em /painel ou /totem -->
    <ng-container *ngIf="mostrarNavbar()">
      <app-navbar></app-navbar>
    </ng-container>

    <div class="container-fluid p-0">
      <router-outlet></router-outlet>
    </div>
  `
})
class AppComponent {
  router = inject(Router);
  mostrarNavbar = signal(true);

  constructor() {
    // Atualiza exibição da navbar conforme a rota
    this.router.events.subscribe(() => {
      const rota = this.router.url;
      // Oculta navbar em rotas específicas
      this.mostrarNavbar.set(!(rota.includes('/painel') || rota.includes('/totem') || rota.includes('/atendente')));
    });
  }
}

// Rotas do aplicativo
const routes: Routes = [
  { path: '', redirectTo: 'totem', pathMatch: 'full' },
  { path: 'totem', component: TotemComponent },
  { path: 'atendente', component: AtendenteComponent },
  { path: 'painel', component: PainelComponent },
];

// Bootstrap do app
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ]
}).catch(err => console.error(err));
