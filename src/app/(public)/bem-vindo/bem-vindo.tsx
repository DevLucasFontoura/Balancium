import Image from 'next/image';
import Link from 'next/link';
import styles from './bem-vindo.module.css';

export function BemVindo() {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundElements}>
        <div className={styles.gradientOrb} />
        <div className={styles.gradientOrb2} />
      </div>
      
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
                Tome decisões financeiras com confiança e alcance seus objetivos.
              </p>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Gestão simplificada</span>
                </div>
                <div className={styles.feature}>
                  <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none">
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Tempo real</span>
                </div>
                <div className={styles.feature}>
                  <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none">
                    <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>100% seguro</span>
                </div>
              </div>
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
                    width="20" 
                    height="20" 
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
              <div className={styles.imageContainer}>
                <Image
                  src="/img_dashboard.png"
                  alt="Preview do Dashboard do Balancium"
                  fill
                  style={{ 
                    objectFit: 'contain',
                    padding: '1.5rem'
                  }}
                  priority
                  quality={100}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.benefitsContent}>
          <h2 className={styles.sectionTitle}>
            Por que escolher o Balancium?
          </h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="none">
                <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <h3 className={styles.benefitTitle}>Fácil de Usar</h3>
              <p className={styles.benefitText}>
                Interface intuitiva que permite começar a controlar suas finanças em minutos, sem complicações.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="none">
                <path d="M9 19L3.78974 20.7106C3.0044 20.9972 2.15775 20.2498 2.44442 19.4645L4 15M9 19L20.0885 7.91154C20.8696 7.13037 20.8696 5.86961 20.0885 5.08844L18.9116 3.91154C18.1304 3.13037 16.8696 3.13037 16.0885 3.91154L5 15M9 19L5 15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <h3 className={styles.benefitTitle}>Personalização Total</h3>
              <p className={styles.benefitText}>
                Crie categorias, metas e relatórios personalizados que se adequam ao seu estilo de vida.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="none">
                <path d="M16 8V16M12 11V16M8 14V16M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3 className={styles.benefitTitle}>Análises Detalhadas</h3>
              <p className={styles.benefitText}>
                Gráficos e relatórios que mostram exatamente para onde seu dinheiro está indo.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className={styles.benefitTitle}>Segurança Garantida</h3>
              <p className={styles.benefitText}>
                Seus dados são protegidos com as mais avançadas tecnologias de criptografia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialSection}>
        <div className={styles.benefitsContent}>
          <h2 className={styles.sectionTitle}>
            O que nossos usuários dizem
          </h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>
                "O Balancium mudou completamente a forma como eu lido com minhas finanças. Agora tenho total controle dos meus gastos e consigo planejar melhor meu futuro."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar} />
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>Maria Silva</div>
                  <div className={styles.authorRole}>Profissional Autônoma</div>
                </div>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>
                "Interface super intuitiva e fácil de usar. Em poucos dias já consegui ter uma visão clara das minhas finanças e identificar onde posso economizar."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar} />
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>João Santos</div>
                  <div className={styles.authorRole}>Empresário</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.benefitsContent}>
          <h2 className={styles.ctaTitle}>
            Comece a controlar suas finanças hoje
          </h2>
          <p className={styles.ctaText}>
            Junte-se a milhares de pessoas que já estão transformando sua vida financeira com o Balancium
          </p>
          <Link href="/cadastro" className={styles.ctaButton}>
            Criar Conta Gratuita
          </Link>
        </div>
      </section>
    </div>
  );
} 