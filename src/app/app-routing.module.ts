import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'messages', loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule)},
  { path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchModule)},
  { path: 'profile/:username', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)},
  { path: '**', redirectTo: 'dashboard' },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
