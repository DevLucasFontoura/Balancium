'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { formatarMoeda } from '@/utils/formatarMoeda';
import { formatarData } from '@/utils/formatarData';
import { EditarTransacaoModal } from '../modais/EditarTransacaoModal';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

interface Categoria {
  id: string;
  nome: string;
  cor: string;
}

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
  const [categorias, setCategorias] = useState<Record<string, Categoria>>({});

  async function carregarCategorias() {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().categorias) {
        const categoriasArray = userDoc.data().categorias;
        const categoriasMap: Record<string, Categoria> = {};
        categoriasArray.forEach((cat: Categoria) => {
          categoriasMap[cat.id] = cat;
        });
        setCategorias(categoriasMap);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  }

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

  const getCategoriaInfo = (categoriaId: string) => {
    return categorias[categoriaId] || { nome: 'Categoria não encontrada', cor: '#gray' };
  };

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

  const handleEditarTransacao = async (transacao: Transacao) => {
    await carregarCategorias();
    setTransacaoParaEditar(transacao);
  };

  useEffect(() => {
    carregarCategorias();
    carregarTransacoes();
  }, [mes, ano]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (transacoes.length === 0) {
    return (
      <div className="p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          Nenhuma transação encontrada
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Não há transações registradas para este mês.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700/50">
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Data
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Descrição
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Categoria
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Valor
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {transacoes.map((transacao) => {
            const categoriaInfo = getCategoriaInfo(transacao.categoria);
            return (
              <tr 
                key={transacao.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {formatarData(transacao.data)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                  {transacao.descricao}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  <span 
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: categoriaInfo.cor,
                      color: 'white'
                    }}
                  >
                    {categoriaInfo.nome}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  transacao.tipo === 'entrada' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {formatarMoeda(transacao.valor)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditarTransacao(transacao)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(transacao.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-rose-700 bg-rose-100 hover:bg-rose-200 dark:text-rose-400 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {transacaoParaEditar && (
        <EditarTransacaoModal
          transacao={transacaoParaEditar}
          categorias={categorias}
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