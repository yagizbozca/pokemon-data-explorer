import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewsModule } from './views/views.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { GlobalErrorHandlerService } from './core/errors/global-error-handler.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ViewsModule
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
