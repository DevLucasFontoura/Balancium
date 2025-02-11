'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { GraficoDistribuicao } from '@/app/(private)/componentes/graficos/GraficoDistribuicao';
import styles from './dashboard.module.css';

export function Dashboard() {
  const [totais, setTotais] = useState({
    entradas: 0,
    saidas: 0,
    saldo: 0
  });
  const [loading, setLoading] = useState(true);
  const [periodoDistribuicao, setPeriodoDistribuicao] = useState<'month' | 'year'>('month');

  useEffect(() => {
    async function carregarTotais() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const anoAtual = new Date().getFullYear();
        const mesAtual = new Date().getMonth() + 1;
        
        // Busca transações do mês atual
        const q = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('ano', '==', anoAtual),
          where('mes', '==', mesAtual)
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

        setTotais({
          entradas: totalEntradas,
          saidas: totalSaidas,
          saldo: totalEntradas - totalSaidas
        });
      } catch (error) {
        console.error('Erro ao carregar totais:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarTotais();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Painel de Controle</h1>
        <p className={styles.subtitle}>Acompanhe seus resultados financeiros</p>
      </div>

      <div className={styles.statsGrid}>
        {/* Card de Entradas */}
        <div className={`${styles.statCard} bg-emerald-50 dark:bg-emerald-900/20`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={styles.statLabel}>Total Entradas</p>
              <p className={styles.statValue + ' text-emerald-600 dark:text-emerald-400'}>
                R$ {totais.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`${styles.iconContainer} bg-emerald-100 dark:bg-emerald-800/30`}>
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card de Saídas */}
        <div className={`${styles.statCard} bg-red-50 dark:bg-red-900/20`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={styles.statLabel}>Total Saídas</p>
              <p className={styles.statValue + ' text-red-600 dark:text-red-400'}>
                R$ {totais.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`${styles.iconContainer} bg-red-100 dark:bg-red-800/30`}>
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card de Saldo */}
        <div className={`${styles.statCard} bg-blue-50 dark:bg-blue-900/20`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={styles.statLabel}>Saldo Total</p>
              <p className={styles.statValue + ' text-blue-600 dark:text-blue-400'}>
                R$ {totais.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`${styles.iconContainer} bg-blue-100 dark:bg-blue-800/30`}>
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>Distribuição por Categoria</h2>
          <select 
            className={styles.periodSelect}
            value={periodoDistribuicao}
            onChange={(e) => setPeriodoDistribuicao(e.target.value as 'month' | 'year')}
          >
            <option value="month">Este mês</option>
            <option value="year">Este ano</option>
          </select>
        </div>
        <GraficoDistribuicao periodo={periodoDistribuicao} />
      </div>
    </div>
  );
} 