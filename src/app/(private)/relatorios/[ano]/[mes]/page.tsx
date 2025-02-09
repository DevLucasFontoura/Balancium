import { TabelaMensal } from '@/app/(private)/componentes/tabelas/TabelaMensal';

export default function RelatorioMensalPage({ 
  params 
}: { 
  params: { ano: string; mes: string } 
}) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Relatório de {params.mes.charAt(0).toUpperCase() + params.mes.slice(1)} / {params.ano}
        </h1>
      </div>

      {/* Cards de Resumo do Mês */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Entradas</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">R$ 0,00</p>
        </div>
        
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Saídas</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">R$ 0,00</p>
        </div>
        
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Saldo do Mês</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">R$ 0,00</p>
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <TabelaMensal mes={params.mes} ano={params.ano} />
      </div>
    </div>
  );
} 