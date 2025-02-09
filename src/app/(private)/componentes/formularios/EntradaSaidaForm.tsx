'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
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

      const transacao = {
        userId: user.uid,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        tipo: formData.tipo,
        data: new Date(formData.data).toISOString(),
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'transacoes'), transacao);
      
      // Redireciona para o dashboard após salvar
      router.push('/dashboard');
      router.refresh(); // Força atualização dos dados
    } catch (err) {
      console.error('Erro ao salvar transação:', err);
      setError('Erro ao salvar transação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-800 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block mb-2">Descrição</label>
        <input
          type="text"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Valor</label>
        <input
          type="number"
          step="0.01"
          value={formData.valor}
          onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Tipo</label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoTransacao })}
          className="w-full p-2 border rounded"
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Data</label>
        <input
          type="date"
          value={formData.data}
          onChange={(e) => setFormData({ ...formData, data: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
} 