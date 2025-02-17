'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import styles from './categorias.module.css';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface Categoria {
  id: string;
  nome: string;
  cor: string;
}

export function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [novaCategoria, setNovaCategoria] = useState({
    nome: '',
    cor: '#4ade80', // cor padrão verde
  });
  const [coresRecentes, setCoresRecentes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editandoCategoria, setEditandoCategoria] = useState<string | null>(null);
  const [categoriaEditada, setCategoriaEditada] = useState<Categoria | null>(null);

  useEffect(() => {
    carregarCategorias();
    carregarCoresRecentes();
  }, []);

  const carregarCoresRecentes = () => {
    const cores = localStorage.getItem('coresRecentes');
    if (cores) {
      setCoresRecentes(JSON.parse(cores));
    }
  };

  const atualizarCoresRecentes = (novaCor: string) => {
    const novasCores = [novaCor, ...coresRecentes.filter(cor => cor !== novaCor)].slice(0, 5);
    setCoresRecentes(novasCores);
    localStorage.setItem('coresRecentes', JSON.stringify(novasCores));
  };

  const selecionarCorRecente = (cor: string) => {
    setNovaCategoria(prev => ({ ...prev, cor }));
  };

  const carregarCategorias = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data().categorias) {
        setCategorias(docSnap.data().categorias);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast.error('Erro ao carregar categorias');
    } finally {
      setIsLoading(false);
    }
  };

  const adicionarCategoria = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!novaCategoria.nome.trim()) {
      toast.error('Digite um nome para a categoria');
      return;
    }

    const categoria: Categoria = {
      id: Date.now().toString(),
      nome: novaCategoria.nome.trim(),
      cor: novaCategoria.cor,
    };

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        categorias: arrayUnion(categoria)
      });

      setCategorias([...categorias, categoria]);
      atualizarCoresRecentes(novaCategoria.cor);
      setNovaCategoria({ nome: '', cor: '#4ade80' });
      toast.success('Categoria adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      toast.error('Erro ao adicionar categoria');
    }
  };

  const removerCategoria = async (categoriaId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const categoria = categorias.find(cat => cat.id === categoriaId);
    if (!categoria) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        categorias: arrayRemove(categoria)
      });

      setCategorias(categorias.filter(cat => cat.id !== categoriaId));
      toast.success('Categoria removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      toast.error('Erro ao remover categoria');
    }
  };

  const iniciarEdicao = (categoria: Categoria) => {
    setEditandoCategoria(categoria.id);
    setCategoriaEditada(categoria);
  };

  const salvarEdicao = async () => {
    if (!categoriaEditada) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      const novasCategorias = categorias.map(cat => 
        cat.id === categoriaEditada.id ? categoriaEditada : cat
      );

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        categorias: novasCategorias
      });

      setCategorias(novasCategorias);
      setEditandoCategoria(null);
      setCategoriaEditada(null);
      atualizarCoresRecentes(categoriaEditada.cor);
      toast.success('Categoria atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      toast.error('Erro ao atualizar categoria');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/configuracoes" className={styles.backButton}>
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Voltar para Configurações
        </Link>
      </div>

      <div className={styles.heroCard}>
        <h1 className={styles.heroTitle}>Categorias</h1>
        <p className={styles.heroSubtitle}>Gerencie suas categorias personalizadas</p>
      </div>

      <div className={styles.content}>
        <Card className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Nova Categoria</h2>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome</label>
              <Input
                type="text"
                value={novaCategoria.nome}
                onChange={(e) => setNovaCategoria({
                  ...novaCategoria,
                  nome: e.target.value
                })}
                placeholder="Ex: Supermercado, Academia, etc"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Cor</label>
              <div className={styles.colorPicker}>
                <Input
                  type="color"
                  value={novaCategoria.cor}
                  onChange={(e) => setNovaCategoria({
                    ...novaCategoria,
                    cor: e.target.value
                  })}
                />
              </div>
              {coresRecentes.length > 0 && (
                <div className={styles.coresRecentes}>
                  <span className={styles.coresRecentesLabel}>Cores recentes:</span>
                  <div className={styles.coresRecentesGrid}>
                    {coresRecentes.map((cor, index) => (
                      <button
                        key={index}
                        className={styles.corRecenteButton}
                        style={{ backgroundColor: cor }}
                        onClick={() => selecionarCorRecente(cor)}
                        title={cor}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            onClick={adicionarCategoria}
            className={styles.addButton}
          >
            Adicionar Categoria
          </Button>
        </Card>

        <Card className={styles.categoriasCard}>
          <h2 className={styles.sectionTitle}>Suas Categorias</h2>
          
          {isLoading ? (
            <div className={styles.loading}>Carregando categorias...</div>
          ) : categorias.length === 0 ? (
            <div className={styles.empty}>
              Nenhuma categoria personalizada criada ainda.
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Cor</th>
                    <th>Editar</th>
                    <th>Deletar</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((categoria) => (
                    <tr key={categoria.id}>
                      <td>
                        {editandoCategoria === categoria.id ? (
                          <Input
                            type="text"
                            value={categoriaEditada?.nome || ''}
                            onChange={(e) => setCategoriaEditada({
                              ...categoriaEditada!,
                              nome: e.target.value
                            })}
                            className={styles.editInput}
                          />
                        ) : (
                          <span className={styles.categoriaNome}>{categoria.nome}</span>
                        )}
                      </td>
                      <td>
                        {editandoCategoria === categoria.id ? (
                          <Input
                            type="color"
                            value={categoriaEditada?.cor || ''}
                            onChange={(e) => setCategoriaEditada({
                              ...categoriaEditada!,
                              cor: e.target.value
                            })}
                            className={styles.editColor}
                          />
                        ) : (
                          <div 
                            className={styles.corIndicator}
                            style={{ backgroundColor: categoria.cor }}
                          />
                        )}
                      </td>
                      <td>
                        {editandoCategoria === categoria.id ? (
                          <Button
                            variant="primary"
                            onClick={salvarEdicao}
                            className={styles.saveButton}
                          >
                            Salvar
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            onClick={() => iniciarEdicao(categoria)}
                            className={styles.editButton}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </Button>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          onClick={() => removerCategoria(categoria.id)}
                          className={styles.deleteButton}
                        >
                          <svg
                            className="w-5 h-5"
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
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 