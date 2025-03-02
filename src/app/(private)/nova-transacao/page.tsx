import { EntradaSaidaForm } from '../componentes/formularios/EntradaSaidaForm';

export default function NovaTransacao() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-emerald-500 rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">Nova Transação</h1>
        <p className="text-white text-lg">Registre suas entradas e saídas de forma simples e organizada</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <EntradaSaidaForm />
      </div>
    </div>
  );
} 