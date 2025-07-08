'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ResumoMensal } from '@/app/(private)/componentes/resumos/ResumoMensal';
import { TabelaMensal } from '@/app/(private)/componentes/tabelas/TabelaMensal';
import { Tooltip } from 'react-tooltip';

const meses = [
  'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
] as const;

type Mes = typeof meses[number];

const nomesMeses: Record<Mes, string> = {
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

interface RelatorioMensalClientProps {
  ano: number;
  mes: string;
}

export function RelatorioMensalClient({ ano, mes }: RelatorioMensalClientProps) {
  const mesNormalizado = mes.toLowerCase() as Mes;
  const mesIndex = meses.findIndex(m => m === mesNormalizado) + 1;
  const [atualizacaoContador, setAtualizacaoContador] = useState(0);

  const handleTransacoesChange = () => {
    setAtualizacaoContador(prev => prev + 1);
  };

  if (mesIndex <= 0) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <Link href="/relatorios" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Relatórios
        </Link>
        <div className="mt-8 text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Mês não encontrado</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">O mês solicitado não está disponível.</p>
        </div>
      </div>
    );
  }

  const nomeMes = nomesMeses[mesNormalizado];

  // Navegação entre meses
  const anosDisponiveis = [2024, 2025]; // ajuste conforme necessário
  const mesAtualIdx = meses.findIndex(m => m === mesNormalizado);
  let prevMes = mesAtualIdx - 1;
  let nextMes = mesAtualIdx + 1;
  let prevAno = ano;
  let nextAno = ano;

  if (prevMes < 0) {
    prevMes = 11;
    prevAno = ano - 1;
  }
  if (nextMes > 11) {
    nextMes = 0;
    nextAno = ano + 1;
  }

  const podeIrParaAnterior = anosDisponiveis.includes(prevAno);
  const podeIrParaProximo = anosDisponiveis.includes(nextAno);

  const prevMesNome = meses[prevMes];
  const nextMesNome = meses[nextMes];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Header com Gradiente */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-2xl p-8 text-white shadow-xl relative">
        <Link 
          href="/relatorios" 
          className="inline-flex items-center text-white/90 hover:text-white transition-colors mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Relatórios
        </Link>
        
        {/* Navegação centralizada responsiva */}
        {/* Desktop: tudo em uma linha só */}
        <div className="hidden sm:flex items-center justify-center w-full mt-2">
          {/* Seta esquerda */}
          <Link
            href={podeIrParaAnterior ? `/relatorios/${prevAno}/${prevMesNome}` : '#'}
            className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition text-white ${!podeIrParaAnterior ? 'opacity-30 pointer-events-none' : ''}`}
            aria-label={`Ir para ${nomesMeses[prevMesNome]} / ${prevAno}`}
            data-tooltip-id="tooltip-prev"
            data-tooltip-content={`Ir para ${nomesMeses[prevMesNome]} / ${prevAno}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <Tooltip id="tooltip-prev" />

          {/* Título em uma linha só */}
          <h1 className="text-3xl font-bold mb-0 text-center px-4 whitespace-nowrap">
            Relatório de {nomeMes} / {ano}
          </h1>

          {/* Seta direita */}
          <Link
            href={podeIrParaProximo ? `/relatorios/${nextAno}/${nextMesNome}` : '#'}
            className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition text-white ${!podeIrParaProximo ? 'opacity-30 pointer-events-none' : ''}`}
            aria-label={`Ir para ${nomesMeses[nextMesNome]} / ${nextAno}`}
            data-tooltip-id="tooltip-next"
            data-tooltip-content={`Ir para ${nomesMeses[nextMesNome]} / ${nextAno}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Tooltip id="tooltip-next" />
        </div>

        {/* Mobile: título em duas linhas, setas ao lado */}
        <div className="flex sm:hidden items-center justify-center w-full mt-2">
          {/* Seta esquerda */}
          <Link
            href={podeIrParaAnterior ? `/relatorios/${prevAno}/${prevMesNome}` : '#'}
            className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition text-white ${!podeIrParaAnterior ? 'opacity-30 pointer-events-none' : ''}`}
            aria-label={`Ir para ${nomesMeses[prevMesNome]} / ${prevAno}`}
            data-tooltip-id="tooltip-prev-mobile"
            data-tooltip-content={`Ir para ${nomesMeses[prevMesNome]} / ${prevAno}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <Tooltip id="tooltip-prev-mobile" />

          {/* Título em duas linhas */}
          <div className="flex flex-col items-center justify-center px-2">
            <span className="text-lg font-bold leading-tight">Relatório de</span>
            <span className="text-xl font-bold leading-tight">{nomeMes} / {ano}</span>
          </div>

          {/* Seta direita */}
          <Link
            href={podeIrParaProximo ? `/relatorios/${nextAno}/${nextMesNome}` : '#'}
            className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition text-white ${!podeIrParaProximo ? 'opacity-30 pointer-events-none' : ''}`}
            aria-label={`Ir para ${nomesMeses[nextMesNome]} / ${nextAno}`}
            data-tooltip-id="tooltip-next-mobile"
            data-tooltip-content={`Ir para ${nomesMeses[nextMesNome]} / ${nextAno}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Tooltip id="tooltip-next-mobile" />
        </div>

        <div className="hidden sm:block absolute top-8 right-8">
          <svg className="w-16 h-16 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="space-y-8">
        <ResumoMensal 
          mes={mesIndex} 
          ano={ano} 
          key={`resumo-${atualizacaoContador}`}
        />
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Transações do Mês
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Lista completa de todas as transações realizadas em {nomeMes}
            </p>
          </div>
          
          <TabelaMensal 
            mes={mesIndex} 
            ano={ano} 
            onTransacoesChange={handleTransacoesChange} 
          />
        </div>
      </div>
    </div>
  );
} 