import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SenhaService, Senha } from '../../services/senha.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-atendente',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container text-center mt-5">
      <h2 class="mb-4">👩‍💼 Atendente</h2>

      <div class="mb-4">
        <button class="btn btn-primary me-2" (click)="gerar('normal')">Gerar Senha Normal</button>
        <button class="btn btn-warning text-white" (click)="gerar('preferencial')">Gerar Senha Preferencial</button>
      </div>

      <div class="mb-4">
        <button class="btn btn-success" (click)="chamarProxima()">Chamar Próxima Senha</button>
      </div>

      <!-- Senha chamada em destaque -->
      <div *ngIf="senhaChamando" class="alert alert-info p-5 mt-4">
        <h1>SENHA: <strong>{{ senhaChamando.codigo }}</strong></h1>
        <h3>Tipo: {{ senhaChamando.tipo === 'normal' ? 'Normal' : 'Preferencial' }}</h3>
      </div>

      <!-- Tabela de senhas aguardando -->
      <table class="table table-bordered w-50 mx-auto mt-4" *ngIf="senhas$ | async as senhas">
        <thead class="table-info">
          <tr>
            <th>Tipo</th>
            <th>Senha</th>
            <th>Status</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of senhas">
            <td>{{ s.tipo }}</td>
            <td><strong>{{ s.codigo }}</strong></td>
            <td>{{ s.status }}</td>
            <td>{{ s.hora }}</td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!(senhas$ | async)?.length" class="text-muted mt-4">
        Nenhuma senha aguardando.
      </div>
    </div>
  `
})
export class AtendenteComponent implements OnInit {
  senhas$!: Observable<Senha[]>;
  senhaChamando: Senha | null = null;

  constructor(private senhaService: SenhaService) {}

  ngOnInit() {
    // Usamos listarSenhasAguardando, que não usa ordenação no Firestore para evitar índice
    this.senhas$ = this.senhaService.listarSenhasAguardando();
  }

  gerar(tipo: 'normal' | 'preferencial') {
    this.senhaService.gerarSenha(tipo);
  }

  async chamarProxima() {
    const proxima = await this.senhaService.proximaSenha();
    if (!proxima || !proxima.id) return;

    await this.senhaService.atualizarStatus(proxima.id, 'chamada');

    // Mostra na tela grande
    this.senhaChamando = proxima;

    // Toca som - AGORA COM GERAÇÃO NATIVA DE ÁUDIO
    this.tocarSomChamada();
  }

  // 💡 NOVO MÉTODO: Gera um som de "beep" usando a Web Audio API
  tocarSomChamada() {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.warn('Web Audio API não suportada. O som de chamada não funcionará.');
        return;
      }

      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine'; // Onda suave
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // Frequência alta (A5)

      // Configura o volume: 0 -> 0.5 -> 0 (beep rápido)
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.01); 
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5); 

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5); // Toca por 0.5 segundos
    } catch (err) {
      // Se der erro aqui, é um problema mais sério de permissão do navegador
      console.error('Erro ao gerar som com Web Audio API:', err);
    }
  }
}
