import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablePageComponent } from './table-page/table-page.component';
import { DetailsPageComponent } from './details-page/details-page.component';



@NgModule({
  declarations: [
    TablePageComponent,
    DetailsPageComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ViewsModule { }
