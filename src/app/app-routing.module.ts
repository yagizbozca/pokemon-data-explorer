import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablePageComponent } from './views/table-page/table-page.component';
import { DetailsPageComponent } from './views/details-page/details-page.component';

const routes: Routes = [
    {
        path: "list",
        component: TablePageComponent
    },
    {
        path: "detail/:id",
        component: DetailsPageComponent,
    },
    {
        path: "**",
        redirectTo: "list",
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
