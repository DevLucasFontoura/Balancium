export type TipoTransacao = 'entrada' | 'saida';

export interface Transacao {
  id: string;
  mes: string;
  ano: number;
  tipo: TipoTransacao;
  descricao: string;
  valor: number;
  data: string;
}

export interface ResumoMensal {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
}

export interface ResumoAnual extends ResumoMensal {
  transacoesPorMes: {
    [mes: string]: ResumoMensal;
  };
} 