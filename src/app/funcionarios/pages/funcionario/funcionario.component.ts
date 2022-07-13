import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Funcionario } from '../../models/funcionario';
import { FuncionarioService } from '../../services/funcionario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ConfirmarDelecaoComponent } from 'src/app/confirmar-delecao/confirmar-delecao.component';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject } from 'rxjs';



@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css'],
})
export class FuncionarioComponent implements OnInit {
  
  funcionario!: Funcionario;

  /* items = this.funcService.getFuncionarios(); */
  
  checkoutForm: FormGroup = this.formBuilder.group({
    foto: [''],
    nome: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  foto!: File;
  fotoPreview: string = '';
  desabilitar: boolean = true;
  naoEncontrado: boolean = false;

  constructor(
    private route: ActivatedRoute, //acessar os parâmetros da rota ativa
    private funcService: FuncionarioService,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    
    
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let idFuncionario = parseInt(params.get('idFuncionario') ?? '0');

      this.recuperarFuncionario(idFuncionario);
    });

    /* let idFuncionario = this.route.snapshot.paramMap.get('idFuncionario')
    console.log(idFuncionario) */

  }
  recuperarFoto(event: any): void {
    this.foto = event.target.files[0];
    this.carregarPreview();
  }

  carregarPreview(): void {
    const reader = new FileReader();

    reader.readAsDataURL(this.foto);

    reader.onload = () => {
      this.fotoPreview = reader.result as string;
    };
  }

  recuperarFuncionario(id: number): void {
    this.funcService.getFuncionarioById(id).subscribe(
      (func) => {

      /* 1º pegar o funcionário que foi retornado e colocar dentro da propriedade funcioário */

      this.funcionario = func;

      /* 2º pegar os dados do funcionário e atribuir esses valores aos seus respectivos campos no formulário */

      /* setvalue() é responsável por pegar os valores que foram passados para ela e colocar dentr do formControls */

      console.log(this.funcionario);
      this.checkoutForm.setValue({
        foto: '',
        nome: func.nome,
        email: func.email,
      });

      /* 3º carregar o preview da imagem */

      this.fotoPreview = this.funcionario.foto;
      this.valorMudou()
    },
    (erro: HttpErrorResponse)=>{
      this.naoEncontrado = erro.status == 404
      }
    )
  }

  valorMudou() {

    /* valueChanges é uma propriedade dos FormGroups
    que é um observable que quando um valor do seu formulário
    altera, esse observable te retorna essa modificação */

    this.checkoutForm.valueChanges.subscribe(

      /* O parâmetro valores é um objeto que é retornado te informando o valor de cada campo do seu reative forms */

      ({ nome, email, foto }) => {

        /* O botão será desabilitado se as validações do formulário estiverem inválidas
        ou se o valor de algum campo formulário estiver diferente do valor de alguma propriedade do objeto funcionário */

      this.desabilitar = !(
        nome != this.funcionario.nome ||
        email != this.funcionario.email ||
        foto.length > 0 ||
        this.checkoutForm.invalid
      );
    });
  } 
  
  salvarAtualizacoes(){
      const f: Funcionario = { ...this.checkoutForm.value}
    f.id = this.funcionario.id
    f.foto = this.funcionario.foto

    const temFoto = this.checkoutForm.value.foto.length > 0

    const obsSalvar: Observable<any> = this.funcService.atualizarFuncionario(f, temFoto ? this.foto : undefined)

    obsSalvar.subscribe(
      (resultado) => {
        if (resultado instanceof Observable<Funcionario>){
          resultado.subscribe(
            (func) => {
              this.snackbar.open('Funcionário salvo com sucesso', 'ok', {duration: 3000})

              this.recuperarFuncionario(func.id)
            }
          )
        }
        this.snackbar.open('Funcionário salvo com sucesso', 'ok', {duration: 3000})
        this.recuperarFuncionario(resultado.id)
      }
    )

    /* this.funcService.atualizarFuncionario(f).subscribe(
      () => {
        this.snackbar.open('Funcionário atualizado com sucesso', 'ok', {duration: 3000})
      }
    ) */
  }

  deletarFuncionario(func:Funcionario): void {   
    
     const MatDialogRef = this.dialog.open

     (ConfirmarDelecaoComponent)
     MatDialogRef.afterClosed().subscribe(
      deletar=> {
        if (deletar) {
          this.funcService.deleteFuncionario(func).subscribe(
            () => {
              this.snackbar.open('Funcionário deletado', 'ok', {
                duration: 3000
              })
              this.router.navigateByUrl('/funcionarios')

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

   

}

