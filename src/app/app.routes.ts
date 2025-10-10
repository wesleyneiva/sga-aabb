import { Routes } from '@angular/router';

// Lazy-loading (carregamento sob demanda) é a melhor prática para Standalone Components.
export const routes: Routes = [
  // 1. Rota para Geração de Senhas (página inicial ou de entrada)
  {
    path: '',
    loadComponent: () => import('./pages/totem/totem.component').then(m => m.TotemComponent),
    title: 'Gerar Senha'
  },
  // 2. Rota para o Painel de Exibição
  {
    path: 'painel',
    loadComponent: () => import('./pages/painel/painel.component').then(m => m.PainelComponent),
    title: 'Painel de Atendimento'
  },
  // 3. Rota para a Área do Atendente
  {
    path: 'atendente',
    loadComponent: () => import('./pages/atendente/atendente.component').then(m => m.AtendenteComponent),
    title: 'Área do Atendente'
  },
  // 4. Rota Coringa (redireciona qualquer URL não reconhecida para a página inicial)
  { path: '**', redirectTo: '' }
];
