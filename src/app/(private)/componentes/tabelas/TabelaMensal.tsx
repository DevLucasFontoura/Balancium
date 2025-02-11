'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { formatarMoeda } from '@/utils/formatarMoeda';
import { formatarData } from '@/utils/formatarData';
import { EditarTransacaoModal } from '../modais/EditarTransacaoModal';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

interface Transacao {
  id: string;
  data: string;
  descricao: string;
  categoria: string;
  valor: number;
  tipo: 'entrada' | 'saida';
}

interface TabelaMensalProps {
  mes: number;
  ano: number;
  onTransacoesChange?: () => void;
}

export function TabelaMensal({ mes, ano, onTransacoesChange }: TabelaMensalProps) {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [transacaoParaEditar, setTransacaoParaEditar] = useState<Transacao | null>(null);

  async function carregarTransacoes() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      console.log('Buscando transações:', { mes, ano, userId: user.uid });

      const q = query(
        collection(db, 'transacoes'),
        where('userId', '==', user.uid),
        where('mes', '==', mes),
        where('ano', '==', ano),
        where('status', '==', 'ativo')
      );

      const querySnapshot = await getDocs(q);
      const dados = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transacao[];

      const dadosOrdenados = dados.sort((a, b) => 
        new Date(b.data).getTime() - new Date(a.data).getTime()
      );

      setTransacoes(dadosOrdenados);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      setLoading(false);
    }
  }

  async function handleDelete(transacaoId: string) {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter esta ação!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#dc2626',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const docRef = doc(db, 'transacoes', transacaoId);
        await deleteDoc(docRef);
        
        toast.success('Transação excluída com sucesso!');
        await carregarTransacoes();
        onTransacoesChange?.();
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
        toast.error('Erro ao excluir transação. Tente novamente.');
      }
    }
  }

  useEffect(() => {
    carregarTransacoes();
  }, [mes, ano]);

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800">
        <p className="text-center text-gray-600 dark:text-gray-400">Carregando...</p>
      </div>
    );
  }

  if (transacoes.length === 0) {
    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800">
        <p className="text-center text-gray-600 dark:text-gray-400">
          Nenhuma transação encontrada para este mês.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white rounded-lg shadow overflow-hidden dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                DATA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                DESCRIÇÃO
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                CATEGORIA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                VALOR
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {transacoes.map((transacao) => (
              <tr key={transacao.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {formatarData(transacao.data)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {transacao.descricao}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {transacao.categoria}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  transacao.tipo === 'entrada' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {formatarMoeda(transacao.valor)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setTransacaoParaEditar(transacao)}
                      className="px-3 py-1 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-md transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(transacao.id)}
                      className="px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 rounded-md transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transacaoParaEditar && (
        <EditarTransacaoModal
          transacao={transacaoParaEditar}
          isOpen={!!transacaoParaEditar}
          onClose={() => setTransacaoParaEditar(null)}
          onUpdate={() => {
            carregarTransacoes();
            setTransacaoParaEditar(null);
            onTransacoesChange?.();
          }}
        />
      )}
    </div>
  );
} 