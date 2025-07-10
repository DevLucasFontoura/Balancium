'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { formatarMoeda } from '@/utils/formatarMoeda';
import { formatarData } from '@/utils/formatarData';

interface ResumoFinanceiroProps {
  ano?: number;
  mes?: number;
}

interface DadosResumo {
  saldoAtual: number;
  entradas: number;
  saidas: number;
  metaMensal: number;
  economiaMesAnterior: number;
}

export function ResumoFinanceiro({ ano, mes }: ResumoFinanceiroProps) {
  const [dados, setDados] = useState<DadosResumo>({
    saldoAtual: 0,
    entradas: 0,
    saidas: 0,
    metaMensal: 0,
    economiaMesAnterior: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const anoAtual = ano || new Date().getFullYear();
        const mesAtual = mes || new Date().getMonth() + 1;

        // Carregar dados do mês atual
        const qMesAtual = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('ano', '==', anoAtual),
          where('mes', '==', mesAtual),
          where('status', '==', 'ativo')
        );

        const snapshotMesAtual = await getDocs(qMesAtual);
        let entradas = 0;
        let saidas = 0;

        snapshotMesAtual.forEach((doc) => {
          const transacao = doc.data();
          if (transacao.tipo === 'entrada') {
            entradas += Number(transacao.valor);
          } else {
            saidas += Number(transacao.valor);
          }
        });

        const saldoAtual = entradas - saidas;

        // Carregar dados do mês anterior para comparação
        const mesAnterior = mesAtual === 1 ? 12 : mesAtual - 1;
        const anoAnterior = mesAtual === 1 ? anoAtual - 1 : anoAtual;

        const qMesAnterior = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('ano', '==', anoAnterior),
          where('mes', '==', mesAnterior),
          where('status', '==', 'ativo')
        );

        const snapshotMesAnterior = await getDocs(qMesAnterior);
        let entradasAnterior = 0;
        let saidasAnterior = 0;

        snapshotMesAnterior.forEach((doc) => {
          const transacao = doc.data();
          if (transacao.tipo === 'entrada') {
            entradasAnterior += Number(transacao.valor);
          } else {
            saidasAnterior += Number(transacao.valor);
          }
        });

        const saldoAnterior = entradasAnterior - saidasAnterior;
        const economiaMesAnterior = saldoAtual - saldoAnterior;

        // Carregar meta mensal do usuário
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const metaMensal = userDoc.exists() ? userDoc.data().metaMensal || 0 : 0;

        setDados({
          saldoAtual,
          entradas,
          saidas,
          metaMensal,
          economiaMesAnterior
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [ano, mes]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const progressoMeta = dados.metaMensal > 0 ? (dados.saldoAtual / dados.metaMensal) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Saldo Atual */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-emerald-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saldo Atual</p>
            <p className={`text-2xl font-bold ${dados.saldoAtual >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatarMoeda(dados.saldoAtual)}
            </p>
          </div>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Entradas: {formatarMoeda(dados.entradas)} | Saídas: {formatarMoeda(dados.saidas)}
        </div>
      </div>

      {/* Meta Mensal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Meta Mensal</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatarMoeda(dados.metaMensal)}
            </p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progresso</span>
            <span>{Math.min(progressoMeta, 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${progressoMeta >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(progressoMeta, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Economia vs Mês Anterior */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">vs Mês Anterior</p>
            <p className={`text-2xl font-bold ${dados.economiaMesAnterior >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {dados.economiaMesAnterior >= 0 ? '+' : ''}{formatarMoeda(dados.economiaMesAnterior)}
            </p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {dados.economiaMesAnterior >= 0 ? 'Melhorou' : 'Piorou'} em relação ao mês anterior
        </div>
      </div>


    </div>
  );
} 