'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ResumoMensal } from '@/app/(private)/componentes/resumos/ResumoMensal';
import { TabelaMensal } from '@/app/(private)/componentes/tabelas/TabelaMensal';

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function RelatorioMensal() {
  const params = useParams();
  const ano = parseInt(params.ano as string);
  const mes = parseInt(params.mes as string);
  const nomeMes = meses[mes - 1];

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/relatorios" className="text-emerald-600 hover:text-emerald-700 mb-4 inline-flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Relatório de {nomeMes} / {ano}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualize todas as transações e o resumo financeiro do mês
        </p>
      </div>

      <ResumoMensal mes={mes} ano={ano} />
      <TabelaMensal mes={nomeMes} ano={ano.toString()} />
    </div>
  );
} 