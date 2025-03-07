'use client';

import { useSubscription } from '@/contexts/SubscriptionContext';
import { PRO_FEATURES } from '@/types/subscription';

export default function UpgradePage() {
  const { subscription } = useSubscription();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Upgrade para Pro
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Desbloqueie recursos exclusivos e melhore sua experiência
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Plano Gratuito */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Plano Gratuito</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Recursos básicos para gerenciar suas finanças
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 text-gray-700 dark:text-gray-300">Adicionar transações</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 text-gray-700 dark:text-gray-300">Visualizar saldo</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 text-gray-700 dark:text-gray-300">Categorias básicas</span>
              </li>
            </ul>
            <div className="mt-8">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">R$ 0</span>
              <span className="text-gray-600 dark:text-gray-400">/mês</span>
            </div>
            <button
              className="mt-8 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              disabled
            >
              Plano Atual
            </button>
          </div>

          {/* Plano Pro */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-emerald-500">
            <div className="absolute top-0 right-0 -mt-4 -mr-4">
              <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                RECOMENDADO
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Plano Pro</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Recursos avançados para um controle financeiro completo
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 text-gray-700 dark:text-gray-300">Dashboard completo</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 text-gray-700 dark:text-gray-300">Edição de transações</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 text-gray-700 dark:text-gray-300">Gerenciamento de categorias</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 text-gray-700 dark:text-gray-300">Exportação de dados</span>
              </li>
            </ul>
            <div className="mt-8">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">R$ 9,90</span>
              <span className="text-gray-600 dark:text-gray-400">/mês</span>
            </div>
            <button
              className="mt-8 w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
              onClick={() => {
                // TODO: Implementar integração com sistema de pagamentos
                console.log('Upgrade to pro');
              }}
            >
              Fazer Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 