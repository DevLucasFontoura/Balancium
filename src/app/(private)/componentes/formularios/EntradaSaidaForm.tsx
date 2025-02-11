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
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">R$</span>
          <input
            type="text"
            value={formData.valor}
            onChange={handleValorChange}
            className="w-full p-2 pl-8 border rounded"
            placeholder="0,00"
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-2">Categoria</label>
        <select
          value={formData.categoria}
          onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
          className="w-full p-2 border rounded"
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