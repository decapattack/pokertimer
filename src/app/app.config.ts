import { ApplicationConfig, provideZoneChangeDetection, isDevMode, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

// 2. Imports para registrar o idioma Português (Brasil)
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

// 3. Executa a função para registrar o idioma
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
    // 4. Adiciona o provider para definir o idioma padrão da aplicação
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
