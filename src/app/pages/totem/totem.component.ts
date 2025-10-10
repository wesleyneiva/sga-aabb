import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SenhaService, Senha } from '../../services/senha.service';

@Component({
  selector: 'app-totem',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container text-center mt-5">
      <h2 class="mb-4">🖥️ Totem de Senhas</h2>

      <div class="mb-4">
        <button class="btn btn-primary me-2" (click)="gerar('normal')">Senha Normal</button>
        <button class="btn btn-warning" (click)="gerar('preferencial')">Senha Preferencial</button>
      </div>

      <div *ngIf="senhaAtual" class="alert alert-success p-4 mt-3">
        <h3>Sua senha é: <strong>{{ senhaAtual.codigo }}</strong></h3>
        <p>Tipo: {{ senhaAtual.tipo === 'normal' ? 'Normal' : 'Preferencial' }}</p>
        <p>Hora: {{ senhaAtual.hora }}</p>
      </div>

      <div *ngIf="!senhaAtual" class="text-muted mt-4">
        Clique em uma das opções acima para gerar sua senha.
      </div>
    </div>
  `,
})
export class TotemComponent {
  senhaAtual: Senha | null = null;

  constructor(private senhaService: SenhaService) {}

  async gerar(tipo: 'normal' | 'preferencial') {
    // Senha gerada com status 'aguardando'
    const novaSenha = await this.senhaService.gerarSenha(tipo);
    this.senhaAtual = novaSenha;
  }
}
