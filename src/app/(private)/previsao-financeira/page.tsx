import { PrevisaoFinanceiraIA } from '../componentes/graficos/PrevisaoFinanceiraIA';
import styles from './previsao-financeira.module.css';

export default function PrevisaoFinanceiraPage() {
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

      {/* Gráfico Principal */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>Análise Preditiva</h2>
          <p className={styles.chartSubtitle}>Projeção baseada em seu histórico financeiro</p>
        </div>
        <PrevisaoFinanceiraIA />
      </div>

      {/* Como Funciona */}
      <div className={styles.infoCard}>
        <h3 className={styles.infoTitle}>Como funciona?</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p>O gráfico mostra suas entradas (verde) e saídas (vermelho) dos últimos meses</p>
          </div>
          
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p>As linhas pontilhadas representam a projeção para os próximos meses</p>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p>A análise é baseada em seu padrão histórico de gastos e receitas</p>
          </div>
        </div>
      </div>

      {/* Explicação */}
      <div className={styles.explanationCard}>
        <h3 className={styles.explanationTitle}>Sobre a Previsão Financeira</h3>
        <div className={styles.explanationContent}>
          <p>Nossa análise preditiva utiliza algoritmos avançados para projetar suas finanças futuras com base no seu histórico de transações. O sistema identifica padrões em suas entradas e saídas para gerar previsões mais precisas.</p>
          <p>As linhas contínuas representam dados reais, enquanto as linhas pontilhadas mostram as projeções. Quanto mais dados históricos você tiver, mais precisa será a previsão.</p>
        </div>
      </div>
    </div>
  );
} 