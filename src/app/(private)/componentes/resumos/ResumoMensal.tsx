'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

interface ResumoMensalProps {
  mes: number;
  ano: number;
}

export function ResumoMensal({ mes, ano }: ResumoMensalProps) {
  const [resumo, setResumo] = useState({
    totalEntradas: 0,
    totalSaidas: 0,
    saldo: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarResumo() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('mes', '==', mes),
          where('ano', '==', ano)
        );

        const querySnapshot = await getDocs(q);
        let totalEntradas = 0;
        let totalSaidas = 0;

        querySnapshot.forEach((doc) => {
          const transacao = doc.data();
          if (transacao.tipo === 'entrada') {
            totalEntradas += transacao.valor;
          } else {
            totalSaidas += transacao.valor;
          }
        });

        setResumo({
          totalEntradas,
          totalSaidas,
          saldo: totalEntradas - totalSaidas
        });
      } catch (error) {
        console.error('Erro ao carregar resumo:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarResumo();
  }, [mes, ano]);

  if (loading) {
    return <div>Carregando resumo...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
      <div className="p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10">
        <p className="text-sm text-emerald-800 dark:text-emerald-100">Total Entradas</p>
        <div className="flex items-center space-x-2">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            R$ {resumo.totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-emerald-600 dark:text-emerald-400">+</span>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-rose-50/50 dark:bg-rose-900/10">
        <p className="text-sm text-rose-800 dark:text-rose-100">Total Saídas</p>
        <div className="flex items-center space-x-2">
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            R$ {resumo.totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-rose-600 dark:text-rose-400">-</span>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
        <p className="text-sm text-blue-800 dark:text-blue-100">Saldo do Mês</p>
        <div className="flex items-center space-x-2">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            R$ {resumo.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-blue-600 dark:text-blue-400">⚖️</span>
        </div>
      </div>
    </div>
  );
} 