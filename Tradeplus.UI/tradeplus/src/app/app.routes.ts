import { Routes } from '@angular/router';
import { TradePlusComponent } from './tradeplus/tradeplus';

export const routes: Routes = [{ path: 'tradeplus', component: TradePlusComponent },
  { path: '', redirectTo: '/tradeplus', pathMatch: 'full' },
  { path: '**', redirectTo: '/tradeplus' }];
