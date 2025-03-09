import Image from 'next/image';
import Link from 'next/link';
import styles from './recursos.module.css';

export function Recursos() {
  const recursos = [
    {
      title: 'Dashboard Intuitivo',
      description: 'Visualize suas finanças de forma clara e objetiva com gráficos interativos e análises em tempo real.',
      icon: (
        <svg className={styles.resourceIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Controle Mensal',
      description: 'Acompanhe suas receitas e despesas detalhadamente por mês.',
      icon: (
        <svg className={styles.resourceIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Relatórios',
      description: 'Análise detalhada da sua evolução financeira com projeções e comparativos mensais.',
      icon: (
        <svg className={styles.resourceIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Categorização',
      description: 'Crie e edite categorias para organizar suas transações.',
      icon: (
        <svg className={styles.resourceIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      )
    }
  ];

  const beneficios = [
    {
      title: 'Economia de Tempo',
      description: 'Automatize suas finanças e economize horas de trabalho manual'
    },
    {
      title: 'Decisões Informadas',
      description: 'Tome decisões financeiras baseadas em dados reais e análises precisas'
    },
    {
      title: 'Organização Total',
      description: 'Mantenha todos os seus dados financeiros organizados em um só lugar'
    }
  ];

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <h1 className={styles.title}>
          Recursos do <span className={styles.highlight}>Balancium</span>
        </h1>
        <p className={styles.subtitle}>
          Ferramentas poderosas para transformar sua gestão financeira
        </p>
      </section>
      
      <section className={styles.resourcesSection}>
        <div className={styles.resourcesGrid}>
          {recursos.map((recurso, index) => (
            <div key={index} className={styles.resourceCard}>
              <div className={styles.iconWrapper}>
                {recurso.icon}
              </div>
              <h3 className={styles.resourceTitle}>{recurso.title}</h3>
              <p className={styles.resourceDescription}>{recurso.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.demoSection}>
        <div className={styles.demoContent}>
          <div className={styles.demoImage}>
            <Image
              src="/img_relatorios.png"
              alt="Relatórios do Balancium"
              width={600}
              height={400}
              className={styles.dashboardPreview}
            />
          </div>
          <div className={styles.demoText}>
            <h2>Experimente na Prática</h2>
            <p>
              Veja como o Balancium pode transformar sua gestão financeira com uma 
              interface moderna e recursos poderosos.
            </p>
            <div className={styles.benefitsGrid}>
              {beneficios.map((beneficio, index) => (
                <div key={index} className={styles.benefitItem}>
                  <h4>{beneficio.title}</h4>
                  <p>{beneficio.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2>Comece a usar agora mesmo</h2>
        <p>Junte-se a milhares de usuários que já transformaram suas finanças</p>
        <div className={styles.ctaButtons}>
          <Link href="/cadastro" className={styles.primaryButton}>
            Criar Conta Grátis
          </Link>
          <Link href="/como-funciona" className={styles.secondaryButton}>
            Saiba Mais
          </Link>
        </div>
      </section>
    </div>
  );
} 