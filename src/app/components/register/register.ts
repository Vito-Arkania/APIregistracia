import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  readonly auth = inject(Auth);
  readonly fb = inject(FormBuilder);
  readonly router = inject(Router);

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
    if (this.user.invalid) {
      alert('');
      return;
    }

    const rawValue = this.user.getRawValue();

    // Преобразуем данные в формат, который ожидает сервер
    const payload = {
      ...rawValue,
      age: Number(rawValue.age), 
      gender: rawValue.gender.toUpperCase()
    };

    this.auth.signUp(payload).subscribe({
      next: (resp: any) => {
  console.log('Успешная регистрация:', resp);
  
  const token = resp?.access_token || resp?.token;
  
  if (token) {
    this.auth.saveToken(token, resp.user || payload);
    this.router.navigate(['/home']);
  } else {
    // АВТО-ЛОГИН: если токена нет, пробуем залогинить пользователя теми же данными
    this.auth.signIn({ email: payload.email, password: payload.password }).subscribe({
      next: (loginResp: any) => {
        const loginToken = loginResp?.access_token || loginResp?.token;
        this.auth.saveToken(loginToken, loginResp.user || payload);
        this.router.navigate(['/home']);
      },
      error: () => {
        // Если авто-логин не прошел, просто кидаем на страницу входа
        alert('Регистрация прошла успешно! Теперь войдите в систему.');
        this.router.navigate(['/login']);
      }
    });
  }
},
      error: (err: any) => {
        console.error('Ошибка сервера (400):', err.error);
        const msg = err.error?.message || 'Ошибка при регистрации. Проверьте данные.';
        alert(msg);
      }
    });
  }
}