import { ResourceCategorizationIcon } from '@/components/icons/ResourceCategorizationIcon';
import { ResourceDashboardIcon } from '@/components/icons/ResourceDashboardIcon';
import { ResourceCalendarIcon } from '@/components/icons/ResourceCalendarIcon';
import { ResourceReportsIcon } from '@/components/icons/ResourceReportsIcon';
import { CONSTANTES } from '@/constants/constantes';
import styles from './recursos.module.css';
import Image from 'next/image';
import Link from 'next/link';

export function Recursos() {
  const recursos = [
    { title: CONSTANTES.TITULO_RECURSO_CARD_01, description: CONSTANTES.DESCRICAO_RECURSO_CARD_01, icon: <ResourceDashboardIcon      className={styles.resourceIcon} /> },
    { title: CONSTANTES.TITULO_RECURSO_CARD_02, description: CONSTANTES.DESCRICAO_RECURSO_CARD_02, icon: <ResourceCalendarIcon       className={styles.resourceIcon} /> },
    { title: CONSTANTES.TITULO_RECURSO_CARD_03, description: CONSTANTES.DESCRICAO_RECURSO_CARD_03, icon: <ResourceReportsIcon        className={styles.resourceIcon} /> },
    { title: CONSTANTES.TITULO_RECURSO_CARD_04, description: CONSTANTES.DESCRICAO_RECURSO_CARD_04, icon: <ResourceCategorizationIcon className={styles.resourceIcon} /> }
  ];

  const beneficios = [
    { title: CONSTANTES.TITULO_BENEFICIOS_CARD_01, description: CONSTANTES.DESCRICAO_BENEFICIOS_CARD_01 },
    { title: CONSTANTES.TITULO_BENEFICIOS_CARD_02, description: CONSTANTES.DESCRICAO_BENEFICIOS_CARD_02 },
    { title: CONSTANTES.TITULO_BENEFICIOS_CARD_03, description: CONSTANTES.DESCRICAO_BENEFICIOS_CARD_03 }
  ];

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <h1 className={styles.title}> {CONSTANTES.TITULO_RECURSOS_01} <span className={styles.highlight}>{CONSTANTES.TITULO_RECURSOS_02}</span> </h1>
        <p className={styles.subtitle}> {CONSTANTES.DESCRICAO_RECURSOS} </p>
      </section>
      
      <section className={styles.resourcesSection}>
        <div className={styles.resourcesGrid}>
          {recursos.map((recurso, index) => (
            <div key={index} className={styles.resourceCard}>
              <div className={styles.iconWrapper}> {recurso.icon} </div>
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
              src={CONSTANTES.CAMINHO_IMAGEM_RELATORIOS}
              alt={CONSTANTES.DESCRICAO_IMAGEM_RELATORIOS}
              width={600}
              height={400}
              className={styles.dashboardPreview}
            />
          </div>
          <div className={styles.demoText}>
            <h2>{CONSTANTES.TITULO_EXPERIMENTE_NA_PRATICA}</h2>
            <p>{CONSTANTES.DESCRICAO_EXPERIMENTE_NA_PRATICA}</p>

            <div className={styles.benefitsGrid}>
              {beneficios.map((beneficio, index) => ( <div key={index} className={styles.benefitItem}> <h4>{beneficio.title}</h4> <p>{beneficio.description}</p> </div> ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2>{CONSTANTES.COMECE_A_USAR_AGORA}</h2>
        <p>{CONSTANTES.DESCRICAO_COMECE_A_USAR_AGORA}</p>
        <div className={styles.ctaButtons}>
          <Link href={CONSTANTES.ROUTE_CADASTRO} className={styles.primaryButton}>{CONSTANTES.COMECAR_GRATIS}</Link>
          <Link href={CONSTANTES.ROUTE_COMO_FUNCIONA} className={styles.secondaryButton}>{CONSTANTES.SAIBA_MAIS}</Link>
        </div>
      </section>
    </div>
  );
} 