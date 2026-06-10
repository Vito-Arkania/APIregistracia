import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  readonly auth = inject(Auth)
  readonly fb = inject(FormBuilder)

  user = this.fb.nonNullable.group({
    email:['',[Validators.required, Validators.email]],
    password:['',[Validators.required]]
  })

  submit(){
    const userValue = this.user.getRawValue()

    this.auth.signIn(userValue).subscribe({
      next:(resp)=>{
        console.log(resp)
        this.auth.saveToken((resp as any).access_token)
      },
      error:(err)=>{
        console.error(err)
      }
    })
  }

}
