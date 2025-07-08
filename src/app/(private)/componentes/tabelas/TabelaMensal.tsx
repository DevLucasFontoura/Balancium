'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, doc, deleteDoc, getDoc, writeBatch, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { formatarMoeda } from '@/utils/formatarMoeda';
import { formatarData } from '@/utils/formatarData';
import { EditarTransacaoModal } from '../modais/EditarTransacaoModal';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { EntradaSaidaForm } from '../formularios/EntradaSaidaForm';
import styles from './TabelaMensal.module.css';

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
  const [showAddTransacao, setShowAddTransacao] = useState(false);

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
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (transacoes.length === 0) {
    return (
      <div className={styles.emptyStateContainer}>
        <svg className={styles.emptyStateIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className={styles.emptyStateTitle}>
          Nenhuma transação encontrada
        </h3>
        <p className={styles.emptyStateDescription}>
          Não há transações registradas para este mês.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      {transacoes.length > 0 && (
        <div className={styles.actionButtonsContainer}>
          <button
            onClick={() => setShowAddTransacao(true)}
            className={styles.addButton}
          >
            <span className={styles.buttonIconMobile}>
              <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <span className={styles.buttonIconDesktop}>
              <svg className={styles.buttonIconSmall} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Transação
            </span>
          </button>
          <button
            onClick={handleDeleteAll}
            className={styles.deleteAllButton}
          >
            <span className={styles.buttonIconMobile}>
              <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </span>
            <span className={styles.buttonIconDesktop}>
              <svg className={styles.buttonIconSmall} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Excluir Todas
            </span>
          </button>
        </div>
      )}

      {/* Modal de Adicionar Transação */}
      {showAddTransacao && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <button
              onClick={() => setShowAddTransacao(false)}
              className={styles.modalCloseButton}
            >
              <svg className={styles.modalCloseIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className={styles.modalTitle}>Adicionar Transação</h2>
            <EntradaSaidaForm 
              key={mes + '-' + ano + '-add'} 
              onCancel={() => setShowAddTransacao(false)}
              onSuccess={() => {
                setShowAddTransacao(false);
                // A tabela já atualiza pelo onTransacoesChange, mas pode forçar atualização se necessário
                if (typeof onTransacoesChange === 'function') onTransacoesChange();
              }}
            />
          </div>
        </div>
      )}

      {/* Versão Mobile (vertical) */}
      <div className={styles.mobileContainer}>
        {transacoes.map((transacao) => {
          const categoriaInfo = getCategoriaInfo(transacao.categoria);
          return (
            <div 
              key={transacao.id}
              className={styles.mobileCard}
            >
              <div className={styles.mobileCardContent}>
                <div>
                  <h3 className={styles.mobileCardTitle}>
                    {transacao.descricao}
                  </h3>
                  <span 
                    className={styles.mobileCardCategory}
                    style={{ 
                      backgroundColor: categoriaInfo.cor,
                      color: 'white'
                    }}
                  >
                    {categoriaInfo.nome}
                  </span>
                </div>

                <div className={styles.mobileCardDate}>
                  {formatarData(transacao.data)}
                </div>

                <div className={`${styles.mobileCardValue} ${
                  transacao.tipo === 'entrada' 
                    ? styles.mobileCardValueEntrada
                    : styles.mobileCardValueSaida
                }`}>
                  {formatarMoeda(transacao.valor)}
                </div>

                <div className={styles.mobileCardActions}>
                  <button
                    onClick={() => handleEditarTransacao(transacao)}
                    className={styles.mobileEditButton}
                  >
                    <svg className={styles.mobileButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(transacao.id)}
                    className={styles.mobileDeleteButton}
                  >
                    <svg className={styles.mobileButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className={styles.desktopContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th scope="col" className={styles.tableHeaderCell}>
                  Descrição
                </th>
                <th scope="col" className={styles.tableHeaderCell}>
                  Categoria
                </th>
                <th scope="col" className={styles.tableHeaderCell}>
                  Data
                </th>
                <th scope="col" className={styles.tableHeaderCell}>
                  Valor
                </th>
                <th scope="col" className={styles.tableHeaderCellActions}>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {transacoes.map((transacao) => {
                const categoriaInfo = getCategoriaInfo(transacao.categoria);
                return (
                  <tr key={transacao.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      {transacao.descricao}
                    </td>
                    <td className={styles.tableCell}>
                      <span 
                        className={styles.categoryBadge}
                        style={{ 
                          backgroundColor: categoriaInfo.cor,
                          color: 'white'
                        }}
                      >
                        {categoriaInfo.nome}
                      </span>
                    </td>
                    <td className={styles.tableCellDate}>
                      {formatarData(transacao.data)}
                    </td>
                    <td className={`${styles.tableCellValue} ${
                      transacao.tipo === 'entrada' 
                        ? styles.tableCellValueEntrada
                        : styles.tableCellValueSaida
                    }`}>
                      {formatarMoeda(transacao.valor)}
                    </td>
                    <td className={styles.tableCellActions}>
                      <div className={styles.tableActionsContainer}>
                        <button
                          onClick={() => handleEditarTransacao(transacao)}
                          className={styles.tableEditButton}
                        >
                          <svg className={styles.tableButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(transacao.id)}
                          className={styles.tableDeleteButton}
                        >
                          <svg className={styles.tableButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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