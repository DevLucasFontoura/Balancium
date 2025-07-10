'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Categoria {
  id: string;
  nome: string;
  cor: string;
}

interface GraficoPizzaProps {
  ano?: number;
  mes?: number;
}

export function GraficoPizza({ ano, mes }: GraficoPizzaProps) {
  const [dados, setDados] = useState<Array<{ categoria: string; valor: number; cor: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<Record<string, Categoria>>({});

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().categorias) {
          const categoriasArray = userDoc.data().categorias;
          const categoriasMap: Record<string, Categoria> = {};
          categoriasArray.forEach((cat: Categoria) => {
            categoriasMap[cat.id] = cat;
          });
          setCategorias(categoriasMap);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    }

    carregarCategorias();
  }, []);

  useEffect(() => {
    async function carregarDados() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const anoAtual = ano || new Date().getFullYear();
        const mesAtual = mes || new Date().getMonth() + 1;

        let q = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('ano', '==', anoAtual),
          where('tipo', '==', 'saida'),
          where('status', '==', 'ativo')
        );

        if (mes) {
          q = query(
            collection(db, 'transacoes'),
            where('userId', '==', user.uid),
            where('ano', '==', anoAtual),
            where('mes', '==', mesAtual),
            where('tipo', '==', 'saida'),
            where('status', '==', 'ativo')
          );
        }

        const snapshot = await getDocs(q);
        const gastosPorCategoria: { [key: string]: number } = {};

        snapshot.forEach((doc) => {
          const transacao = doc.data();
          if (transacao.categoria && transacao.valor) {
            gastosPorCategoria[transacao.categoria] = (gastosPorCategoria[transacao.categoria] || 0) + Number(transacao.valor);
          }
        });

        // Converter para array e ordenar por valor
        const dadosOrdenados = Object.entries(gastosPorCategoria)
          .map(([categoriaId, valor]) => ({
            categoria: categorias[categoriaId]?.nome || 'Categoria não encontrada',
            valor,
            cor: categorias[categoriaId]?.cor || '#6B7280'
          }))
          .sort((a, b) => b.valor - a.valor)
          .slice(0, 8); // Limitar a 8 categorias para melhor visualização

        setDados(dadosOrdenados);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [ano, mes, categorias]);

  const chartData = {
    labels: dados.map(item => item.categoria),
    datasets: [
      {
        data: dados.map(item => item.valor),
        backgroundColor: dados.map(item => item.cor),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff'
      }
    ]
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            family: 'Inter'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          family: 'Inter',
          weight: 600
        },
        bodyFont: {
          size: 13,
          family: 'Inter'
        },
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (dados.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-center">Nenhum gasto registrado neste período</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <Doughnut data={chartData} options={options} />
    </div>
  );
} 