'use client';

import { useState } from 'react';
import Link from 'next/link';

const ANOS = [2024, 2023, 2022];
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function RelatoriosPage() {
  const [anoSelecionado, setAnoSelecionado] = useState<number | null>(null);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Relatórios</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ANOS.map((ano) => (
          <button
            key={ano}
            onClick={() => setAnoSelecionado(anoSelecionado === ano ? null : ano)}
            className={`p-4 rounded-lg text-left transition-colors ${
              anoSelecionado === ano 
                ? 'bg-primary text-white' 
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <h2 className="text-xl font-semibold">{ano}</h2>
          </button>
        ))}
      </div>

      {anoSelecionado && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {MESES.map((mes) => (
            <Link
              key={mes}
              href={`/relatorios/${anoSelecionado}/${mes.toLowerCase()}`}
              className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{mes}</span>
                <svg 
                  className="w-5 h-5 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 