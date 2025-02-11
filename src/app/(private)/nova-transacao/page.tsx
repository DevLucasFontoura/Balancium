import { EntradaSaidaForm } from '../componentes/formularios/EntradaSaidaForm';

export default function NovaTransacaoPage() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Nova Transação</h1>
        <p className="text-emerald-50">
          Registre suas entradas e saídas de forma simples e organizada
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        <EntradaSaidaForm />
      </div>
    </div>
  );
} 