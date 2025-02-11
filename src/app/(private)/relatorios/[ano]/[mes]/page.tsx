'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ResumoMensal } from '@/app/(private)/componentes/resumos/ResumoMensal';
import { TabelaMensal } from '@/app/(private)/componentes/tabelas/TabelaMensal';

const meses = [
  'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

// Mapeamento para nomes de exibição
const nomesMeses = {
  'janeiro': 'Janeiro',
  'fevereiro': 'Fevereiro',
  'marco': 'Março',
  'abril': 'Abril',
  'maio': 'Maio',
  'junho': 'Junho',
  'julho': 'Julho',
  'agosto': 'Agosto',
  'setembro': 'Setembro',
  'outubro': 'Outubro',
  'novembro': 'Novembro',
  'dezembro': 'Dezembro'
};

export default function RelatorioMensal() {
  const params = useParams();
  const ano = parseInt(params.ano as string);
  
  const mesNormalizado = (params.mes as string).toLowerCase();
  const mesIndex = meses.findIndex(m => m === mesNormalizado) + 1;
  
  // Adicione este estado para forçar atualizações
  const [atualizacaoContador, setAtualizacaoContador] = useState(0);

  // Função para forçar atualização dos componentes
  const handleTransacoesChange = () => {
    setAtualizacaoContador(prev => prev + 1);
  };

  if (mesIndex <= 0) {
    return (
      <div className="p-8">
        <Link href="/relatorios" className="text-emerald-600 hover:text-emerald-700 mb-4 inline-flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mês não encontrado
        </h1>
      </div>
    );
  }

  // Usar o mapeamento para obter o nome correto de exibição
  const nomeMes = nomesMeses[mesNormalizado];

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

      <ResumoMensal 
        mes={mesIndex} 
        ano={ano} 
        key={`resumo-${atualizacaoContador}`} // Força re-render
      />
      <TabelaMensal 
        mes={mesIndex} 
        ano={ano} 
        onTransacoesChange={handleTransacoesChange} 
      />

      {/* Para debug */}
      <div className="text-sm text-gray-500 mt-4">
        Debug: Mês: {mesIndex}, Ano: {ano}
      </div>
    </div>
  );
} 