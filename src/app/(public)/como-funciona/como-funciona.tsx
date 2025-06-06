import { CONSTANTES } from '@/constants/constantes';
import styles from './como-funciona.module.css';
import Image from 'next/image';
import Link from 'next/link';

export function ComoFunciona() {
  const passos = [
    {
      numero: CONSTANTES.CARD_COMO_FUNCIONA_NUMERO_01,
      titulo: CONSTANTES.CARD_COMO_FUNCIONA_TITULO_01,
      descricao: CONSTANTES.CARD_COMO_FUNCIONA_DESCRICAO_01,
      icon: ( <div className={styles.stepIcon} />)
    },
    {
      numero: CONSTANTES.CARD_COMO_FUNCIONA_NUMERO_02,
      titulo: CONSTANTES.CARD_COMO_FUNCIONA_TITULO_02,
      descricao: CONSTANTES.CARD_COMO_FUNCIONA_DESCRICAO_02,
      icon: ( <div className={styles.stepIcon} /> )
    },
    {
      numero: CONSTANTES.CARD_COMO_FUNCIONA_NUMERO_03,
      titulo: CONSTANTES.CARD_COMO_FUNCIONA_TITULO_03,
      descricao: CONSTANTES.CARD_COMO_FUNCIONA_DESCRICAO_03,
      icon: ( <div className={styles.stepIcon} /> )
    },
    {
      numero: CONSTANTES.CARD_COMO_FUNCIONA_NUMERO_04,
      titulo: CONSTANTES.CARD_COMO_FUNCIONA_TITULO_04,
      descricao: CONSTANTES.CARD_COMO_FUNCIONA_DESCRICAO_04,
      icon: ( <div className={styles.stepIcon} /> )
    }
  ];

  const recursos = [
    {
      titulo: CONSTANTES.CARD_DASHBOARD_INTUITIVO,
      descricao: CONSTANTES.CARD_DASHBOARD_INTUITIVO_DESCRICAO,
      icon: ( <div className={styles.featureIcon} /> )
    },
    {
      titulo: CONSTANTES.CARD_CATEGORIZACAO_AUTOMATICO,
      descricao: CONSTANTES.CARD_CATEGORIZACAO_AUTOMATICO_DESCRICAO,
      icon: ( <div className={styles.featureIcon} /> )
    },
    {
      titulo: CONSTANTES.CARD_RELATORIOS_DETALHADOS,
      descricao: CONSTANTES.CARD_RELATORIOS_DETALHADOS_DESCRICAO,
      icon: ( <div className={styles.featureIcon} /> )
    }
  ];

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <h1 className={styles.title}> {CONSTANTES.TITULO_COMO_FUNCIONA_PARTE_01} <span className={styles.highlight}>{CONSTANTES.TITULO_COMO_FUNCIONA_PARTE_02}</span> {CONSTANTES.TITULO_COMO_FUNCIONA_PARTE_03} </h1>
        <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_COMO_FUNCIONA}</p>
      </section>

      <section className={styles.stepsSection}>
        <div className={styles.stepsGrid}>
          {passos.map((passo, index) => (
            <div key={index} className={styles.stepCard}>
              <span className={styles.stepNumber}>{passo.numero}</span>
              <div className={styles.iconWrapper}> {passo.icon} </div>
              <h3 className={styles.stepTitle}>{passo.titulo}</h3>
              <p className={styles.stepDescription}>{passo.descricao}</p>
              <div className={styles.stepProgress}> <div className={styles.progressLine} /> </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.featureGrid}>
          {recursos.map((recurso, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}> {recurso.icon} </div>
              <h3>{recurso.titulo}</h3>
              <p>{recurso.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.demoSection}>
        <div className={styles.demoContent}>
          <div className={styles.demoText}>
            <h2>{CONSTANTES.TITULO_EXPERIMENTE_NOSSA_PLATAFORMA}</h2>
            <p>{CONSTANTES.DESCRICAO_EXPERIMENTE_NOSSA_PLATAFORMA}</p>
            <ul className={styles.demoList}>
              <li>{CONSTANTES.LISTA_EXPERIMENTE_NOSSA_PLATAFORMA_01}</li>
              <li>{CONSTANTES.LISTA_EXPERIMENTE_NOSSA_PLATAFORMA_02}</li>
              <li>{CONSTANTES.LISTA_EXPERIMENTE_NOSSA_PLATAFORMA_03}</li>
              <li>{CONSTANTES.LISTA_EXPERIMENTE_NOSSA_PLATAFORMA_04}</li>
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
        <h2 className={styles.ctaTitle}>{CONSTANTES.PRONTO_PARA_COMECAR}</h2>
        <p className={styles.ctaText}>{CONSTANTES.DESCRICAO_PRONTO_PARA_COMECAR}</p>
        <div className={styles.ctaButtons}>
          <Link href={CONSTANTES.ROUTE_CADASTRO} className={styles.primaryButton}>{CONSTANTES.BOTAO_PRONTO_PARA_COMECAR} </Link>
          <Link href={CONSTANTES.ROUTE_PRECOS} className={styles.secondaryButton}>{CONSTANTES.BOTAO_VER_PRECOS} </Link>
        </div>
      </section>
    </div>
  );
} 