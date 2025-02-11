'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DadosCategoria {
  [key: string]: number;
}

// Definindo todas as categorias possíveis com suas cores
const CATEGORIAS = {
  salario: { nome: 'Salário', cor: 'rgba(6, 182, 212, 0.9)' },
  investimentos: { nome: 'Investimentos', cor: 'rgba(20, 184, 166, 0.9)' },
  alimentacao: { nome: 'Alimentação', cor: 'rgba(239, 68, 68, 0.9)' },
  transporte: { nome: 'Transporte', cor: 'rgba(245, 158, 11, 0.9)' },
  moradia: { nome: 'Moradia', cor: 'rgba(16, 185, 129, 0.9)' },
  lazer: { nome: 'Lazer', cor: 'rgba(59, 130, 246, 0.9)' },
  saude: { nome: 'Saúde', cor: 'rgba(99, 102, 241, 0.9)' },
  educacao: { nome: 'Educação', cor: 'rgba(139, 92, 246, 0.9)' },
  cartao_credito: { nome: 'Cartão de Crédito', cor: 'rgba(168, 85, 247, 0.9)' },
  outros: { nome: 'Outros', cor: 'rgba(236, 72, 153, 0.9)' }
};

export function GraficoDistribuicao({ periodo }: { periodo: 'month' | 'year' }) {
  const [dadosEntrada, setDadosEntrada] = useState<DadosCategoria>({});
  const [dadosSaida, setDadosSaida] = useState<DadosCategoria>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;

        const anoAtual = new Date().getFullYear();
        const mesAtual = new Date().getMonth() + 1;

        let q = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('ano', '==', anoAtual)
        );

        if (periodo === 'month') {
          q = query(
            collection(db, 'transacoes'),
            where('userId', '==', user.uid),
            where('ano', '==', anoAtual),
            where('mes', '==', mesAtual)
          );
        }

        const querySnapshot = await getDocs(q);
        const dadosEntradaPorCategoria: DadosCategoria = {};
        const dadosSaidaPorCategoria: DadosCategoria = {};

        // Inicializa categorias com 0
        Object.keys(CATEGORIAS).forEach(cat => {
          dadosEntradaPorCategoria[cat] = 0;
          dadosSaidaPorCategoria[cat] = 0;
        });

        // Processa cada transação
        querySnapshot.forEach((doc) => {
          const transacao = doc.data();
          console.log('Transação encontrada:', {
            descricao: transacao.descricao,
            valor: transacao.valor,
            categoria: transacao.categoria,
            tipo: transacao.tipo
          });

          if (transacao.categoria && transacao.valor) {
            if (transacao.tipo === 'entrada') {
              dadosEntradaPorCategoria[transacao.categoria] += Number(transacao.valor);
            } else {
              dadosSaidaPorCategoria[transacao.categoria] += Number(transacao.valor);
            }
          }
        });

        // Filtra e ordena entradas
        const entradasFiltradas = Object.fromEntries(
          Object.entries(dadosEntradaPorCategoria)
            .filter(([_, valor]) => valor > 0)
            .sort((a, b) => b[1] - a[1])
        );

        // Filtra e ordena saídas
        const saidasFiltradas = Object.fromEntries(
          Object.entries(dadosSaidaPorCategoria)
            .filter(([_, valor]) => valor > 0)
            .sort((a, b) => b[1] - a[1])
        );

        setDadosEntrada(entradasFiltradas);
        setDadosSaida(saidasFiltradas);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [periodo]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        padding: 12,
        titleFont: {
          size: 13,
          family: 'Inter',
          weight: '500'
        },
        bodyFont: {
          size: 12,
          family: 'Inter'
        },
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.06)',
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          padding: 12,
          font: {
            size: 11,
            family: 'Inter'
          },
          color: 'rgba(0, 0, 0, 0.6)',
          callback: (value: any) => `R$ ${value}`
        },
        border: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          padding: 8,
          font: {
            size: 12,
            family: 'Inter',
            weight: '500'
          },
          color: 'rgba(0, 0, 0, 0.75)'
        },
        border: {
          display: false
        }
      }
    }
  };

  const criarDataConfig = (dados: DadosCategoria) => ({
    labels: Object.keys(dados).map(cat => CATEGORIAS[cat as keyof typeof CATEGORIAS].nome),
    datasets: [
      {
        data: Object.values(dados),
        backgroundColor: Object.keys(dados).map(cat => CATEGORIAS[cat as keyof typeof CATEGORIAS].cor),
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 40,
        maxBarThickness: 40
      }
    ]
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
    </div>;
  }

  const semDados = Object.keys(dadosEntrada).length === 0 && Object.keys(dadosSaida).length === 0;

  if (semDados) {
    return <div className="flex justify-center items-center h-64 text-gray-500">
      Nenhuma transação registrada neste período
    </div>;
  }

  return (
    <div className="grid grid-cols-2 gap-12">
      <div className="w-full">
        <h3 className="text-sm font-medium mb-6 text-emerald-600">Entradas</h3>
        {Object.keys(dadosEntrada).length > 0 ? (
          <div className="h-[240px]">
            <Bar data={criarDataConfig(dadosEntrada)} options={options} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-400 text-sm">
            Nenhuma entrada registrada
          </div>
        )}
      </div>
      
      <div className="w-full">
        <h3 className="text-sm font-medium mb-6 text-red-600">Saídas</h3>
        {Object.keys(dadosSaida).length > 0 ? (
          <div className="h-[240px]">
            <Bar data={criarDataConfig(dadosSaida)} options={options} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-400 text-sm">
            Nenhuma saída registrada
          </div>
        )}
      </div>
    </div>
  );
} 