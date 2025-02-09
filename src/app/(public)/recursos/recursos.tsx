import styles from './recursos.module.css';

export function Recursos() {
  const recursos = [
    {
      title: 'Dashboard Intuitivo',
      description: 'Visualize suas finanças em um painel completo e fácil de entender',
      icon: '📊'
    },
    {
      title: 'Controle Mensal',
      description: 'Acompanhe suas receitas e despesas mês a mês',
      icon: '📅'
    },
    {
      title: 'Relatórios Detalhados',
      description: 'Gere relatórios e gráficos para melhor análise',
      icon: '📈'
    },
    {
      title: 'Categorização Inteligente',
      description: 'Organize suas transações em categorias personalizadas',
      icon: '🏷️'
    },
    {
      title: 'Metas Financeiras',
      description: 'Defina e acompanhe suas metas de economia',
      icon: '🎯'
    },
    {
      title: 'Alertas Personalizados',
      description: 'Receba notificações sobre seus gastos e objetivos',
      icon: '🔔'
    }
  ];

  return (
    <div className={styles.container}>
      <section className={styles.resourcesSection}>
        <h1 className={styles.title}>Recursos do Balancium</h1>
        <p className={styles.subtitle}>
          Ferramentas poderosas para seu controle financeiro
        </p>
        
        <div className={styles.resourcesGrid}>
          {recursos.map((recurso, index) => (
            <div key={index} className={styles.resourceCard}>
              <div className={styles.resourceIcon}>{recurso.icon}</div>
              <h3 className={styles.resourceTitle}>{recurso.title}</h3>
              <p className={styles.resourceDescription}>{recurso.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 