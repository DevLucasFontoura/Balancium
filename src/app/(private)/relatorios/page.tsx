'use client';

import { useState } from 'react';
import Link from 'next/link';

const MESES = [
  { nome: 'Janeiro', abrev: 'Jan' },
  { nome: 'Fevereiro', abrev: 'Fev' },
  { nome: 'Março', abrev: 'Mar' },
  { nome: 'Abril', abrev: 'Abr' },
  { nome: 'Maio', abrev: 'Mai' },
  { nome: 'Junho', abrev: 'Jun' },
  { nome: 'Julho', abrev: 'Jul' },
  { nome: 'Agosto', abrev: 'Ago' },
  { nome: 'Setembro', abrev: 'Set' },
  { nome: 'Outubro', abrev: 'Out' },
  { nome: 'Novembro', abrev: 'Nov' },
  { nome: 'Dezembro', abrev: 'Dez' }
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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios Financeiros</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Visualize seus relatórios mensais</p>
      </div>

      {/* Seletor de Ano */}
      <div className="mb-8 flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ano:</label>
        <select
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(Number(e.target.value))}
          className="form-select rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {anos.map((ano) => (
            <option key={ano} value={ano}>
              {ano} {ano === new Date().getFullYear() ? '(Atual)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Grid de Meses */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {MESES.map(({ nome, abrev }) => (
          <Link
            key={nome}
            href={`/relatorios/${anoSelecionado}/${nome.toLowerCase()}`}
            className="group relative bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600">
                    {nome}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {abrev} / {anoSelecionado}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-800/30 group-hover:bg-emerald-500">
                  <svg 
                    className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 