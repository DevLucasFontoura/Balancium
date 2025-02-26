'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { ResumoAnual as IResumoAnual, ResumoMensal } from '@/app/tipos';

export function ResumoAnual() {
  const [resumo, setResumo] = useState<IResumoAnual>({
    totalEntradas: 0,
    totalSaidas: 0,
    saldo: 0,
    transacoesPorMes: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarResumo() {
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
        let totalEntradas = 0;
        let totalSaidas = 0;
        const transacoesPorMes: { [key: string]: ResumoMensal } = {};

        querySnapshot.forEach((doc) => {
          const transacao = doc.data();
          const mesKey = transacao.mes.toString();
          
          if (!transacoesPorMes[mesKey]) {
            transacoesPorMes[mesKey] = {
              totalEntradas: 0,
              totalSaidas: 0,
              saldo: 0
            };
          }

          if (transacao.tipo === 'entrada') {
            totalEntradas += transacao.valor;
            transacoesPorMes[mesKey].totalEntradas += transacao.valor;
          } else {
            totalSaidas += transacao.valor;
            transacoesPorMes[mesKey].totalSaidas += transacao.valor;
          }
          
          transacoesPorMes[mesKey].saldo = 
            transacoesPorMes[mesKey].totalEntradas - 
            transacoesPorMes[mesKey].totalSaidas;
        });

        setResumo({
          totalEntradas,
          totalSaidas,
          saldo: totalEntradas - totalSaidas,
          transacoesPorMes
        });
      } catch (error) {
        console.error('Erro ao carregar resumo:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarResumo();
  }, []);

  if (loading) {
    return <div>Carregando resumo...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Resumo Anual</h2>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900">
          <p className="text-sm text-green-800 dark:text-green-100">Total Entradas</p>
          <p className="text-2xl font-bold text-green-800 dark:text-green-100">
            R$ {resumo.totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900">
          <p className="text-sm text-red-800 dark:text-red-100">Total Saídas</p>
          <p className="text-2xl font-bold text-red-800 dark:text-red-100">
            R$ {resumo.totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900">
          <p className="text-sm text-blue-800 dark:text-blue-100">Saldo</p>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-100">
            R$ {resumo.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
} 