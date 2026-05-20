import { Component, inject } from '@angular/core';
import {  RouterModule } from "@angular/router";
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  readonly auth = inject(Auth)
}
