'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DadosMensais {
  entradas: number;
  saidas: number;
}

export function GraficoAnual() {
  const [dadosMensais, setDadosMensais] = useState<{ [key: number]: DadosMensais }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const anoAtual = new Date().getFullYear();
        
        const q = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('ano', '==', anoAtual),
          where('status', '==', 'ativo')
        );

        const querySnapshot = await getDocs(q);
        const dadosPorMes: { [key: number]: DadosMensais } = {};

        // Inicializar todos os meses com zero
        for (let i = 1; i <= 12; i++) {
          dadosPorMes[i] = { entradas: 0, saidas: 0 };
        }

        querySnapshot.forEach((doc) => {
          const transacao = doc.data();
          const mes = transacao.mes;
          
          if (transacao.tipo === 'entrada') {
            dadosPorMes[mes].entradas += transacao.valor;
          } else {
            dadosPorMes[mes].saidas += transacao.valor;
          }
        });

        setDadosMensais(dadosPorMes);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const data = {
    labels: meses,
    datasets: [
      {
        label: 'Entradas',
        data: Object.values(dadosMensais).map(mes => mes.entradas),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Saídas',
        data: Object.values(dadosMensais).map(mes => mes.saidas),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(value);
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
      <Line data={data} options={options} />
    </div>
  );
} 