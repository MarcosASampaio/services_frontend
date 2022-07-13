import { Component, OnInit } from '@angular/core';
import { MatDialog, matDialogAnimations } from '@angular/material/dialog';
import { FormFuncionarioComponent } from '../../components/form-funcionario/form-funcionario.component';
import { Funcionario } from '../../models/funcionario';
import { FuncionarioService } from '../../services/funcionario.service';
import { MatDialogRef } from '@angular/material/dialog';
import { stringify } from '@firebase/util';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DialogRef } from '@angular/cdk/dialog';
import { ConfirmarDelecaoComponent } from 'src/app/confirmar-delecao/confirmar-delecao.component';


@Component({
  selector: 'app-listar-funcionarios',
  templateUrl: './listar-funcionarios.component.html',
  styleUrls: ['./listar-funcionarios.component.css']
})
export class ListarFuncionariosComponent implements OnInit {

  funcionarios: Funcionario[] = []
  colunas: Array<string> = ['id', 'email', 'nome', 'actions']

  constructor(
    private funcService: FuncionarioService,
    private dialog: MatDialog, // responsável por abrir o componente confirmar-delecao na tela
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    //1º sucesso -> retorna os dados
    //2º erro -> ocorre um erro na fonte de dados
    //3º  complete -> a fonte de dados te retorna tudo
    this.funcService.atualizarFuncionariosSub$.subscribe(
      (precisaAtualizar)=>{
        if(precisaAtualizar){
          this.recuperarFuncionarios()
        }
      }
    )
    this.recuperarFuncionarios()
  }

   deletarFuncionario(func:Funcionario): void {
    /* A função open() do dialog vai abrir o seu componente
    na tela com uma caixa de dialog, basta informar
    a classe do componente que ele precisa abrir pra você

    e ele te retornará uma referência desse componente que está
    aberto na sua tela
    */

     const MatDialogRef = this.dialog.open

/* A função afterClosed() te retorna um observable
    que manda os dados que serão enviados para você
    quando esse dialog for fechado */

     (ConfirmarDelecaoComponent)
     MatDialogRef.afterClosed().subscribe(
      deletar=> {
        if (deletar) {
          this.funcService.deleteFuncionario(func).subscribe(
            () => {
              this.snackbar.open('Funcionário deletado', 'ok', {
                duration: 3000
              })
              this.recuperarFuncionarios()
            },
            (error) => {
              this.snackbar.open('Não foi possível deletar o funcionário', '', {
                duration: 3000
              })
              console.log(error)
            }
          )
        }
      }
     )
   }


  recuperarFuncionarios(): void{
    this.funcService.getFuncionarios().subscribe(
      (funcs)=>{ //sucesso
        this.funcionarios = funcs.reverse()//O reverse reverterá o array para que na lista os funcionários apareçam do mais novo para o mais antigo.
      },
      (erro)=>{ //erro
        console.log(erro)
      },
      ()=>{ //complete
        console.log('Dados enviados com sucesso')
      }
    )
  }

  abrirFormFuncionario(): void{
    const referenciaDialog = this.dialog.open(FormFuncionarioComponent) //abrindo o formulário e recuperando a referência desse dialog e guardando na variável


    //A função afterClosed() nos retorna um observable que notifica quando o dialog acabou de ser fechado. Quando o dialog for fechado, chamaremos a função que faz a requisição dos funcionários novamente
    referenciaDialog.afterClosed().subscribe(
      () => {
        this.recuperarFuncionarios()
      }
    )
  }
}
