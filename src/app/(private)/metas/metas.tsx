'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import styles from './metas.module.css';

interface Meta {
  id: string;
  titulo: string;
  descricao: string;
  valorAtual: number;
  valorMeta: number;
}

export default function MetasPage() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);

  const [showNovaMeta, setShowNovaMeta] = useState(false);
  const [novaMeta, setNovaMeta] = useState({
    titulo: '',
    descricao: '',
    valorMeta: ''
  });

  // Estado para modal de edição de meta
  const [metaParaEditar, setMetaParaEditar] = useState<Meta | null>(null);
  const [edicaoMeta, setEdicaoMeta] = useState({
    valorAdicionar: '',
    valorMetaTotal: ''
  });

  // Estado para modal de confirmação de exclusão
  const [metaParaExcluir, setMetaParaExcluir] = useState<Meta | null>(null);

  // Função para formatar valor como moeda brasileira
  const formatarValorInput = (valor: string) => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '');
    
    // Converte para número e divide por 100 para ter centavos
    const valorNumerico = apenasNumeros ? parseInt(apenasNumeros) / 100 : 0;
    
    // Formata como moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valorNumerico);
  };

  // Função para converter valor formatado de volta para número
  const converterValorFormatado = (valorFormatado: string) => {
    const apenasNumeros = valorFormatado.replace(/\D/g, '');
    return apenasNumeros ? (parseInt(apenasNumeros) / 100).toString() : '';
  };

  // Carregar metas do Firebase
  useEffect(() => {
    const carregarMetas = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, 'metas'),
          where('userId', '==', user.uid),
          where('status', '==', 'ativo')
        );
        const querySnapshot = await getDocs(q);
        const metasData: Meta[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          metasData.push({
            id: doc.id,
            titulo: data.titulo,
            descricao: data.descricao,
            valorAtual: data.valorAtual || 0,
            valorMeta: data.valorMeta
          });
        });
        setMetas(metasData);
      } catch (error) {
        console.error('Erro ao carregar metas:', error);
        toast.error('Erro ao carregar metas');
      } finally {
        setLoading(false);
      }
    };

    carregarMetas();
  }, []);

  const handleCriarMeta = async () => {
    if (novaMeta.titulo && novaMeta.descricao && novaMeta.valorMeta) {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      try {
        // Converter valor formatado para número
        const valorNumerico = parseFloat(converterValorFormatado(novaMeta.valorMeta));
        
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
          toast.error('Digite um valor válido para a meta');
          return;
        }

        const metaData = {
          userId: user.uid,
          titulo: novaMeta.titulo,
          descricao: novaMeta.descricao,
          valorAtual: 0,
          valorMeta: valorNumerico,
          status: 'ativo',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'metas'), metaData);
        
        const novaMetaObj: Meta = {
          id: docRef.id,
          titulo: novaMeta.titulo,
          descricao: novaMeta.descricao,
          valorAtual: 0,
          valorMeta: valorNumerico
        };

        setMetas([...metas, novaMetaObj]);
        setNovaMeta({ titulo: '', descricao: '', valorMeta: '' });
        setShowNovaMeta(false);
        toast.success('Meta criada com sucesso!');
      } catch (error) {
        console.error('Erro ao criar meta:', error);
        toast.error('Erro ao criar meta');
      }
    } else {
      toast.error('Preencha todos os campos obrigatórios');
    }
  };

  const handleEditarMeta = async () => {
    if (!metaParaEditar) return;

    const user = auth.currentUser;
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      let novoValorAtual = metaParaEditar.valorAtual;
      let novoValorMeta = metaParaEditar.valorMeta;

      // Processar valor a adicionar
      if (edicaoMeta.valorAdicionar) {
        const valorAdicionarNumerico = parseFloat(converterValorFormatado(edicaoMeta.valorAdicionar));
        if (!isNaN(valorAdicionarNumerico) && valorAdicionarNumerico > 0) {
          novoValorAtual += valorAdicionarNumerico;
        }
      }

      // Processar novo valor total da meta
      if (edicaoMeta.valorMetaTotal) {
        const novoValorMetaNumerico = parseFloat(converterValorFormatado(edicaoMeta.valorMetaTotal));
        if (!isNaN(novoValorMetaNumerico) && novoValorMetaNumerico > 0) {
          novoValorMeta = novoValorMetaNumerico;
        }
      }

      // Atualizar no Firebase
      const metaRef = doc(db, 'metas', metaParaEditar.id);
      await updateDoc(metaRef, {
        valorAtual: novoValorAtual,
        valorMeta: novoValorMeta,
        updatedAt: serverTimestamp()
      });

      // Atualizar estado local
      setMetas(metas.map(meta => 
        meta.id === metaParaEditar.id 
          ? { ...meta, valorAtual: novoValorAtual, valorMeta: novoValorMeta }
          : meta
      ));

      // Limpar e fechar modal
      setEdicaoMeta({ valorAdicionar: '', valorMetaTotal: '' });
      setMetaParaEditar(null);
      toast.success('Meta atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      toast.error('Erro ao atualizar meta');
    }
  };

  const abrirModalEdicao = (meta: Meta) => {
    setMetaParaEditar(meta);
    setEdicaoMeta({
      valorAdicionar: '',
      valorMetaTotal: formatarMoeda(meta.valorMeta)
    });
  };

  const handleExcluirMeta = async (metaId: string) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      // Excluir do Firebase
      const metaRef = doc(db, 'metas', metaId);
      await deleteDoc(metaRef);

      // Remover do estado local
      setMetas(metas.filter(meta => meta.id !== metaId));
      setMetaParaExcluir(null); // Fechar modal
      toast.success('Meta excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      toast.error('Erro ao excluir meta');
    }
  };

  const confirmarExclusao = (meta: Meta) => {
    setMetaParaExcluir(meta);
  };

  const calcularProgresso = (atual: number, meta: number) => {
    return Math.min((atual / meta) * 100, 100);
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando metas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>Minhas Metas Financeiras</h1>
        <p className={styles.subtitulo}>
          Acompanhe e gerencie seus objetivos financeiros
        </p>
      </div>

      <div className={styles.acoes}>
        <Button 
          onClick={() => setShowNovaMeta(true)}
          className={styles.botaoNovaMeta}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nova Meta
        </Button>
      </div>

      {/* Modal Nova Meta */}
      {showNovaMeta && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitulo}>Criar Nova Meta</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Título da Meta</label>
              <Input
                type="text"
                placeholder="Ex: Viagem para Europa"
                value={novaMeta.titulo}
                onChange={(e) => setNovaMeta({...novaMeta, titulo: e.target.value})}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Descrição</label>
              <Input
                type="text"
                placeholder="Descreva sua meta"
                value={novaMeta.descricao}
                onChange={(e) => setNovaMeta({...novaMeta, descricao: e.target.value})}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Valor da Meta</label>
              <Input
                type="text"
                placeholder="R$ 0,00"
                value={novaMeta.valorMeta}
                onChange={(e) => {
                  const valorFormatado = formatarValorInput(e.target.value);
                  setNovaMeta({...novaMeta, valorMeta: valorFormatado});
                }}
                className={styles.input}
              />
            </div>

            <div className={styles.modalBotoes}>
              <Button 
                variant="outline" 
                onClick={() => setShowNovaMeta(false)}
                className={styles.botaoCancelar}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCriarMeta}
                className={styles.botaoSalvar}
              >
                Criar Meta
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Meta */}
      {metaParaEditar && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitulo}>Editar Meta</h2>
            
            <div className={styles.metaInfoEdicao}>
              <h3 className={styles.metaTituloEdicao}>{metaParaEditar.titulo}</h3>
              <p className={styles.metaDescricaoEdicao}>{metaParaEditar.descricao}</p>
            </div>

            <div className={styles.progressoAtual}>
              <div className={styles.progressoInfo}>
                <span className={styles.valorAtualEdicao}>
                  {formatarMoeda(metaParaEditar.valorAtual)}
                </span>
                <span className={styles.valorMetaEdicao}>
                  de {formatarMoeda(metaParaEditar.valorMeta)}
                </span>
              </div>
              
              <div className={styles.barraProgresso}>
                <div 
                  className={styles.progressoPreenchido}
                  style={{ width: `${calcularProgresso(metaParaEditar.valorAtual, metaParaEditar.valorMeta)}%` }}
                />
              </div>
              
              <div className={styles.percentual}>
                {calcularProgresso(metaParaEditar.valorAtual, metaParaEditar.valorMeta).toFixed(1)}%
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Adicionar Valor</label>
              <Input
                type="text"
                placeholder="R$ 0,00"
                value={edicaoMeta.valorAdicionar}
                onChange={(e) => {
                  const valorFormatado = formatarValorInput(e.target.value);
                  setEdicaoMeta({...edicaoMeta, valorAdicionar: valorFormatado});
                }}
                className={styles.input}
              />
              <small className={styles.inputHelp}>
                Deixe em branco se não quiser adicionar valor
              </small>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Novo Valor Total da Meta</label>
              <Input
                type="text"
                placeholder="R$ 0,00"
                value={edicaoMeta.valorMetaTotal}
                onChange={(e) => {
                  const valorFormatado = formatarValorInput(e.target.value);
                  setEdicaoMeta({...edicaoMeta, valorMetaTotal: valorFormatado});
                }}
                className={styles.input}
              />
              <small className={styles.inputHelp}>
                Valor total que você quer atingir (100%)
              </small>
            </div>

            <div className={styles.modalBotoes}>
              <Button 
                variant="outline" 
                onClick={() => {
                  setMetaParaEditar(null);
                  setEdicaoMeta({ valorAdicionar: '', valorMetaTotal: '' });
                }}
                className={styles.botaoCancelar}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleEditarMeta}
                className={styles.botaoSalvar}
              >
                Atualizar Meta
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.gridMetas}>
        {metas.map((meta) => (
          <Card key={meta.id} className={styles.metaCard}>
            <div className={styles.metaHeader}>
              <div className={styles.metaInfo}>
                <h3 className={styles.metaTitulo}>{meta.titulo}</h3>
                <p className={styles.metaDescricao}>{meta.descricao}</p>
              </div>
              <button
                onClick={() => confirmarExclusao(meta)}
                className={styles.botaoExcluir}
                title="Excluir meta"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.metaProgresso}>
              <div className={styles.progressoInfo}>
                <span className={styles.valorAtual}>
                  {formatarMoeda(meta.valorAtual)}
                </span>
                <span className={styles.valorMeta}>
                  de {formatarMoeda(meta.valorMeta)}
                </span>
              </div>
              
              <div className={styles.barraProgresso}>
                <div 
                  className={styles.progressoPreenchido}
                  style={{ width: `${calcularProgresso(meta.valorAtual, meta.valorMeta)}%` }}
                />
              </div>
              
              <div className={styles.percentual}>
                {calcularProgresso(meta.valorAtual, meta.valorMeta).toFixed(1)}%
              </div>
            </div>

            <div className={styles.metaAcoes}>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => abrirModalEdicao(meta)}
                className={styles.botaoEditar}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Meta
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {metas.length === 0 && (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className={styles.emptyTitulo}>Nenhuma meta criada</h3>
          <p className={styles.emptyDescricao}>
            Comece criando sua primeira meta financeira para acompanhar seus objetivos
          </p>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {metaParaExcluir && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalConfirmacao}>
            <div className={styles.modalConfirmacaoIcon}>
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className={styles.modalConfirmacaoTitulo}>Excluir Meta</h2>
            
            <p className={styles.modalConfirmacaoDescricao}>
              Tem certeza que deseja excluir a meta <strong>"{metaParaExcluir.titulo}"</strong>?
            </p>
            
            <p className={styles.modalConfirmacaoAviso}>
              Esta ação não pode ser desfeita e todos os dados da meta serão perdidos permanentemente.
            </p>

            <div className={styles.modalConfirmacaoBotoes}>
              <Button 
                variant="outline" 
                onClick={() => setMetaParaExcluir(null)}
                className={styles.botaoCancelarExclusao}
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => handleExcluirMeta(metaParaExcluir.id)}
                className={styles.botaoConfirmarExclusao}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Excluir Meta
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
