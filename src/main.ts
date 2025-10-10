// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes, RouterOutlet } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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

// Layout principal que envolve Navbar e rota
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `
})
class AppComponent { }

// Rotas do aplicativo
const routes: Routes = [
  { path: '', component: TotemComponent },
  { path: 'totem', component: TotemComponent },
  { path: 'atendente', component: AtendenteComponent },
  { path: 'painel', component: PainelComponent },
];

// Bootstrap do aplicativo
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ]
}).catch(err => console.error(err));
