'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import styles from './home.module.css';

interface ResumoFinanceiro {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  ultimasTransacoes: any[];
}

export function Home() {
  const [userName, setUserName] = useState<string>('');
  const [resumo, setResumo] = useState<ResumoFinanceiro>({
    totalEntradas: 0,
    totalSaidas: 0,
    saldo: 0,
    ultimasTransacoes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.displayName) {
      setUserName(user.displayName);
    } else if (user?.email) {
      // Se não tiver nome, usa a parte antes do @ do email
      setUserName(user.email.split('@')[0]);
    }

    async function carregarResumo() {
      if (!user) return;

      try {
        const hoje = new Date();
        const mesAtual = hoje.getMonth() + 1;
        const anoAtual = hoje.getFullYear();

        const q = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('mes', '==', mesAtual),
          where('ano', '==', anoAtual),
          where('status', '==', 'ativo')
        );

        const querySnapshot = await getDocs(q);
        let entradas = 0;
        let saidas = 0;
        const transacoes = [];

        querySnapshot.forEach((doc) => {
          const transacao = doc.data();
          if (transacao.tipo === 'entrada') {
            entradas += transacao.valor;
          } else {
            saidas += transacao.valor;
          }
          transacoes.push({ id: doc.id, ...transacao });
        });

        setResumo({
          totalEntradas: entradas,
          totalSaidas: saidas,
          saldo: entradas - saidas,
          ultimasTransacoes: transacoes.slice(0, 3)
        });
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar resumo:', error);
        setLoading(false);
      }
    }

    carregarResumo();
  }, []);

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Seção de Boas-vindas */}
      <section className={styles.welcomeHero}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>
            Olá, {userName}! 👋
          </h1>
          <p className={styles.welcomeMessage}>
            Que bom ter você de volta! Vamos organizar suas finanças?
          </p>
        </div>
        <div className={styles.quickStats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Saldo do Mês</span>
            <span className={`${styles.statValue} ${resumo.saldo >= 0 ? styles.positive : styles.negative}`}>
              {formatarMoeda(resumo.saldo)}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Entradas</span>
            <span className={`${styles.statValue} ${styles.positive}`}>
              {formatarMoeda(resumo.totalEntradas)}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Saídas</span>
            <span className={`${styles.statValue} ${styles.negative}`}>
              {formatarMoeda(resumo.totalSaidas)}
            </span>
          </div>
        </div>
      </section>

      {/* Seção de Ações Rápidas */}
      <section className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Ações Rápidas</h2>
        <div className={styles.actionsGrid}>
          <Link href="/nova-transacao">
            <div className={`${styles.actionCard} ${styles.primaryAction}`}>
              <div className={styles.actionIcon}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className={styles.actionTitle}>Nova Transação</h3>
              <p className={styles.actionDescription}>
                Registre rapidamente suas receitas e despesas
              </p>
            </div>
          </Link>

          <Link href="/dashboard">
            <div className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className={styles.actionTitle}>Dashboard</h3>
              <p className={styles.actionDescription}>
                Visualize seus relatórios e análises
              </p>
            </div>
          </Link>

          <Link href="/previsao-financeira">
            <div className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className={styles.actionTitle}>Previsão Financeira</h3>
              <p className={styles.actionDescription}>
                Planeje seu futuro financeiro
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Seção de Últimas Transações */}
      <section className={styles.recentTransactions}>
        <h2 className={styles.sectionTitle}>Últimas Transações</h2>
        <div className={styles.transactionsList}>
          {resumo.ultimasTransacoes.map((transacao) => (
            <div key={transacao.id} className={styles.transactionCard}>
              <div className={styles.transactionInfo}>
                <span className={styles.transactionDescription}>{transacao.descricao}</span>
                <span className={styles.transactionCategory}>{transacao.categoria}</span>
              </div>
              <span className={`${styles.transactionValue} ${
                transacao.tipo === 'entrada' ? styles.positive : styles.negative
              }`}>
                {transacao.tipo === 'entrada' ? '+' : '-'} {formatarMoeda(transacao.valor)}
              </span>
            </div>
          ))}
          <Link href="/relatorios" className={styles.viewAllLink}>
            Ver todas as transações →
          </Link>
        </div>
      </section>

      {/* Seção de Dicas */}
      <section className={styles.tipsSection}>
        <h2 className={styles.sectionTitle}>Dicas para Você</h2>
        <div className={styles.tipsGrid}>
          <div className={styles.tipCard}>
            <div className={styles.tipIcon}>💡</div>
            <h3 className={styles.tipTitle}>Sabia que?</h3>
            <p className={styles.tipDescription}>
              Definir metas financeiras aumenta em 42% suas chances de sucesso financeiro.
            </p>
          </div>
          <div className={styles.tipCard}>
            <div className={styles.tipIcon}>📊</div>
            <h3 className={styles.tipTitle}>Análise Personalizada</h3>
            <p className={styles.tipDescription}>
              Confira seu dashboard para insights personalizados sobre seus gastos.
            </p>
          </div>
          <div className={styles.tipCard}>
            <div className={styles.tipIcon}>🎯</div>
            <h3 className={styles.tipTitle}>Próximo Objetivo</h3>
            <p className={styles.tipDescription}>
              Configure suas metas financeiras e acompanhe seu progresso.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 