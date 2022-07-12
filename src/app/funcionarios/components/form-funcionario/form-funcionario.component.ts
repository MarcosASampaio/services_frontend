import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { async } from '@firebase/util';
import { Funcionario } from '../../models/funcionario';
import { FuncionarioService } from '../../services/funcionario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStep } from '@angular/material/stepper';
import { AnimationDurations } from '@angular/material/core';
import { animationFrames, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-form-funcionario',
  templateUrl: './form-funcionario.component.html',
  styleUrls: ['./form-funcionario.component.css'],
})
export class FormFuncionarioComponent implements OnInit {
  formFuncionario: FormGroup = this.fb.group({
    nome: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    foto: ['']
  });
  foto!: File;
  fotoPreview: string = ''
  salvandoFuncionario: boolean = false

  constructor(
    private fb: FormBuilder,
    private funcService: FuncionarioService,
    private dialogRef: MatDialogRef<FormFuncionarioComponent>, //objeto que permite controlar o dialog aberto
    private snackbar: MatSnackBar // com esse objeto será criado um snackbar na tela
  ) {}

  

  ngOnInit(): void {}

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

  salvar(): void {
    this.salvandoFuncionario = true
    const f: Funcionario = this.formFuncionario.value;
    f.foto = ''
    let obsSalvar: Observable<any>

    if(this.formFuncionario.value.foto.length != undefined) {
    obsSalvar = this.funcService.salvarFuncionario(f, this.foto)
    } else{
      obsSalvar = this.funcService.salvarFuncionario(f)
    }

    obsSalvar.subscribe(
      (resultado)=>{
        // 1º testar se o resultado é uma Promise ou não

        if(resultado instanceof Promise){

          /* Se cair no if, significa que há uma Promise e que tem uma foto para salvar*/

          resultado.then((obs$)=>{
            obs$.subscribe(
              () => {
                this.snackbar.open("Funcionario salvo com sucesso!", "OK", {duration: 3000});
          this.dialogRef.close();
              }
            )
          })

        } else {

          /* Se cair no else, significa que o funcionário já foi salvo e não tinha foto para enviar */

          this.snackbar.open("Funcionario salvo com sucesso!", "OK", {duration: 3000});
          this.dialogRef.close();
        }
      }
    )

    // Iniciando salvamento do funcionário
   // this.funcService.salvarFuncionario(f, this.foto).subscribe((dados) => {
      // 1º -> Recuperar o observable que me é retornado do primeiro subscribe
      //a função then() é executada quando a promise consegue te retornar os dados com sucesso
      //nesse caso, o dado que será retornado é um observable com o funcionário que foi salvo no banco de dados
     // dados.then((obs$) => {
        //inscrevendo-se no observable que nos retornará o fuioncionário salvo no banco de dados
       // obs$.subscribe((func) => {
          // quando o funcionário for salvo, aparecerá um alerta na tela e o dialog será fechado
         // console.log(func);
          // this.snackbar.open("Funcionario salvo com sucesso!", "OK", {duration: 3000});/* alert('Funcionário Salvo com sucesso!'); */
         // this.dialogRef.close();
       // });
     // });
   // });
  }
}
