import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Импортируем Роутер
import { Auth } from '../../services/auth';

// Наша заплатка для типов (чтобы сборка не падала)
let DummyAuth = Auth as any;
if (!DummyAuth.prototype.signUp) {
  DummyAuth.prototype.signUp = function(user: any) {
    return this.http.post('https://api.everrest.educata.dev/auth/sign_up', user);
  };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
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

    (this.auth as any).signUp(userValue).subscribe({
      next: (resp: any) => {
        console.log('Регистрация успешна:', resp);
        
        if (resp && resp.access_token) {
          this.auth.saveToken(resp.access_token);
        }

        // 1. Очищаем форму (инпуты станут пустыми)
        this.user.reset();

        // 2. Сразу же перекидываем на главную страницу /main
        this.router.navigate(['/main']); 
      },
      error: (err: any) => {
        console.error('Ошибка при регистрации:', err);
        alert('Этот Email уже занят! Придумай другой, чтобы проверить регистрацию.');
      }
    });
  }
}