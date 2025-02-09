'use client';

import { useState } from 'react';
import Link from 'next/link';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function getAnos() {
  const anoAtual = new Date().getFullYear();
  const anoInicial = 2010;
  const anos = [];
  
  for (let ano = anoAtual; ano >= anoInicial; ano--) {
    anos.push(ano);
  }
  
  return anos;
}

export default function RelatoriosPage() {
  const [anoSelecionado, setAnoSelecionado] = useState<number | null>(null);
  const anos = getAnos();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios Financeiros</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Selecione o ano e mês para visualizar os relatórios detalhados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {anos.map((ano) => (
          <button
            key={ano}
            onClick={() => setAnoSelecionado(anoSelecionado === ano ? null : ano)}
            className={`relative p-6 rounded-xl transition-all duration-200 ${
              anoSelecionado === ano 
                ? 'bg-primary shadow-lg shadow-primary/30 text-white transform scale-105' 
                : 'bg-white dark:bg-gray-800 hover:shadow-lg hover:transform hover:scale-102'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{ano}</h2>
                <p className={`mt-1 text-sm ${anoSelecionado === ano ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                  {ano === new Date().getFullYear() ? 'Ano Atual' : 'Relatório Anual'}
                </p>
              </div>
              <div className={`p-3 rounded-full ${anoSelecionado === ano ? 'bg-white/20' : 'bg-primary/10'}`}>
                <svg 
                  className={`w-6 h-6 ${anoSelecionado === ano ? 'text-white' : 'text-primary'}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {anoSelecionado && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Selecione o Mês
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MESES.map((mes) => (
              <Link
                key={mes}
                href={`/relatorios/${anoSelecionado}/${mes.toLowerCase()}`}
                className="group p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all duration-200 hover:transform hover:scale-102"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary">{mes}</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ver relatório</p>
                  </div>
                  <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white">
                    <svg 
                      className="w-4 h-4 text-primary group-hover:text-white" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 