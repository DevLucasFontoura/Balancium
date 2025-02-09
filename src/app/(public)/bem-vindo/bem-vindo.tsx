import Link from 'next/link';
import styles from './bem-vindo.module.css';

export function BemVindo() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroGrid}>
            <div className={styles.textContent}>
              <h1 className={styles.title}>
                Controle suas finanças com
                <span className={styles.highlight}>simplicidade e eficiência</span>
              </h1>
              <p className={styles.subtitle}>
                Organize suas receitas e despesas de forma inteligente. 
                Tome decisões financeiras com confiança.
              </p>
              <div className={styles.buttonGroup}>
                <Link href="/cadastro" className="btn-primary">
                  Começar Grátis
                </Link>
                <Link 
                  href="/como-funciona" 
                  className={styles.secondaryButton}
                >
                  <span>Saiba Mais</span>
                  <svg 
                    className="w-5 h-5 ml-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className={styles.heroImage}>
              <div className={styles.imageContainer} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Pronto para começar?
          </h2>
          <p className={styles.ctaText}>
            Junte-se a milhares de usuários que já estão controlando melhor suas finanças
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/cadastro" className="btn-primary">
              Criar Conta Grátis
            </Link>
            <Link href="/login" className="btn-secondary">
              Fazer Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 