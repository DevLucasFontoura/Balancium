'use client';

import { PrevisaoFinanceiraIA } from '../componentes/graficos/PrevisaoFinanceiraIA';
import { ArvoreDecisoes } from '../componentes/graficos/ArvoreDecisoes';
import styles from './previsao-financeira.module.css';

export function PrevisaoFinanceira() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Previsão Financeira</h1>
      <p className={styles.subtitle}>Análise preditiva e cenários financeiros</p>

      <div className={styles.gridContainer}>
        <div className={styles.section}>
          <PrevisaoFinanceiraIA />
        </div>

        <div className={styles.section}>
          <ArvoreDecisoes />
        </div>
      </div>
    </div>
  );
} 