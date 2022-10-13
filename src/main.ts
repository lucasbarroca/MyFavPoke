import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();

  // HACK: Don't log to console in production environment.
  // TODO: This can be done in better way using logger service and logger factory.
  if (window) {
    window.console.log =
      window.console.warn =
      window.console.info =
        function () {
          // Don't log anything.
        };
  }
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
