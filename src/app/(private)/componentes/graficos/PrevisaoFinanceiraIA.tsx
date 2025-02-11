'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './PrevisaoFinanceiraIA.module.css';

interface DadosMensais {
  mes: string;
  entradas: number;
  saidas: number;
  previsaoEntradas?: number;
  previsaoSaidas?: number;
}

export function PrevisaoFinanceiraIA() {
  const [dados, setDados] = useState<DadosMensais[]>([]);
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
        const transacoes = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        // Agrupa transações por mês
        const dadosPorMes = Array.from({ length: 12 }, (_, i) => ({
          mes: new Date(2024, i).toLocaleString('pt-BR', { month: 'short' }),
          entradas: 0,
          saidas: 0
        }));

        transacoes.forEach((transacao: any) => {
          const mesIndex = transacao.mes - 1;
          if (transacao.tipo === 'entrada') {
            dadosPorMes[mesIndex].entradas += transacao.valor;
          } else {
            dadosPorMes[mesIndex].saidas += transacao.valor;
          }
        });

        // Filtra apenas os meses até o atual
        const mesAtual = new Date().getMonth();
        const dadosHistoricos = dadosPorMes.slice(0, mesAtual + 1);

        // Calcula previsões para os próximos 3 meses
        const previsoes = calcularPrevisoes(dadosHistoricos);
        
        setDados([...dadosHistoricos, ...previsoes]);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  // Função simplificada de previsão usando média móvel
  function calcularPrevisoes(dadosHistoricos: DadosMensais[]): DadosMensais[] {
    const mesesFuturos = ['jan', 'fev', 'mar'];
    const ultimosMeses = dadosHistoricos.slice(-3);
    
    const mediaEntradas = ultimosMeses.reduce((acc, curr) => acc + curr.entradas, 0) / ultimosMeses.length;
    const mediaSaidas = ultimosMeses.reduce((acc, curr) => acc + curr.saidas, 0) / ultimosMeses.length;
    
    // Adiciona uma pequena variação aleatória para tornar mais realista
    return mesesFuturos.map((mes, index) => ({
      mes: `${mes} (prev)`,
      previsaoEntradas: mediaEntradas * (1 + (Math.random() * 0.1 - 0.05)),
      previsaoSaidas: mediaSaidas * (1 + (Math.random() * 0.1 - 0.05)),
      entradas: 0,
      saidas: 0
    }));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Análise Preditiva de Finanças</h3>
        <p className={styles.subtitle}>
          Baseado em seu histórico financeiro e padrões de gastos
        </p>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => 
                `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
              }
            />
            <Legend />
            
            {/* Dados históricos */}
            <Line 
              type="monotone" 
              dataKey="entradas" 
              stroke="#059669" 
              strokeWidth={2}
              name="Entradas"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="saidas" 
              stroke="#dc2626" 
              strokeWidth={2}
              name="Saídas"
              dot={{ r: 4 }}
            />

            {/* Previsões */}
            <Line 
              type="monotone" 
              dataKey="previsaoEntradas" 
              stroke="#059669" 
              strokeDasharray="5 5"
              name="Previsão Entradas"
              dot={{ r: 4, strokeDasharray: '' }}
            />
            <Line 
              type="monotone" 
              dataKey="previsaoSaidas" 
              stroke="#dc2626" 
              strokeDasharray="5 5"
              name="Previsão Saídas"
              dot={{ r: 4, strokeDasharray: '' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.insights}>
        <div className={styles.insightCard}>
          <h4>Tendência de Entradas</h4>
          <p>{dados[dados.length - 1]?.previsaoEntradas > dados[dados.length - 4]?.entradas 
            ? 'Tendência de aumento nas entradas' 
            : 'Tendência de redução nas entradas'}</p>
        </div>
        <div className={styles.insightCard}>
          <h4>Tendência de Saídas</h4>
          <p>{dados[dados.length - 1]?.previsaoSaidas > dados[dados.length - 4]?.saidas
            ? 'Tendência de aumento nas despesas' 
            : 'Tendência de redução nas despesas'}</p>
        </div>
      </div>
    </div>
  );
} 