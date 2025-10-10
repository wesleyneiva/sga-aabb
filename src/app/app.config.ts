import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()), provideFirebaseApp(() => initializeApp({ projectId: "sga-aabb", appId: "1:119025909759:web:ab0be9d12a9ba7fd7271ca", storageBucket: "sga-aabb.firebasestorage.app", apiKey: "AIzaSyC-SsA_xWd_0LjdOCOOtKrQ4cmxsdceqh4", authDomain: "sga-aabb.firebaseapp.com", messagingSenderId: "119025909759" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
};
