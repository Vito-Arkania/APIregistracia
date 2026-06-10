import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Импортируем Роутер
import { Auth } from '../../services/auth';



@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  readonly auth = inject(Auth);
  readonly fb = inject(FormBuilder);
  readonly router = inject(Router); // Внедряем Роутер

  user = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    age: [18, [Validators.required, Validators.min(1)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    zipcode: ['', Validators.required],
    avatar: ['', Validators.required],
    gender: ['MALE', Validators.required]
  });

  submit() {
  if (this.user.invalid) return;
  const userValue = this.user.getRawValue();

  this.auth.signUp(userValue).subscribe({
    next: (resp: any) => {
      console.log('Registration was successful:', resp);
      if (resp?.access_token) {
        this.auth.saveToken(resp.access_token);
      }
      this.user.reset();
      this.router.navigate(['/home']);
    },
    error: (err: any) => {
      console.error('error registration:', err);
    }
  });
}
}