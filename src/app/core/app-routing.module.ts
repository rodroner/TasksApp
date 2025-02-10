import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudComponent } from '../task/crud/crud.component';
import { BoardComponent } from '../task/board/board.component';
import { CategoryComponent } from '../category/category.component';
import { UserComponent } from '../user/user.component';
import { SprintComponent } from '../sprint/sprint.component';
import { AuthComponent } from '../user/auth/auth.component';
import { AuthGuard } from '../guards/auth.guard';

import { UnauthorizedComponent } from '../errors/unathorized/unauthorized.component';
import { NotFound404Component } from '../errors/not-found404/not-found404.component';
import { ServerError500Component } from '../errors/server-error500/server-error500.component';

const routes: Routes = [
  { path: '', component: CrudComponent, canActivate: [AuthGuard], data: { expectedRole: ['admin', 'developer', 'user'] } },
  { path: 'board', component: BoardComponent, canActivate: [AuthGuard], data: { expectedRole: ['admin', 'developer', 'user'] } },
  { path: 'categorys', component: CategoryComponent, canActivate: [AuthGuard], data: { expectedRole: ['admin'] } },
  { path: 'users', component: UserComponent, canActivate: [AuthGuard], data: { expectedRole: ['admin', 'developer'] } },
  { path: 'sprints', component: SprintComponent, canActivate: [AuthGuard], data: { expectedRole: ['admin', 'developer'] }},
  { path: 'session', component: AuthComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'not-found', component: NotFound404Component },
  { path: 'server-error', component: ServerError500Component },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
