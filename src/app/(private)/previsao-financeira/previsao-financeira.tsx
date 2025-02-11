'use client';

import { PrevisaoFinanceiraIA } from '../componentes/graficos/PrevisaoFinanceiraIA';
import styles from './previsao-financeira.module.css';

export function PrevisaoFinanceira() {
  return (
    <div className={styles.container}>
      {/* Hero Verde */}
      <div className={styles.heroCard}>
        <h1 className={styles.heroTitle}>
          Previsão Financeira
        </h1>
        <p className={styles.heroSubtitle}>
          Análise preditiva baseada em seu histórico financeiro
        </p>
      </div>

      {/* Conteúdo Principal */}
      <div className={styles.mainGrid}>
        {/* Coluna da Esquerda */}
        <div className={styles.leftColumn}>
          {/* Gráfico de Previsão */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>Análise Preditiva</h2>
              <p className={styles.chartSubtitle}>Projeção baseada em seu histórico financeiro</p>
            </div>
            <PrevisaoFinanceiraIA />
          </div>
        </div>
      </div>
    </div>
  );
} 