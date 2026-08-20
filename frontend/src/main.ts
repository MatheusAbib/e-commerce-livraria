import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

const link = document.createElement('link');
link.rel = 'icon';
link.type = 'image/png';
link.href = '/api/icones/favicon';
document.head.appendChild(link);

setTimeout(() => {
  const link2 = document.createElement('link');
  link2.rel = 'icon';
  link2.type = 'image/png';
  link2.href = '/api/icones/favicon';
  document.head.appendChild(link2);
}, 1000);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
