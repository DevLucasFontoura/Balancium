'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { formatarMoeda } from '@/utils/formatarMoeda';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DadosMensais {
  [categoria: string]: {
    [mes: number]: number;
  };
}

export function GraficoBarrasEmpilhadas() {
  const [dadosMensais, setDadosMensais] = useState<DadosMensais>({});
  const [loading, setLoading] = useState(true);

  const cores = [
    'rgb(34, 197, 94)',   // Verde
    'rgb(239, 68, 68)',   // Vermelho
    'rgb(59, 130, 246)',  // Azul
    'rgb(168, 85, 247)',  // Roxo
    'rgb(251, 146, 60)'   // Laranja
  ];

  useEffect(() => {
    async function carregarDados() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const anoAtual = new Date().getFullYear();
        
        // Primeiro, vamos buscar todas as categorias do usuário
        const categoriasQuery = query(
          collection(db, 'categorias'),
          where('userId', '==', user.uid),
          where('status', '==', 'ativo')
        );
        
        const categoriasSnapshot = await getDocs(categoriasQuery);
        const categoriasMap = new Map();
        
        categoriasSnapshot.forEach(doc => {
          const categoria = doc.data();
          categoriasMap.set(doc.id, categoria.nome);
        });

        // Agora vamos buscar as transações
        const transacoesQuery = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('ano', '==', anoAtual),
          where('tipo', '==', 'saida'),
          where('status', '==', 'ativo')
        );

        const transacoesSnapshot = await getDocs(transacoesQuery);
        const dados: DadosMensais = {};

        transacoesSnapshot.forEach((doc) => {
          const transacao = doc.data();
          const categoriaNome = categoriasMap.get(transacao.categoria) || 'Outros';
          
          if (!dados[categoriaNome]) {
            dados[categoriaNome] = {};
          }
          if (!dados[categoriaNome][transacao.mes]) {
            dados[categoriaNome][transacao.mes] = 0;
          }
          dados[categoriaNome][transacao.mes] += transacao.valor;
        });

        setDadosMensais(dados);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const data = {
    labels: meses,
    datasets: Object.entries(dadosMensais).map(([categoria, valores], index) => ({
      label: categoria,
      data: Array.from({ length: 12 }, (_, i) => valores[i + 1] || 0),
      backgroundColor: cores[index % cores.length],
      borderColor: 'white',
      borderWidth: 1,
      borderRadius: 4,
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        stacked: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value: any) {
            return formatarMoeda(value);
          },
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatarMoeda(context.raw)}`;
          }
        }
      }
    }
  };

  if (loading) {
    return <div>Carregando gráfico...</div>;
  }

  return (
    <div style={{ height: '400px', padding: '20px 0' }}>
      <Bar data={data} options={options} />
    </div>
  );
} 