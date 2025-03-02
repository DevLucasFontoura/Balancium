import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import styles from './EditarTransacaoModal.module.css';

interface Categoria {
  id: string;
  nome: string;
  cor: string;
  tipo?: 'entrada' | 'saida';
}

interface Transacao {
  id: string;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  tipo: 'entrada' | 'saida';
}

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
  onUpdate: (transacao: Transacao) => void;
  categorias: Record<string, Categoria>;
}

export function EditarTransacaoModal({ 
  transacao, 
  isOpen, 
  onClose, 
  onUpdate,
  categorias
}: EditarTransacaoModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    descricao: transacao.descricao,
    categoria: transacao.categoria,
    valor: transacao.valor,
    data: transacao.data.split('T')[0],
    tipo: transacao.tipo
  });

  // Usar todas as categorias disponíveis
  const todasCategorias = Object.values(categorias);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Mantém a data exatamente como o usuário selecionou
      const dataObj = new Date(formData.data + 'T00:00:00');
      
      const dadosAtualizados: Transacao = {
        id: transacao.id,
        descricao: formData.descricao,
        categoria: formData.categoria,
        valor: Number(formData.valor),
        tipo: formData.tipo,
        data: formData.data // Mantém a data no formato YYYY-MM-DD
      };

      onUpdate(dadosAtualizados);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
    } finally {
      setLoading(false);
    }
  };

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
              Tipo de Transação
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex items-center justify-center px-4 py-2 rounded-lg border transition-colors flex-1 ${
                  formData.tipo === 'entrada'
                    ? 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, tipo: 'entrada' }))}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0-16l-4 4m4-4l4 4" />
                </svg>
                Entrada
              </button>
              <button
                type="button"
                className={`flex items-center justify-center px-4 py-2 rounded-lg border transition-colors flex-1 ${
                  formData.tipo === 'saida'
                    ? 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, tipo: 'saida' }))}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V4m0 16l4-4m-4 4l-4-4" />
                </svg>
                Saída
              </button>
            </div>
          </div>

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
              required
            >
              <option value="">Selecione uma categoria</option>
              {todasCategorias.map((cat) => (
                <option 
                  key={cat.id} 
                  value={cat.id}
                >
                  {cat.nome}
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