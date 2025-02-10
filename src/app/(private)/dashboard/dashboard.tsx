'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { ResumoAnual } from '@/app/(private)/componentes/resumos/ResumoAnual';
import { GraficoAnual } from '@/app/(private)/componentes/graficos/GraficoAnual';
import styles from './dashboard.module.css';

export function Dashboard() {
  const [totais, setTotais] = useState({
    entradas: 0,
    saidas: 0,
    saldo: 0
  });
  const [loading, setLoading] = useState(true);

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
      
      {/* Cards de Totais */}
      <div className={styles.statsGrid}>
        <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Entradas</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                R$ {totais.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-800/30 rounded-full">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-rose-50/50 dark:bg-rose-900/10 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Saídas</p>
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                R$ {totais.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-rose-100 dark:bg-rose-800/30 rounded-full">
              <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saldo Total</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                R$ {totais.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-800/30 rounded-full">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className={styles.chartsGrid}>
        <div className="bg-emerald-50/30 dark:bg-emerald-900/10 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className={styles.chartTitle}>Movimentações do Ano</h2>
            <select className={styles.periodSelect}>
              <option value="year">Último ano</option>
              <option value="semester">Último semestre</option>
              <option value="quarter">Último trimestre</option>
            </select>
          </div>
          <GraficoAnual />
        </div>
        
        <div className="bg-emerald-50/30 dark:bg-emerald-900/10 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className={styles.chartTitle}>Distribuição por Categoria</h2>
            <select className={styles.periodSelect}>
              <option value="month">Este mês</option>
              <option value="year">Este ano</option>
            </select>
          </div>
          {/* Adicionar gráfico de distribuição por categoria */}
        </div>
      </div>

      {/* Últimas Transações */}
      <div className="bg-emerald-50/30 dark:bg-emerald-900/10 p-6 rounded-xl shadow-sm mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className={styles.chartTitle}>Últimas Transações</h2>
          <button className={styles.viewAllButton}>
            Ver todas
          </button>
        </div>
        {/* Tabela de transações recentes */}
      </div>
    </div>
  );
} 