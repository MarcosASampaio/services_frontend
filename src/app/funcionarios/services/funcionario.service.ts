import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, Observable, tap } from 'rxjs';
import { Funcionario } from '../models/funcionario';
import { AngularFireStorage } from '@angular/fire/compat/storage'; //importação do fireStorage
import { async } from '@firebase/util';

//localhost:3000/funcionarios/

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private readonly baseUrl: string = 'http://localhost:3000/funcionarios'

  atualizarFuncionariosSub$: BehaviorSubject<boolean> = new BehaviorSubject(true)

  constructor(
    private http: HttpClient,
    private storage: AngularFireStorage //objeto responsável por salvar as imagens no firebase
  ) { }

  getFuncionarios():Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.baseUrl)
  }
  //http://localhost:3000/funcionarios/1 (id do funcionario)

  deleteFuncionario(func: Funcionario): Observable<any> {

    //Se não tiver foto, apena será deletado o email e nome

    if (func.foto.length > 0){

      //1º pegar a referência da imagem no firestorage
      //refFromURL() pega referência do arquivo do storage pelo link de acesso gerado pelo firebase

      return this.storage.refFromURL(func.foto).delete().pipe(
        mergeMap(()=>{

          //mergeMap tem a função de pegar dois ou mais observables e transformar todos em um só
          
          return this.http.delete<any>(`${this.baseUrl}/${func.id}`)
        })
      )
    }

    return this.http.delete<any>(`${this.baseUrl}/${func.id}`)
  }
//http://localhost:3000/funcionarios/
  getFuncionarioById(id:number): Observable<Funcionario>{
    return this.http.get<Funcionario>(`${this.baseUrl}/${id}`)
  }

  //RXJS Operators: funções que manipulam os dados que os observables te retornam

  //O "?" na frente do parãmetro faz com que ele seja opcional na hora de executar a função

  salvarFuncionario(func: Funcionario, foto?: File){

    //fazendo requisição POST para salvar os dados do funionário
    // @return funcionário que acabou de ser salvo
    //a função pipe é utilizada para colocar os operadores do RXJS que manipularão os dados que são retornados dos observables
    //o pipe map manipula cada dado que o observable te retorna, transformando em algo diferente e te retorna esse dado modificado

    if (foto == undefined){ //se a foto não existe, será retornado um observable que apenas salva os dados básicos
      return this.http.post<Funcionario>(this.baseUrl, func)
    }

   return this.http.post<Funcionario>(this.baseUrl, func).pipe(
      map(async (func) => {

        //1º Fazer upload da imagem e recuperar o link gerado

       const linkFotoFirebase = await this.uploadImagem(foto)
       
       //2º Atribuir o link gerado ao funcionário criado

       func.foto = linkFotoFirebase

       //3º Atualizar funcionário com a foto

       return this.atualizarFuncionario(func)
      })
    )
  }

  //fazer com que a função receba a foto ou não

  atualizarFuncionario(func: Funcionario, foto?: File): any{

    //se a foto não foi passada, atualizar apena com os dados básicos

    if (foto == undefined){
    return this.http.put<Funcionario>(`${this.baseUrl}/${func.id}`, func).pipe(
      tap((funcionario)=>{
        this.atualizarFuncionariosSub$.next(true)
      })
    )
    }

    //se já existir uma foto ligada a esse funcionário, iremos deletá-la para pôr a nova

    if (func.foto.length > 0) {
      const inscricao = this.storage.refFromURL(func.foto).delete().subscribe(
        () => {
          inscricao.unsubscribe()
        }
      )
    }

    return this.http.put<Funcionario>(`${this.baseUrl}/${func.id}`, func).pipe(
      mergeMap(async (funcionarioAtualizado) => {
        const linkFotoFirebase = await this.uploadImagem(foto)

        funcionarioAtualizado.foto = linkFotoFirebase

        return this.atualizarFuncionario(funcionarioAtualizado)
      }),
      tap((funcionario)=>{
        this.atualizarFuncionariosSub$.next(true)
      })
    )
  }

  // 1º pegar a imagem
  // 2º fazer o upload da imagem
  // 3º gerar o link de download e retorna-lo
  private async uploadImagem(foto: File): Promise<string> {
    //a palavra async informa que a função vai trabalahr com
    //código assíncrono, ou seja, códigos que demoram para serem exercutados

    const nomeDoArquivo = Date.now() //retorna a data atual em milissegundos

    // faz o upload do arquivos para o firebase
    // 1º parâmetro: nome do arquivo
    // 2 parâmetro: o arquivo que deve ser enviado

    const dados = await this.storage.upload(`${nomeDoArquivo}`, foto)

    //a propriedade REF é a referência do arquivo no firebase
    const getDownloadURL = await dados.ref.getDownloadURL() // retorna um link para o acesso da imagem
    return getDownloadURL
  }
}
