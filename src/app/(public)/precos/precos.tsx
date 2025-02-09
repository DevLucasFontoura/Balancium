import styles from './precos.module.css';

export function Precos() {
  const planos = [
    {
      nome: "Grátis",
      preco: "R$ 0",
      periodo: "para sempre",
      recursos: [
        "Dashboard básico",
        "Controle de receitas e despesas",
        "Categorização simples",
        "Relatórios mensais",
      ],
      destaque: false,
      botao: "Começar Grátis"
    },
    {
      nome: "Premium",
      preco: "R$ 9,90",
      periodo: "por mês",
      recursos: [
        "Todas as features do plano Grátis",
        "Relatórios avançados",
        "Metas financeiras",
        "Categorias personalizadas",
        "Alertas personalizados",
        "Suporte prioritário"
      ],
      destaque: true,
      botao: "Assinar Premium"
    },
    {
      nome: "Empresarial",
      preco: "R$ 29,90",
      periodo: "por mês",
      recursos: [
        "Todas as features do plano Premium",
        "Múltiplos usuários",
        "Relatórios empresariais",
        "API de integração",
        "Suporte 24/7",
        "Treinamento personalizado"
      ],
      destaque: false,
      botao: "Contatar Vendas"
    }
  ];

  return (
    <div className={styles.container}>
      <section className={styles.pricingSection}>
        <h1 className={styles.title}>Planos e Preços</h1>
        <p className={styles.subtitle}>
          Escolha o plano ideal para suas necessidades
        </p>
        
        <div className={styles.plansGrid}>
          {planos.map((plano, index) => (
            <div 
              key={index} 
              className={`${styles.planCard} ${plano.destaque ? styles.highlighted : ''}`}
            >
              <div className={styles.planHeader}>
                <h3 className={styles.planName}>{plano.nome}</h3>
                <div className={styles.planPrice}>
                  <span className={styles.price}>{plano.preco}</span>
                  <span className={styles.period}>/{plano.periodo}</span>
                </div>
              </div>
              
              <ul className={styles.featuresList}>
                {plano.recursos.map((recurso, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {recurso}
                  </li>
                ))}
              </ul>
              
              <button className={`${styles.planButton} ${plano.destaque ? styles.highlightedButton : ''}`}>
                {plano.botao}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 