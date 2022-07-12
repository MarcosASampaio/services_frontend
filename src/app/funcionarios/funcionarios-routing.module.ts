import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdValidatorGuard } from './guards/id-validator.guard';
import { PodeSairGuard } from './guards/pode-sair.guard';
import { FuncionarioComponent } from './pages/funcionario/funcionario.component';
import { ListarFuncionariosComponent } from './pages/listar-funcionarios/listar-funcionarios.component';

//localhost:4200/funcionarios
//http://localhost:4200/funcionarios
const routes: Routes = [
  {
    //http://localhost:4200/funcionarios/3
    path: '',
    //pathMatch: 'full',
    component: ListarFuncionariosComponent,
    children: [
      {
        path: ':idFuncionario',
        component: FuncionarioComponent,
        canDeactivate: [
          PodeSairGuard
        ],
        canActivate: [
          IdValidatorGuard
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncionariosRoutingModule { }
