import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { CrudComponent } from '../task/crud/crud.component';
import { ListComponent } from '../task/crud/list/list.component';
import { ItemCardComponent } from '../task/crud/item-card/item-card.component';



@NgModule({
  imports: [
    AppModule,
    ServerModule,

    /*
    CrudComponent,
    ListComponent,
    ItemCardComponent
    */
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
