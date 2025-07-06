'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
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

  const [editandoMeta, setEditandoMeta] = useState<string | null>(null);
  const [novoValor, setNovoValor] = useState('');

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

  const handleEditarValor = async (metaId: string) => {
    if (novoValor) {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      try {
        // Converter valor formatado para número
        const novoValorNumerico = parseFloat(converterValorFormatado(novoValor));
        
        if (isNaN(novoValorNumerico) || novoValorNumerico < 0) {
          toast.error('Digite um valor válido');
          return;
        }
        
        // Atualizar no Firebase
        const metaRef = doc(db, 'metas', metaId);
        await updateDoc(metaRef, {
          valorAtual: novoValorNumerico,
          updatedAt: serverTimestamp()
        });

        // Atualizar estado local
        setMetas(metas.map(meta => 
          meta.id === metaId 
            ? { ...meta, valorAtual: novoValorNumerico }
            : meta
        ));
        setNovoValor('');
        setEditandoMeta(null);
        toast.success('Valor atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar valor:', error);
        toast.error('Erro ao atualizar valor');
      }
    } else {
      toast.error('Digite um valor válido');
    }
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

      <div className={styles.gridMetas}>
        {metas.map((meta) => (
          <Card key={meta.id} className={styles.metaCard}>
            <div className={styles.metaHeader}>
              <div className={styles.metaInfo}>
                <h3 className={styles.metaTitulo}>{meta.titulo}</h3>
                <p className={styles.metaDescricao}>{meta.descricao}</p>
              </div>
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
              {editandoMeta === meta.id ? (
                <div className={styles.edicaoValor}>
                  <Input
                    type="text"
                    placeholder="R$ 0,00"
                    value={novoValor}
                    onChange={(e) => {
                      const valorFormatado = formatarValorInput(e.target.value);
                      setNovoValor(valorFormatado);
                    }}
                    className={styles.inputValor}
                  />
                  <Button 
                    size="sm"
                    onClick={() => handleEditarValor(meta.id)}
                    className={styles.botaoSalvarValor}
                  >
                    Salvar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditandoMeta(null);
                      setNovoValor('');
                    }}
                    className={styles.botaoCancelarValor}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditandoMeta(meta.id)}
                  className={styles.botaoEditar}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar Valor
                </Button>
              )}
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
    </div>
  );
}
