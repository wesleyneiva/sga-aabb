import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SenhaService, Senha } from '../../services/senha.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.scss']
  
})
export class PainelComponent implements OnInit {
  private senhaService = inject(SenhaService);

  historicoChamadas$!: Observable<Senha[]>;
  ultimaChamada$!: Observable<Senha | undefined>;

  ngOnInit() {
    this.historicoChamadas$ = this.senhaService.listarUltimasChamadas(5);

    this.ultimaChamada$ = this.historicoChamadas$.pipe(
      map(senhas => senhas.length > 0 ? senhas[0] : undefined)
    );
  }

  trackBySenhaId(index: number, senha: Senha): string | undefined {
    return senha.id;
  }
}
