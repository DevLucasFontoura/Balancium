import { ArvoreDecisoes } from '../componentes/graficos/ArvoreDecisoes';

export default function ArvoreDecisoesPage() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Árvore de Decisões
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">
        Explore diferentes cenários e tome decisões financeiras informadas
      </p>
      
      <div className="w-full">
        <ArvoreDecisoes />
      </div>
    </div>
  );
} 