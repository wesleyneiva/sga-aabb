import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SenhaService, Senha } from '../../services/senha.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-atendente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container text-center mt-5">
      <h2 class="mb-4 text-2xl font-bold">👩‍💼 Painel do Atendente</h2>
      
      <div class="card p-4 shadow-xl mb-5 mx-auto bg-light border-primary" style="max-width: 400px;">
        <h4 class="mb-3 text-primary">Estou no Guichê:</h4>
        <select 
          [(ngModel)]="guicheAtual" 
          class="form-select form-select-lg text-center"
          [class.is-invalid]="guicheAtual === 0"
        >
          <option value="0" disabled>Selecione o Guichê</option>
          <option *ngFor="let i of guiches" [value]="i">Guichê {{ i }}</option>
        </select>
        <div *ngIf="guicheAtual === 0" class="invalid-feedback d-block">
          Selecione seu guichê para iniciar o atendimento.
        </div>
      </div>
      
      <div class="d-flex justify-content-center gap-3 mb-4">
        <button class="btn btn-primary btn-lg" (click)="gerar('normal')">Gerar Senha Normal</button>
        <button class="btn btn-warning text-white btn-lg" (click)="gerar('preferencial')">Gerar Senha Preferencial</button>
      </div>

      <div class="mb-4">
        <button 
          class="btn btn-success btn-lg me-2" 
          (click)="chamarProxima()" 
          [disabled]="guicheAtual === 0 || !!senhaChamando"
        >
          {{ !!senhaChamando ? 'Atendendo...' : 'Chamar Próxima Senha' }}
        </button>

        <button 
          *ngIf="senhaChamando" 
          class="btn btn-danger btn-lg" 
          (click)="atenderSenha()"
        >
          Finalizar Atendimento (Guichê {{ guicheAtual }})
        </button>
      </div>

      <div *ngIf="senhaChamando" class="alert alert-info p-5 mt-4 shadow-2xl animate-pulse-slow">
        <h1 class="text-6xl font-black">CHAMANDO: <strong>{{ senhaChamando.codigo }}</strong></h1>
        <h3 class="mt-3">
          Guichê: <strong class="text-danger">{{ senhaChamando.guiche }}</strong>
        </h3>
        <p class="text-muted mt-2">Pressione 'Finalizar Atendimento' quando concluir.</p>
      </div>

      <div class="card p-3 mt-5 shadow">
        <h4 class="text-start">Senhas Aguardando na Fila</h4>
        <table class="table table-striped table-hover mt-3">
          <thead class="table-dark">
            <tr>
              <th>Fila</th>
              <th>Senha</th>
              <th>Hora de Criação</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of senhas$ | async">
              <td>{{ s.tipo === 'preferencial' ? 'Preferencial 💛' : 'Normal' }}</td>
              <td><strong>{{ s.codigo }}</strong></td>
              <td>{{ s.hora }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!(senhas$ | async)?.length" class="text-muted mt-4">
        Nenhuma senha aguardando.
      </div>
    </div>
  `,
  styles: [`
    @keyframes pulse-slow {
      0%, 100% { background-color: #d1ecf1; }
      50% { background-color: #c0d7da; }
    }
    .animate-pulse-slow {
      animation: pulse-slow 3s infinite;
    }
  `]
})
export class AtendenteComponent implements OnInit {
  senhas$!: Observable<Senha[]>;
  senhaChamando: Senha | null = null;
  guicheAtual: number = 0;
  guiches: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private senhaService: SenhaService) {}

  ngOnInit() {
    this.senhas$ = this.senhaService.listarSenhasAguardando();
  }

  gerar(tipo: 'normal' | 'preferencial') {
    this.senhaService.gerarSenha(tipo);
  }

  async chamarProxima() {
    if (this.guicheAtual === 0 || this.senhaChamando) return;

    const proxima = await this.senhaService.proximaSenha();
    if (!proxima || !proxima.id) return;

    await this.senhaService.atualizarStatus(proxima.id, 'chamada', this.guicheAtual);
    this.senhaChamando = { ...proxima, guiche: this.guicheAtual, status: 'chamada' };

    this.tocarSomChamada();
  }

  async atenderSenha() {
    if (!this.senhaChamando || !this.senhaChamando.id) return;

    await this.senhaService.atualizarStatus(this.senhaChamando.id, 'atendida');
    this.senhaChamando = null;
  }

  tocarSomChamada() {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (err) {
      console.error('Erro ao gerar som:', err);
    }
  }
}
