'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { GraficoAnual } from '@/app/(private)/componentes/graficos/GraficoAnual';
import { GraficoBarrasEmpilhadas } from '@/app/(private)/componentes/graficos/GraficoBarrasEmpilhadas';
import styles from './dashboard.module.css';
import { formatarMoeda } from '@/utils/formatarMoeda';

interface DashboardData {
  categoriasMaisGastos: Array<{
    categoria: string;
    valor: number;
  }>;
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    categoriasMaisGastos: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const anoAtual = new Date().getFullYear();
        const mesAtual = new Date().getMonth() + 1;
        
        // Carregar dados do ano
        const qAno = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('ano', '==', anoAtual),
          where('status', '==', 'ativo')
        );

        const snapshotAno = await getDocs(qAno);

        // Processar dados do ano
        const categorias: { [key: string]: number } = {};

        snapshotAno.forEach((doc) => {
          const transacao = doc.data();
          categorias[transacao.categoria] = (categorias[transacao.categoria] || 0) + transacao.valor;
        });

        // Ordenar categorias por valor
        const categoriasMaisGastos = Object.entries(categorias)
          .map(([categoria, valor]) => ({ categoria, valor }))
          .sort((a, b) => b.valor - a.valor)
          .slice(0, 5);

        setData({
          categoriasMaisGastos
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Seção Hero */}
      <section className={styles.welcomeHero}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>
            Dashboard
          </h1>
          <p className={styles.welcomeMessage}>
            Visão geral do ano de {new Date().getFullYear()}
          </p>
        </div>
      </section>

      {/* Grid Principal */}
      <div className={styles.mainGrid}>
        {/* Coluna da Esquerda */}
        <div className={styles.leftColumn}>
          {/* Gráfico Anual */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>Evolução Anual</h2>
              <p className={styles.chartSubtitle}>Comparativo mensal de entradas e saídas</p>
            </div>
            <GraficoAnual />
          </div>

          {/* Gráfico de Barras Empilhadas */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>Composição dos Gastos</h2>
              <p className={styles.chartSubtitle}>Distribuição mensal por categoria</p>
            </div>
            <GraficoBarrasEmpilhadas />
          </div>
        </div>

        {/* Coluna da Direita */}
        <div className={styles.rightColumn}>
          {/* Top Categorias */}
          <div className={styles.categoriesCard}>
            <h2 className={styles.cardTitle}>Top Categorias</h2>
            <div className={styles.categoriesList}>
              {data.categoriasMaisGastos.map((categoria, index) => (
                <div key={categoria.categoria} className={styles.categoryItem}>
                  <div className={styles.categoryRank}>{index + 1}</div>
                  <div className={styles.categoryInfo}>
                    <p className={styles.categoryName}>{categoria.categoria}</p>
                    <p className={styles.categoryValue}>{formatarMoeda(categoria.valor)}</p>
                  </div>
                  <div className={styles.categoryBar}>
                    <div 
                      className={styles.categoryProgress}
                      style={{ 
                        width: `${(categoria.valor / data.categoriasMaisGastos[0].valor) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 