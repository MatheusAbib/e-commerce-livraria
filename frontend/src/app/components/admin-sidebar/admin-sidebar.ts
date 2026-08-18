import { Component, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AdminModalsComponent } from '../admin-modals/admin-modals';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminModalsComponent],
  templateUrl: './admin-sidebar.html',
  styleUrls: ['./admin-sidebar.css']
})
export class AdminSidebarComponent implements OnInit {
  @Output() closeSidebar = new EventEmitter<void>();
  @ViewChild(AdminModalsComponent) adminModals!: AdminModalsComponent;

  usuario: any = {};
  totalChatNaoLidas: number = 0;
  menuAberto: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarUsuario();
    this.carregarTotalChatNaoLidas();
    setInterval(() => {
      this.carregarTotalChatNaoLidas();
    }, 3000);
  }

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }

  async carregarTotalChatNaoLidas(): Promise<void> {
    try {
      const token = this.authService.getToken();
      const response = await fetch('/api/chat/admin/total-nao-lidas', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      if (response.ok) {
        const data = await response.json();
        this.totalChatNaoLidas = data.total || 0;
      }
    } catch (error) {
      console.error('Erro ao carregar total de chats não lidos:', error);
    }
  }

  carregarUsuario(): void {
    const user = this.authService.getUser();
    if (user) {
      this.usuario = { ...user };
    }
  }

  onPerfilAtualizado(): void {
    this.carregarUsuario();
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  abrirPerfil(): void {
    this.fecharMenu();
    if (this.adminModals) {
      this.adminModals.abrirPerfil();
    }
  }

  abrirLogout(): void {
    this.fecharMenu();
    if (this.adminModals) {
      this.adminModals.abrirLogout();
    }
  }
}
