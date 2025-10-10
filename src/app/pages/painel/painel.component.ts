import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SenhaService, Senha } from '../../services/senha.service';
import { Observable, map } from 'rxjs'; // 💡 Importado o map para o destaque

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid p-5" style="background-color: #1a1a2e; color: white; min-height: 100vh; font-family: 'Inter', sans-serif;">
      
      <!-- Título Principal -->
      <h1 class="text-center display-4 mb-4 fw-bold text-warning">PAINEL DE ATENDIMENTO</h1>

      <!-- Seção da Senha em Destaque (ÚLTIMA CHAMADA) -->
      <ng-container *ngIf="ultimaChamada$ | async as ultima">
        <div class="row justify-content-center mb-5">
          <div class="col-md-8 col-lg-6">
            <div class="card p-5 shadow-lg rounded-3 border border-5 border-success" 
                 style="background-color: #383852; transition: transform 0.3s ease;">
              <p class="h5 mb-2 text-info">AGORA</p>
              
              <!-- Senha GRANDE (Display-1 e tamanho responsivo) -->
              <h1 class="display-1 fw-bold mb-3" style="font-size: 8vw; color: #4CAF50;">{{ ultima.codigo }}</h1>
              
              <!-- Guichê (Dica: No futuro, você pode adicionar a coluna 'guiche' no Firestore!) -->
              <p class="h3 fw-normal text-light">
                GUICHÊ: {{ ultima.tipo === 'preferencial' ? 'PREFERENCIAL' : '01' }}
              </p>
            </div>
          </div>
        </div>
      </ng-container>

      <hr style="border-color: #383852;">

      <!-- Histórico das Chamadas (ÚLTIMAS 4) -->
      <h2 class="text-center h4 mb-3 text-white-50 mt-4">ÚLTIMAS CHAMADAS</h2>
      <div class="row justify-content-center">
        <div class="col-md-6">
          <table class="table table-dark table-striped table-hover table-bordered text-center rounded-3">
            <thead class="table-info text-dark">
              <tr>
                <th class="h5">SENHA</th>
                <th class="h5">TIPO</th>
                <th class="h5">HORA</th>
              </tr>
            </thead>
            <tbody>
              <!-- O histórico começa do segundo item, pois o primeiro está em destaque -->
              <tr *ngFor="let s of historicoChamadas$ | async; let i = index">
                <!-- Se quiser remover a mais recente da lista, use *ngIf="i > 0" -->
                <td class="h5 fw-bold" [class.text-warning]="s.tipo === 'preferencial'">{{ s.codigo }}</td>
                <td>{{ s.tipo | uppercase }}</td>
                <td>{{ s.hora }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="!(historicoChamadas$ | async)?.length" class="text-muted mt-4">
        Nenhuma senha chamada ainda.
      </div>
    </div>
  `,
  styles: [`
    .display-1 { animation: pulse 1s infinite alternate; }
    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(1.01); opacity: 0.98; }
    }
    .card {
      box-shadow: 0 0 30px rgba(76, 175, 80, 0.5) !important; /* Brilho verde para destaque */
    }
    @media (max-width: 768px) {
      .display-1 { font-size: 15vw !important; }
    }
  `]
})
export class PainelComponent implements OnInit {
  historicoChamadas$!: Observable<Senha[]>;
  ultimaChamada$!: Observable<Senha | null>;

  constructor(private senhaService: SenhaService) {}

  ngOnInit() {
    // Busca as últimas 5 chamadas (a mais recente será a primeira)
    this.historicoChamadas$ = this.senhaService.listarUltimasChamadas(5);
    
    // Pega a primeira senha do histórico para exibição em destaque
    this.ultimaChamada$ = this.historicoChamadas$.pipe(
        // O operador map garante que o 'ultimaChamada$' só pegue o primeiro elemento da lista
        map(senhas => senhas.length > 0 ? senhas[0] : null)
    );
  }
}
