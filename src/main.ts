import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// web-component
import "hdr-color-input";

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
