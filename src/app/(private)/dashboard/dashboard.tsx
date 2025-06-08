'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { GraficoAnual } from '@/app/(private)/componentes/graficos/GraficoAnual';
import styles from './dashboard.module.css';
import { formatarMoeda } from '@/utils/formatarMoeda';
import { TodasCategorias } from './TodasCategorias';

interface Categoria {
  id: string;
  nome: string;
  cor: string;
}

interface DashboardData {
  categoriasMaisGastos: Array<{
    categoria: string;
    categoriaId: string;
    valor: number;
    cor: string;
  }>;
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    categoriasMaisGastos: []
  });
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<Record<string, Categoria>>({});
  const [totaisCategorias, setTotaisCategorias] = useState<{ [key: string]: number }>({});
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const anosDisponiveis = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    async function carregarDados() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Primeiro, carregar as categorias do usuário
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().categorias) {
          const categoriasArray = userDoc.data().categorias;
          const categoriasMap: Record<string, Categoria> = {};
          categoriasArray.forEach((cat: Categoria) => {
            categoriasMap[cat.id] = cat;
          });
          setCategorias(categoriasMap);
        }

        // Carregar transações do ano selecionado
        const qAno = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('ano', '==', anoSelecionado),
          where('status', '==', 'ativo')
        );

        const snapshotAno = await getDocs(qAno);

        // Processar dados do ano
        const categoriasGastos: { [key: string]: number } = {};

        snapshotAno.forEach((doc) => {
          const transacao = doc.data();
          categoriasGastos[transacao.categoria] = (categoriasGastos[transacao.categoria] || 0) + transacao.valor;
        });

        // Ordenar categorias por valor
        const categoriasMaisGastos = Object.entries(categoriasGastos)
          .map(([categoriaId, valor]) => ({
            categoriaId,
            categoria: categorias[categoriaId]?.nome || 'Categoria não encontrada',
            valor,
            cor: categorias[categoriaId]?.cor || '#gray'
          }))
          .sort((a, b) => b.valor - a.valor)
          .slice(0, 7);

        setData({
          categoriasMaisGastos
        });
        setTotaisCategorias(categoriasGastos);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [categorias, anoSelecionado]);

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
            Visão geral do ano de {anoSelecionado}
          </p>
        </div>
        {/* Seletor de Ano estilizado */}
        <div className="flex items-center gap-2 mt-4">
          <label htmlFor="ano-select" className="font-medium text-gray-800 dark:text-gray-100">Ano:</label>
          <select
            id="ano-select"
            value={anoSelecionado}
            onChange={e => setAnoSelecionado(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500"
          >
            {anosDisponiveis.map(ano => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Grid Principal */}
      <div className={styles.mainGrid}>
        {/* Coluna da Esquerda - Agora com width: 100% em telas menores */}
        <div className={styles.leftColumn}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>Evolução Anual</h2>
              <p className={styles.chartSubtitle}>Comparativo mensal de entradas e saídas</p>
            </div>
            <div className={styles.chartsContainer}>
              <GraficoAnual ano={anoSelecionado} />
            </div>
          </div>
        </div>

        {/* Coluna da Direita - Agora com width: 100% em telas menores */}
        <div className={styles.rightColumn}>
          <div className={styles.categoriesCard}>
            <h2 className={styles.cardTitle}>Top Categorias</h2>
            <div className={styles.categoriesList}>
              {data.categoriasMaisGastos.map((categoria, index) => (
                <div key={categoria.categoriaId} className={styles.categoryItem}>
                  <div className={styles.categoryRank}>{index + 1}</div>
                  <div className={styles.categoryInfo}>
                    <p className={styles.categoryName}>{categoria.categoria}</p>
                    <p className={styles.categoryValue}>{formatarMoeda(categoria.valor)}</p>
                  </div>
                  <div className={styles.categoryBar}>
                    <div 
                      className={styles.categoryProgress}
                      style={{ 
                        width: `${(categoria.valor / data.categoriasMaisGastos[0].valor) * 100}%`,
                        backgroundColor: categoria.cor
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* NOVO: Todas as Categorias */}
      <div style={{ marginTop: '2rem' }}>
        <TodasCategorias categorias={categorias} totais={totaisCategorias} />
      </div>
    </div>
  );
} 