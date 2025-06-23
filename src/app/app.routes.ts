import { Routes } from '@angular/router';
import { ClockComponent } from './pages/clock/clock.component';

export const routes: Routes = [
  { path: '', redirectTo: 'clock', pathMatch: 'full' },
  { path: 'clock', component: ClockComponent }
];
