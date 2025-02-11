'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { TipoTransacao } from '@/app/tipos';

export function EntradaSaidaForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'entrada' as TipoTransacao,
    data: new Date().toISOString().split('T')[0],
    categoria: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Converte o valor para número considerando o formato brasileiro
      const valorNumerico = parseFloat(formData.valor.replace(/\./g, '').replace(',', '.'));

      const transacao = {
        userId: user.uid,
        descricao: formData.descricao,
        valor: valorNumerico,
        tipo: formData.tipo,
        categoria: formData.categoria,
        data: new Date(formData.data).toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'ativo',
        mes: new Date(formData.data).getMonth() + 1,
        ano: new Date(formData.data).getFullYear(),
      };

      const docRef = await addDoc(collection(db, 'transacoes'), transacao);
      console.log('Transação salva com ID:', docRef.id);
      
      setFormData({
        descricao: '',
        valor: '',
        tipo: 'entrada',
        data: new Date().toISOString().split('T')[0],
        categoria: '',
      });

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Erro ao salvar transação:', err);
      setError('Erro ao salvar transação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove todos os caracteres não numéricos
    value = value.replace(/\D/g, '');
    
    // Converte para número e divide por 100 para considerar os centavos
    const numero = parseInt(value, 10) / 100;
    
    // Formata o número no padrão brasileiro
    const valorFormatado = numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setFormData({ ...formData, valor: valorFormatado });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 text-sm text-red-800 bg-red-100 dark:bg-red-900/50 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white transition-colors"
              placeholder="Digite a descrição"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Valor
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-gray-500 dark:text-gray-400 text-sm">
                R$
              </span>
              <input
                type="text"
                value={formData.valor}
                onChange={handleValorChange}
                className="w-full px-4 py-2.5 pl-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white transition-colors"
                placeholder="0,00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Categoria
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white appearance-none cursor-pointer transition-colors"
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="salario">Salário</option>
              <option value="investimentos">Investimentos</option>
              <option value="alimentacao">Alimentação</option>
              <option value="transporte">Transporte</option>
              <option value="moradia">Moradia</option>
              <option value="lazer">Lazer</option>
              <option value="saude">Saúde</option>
              <option value="educacao">Educação</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoTransacao })}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white appearance-none cursor-pointer transition-colors"
            >
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data
            </label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white transition-colors"
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </span>
            ) : (
              'Salvar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 