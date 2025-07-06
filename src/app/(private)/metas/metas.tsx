'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './metas.module.css';

interface Meta {
  id: string;
  titulo: string;
  descricao: string;
  valorAtual: number;
  valorMeta: number;
  categoria: string;
}

export default function MetasPage() {
  const [metas, setMetas] = useState<Meta[]>([
    {
      id: '1',
      titulo: 'Viagem para Europa',
      descricao: 'Economizar para uma viagem de 15 dias pela Europa',
      valorAtual: 5000,
      valorMeta: 15000,
      categoria: 'Viagem'
    },
    {
      id: '2',
      titulo: 'Entrada do Apartamento',
      descricao: 'Juntar dinheiro para dar entrada em um apartamento',
      valorAtual: 25000,
      valorMeta: 80000,
      categoria: 'Imóvel'
    },
    {
      id: '3',
      titulo: 'Fundo de Emergência',
      descricao: 'Criar uma reserva de emergência de 6 meses de despesas',
      valorAtual: 8000,
      valorMeta: 12000,
      categoria: 'Segurança'
    }
  ]);

  const [showNovaMeta, setShowNovaMeta] = useState(false);
  const [novaMeta, setNovaMeta] = useState({
    titulo: '',
    descricao: '',
    valorMeta: '',
    categoria: ''
  });

  const [editandoMeta, setEditandoMeta] = useState<string | null>(null);
  const [novoValor, setNovoValor] = useState('');

  const handleCriarMeta = () => {
    if (novaMeta.titulo && novaMeta.descricao && novaMeta.valorMeta) {
      const novaMetaObj: Meta = {
        id: Date.now().toString(),
        titulo: novaMeta.titulo,
        descricao: novaMeta.descricao,
        valorAtual: 0,
        valorMeta: parseFloat(novaMeta.valorMeta),
        categoria: novaMeta.categoria || 'Geral'
      };

      setMetas([...metas, novaMetaObj]);
      setNovaMeta({ titulo: '', descricao: '', valorMeta: '', categoria: '' });
      setShowNovaMeta(false);
    }
  };

  const handleEditarValor = (metaId: string) => {
    if (novoValor) {
      setMetas(metas.map(meta => 
        meta.id === metaId 
          ? { ...meta, valorAtual: parseFloat(novoValor) }
          : meta
      ));
      setNovoValor('');
      setEditandoMeta(null);
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
              <label className={styles.label}>Valor da Meta (R$)</label>
              <Input
                type="number"
                placeholder="0,00"
                value={novaMeta.valorMeta}
                onChange={(e) => setNovaMeta({...novaMeta, valorMeta: e.target.value})}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Categoria</label>
              <Input
                type="text"
                placeholder="Ex: Viagem, Imóvel, Educação"
                value={novaMeta.categoria}
                onChange={(e) => setNovaMeta({...novaMeta, categoria: e.target.value})}
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
                <span className={styles.metaCategoria}>{meta.categoria}</span>
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
                    type="number"
                    placeholder="Novo valor"
                    value={novoValor}
                    onChange={(e) => setNovoValor(e.target.value)}
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
