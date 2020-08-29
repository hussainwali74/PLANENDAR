import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuggatiComponent } from './buggati/buggati.component';
import { SuzukiComponent } from './suzuki/suzuki.component';
import { CarHomeComponent } from './car-home/car-home.component';
import { CarRouting } from './car.routing';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CarHomeComponent, SuzukiComponent, BuggatiComponent],
  imports: [
    CommonModule,
    RouterModule,

    CarRouting
  ]
})
export class CarModule { }
