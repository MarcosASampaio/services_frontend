import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FuncionarioComponent } from '../pages/funcionario/funcionario.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlteracaoComponent } from 'src/app/dialog-alteracao/dialog-alteracao.component';
import { FormFuncionarioComponent } from '../components/form-funcionario/form-funcionario.component';


@Injectable({
  providedIn: 'root'
})
export class PodeSairGuard implements CanDeactivate<FuncionarioComponent> {

  

  constructor(
    
    private dialog: MatDialog
  ){}

    canDeactivate(
    component: FuncionarioComponent, //representa o componente que ele está inserido
    currentRoute: ActivatedRouteSnapshot, //a partir dele conseguimos acessar o valor dos parâmetros
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree { //Se o guard retorna o valor TRUE, significa que a pessoa PODE sair da página
      //Se o guard retornar o valor FALSE, significa que a pessoa NÃO PODE  sair da página

      //1º Pegar os dados do formulário e guardar cada um em variáveis diferentes

      const nome = component.checkoutForm.value.nome
      const email = component.checkoutForm.value.email
      const foto = component.checkoutForm.value.foto    

      if (nome != component.funcionario.nome || email != component.funcionario.email || foto.length > 0) {
        const dialogRef = this.dialog.open
         (DialogAlteracaoComponent)
         
        const querSair = dialogRef.afterClosed()

        return querSair
      }else{ 

    return true
      }
  }
  
}
