import Image from 'next/image';
import Link from 'next/link';
import styles from './como-funciona.module.css';

export function ComoFunciona() {
  const passos = [
    {
      numero: "01",
      titulo: "Cadastro Simplificado",
      descricao: "Crie sua conta em segundos com apenas algumas informações básicas",
      icon: (
        <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      numero: "02",
      titulo: "Configure suas Categorias",
      descricao: "Personalize as categorias de acordo com seu perfil financeiro",
      icon: (
        <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      )
    },
    {
      numero: "03",
      titulo: "Registre Transações",
      descricao: "Adicione receitas e despesas de forma rápida e organizada",
      icon: (
        <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      numero: "04",
      titulo: "Acompanhe Resultados",
      descricao: "Visualize relatórios detalhados e tome decisões informadas",
      icon: (
        <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 19l-4 1.5v-15l4-1.5m0 15v-15m0 0l7-3m0 0l4 1.5v15l-4-1.5m0 0v-15" />
        </svg>
      )
    }
  ];

  const recursos = [
    {
      titulo: "Dashboard Intuitivo",
      descricao: "Visualize seus dados financeiros em um painel claro e objetivo",
      icon: (
        <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    },
    {
      titulo: "Categorização Automática",
      descricao: "Sistema inteligente que aprende com seus hábitos financeiros",
      icon: (
        <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      titulo: "Relatórios Detalhados",
      descricao: "Análises completas da sua vida financeira com gráficos e projeções",
      icon: (
        <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <h1 className={styles.title}>
          Como o <span className={styles.highlight}>Balancium</span> funciona?
        </h1>
        <p className={styles.subtitle}>
          Descubra como nossa plataforma pode ajudar você a alcançar seus objetivos financeiros
        </p>
      </section>

      <section className={styles.stepsSection}>
        <div className={styles.stepsGrid}>
          {passos.map((passo, index) => (
            <div key={index} className={styles.stepCard}>
              <span className={styles.stepNumber}>{passo.numero}</span>
              <div className={styles.iconWrapper}>
                {passo.icon}
              </div>
              <h3 className={styles.stepTitle}>{passo.titulo}</h3>
              <p className={styles.stepDescription}>{passo.descricao}</p>
              <div className={styles.stepProgress}>
                <div className={styles.progressLine} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.featureGrid}>
          {recursos.map((recurso, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                {recurso.icon}
              </div>
              <h3>{recurso.titulo}</h3>
              <p>{recurso.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.demoSection}>
        <div className={styles.demoContent}>
          <div className={styles.demoText}>
            <h2>Experimente nossa plataforma</h2>
            <p>Veja como é fácil começar a organizar suas finanças com o Balancium</p>
            <ul className={styles.demoList}>
              <li>✓ Dashboard personalizado</li>
              <li>✓ Relatórios detalhados</li>
              <li>✓ Categorização inteligente</li>
              <li>✓ Suporte dedicado</li>
            </ul>
          </div>
          <div className={styles.demoImage}>
            <Image
              src="/img_dashboard.png"
              alt="Dashboard do Balancium"
              width={600}
              height={400}
              className={styles.dashboardImage}
            />
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Pronto para começar?</h2>
        <p className={styles.ctaText}>
          Junte-se a milhares de pessoas que já estão transformando sua vida financeira
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/cadastro" className={styles.primaryButton}>
            Começar Gratuitamente
          </Link>
          <Link href="/precos" className={styles.secondaryButton}>
            Ver Planos
          </Link>
        </div>
      </section>
    </div>
  );
} 