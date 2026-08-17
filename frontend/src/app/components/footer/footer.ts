import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent implements OnInit {
  anoAtual: number = new Date().getFullYear();
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('clienteLogado') || 'null');
    this.isLoggedIn = !!user;
  }
}
