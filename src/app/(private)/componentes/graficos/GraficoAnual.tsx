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

interface GraficoAnualProps {
  ano?: number;
}

export function GraficoAnual({ ano }: GraficoAnualProps) {
  const [dadosMensais, setDadosMensais] = useState<{ [key: number]: DadosMensais }>({});
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Adicionar detecção de dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function carregarDados() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const anoFiltro = ano || new Date().getFullYear();
        const q = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('ano', '==', anoFiltro),
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
  }, [ano]);

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Função para obter os últimos 3 meses
  const getUltimos3Meses = () => {
    const mesAtual = new Date().getMonth(); // 0-11
    const ultimos3 = [];
    
    for (let i = 2; i >= 0; i--) {
      const indice = ((mesAtual - i) + 12) % 12;
      ultimos3.push(meses[indice]);
    }
    
    return ultimos3;
  };

  // Preparar dados com base no dispositivo
  const labelsFinais = isMobile ? getUltimos3Meses() : meses;
  const mesAtual = new Date().getMonth() + 1; // 1-12

  const getDadosFiltrados = (dados: number[]) => {
    if (!isMobile) return dados;
    
    const ultimos3 = [];
    for (let i = 2; i >= 0; i--) {
      const indice = ((mesAtual - 1 - i) + 12) % 12;
      ultimos3.push(dados[indice]);
    }
    return ultimos3;
  };

  const data = {
    labels: labelsFinais,
    datasets: [
      {
        label: 'Entradas',
        data: getDadosFiltrados(Object.values(dadosMensais).map(mes => mes.entradas)),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(34, 197, 94, 0.25)');
          gradient.addColorStop(1, 'rgba(34, 197, 94, 0.05)');
          return gradient;
        },
        tension: 0.4,
        fill: true
      },
      {
        label: 'Saídas',
        data: getDadosFiltrados(Object.values(dadosMensais).map(mes => mes.saidas)),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(239, 68, 68, 0.18)');
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0.04)');
          return gradient;
        },
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
      {isMobile && (
        <div style={{
          textAlign: 'center',
          marginBottom: '10px',
          fontSize: '0.875rem',
          color: 'rgb(107 114 128)',
          padding: '0 10px'
        }}>
          Rotacione o dispositivo ou acesse a versão desktop para visualizar todos os meses
        </div>
      )}
      <Line data={data} options={options} />
    </div>
  );
} 