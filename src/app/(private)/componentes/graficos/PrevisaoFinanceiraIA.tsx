'use client';

import { useState, useEffect } from 'react';
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
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { formatarMoeda } from '@/utils/formatarMoeda';
import styles from './PrevisaoFinanceiraIA.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DadosPrevisao {
  historico: {
    entradas: number[];
    saidas: number[];
  };
  previsao: {
    entradas: number[];
    saidas: number[];
  };
}

export function PrevisaoFinanceiraIA() {
  const [dados, setDados] = useState<DadosPrevisao>({
    historico: { entradas: [], saidas: [] },
    previsao: { entradas: [], saidas: [] }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const anoAtual = new Date().getFullYear();
        const mesAtual = new Date().getMonth() + 1;
        
        // Carregar dados históricos
        const q = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('ano', '==', anoAtual),
          where('status', '==', 'ativo')
        );

        const querySnapshot = await getDocs(q);
        const dadosPorMes: { [key: number]: { entradas: number; saidas: number } } = {};

        // Inicializar meses
        for (let i = 1; i <= 12; i++) {
          dadosPorMes[i] = { entradas: 0, saidas: 0 };
        }

        // Processar dados históricos
        querySnapshot.forEach((doc) => {
          const transacao = doc.data();
          if (transacao.mes <= mesAtual) {
            if (transacao.tipo === 'entrada') {
              dadosPorMes[transacao.mes].entradas += transacao.valor;
            } else {
              dadosPorMes[transacao.mes].saidas += transacao.valor;
            }
          }
        });

        // Calcular médias para previsão
        const mediaEntradas = Object.values(dadosPorMes)
          .reduce((acc, val) => acc + val.entradas, 0) / mesAtual;
        const mediaSaidas = Object.values(dadosPorMes)
          .reduce((acc, val) => acc + val.saidas, 0) / mesAtual;

        // Criar previsão para os próximos 3 meses
        const historicoEntradas = [];
        const historicoSaidas = [];
        const previsaoEntradas = [];
        const previsaoSaidas = [];

        for (let i = 1; i <= mesAtual; i++) {
          historicoEntradas.push(dadosPorMes[i].entradas);
          historicoSaidas.push(dadosPorMes[i].saidas);
        }

        // Adicionar previsões com variação aleatória
        for (let i = 1; i <= 3; i++) {
          const variacaoEntradas = (Math.random() * 0.2) - 0.1; // -10% a +10%
          const variacaoSaidas = (Math.random() * 0.2) - 0.1;
          previsaoEntradas.push(mediaEntradas * (1 + variacaoEntradas));
          previsaoSaidas.push(mediaSaidas * (1 + variacaoSaidas));
        }

        setDados({
          historico: {
            entradas: historicoEntradas,
            saidas: historicoSaidas
          },
          previsao: {
            entradas: previsaoEntradas,
            saidas: previsaoSaidas
          }
        });
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

  const mesAtual = new Date().getMonth();
  const labels = [
    ...meses.slice(0, mesAtual + 1),
    ...Array(3).fill(0).map((_, i) => `${meses[(mesAtual + i + 1) % 12]} (prev)`)
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Entradas',
        data: [...dados.historico.entradas, ...dados.previsao.entradas],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 2,
        pointStyle: 'circle',
        pointRadius: 4,
        pointHoverRadius: 6,
        segment: {
          borderDash: (ctx: any) => 
            ctx.p0DataIndex >= dados.historico.entradas.length ? [6, 6] : undefined,
        }
      },
      {
        label: 'Saídas',
        data: [...dados.historico.saidas, ...dados.previsao.saidas],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderWidth: 2,
        pointStyle: 'circle',
        pointRadius: 4,
        pointHoverRadius: 6,
        segment: {
          borderDash: (ctx: any) => 
            ctx.p0DataIndex >= dados.historico.saidas.length ? [6, 6] : undefined,
        }
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatarMoeda(context.parsed.y);
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
            return formatarMoeda(value);
          }
        }
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando previsão...</div>;
  }

  return (
    <div className={styles.chartWrapper}>
      <Line data={data} options={options} />
    </div>
  );
} 