import styles from './como-funciona.module.css';

export function ComoFunciona() {
  const passos = [
    {
      numero: "01",
      titulo: "Cadastro Simplificado",
      descricao: "Crie sua conta em segundos e comece a organizar suas finanças",
      icon: (
        <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      numero: "02",
      titulo: "Dashboard Básico",
      descricao: "Visualize seus gastos e ganhos de forma clara e objetiva",
      icon: (
        <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
      )
    },
    {
      numero: "03",
      titulo: "Registro de Transações",
      descricao: "Adicione suas receitas e despesas de forma simples",
      icon: (
        <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      numero: "04",
      titulo: "Relatório Mensal",
      descricao: "Acompanhe seu balanço financeiro mês a mês",
      icon: (
        <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.stepsGrid}>
        {passos.map((passo, index) => (
          <div key={index} className={styles.stepCard}>
            <span className={styles.stepNumber}>{passo.numero}</span>
            <div className={styles.iconWrapper}>
              {passo.icon}
            </div>
            <h3 className={styles.stepTitle}>{passo.titulo}</h3>
            <p className={styles.stepDescription}>{passo.descricao}</p>
          </div>
        ))}
      </div>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Pronto para organizar suas finanças?</h2>
        <p className={styles.ctaText}>
          Comece agora mesmo a controlar suas receitas e despesas
        </p>
        <div className={styles.ctaButtons}>
          <button className={styles.primaryButton}>
            Começar Gratuitamente
          </button>
          <button className={styles.secondaryButton}>
            Saiba Mais
          </button>
        </div>
      </section>
    </div>
  );
} 