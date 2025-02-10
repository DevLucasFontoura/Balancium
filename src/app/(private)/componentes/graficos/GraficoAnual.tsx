'use client';

import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

Chart.register(...registerables);

export function GraficoAnual() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
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
          where('ano', '==', anoAtual)
        );

        const querySnapshot = await getDocs(q);
        const dadosPorMes = Array(12).fill(0).map(() => ({ entradas: 0, saidas: 0 }));

        querySnapshot.forEach((doc) => {
          const transacao = doc.data();
          const mes = transacao.mes - 1; // Ajusta para índice 0-11
          
          if (transacao.tipo === 'entrada') {
            dadosPorMes[mes].entradas += transacao.valor;
          } else {
            dadosPorMes[mes].saidas += transacao.valor;
          }
        });

        if (chartRef.current) {
          const ctx = chartRef.current.getContext('2d');
          if (ctx) {
            if (chartInstance.current) {
              chartInstance.current.destroy();
            }

            chartInstance.current = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: [
                  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
                ],
                datasets: [
                  {
                    label: 'Entradas',
                    data: dadosPorMes.map(d => d.entradas),
                    backgroundColor: 'rgba(34, 197, 94, 0.5)',
                    borderColor: 'rgb(34, 197, 94)',
                    borderWidth: 1
                  },
                  {
                    label: 'Saídas',
                    data: dadosPorMes.map(d => d.saidas),
                    backgroundColor: 'rgba(239, 68, 68, 0.5)',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 1
                  }
                ]
              },
              options: {
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return `R$ ${value.toLocaleString('pt-BR')}`;
                      }
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const value = context.raw as number;
                        return `R$ ${value.toLocaleString('pt-BR')}`;
                      }
                    }
                  }
                }
              }
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do gráfico:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
    </div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Movimentações por Mês</h2>
      <canvas ref={chartRef}></canvas>
    </div>
  );
} 