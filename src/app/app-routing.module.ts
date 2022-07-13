import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//localhost:4200/funcionarios -> localhost:4200/funcionarios

const routes: Routes = [
  {
    path: 'funcionarios',
    loadChildren: () => import('./funcionarios/funcionarios.module').then(m => m.FuncionariosModule)
    /* Lazy Loading - carregamento tardio (.then) */
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'funcionarios'
  },
  {
    path: 'auth',
    loadChildren: ()=> import('./auth/auth.module').then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
