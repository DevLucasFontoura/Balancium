'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, doc, deleteDoc, getDoc, writeBatch, updateDoc, serverTimestamp } from 'firebase/firestore';
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

  async function handleDeleteAll() {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Você irá excluir todas as transações deste mês. Esta ação não poderá ser revertida!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#dc2626',
      confirmButtonText: 'Sim, excluir todas!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('mes', '==', mes),
          where('ano', '==', ano),
          where('status', '==', 'ativo')
        );

        const querySnapshot = await getDocs(q);
        
        // Criar um batch para operações em lote
        const batch = writeBatch(db);
        
        querySnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Executar todas as exclusões de uma vez
        await batch.commit();
        
        toast.success('Todas as transações foram excluídas com sucesso!');
        await carregarTransacoes();
        onTransacoesChange?.();
      } catch (error) {
        console.error('Erro ao excluir transações:', error);
        toast.error('Erro ao excluir transações. Tente novamente.');
      }
    }
  }

  const handleEditarTransacao = async (transacao: Transacao) => {
    await carregarCategorias();
    setTransacaoParaEditar({
      ...transacao,
      data: transacao.data.split('T')[0] // Garante o formato correto da data
    });
  };

  const handleSalvarEdicao = async (transacaoEditada: Transacao) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const transacoesRef = doc(db, 'transacoes', transacaoEditada.id);
      
      // Criar data corretamente a partir da string YYYY-MM-DD
      const dataObj = new Date(transacaoEditada.data + 'T00:00:00');
      
      const dadosParaAtualizar = {
        descricao: transacaoEditada.descricao,
        categoria: transacaoEditada.categoria,
        valor: transacaoEditada.valor,
        data: transacaoEditada.data, // Mantém o formato YYYY-MM-DD
        tipo: transacaoEditada.tipo,
        mes: dataObj.getMonth() + 1, // Mês correto baseado na data selecionada
        ano: dataObj.getFullYear(), // Ano correto baseado na data selecionada
        updatedAt: serverTimestamp()
      };

      await updateDoc(transacoesRef, dadosParaAtualizar);
      
      await carregarTransacoes();
      setTransacaoParaEditar(null);
      onTransacoesChange?.();
      toast.success('Transação atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast.error('Erro ao atualizar transação');
    }
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
    <div className="space-y-4">
      {transacoes.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDeleteAll}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors dark:hover:bg-rose-600 dark:focus:ring-offset-gray-900"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
            Excluir Todas
          </button>
        </div>
      )}

      {/* Versão Mobile (vertical) */}
      <div className="md:hidden space-y-4">
        {transacoes.map((transacao) => {
          const categoriaInfo = getCategoriaInfo(transacao.categoria);
          return (
            <div 
              key={transacao.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {transacao.descricao}
                  </h3>
                  <span 
                    className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: categoriaInfo.cor,
                      color: 'white'
                    }}
                  >
                    {categoriaInfo.nome}
                  </span>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatarData(transacao.data)}
                </div>

                <div className={`text-lg font-semibold ${
                  transacao.tipo === 'entrada' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {formatarMoeda(transacao.valor)}
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => handleEditarTransacao(transacao)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(transacao.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-rose-700 bg-rose-100 hover:bg-rose-200 dark:text-rose-400 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Versão Desktop (tabela) */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {transacoes.map((transacao) => {
                const categoriaInfo = getCategoriaInfo(transacao.categoria);
                return (
                  <tr key={transacao.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {transacao.descricao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: categoriaInfo.cor,
                          color: 'white'
                        }}
                      >
                        {categoriaInfo.nome}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatarData(transacao.data)}
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
                          className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(transacao.id)}
                          className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-rose-700 bg-rose-100 hover:bg-rose-200 dark:text-rose-400 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 transition-colors"
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
        </div>
      </div>

      {transacaoParaEditar && (
        <EditarTransacaoModal
          transacao={transacaoParaEditar}
          categorias={categorias}
          isOpen={!!transacaoParaEditar}
          onClose={() => setTransacaoParaEditar(null)}
          onUpdate={handleSalvarEdicao}
        />
      )}
    </div>
  );
} 