'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { Transacao } from '@/app/tipos';

interface TabelaMensalProps {
  mes: string;
  ano?: string;
}

export function TabelaMensal({ mes, ano }: TabelaMensalProps) {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarTransacoes() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const mesNumero = new Date(`${mes} 1, 2024`).getMonth() + 1;
        const anoNumero = ano ? parseInt(ano) : new Date().getFullYear();

        const q = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('mes', '==', mesNumero),
          where('ano', '==', anoNumero),
          orderBy('data', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const transacoesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transacao[];

        setTransacoes(transacoesData);
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarTransacoes();
  }, [mes, ano]);

  if (loading) {
    return <div className="text-center py-4">Carregando transações...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Transações do Mês</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="p-4 text-left">Data</th>
              <th className="p-4 text-left">Descrição</th>
              <th className="p-4 text-left">Categoria</th>
              <th className="p-4 text-right">Valor</th>
              <th className="p-4 text-center">Tipo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {transacoes.map((transacao) => (
              <tr key={transacao.id}>
                <td className="p-4">
                  {new Date(transacao.data).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4">{transacao.descricao}</td>
                <td className="p-4">{transacao.categoria}</td>
                <td className="p-4 text-right">
                  R$ {transacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transacao.tipo === 'entrada' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                  }`}>
                    {transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transacoes.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Nenhuma transação registrada neste mês.
        </div>
      )}
    </div>
  );
} 