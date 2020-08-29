import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarHomeComponent } from './car-home/car-home.component';
import { RouterModule } from '@angular/router';
import { SuzukiComponent } from './suzuki/suzuki.component';
import { BuggatiComponent } from './buggati/buggati.component';

const routes = [
    {
        path: 'car',
        component: CarHomeComponent,
        //
        children: [
            { path: 'buggati', component: BuggatiComponent, },
            { path: 'suzuki', component: SuzukiComponent, }
        ]
    }
]

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class CarRouting { }
