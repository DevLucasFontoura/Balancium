import styles from './recursos.module.css';

export function Recursos() {
  const recursos = [
    {
      title: 'Dashboard Intuitivo',
      description: 'Visualize suas finanças de forma clara e objetiva em um painel simples',
      icon: (
        <svg className={styles.resourceIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Controle Mensal',
      description: 'Registre e acompanhe suas receitas e despesas mês a mês',
      icon: (
        <svg className={styles.resourceIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Relatórios Básicos',
      description: 'Acompanhe sua evolução financeira através de relatórios simples',
      icon: (
        <svg className={styles.resourceIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Categorização',
      description: 'Organize suas transações em categorias para melhor controle',
      icon: (
        <svg className={styles.resourceIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <section className={styles.resourcesSection}>
        <h1 className={styles.title}>
          Recursos do <span className={styles.highlight}>Balancium</span>
        </h1>
        <p className={styles.subtitle}>
          Ferramentas essenciais para seu controle financeiro
        </p>
        
        <div className={styles.resourcesGrid}>
          {recursos.map((recurso, index) => (
            <div key={index} className={styles.resourceCard}>
              {recurso.icon}
              <h3 className={styles.resourceTitle}>{recurso.title}</h3>
              <p className={styles.resourceDescription}>{recurso.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 