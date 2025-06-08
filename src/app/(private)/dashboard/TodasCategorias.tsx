import React from 'react';
import { formatarMoeda } from '@/utils/formatarMoeda';
import styles from './dashboard.module.css';

interface Categoria {
  id: string;
  nome: string;
  cor: string;
}

interface TodasCategoriasProps {
  categorias: Record<string, Categoria>;
  totais: Record<string, number>;
}

export function TodasCategorias({ categorias, totais }: TodasCategoriasProps) {
  // Ordena por valor decrescente
  const todas = Object.entries(totais)
    .map(([categoriaId, valor]) => ({
      categoriaId,
      categoria: categorias[categoriaId]?.nome || 'Categoria não encontrada',
      valor,
      cor: categorias[categoriaId]?.cor || '#gray',
    }))
    .sort((a, b) => b.valor - a.valor);

  if (todas.length === 0) {
    return null;
  }

  return (
    <div className={styles.categoriesCard}>
      <h2 className={styles.cardTitle}>Todas as Categorias</h2>
      <div className={styles.categoriesList}>
        {todas.map((categoria, index) => (
          <div key={categoria.categoriaId} className={styles.categoryItem}>
            <div className={styles.categoryRank}>{index + 1}</div>
            <div className={styles.categoryInfo}>
              <p className={styles.categoryName}>{categoria.categoria}</p>
              <p className={styles.categoryValue}>{formatarMoeda(categoria.valor)}</p>
            </div>
            <div className={styles.categoryBar}>
              <div
                className={styles.categoryProgress}
                style={{
                  width: todas[0].valor ? `${(categoria.valor / todas[0].valor) * 100}%` : '0%',
                  backgroundColor: categoria.cor,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 