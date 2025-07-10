'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { GraficoAnual } from '@/app/(private)/componentes/graficos/GraficoAnual';
import { GraficoBarras } from '@/app/(private)/componentes/graficos/GraficoBarras';
import { ResumoFinanceiro } from '@/app/(private)/componentes/resumos/ResumoFinanceiro';
import styles from './dashboard.module.css';

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
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);
  const [periodoGrafico, setPeriodoGrafico] = useState<'mes' | 'ano'>('mes');
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
        {/* Seletor de Ano e Mês estilizado */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-2">
            <label htmlFor="mes-select" className="font-medium text-gray-800 dark:text-gray-100">Mês:</label>
            <select
              id="mes-select"
              value={mesSelecionado}
              onChange={e => setMesSelecionado(Number(e.target.value))}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500"
            >
              <option value={1}>Janeiro</option>
              <option value={2}>Fevereiro</option>
              <option value={3}>Março</option>
              <option value={4}>Abril</option>
              <option value={5}>Maio</option>
              <option value={6}>Junho</option>
              <option value={7}>Julho</option>
              <option value={8}>Agosto</option>
              <option value={9}>Setembro</option>
              <option value={10}>Outubro</option>
              <option value={11}>Novembro</option>
              <option value={12}>Dezembro</option>
            </select>
          </div>
        </div>
      </section>

      {/* Cards de Resumo Financeiro */}
      <ResumoFinanceiro ano={anoSelecionado} mes={mesSelecionado} />

      {/* Gráfico Anual */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>Evolução Anual</h2>
          <p className={styles.chartSubtitle}>Comparativo mensal de entradas e saídas</p>
        </div>
        <div className={styles.chartsContainer}>
          <GraficoAnual ano={anoSelecionado} />
        </div>
      </div>

      {/* Espaçamento entre gráficos */}
      <div className="mb-8"></div>

                      {/* Gráfico de Barras */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className={styles.chartTitle}>Top 3 Categorias</h2>
                <p className={styles.chartSubtitle}>
                  Principais categorias de gastos {periodoGrafico === 'mes' ? 'do mês' : 'do ano'} de {anoSelecionado}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Período:</label>
                <select
                  value={periodoGrafico}
                  onChange={(e) => setPeriodoGrafico(e.target.value as 'mes' | 'ano')}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="mes">Mês</option>
                  <option value="ano">Ano</option>
                </select>
              </div>
            </div>
          </div>
          <div className={styles.chartsContainer}>
            <GraficoBarras 
              ano={anoSelecionado} 
              mes={mesSelecionado}
              filtrarPorMes={periodoGrafico === 'mes'}
            />
          </div>
        </div>
    </div>
  );
} 