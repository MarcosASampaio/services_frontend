import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formularioLogin = this.loginBuilder.group({
    email: new FormControl('',[Validators.required, Validators.email]),
    senha: new FormControl('', Validators.required)
  });

  constructor(

    private loginBuilder: FormBuilder

  ) { }

  get email(){
    return this.formularioLogin.get('email')
  }

  get senha(){
    return this.formularioLogin.get('senha')
  }

  ngOnInit(): void {
    
  }

}
