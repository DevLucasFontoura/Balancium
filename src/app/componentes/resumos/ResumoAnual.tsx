'use client';

import { ResumoAnual as IResumoAnual } from '@/app/tipos';
import { useState, useEffect } from 'react';

export function ResumoAnual() {
  const [resumo, setResumo] = useState<IResumoAnual>({
    totalEntradas: 0,
    totalSaidas: 0,
    saldo: 0,
    transacoesPorMes: {}
  });

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