import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablePageComponent } from './table-page/table-page.component';
import { DetailsPageComponent } from './details-page/details-page.component';
import { PokemonService } from '../core/services/pokemon.service';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    TablePageComponent,
    DetailsPageComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [
    PokemonService
  ]
})
export class ViewsModule { }
