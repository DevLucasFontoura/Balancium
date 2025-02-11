'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { formatarMoeda } from '@/utils/formatarMoeda';

interface ResumoMensalProps {
  mes: number;
  ano: number;
}

export function ResumoMensal({ mes, ano }: ResumoMensalProps) {
  const [resumo, setResumo] = useState({
    totalEntradas: 0,
    totalSaidas: 0,
    saldo: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarResumo() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('mes', '==', mes),
          where('ano', '==', ano),
          where('status', '==', 'ativo')
        );

        const querySnapshot = await getDocs(q);
        let totalEntradas = 0;
        let totalSaidas = 0;

        querySnapshot.forEach((doc) => {
          const transacao = doc.data();
          if (transacao.tipo === 'entrada') {
            totalEntradas += transacao.valor;
          } else {
            totalSaidas += transacao.valor;
          }
        });

        setResumo({
          totalEntradas,
          totalSaidas,
          saldo: totalEntradas - totalSaidas
        });
      } catch (error) {
        console.error('Erro ao carregar resumo:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarResumo();
  }, [mes, ano]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl p-6 h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                Entradas
              </h3>
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatarMoeda(resumo.totalEntradas)}
          </p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/10 px-6 py-3">
          <div className="text-sm text-emerald-600 dark:text-emerald-400">
            Total de receitas no mês
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <h3 className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                Saídas
              </h3>
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {formatarMoeda(resumo.totalSaidas)}
          </p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-900/10 px-6 py-3">
          <div className="text-sm text-rose-600 dark:text-rose-400">
            Total de despesas no mês
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                Saldo
              </h3>
            </div>
          </div>
          <p className={`text-2xl font-bold ${
            resumo.saldo >= 0 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-rose-600 dark:text-rose-400'
          }`}>
            {formatarMoeda(resumo.saldo)}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/10 px-6 py-3">
          <div className="text-sm text-blue-600 dark:text-blue-400">
            Balanço final do mês
          </div>
        </div>
      </div>
    </div>
  );
} 