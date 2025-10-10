export type StatusSenha = 'aguardando' | 'chamada' | 'em_atendimento' | 'concluida';

export interface Senha {
  id?: string;
  numero: string;      // ex: 'F001'
  tipo: string;        // ex: 'Financeiro'
  status: StatusSenha;
  guiche?: number | null;
  createdAt?: any;     // Timestamp (serverTimestamp)
}
