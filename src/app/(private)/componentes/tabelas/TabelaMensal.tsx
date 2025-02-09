'use client';

import { useState, useEffect } from 'react';
import { Transacao } from '@/app/tipos';

interface TabelaMensalProps {
  mes: string;
}

export function TabelaMensal({ mes }: TabelaMensalProps) {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Transações do Mês</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="p-4 text-left">Data</th>
              <th className="p-4 text-left">Descrição</th>
              <th className="p-4 text-right">Valor</th>
              <th className="p-4 text-center">Tipo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {transacoes.map((transacao) => (
              <tr key={transacao.id}>
                <td className="p-4">{new Date(transacao.data).toLocaleDateString('pt-BR')}</td>
                <td className="p-4">{transacao.descricao}</td>
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