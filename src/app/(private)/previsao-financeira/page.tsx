import { PrevisaoFinanceiraIA } from '../componentes/graficos/PrevisaoFinanceiraIA';

export default function PrevisaoFinanceiraPage() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Previsão Financeira
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">
        Análise preditiva baseada em seu histórico financeiro
      </p>
      
      <div className="w-full">
        <PrevisaoFinanceiraIA />
      </div>
    </div>
  );
} 