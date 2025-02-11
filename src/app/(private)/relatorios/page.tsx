'use client';

import { useState } from 'react';
import Link from 'next/link';

const MESES = [
  { 
    nome: 'Janeiro', 
    abrev: 'Jan', 
    url: 'janeiro',
    icon: (
      <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <text x="8" y="16" className="text-xs font-medium" fill="currentColor">01</text>
      </svg>
    )
  },
  { 
    nome: 'Fevereiro', 
    abrev: 'Fev', 
    url: 'fevereiro',
    icon: (
      <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <text x="8" y="16" className="text-xs font-medium" fill="currentColor">02</text>
      </svg>
    )
  },
  { 
    nome: 'Março', 
    abrev: 'Mar', 
    url: 'marco',
    icon: (
      <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <text x="8" y="16" className="text-xs font-medium" fill="currentColor">03</text>
      </svg>
    )
  },
  { 
    nome: 'Abril', 
    abrev: 'Abr', 
    url: 'abril',
    icon: (
      <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <text x="8" y="16" className="text-xs font-medium" fill="currentColor">04</text>
      </svg>
    )
  },
  { 
    nome: 'Maio', 
    abrev: 'Mai', 
    url: 'maio',
    icon: (
      <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <text x="8" y="16" className="text-xs font-medium" fill="currentColor">05</text>
      </svg>
    )
  },
  { 
    nome: 'Junho', 
    abrev: 'Jun', 
    url: 'junho',
    icon: (
      <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <text x="8" y="16" className="text-xs font-medium" fill="currentColor">06</text>
      </svg>
    )
  },
  { 
    nome: 'Julho', 
    abrev: 'Jul', 
    url: 'julho',
    icon: (
      <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <text x="8" y="16" className="text-xs font-medium" fill="currentColor">07</text>
      </svg>
    )
  },
  { 
    nome: 'Agosto', 
    abrev: 'Ago', 
    url: 'agosto',
    icon: (
      <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <text x="8" y="16" className="text-xs font-medium" fill="currentColor">08</text>
      </svg>
    )
  },
  { 
    nome: 'Setembro', 
    abrev: 'Set', 
    url: 'setembro',
    icon: (
      <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <text x="8" y="16" className="text-xs font-medium" fill="currentColor">09</text>
      </svg>
    )
  },
  { 
    nome: 'Outubro', 
    abrev: 'Out', 
    url: 'outubro',
    icon: (
      <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <text x="8" y="16" className="text-xs font-medium" fill="currentColor">10</text>
      </svg>
    )
  },
  { 
    nome: 'Novembro', 
    abrev: 'Nov', 
    url: 'novembro',
    icon: (
      <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <text x="8" y="16" className="text-xs font-medium" fill="currentColor">11</text>
      </svg>
    )
  },
  { 
    nome: 'Dezembro', 
    abrev: 'Dez', 
    url: 'dezembro',
    icon: (
      <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <text x="8" y="16" className="text-xs font-medium" fill="currentColor">12</text>
      </svg>
    )
  }
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
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const anos = getAnos();

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-2xl p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Relatórios Financeiros</h1>
          <p className="text-emerald-50 text-lg">
            Acompanhe suas finanças mês a mês e tome decisões mais inteligentes
          </p>
          
          {/* Seletor de Ano */}
          <div className="mt-6 flex items-center space-x-4">
            <select
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(Number(e.target.value))}
              className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none"
            >
              {anos.map((ano) => (
                <option key={ano} value={ano} className="text-gray-900">
                  {ano} {ano === new Date().getFullYear() ? '(Atual)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Meses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MESES.map(({ nome, abrev, url, icon }) => (
          <Link
            key={nome}
            href={`/relatorios/${anoSelecionado}/${url}`}
            className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl 
                     transition-all duration-300 border border-gray-100 dark:border-gray-700 
                     transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 mb-2">
                  {nome}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {abrev} / {anoSelecionado}
                </p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full 
                            group-hover:bg-emerald-500 transition-colors duration-300">
                <svg 
                  className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:text-white" 
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
  );
} 