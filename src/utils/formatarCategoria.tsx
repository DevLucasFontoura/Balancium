import React from 'react';

interface CategoriaConfig {
  nome: string;
  icone: React.ReactNode;
  cor: string;
}

const IconeSalario = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const IconeInvestimentos = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const IconeAlimentacao = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const IconeTransporte = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const IconeMoradia = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const IconeLazer = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconeCartaoCredito = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const IconeSaude = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const IconeEducacao = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const IconeOutros = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
  </svg>
);

const categoriasConfig: Record<string, CategoriaConfig> = {
  salario: {
    nome: 'Salário',
    icone: <IconeSalario />,
    cor: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30'
  },
  investimentos: {
    nome: 'Investimentos',
    icone: <IconeInvestimentos />,
    cor: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
  },
  alimentacao: {
    nome: 'Alimentação',
    icone: <IconeAlimentacao />,
    cor: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30'
  },
  transporte: {
    nome: 'Transporte',
    icone: <IconeTransporte />,
    cor: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
  },
  moradia: {
    nome: 'Moradia',
    icone: <IconeMoradia />,
    cor: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30'
  },
  lazer: {
    nome: 'Lazer',
    icone: <IconeLazer />,
    cor: 'text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/30'
  },
  cartao_credito: {
    nome: 'Cartão de Crédito',
    icone: <IconeCartaoCredito />,
    cor: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30'
  },
  saude: {
    nome: 'Saúde',
    icone: <IconeSaude />,
    cor: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
  },
  educacao: {
    nome: 'Educação',
    icone: <IconeEducacao />,
    cor: 'text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-900/30'
  },
  outros: {
    nome: 'Outros',
    icone: <IconeOutros />,
    cor: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
  }
};

export function formatarCategoria(categoria: string) {
  const config = categoriasConfig[categoria] || categoriasConfig.outros;
  return config;
} 