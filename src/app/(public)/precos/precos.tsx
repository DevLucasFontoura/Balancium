import styles from './precos.module.css';

export function Precos() {
  return (
    <div className={styles.container}>
      <section className={styles.pricingSection}>
        <h1 className={styles.title}>Planos e Preços</h1>
        <p className={styles.subtitle}>
          Escolha o plano ideal para suas necessidades
        </p>
        
        <div className={styles.comparisonTable}>
          <div className={styles.plansHeader}>
            <div className={styles.featureHeader}>Recursos</div>
            <div className={styles.planColumn}>
              <div className={styles.planColumnTitle}>Gratuito</div>
              <div className={styles.planColumnPrice}>R$ 0,00</div>
              <button className={styles.planButton}>Escolher Plano</button>
            </div>
            <div className={styles.planColumn}>
              <div className={styles.planColumnTitle}>Plus</div>
              <div className={styles.planColumnPrice}>R$ 9,90/mês</div>
              <button className={styles.planButton}>Escolher Plano</button>
            </div>
            <div className={styles.planColumn}>
              <div className={styles.planColumnTitle}>Premium</div>
              <div className={styles.planColumnPrice}>R$ 19,90/mês</div>
              <button className={styles.planButton}>Escolher Plano</button>
            </div>
          </div>

          <div className={styles.featuresList}>
            <div className={styles.featureRow}>
              <div className={styles.featureName}>Dashboard Básico</div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
            </div>
            <div className={styles.featureRow}>
              <div className={styles.featureName}>Controle de Receitas e Despesas</div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
            </div>
            <div className={styles.featureRow}>
              <div className={styles.featureName}>Categorização Simples</div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
            </div>
            <div className={styles.featureRow}>
              <div className={styles.featureName}>Dashboard Completo</div>
              <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
            </div>
            <div className={styles.featureRow}>
              <div className={styles.featureName}>Edição de Transações</div>
              <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
            </div>
            <div className={styles.featureRow}>
              <div className={styles.featureName}>Gerenciamento de Categorias</div>
              <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
            </div>
            <div className={styles.featureRow}>
              <div className={styles.featureName}>Exportação de Dados</div>
              <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
            </div>
            <div className={styles.featureRow}>
              <div className={styles.featureName}>Armazenamento Ilimitado</div>
              <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
              <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
            </div>
            <div className={styles.featureRow}>
              <div className={styles.featureName}>Anexos em Transações</div>
              <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
              <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
              <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 