import { CONSTANTES } from '@/constants/constantes';
import styles from './bem-vindo.module.css';
import Image from 'next/image';
import Link from 'next/link';

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
          <h1 className={styles.title}>
            <span>Controle suas finanças</span>
            <span>com simplicidade e eficiência</span>
          </h1>
          <div className={styles.heroGrid}>
            <div className={styles.textContent}>
              <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_BEM_VINDO}</p>
              <div className={styles.buttonGroup}>
                <Link href={CONSTANTES.ROUTE_CADASTRO} className="btn-primary">{CONSTANTES.COMECAR_GRATIS}</Link>
                <Link href={CONSTANTES.ROUTE_COMO_FUNCIONA} className={styles.secondaryButton}>{CONSTANTES.SAIBA_MAIS}</Link>
              </div>
            </div>
            <div className={styles.heroImage}>
              <div className={styles.imageContainer}>
                <Image src={CONSTANTES.IMAGEM_INICIAL_BEM_VINDO} alt="Preview do Dashboard do Balancium" fill
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

          <h2 className={styles.sectionTitle}> {CONSTANTES.TITULO_BENEFICIOS} </h2>

          <div className={styles.benefitsGrid}>

            <div className={styles.benefitCard}> <div className={`${styles.benefitIcon} ${styles.benefitIcon1}`} />
              <h3 className={styles.benefitTitle}>{CONSTANTES.CARD_BENEFICIOS_01}</h3>
              <p className={styles.benefitText}> {CONSTANTES.DESCRICAO_BENEFICIOS_01} </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={`${styles.benefitIcon} ${styles.benefitIcon2}`} />
              <h3 className={styles.benefitTitle}>{CONSTANTES.CARD_BENEFICIOS_02}</h3>
              <p className={styles.benefitText}> {CONSTANTES.DESCRICAO_BENEFICIOS_02} </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={`${styles.benefitIcon} ${styles.benefitIcon3}`} />
              <h3 className={styles.benefitTitle}>{CONSTANTES.CARD_BENEFICIOS_03}</h3>
              <p className={styles.benefitText}> {CONSTANTES.DESCRICAO_BENEFICIOS_03} </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={`${styles.benefitIcon} ${styles.benefitIcon4}`} />
              <h3 className={styles.benefitTitle}>{CONSTANTES.CARD_BENEFICIOS_04}</h3>
              <p className={styles.benefitText}> {CONSTANTES.DESCRICAO_BENEFICIOS_04} </p>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialSection}>
        <div className={styles.benefitsContent}>

          <h2 className={styles.sectionTitle}> {CONSTANTES.TITULO_TESTEMUNHOS} </h2>

          <div className={styles.benefitsGrid}>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}> {CONSTANTES.TESTEMUNHO_01} </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar} />
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>{CONSTANTES.NOME_TESTEMUNHO_01}</div>
                  <div className={styles.authorRole}>{CONSTANTES.CARGO_TESTEMUNHO_01}</div>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}> {CONSTANTES.TESTEMUNHO_02}</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar} />
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>{CONSTANTES.NOME_TESTEMUNHO_02}</div>
                  <div className={styles.authorRole}>{CONSTANTES.CARGO_TESTEMUNHO_02}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.benefitsContent}>
          <h2 className={styles.ctaTitle}> {CONSTANTES.TITULO_CTA} </h2>
          <p className={styles.ctaText}> {CONSTANTES.DESCRICAO_CTA} </p>
          <Link href={CONSTANTES.ROUTE_CADASTRO} className={styles.ctaButton}> {CONSTANTES.BOTAO_CTA} </Link>
        </div>
      </section>
    </div>
  );
} 