import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface EditarTransacaoModalProps {
  transacao: {
    id: string;
    descricao: string;
    categoria: string;
    valor: number;
    data: string;
    tipo: 'entrada' | 'saida';
  };
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditarTransacaoModal({ transacao, isOpen, onClose, onUpdate }: EditarTransacaoModalProps) {
  const [formData, setFormData] = useState({
    descricao: transacao.descricao,
    categoria: transacao.categoria,
    valor: transacao.valor,
    data: transacao.data.split('T')[0], // Formata a data para YYYY-MM-DD
    tipo: transacao.tipo
  });

  const categorias = {
    entrada: ['salario', 'outros'],
    saida: ['alimentacao', 'transporte', 'moradia', 'lazer', 'outros']
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const docRef = doc(db, 'transacoes', transacao.id);
      await updateDoc(docRef, {
        ...formData,
        valor: Number(formData.valor),
        updatedAt: new Date()
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-md mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Editar Transação
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Digite a descrição"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categorias[formData.tipo].map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">R$</span>
              <input
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData(prev => ({ ...prev, valor: parseFloat(e.target.value) }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="0,00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data
            </label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-800"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 