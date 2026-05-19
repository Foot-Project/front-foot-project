import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
// 1. Added the missing import for providePrimeNG
import { providePrimeNG } from 'primeng/config'; 

// 2. Removed curly braces because Aura is a default export
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({ 
        theme: {
            preset: Aura, 
            options: {
                darkModeSelector: '.my-app-dark' 
            }
        }
    }),
    provideHttpClient(),
  ]
};