'use client';

import Link from 'next/link';
import styles from './bem-vindo.module.css';

export default function BemVindo() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-16 pb-12 md:pt-24 md:pb-20 text-center md:text-left">
            {/* Texto Principal */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Controle suas finanças com{' '}
              <span className="text-emerald-500">
                simplicidade e eficiência
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto md:mx-0">
              Organize suas receitas e despesas de forma inteligente. 
              Tome decisões financeiras com confiança.
            </p>

            {/* Botões de Ação */}
            <div className="flex flex-col md:flex-row gap-4 max-w-sm mx-auto md:mx-0">
              <Link
                href="/registro"
                className="w-full md:w-auto px-8 py-3 text-center font-medium rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                Começar Grátis
              </Link>
              <Link
                href="/recursos"
                className="w-full md:w-auto px-8 py-3 text-center font-medium rounded-lg border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                Saiba Mais
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Controle Total</h3>
              <p className="text-gray-600">
                Acompanhe suas finanças em tempo real com uma interface intuitiva.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Análises Detalhadas</h3>
              <p className="text-gray-600">
                Visualize seus gastos e ganhos com gráficos e relatórios claros.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Planejamento Futuro</h3>
              <p className="text-gray-600">
                Defina metas e acompanhe seu progresso financeiro ao longo do tempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-500 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-emerald-50 mb-8">
            Junte-se a milhares de pessoas que já estão controlando melhor suas finanças.
          </p>
          <Link
            href="/registro"
            className="inline-block px-8 py-3 bg-white text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Criar Conta Gratuita
          </Link>
        </div>
      </section>
    </div>
  );
} 