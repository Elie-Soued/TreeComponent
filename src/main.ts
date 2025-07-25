/* eslint-disable @tseslint/use-unknown-in-catch-callback-variable */
/* eslint-disable @unicorn/prefer-top-level-await */
/* eslint-disable @tseslint/dot-notation */
/* eslint-disable @tseslint/typedef */
/* eslint-disable no-console */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
