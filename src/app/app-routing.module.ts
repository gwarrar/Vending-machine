import { VendingMachineComponent } from './component/vending-machine/vending-machine.component';
import { createPlatform, NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'vending-machine',
    component: VendingMachineComponent,
  },
  {
    path: '**',
    redirectTo: 'vending-machine',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
