import { CONSTANTES } from '@/constants/constantes';
import styles from './precos.module.css';
import Link from 'next/link';

export function Precos() {
  return (
    <div className={styles.container}>
      <section className={styles.pricingSection}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}> {CONSTANTES.TITULO_PAGINA_PRECOS_01} <span className={styles.highlight}>{CONSTANTES.TITULO_PAGINA_PRECOS_02}</span> </h1>
          <p className={styles.subtitle}> {CONSTANTES.DESCRICAO_PAGINA_PRECOS} </p>
        </div>
        
        <div className={styles.comparisonTable}>
          <div className={styles.plansHeader}>
            <div className={styles.featureHeader}>{CONSTANTES.TITULO_RECURSOS}</div>
            <div className={styles.planColumn}>
              <div className={styles.planTag}>{CONSTANTES.TAG_BASICO}</div>
              <div className={styles.planColumnTitle}>{CONSTANTES.TITULO_GRATUTITO}</div>
              <div className={styles.planColumnPrice}>{CONSTANTES.VALOR_GRATUITO}</div>
              <div className={styles.planPeriod}>{CONSTANTES.PERIODO_GRATUITO}</div>
              <Link href={CONSTANTES.ROUTE_CADASTRO} className={styles.planButton}>{CONSTANTES.BOTAO_GRATUITO}</Link>
            </div>
            <div className={`${styles.planColumn} ${styles.popularPlan}`}>
              <div className={styles.planTag}>{CONSTANTES.TAG_POPULAR}</div>
              <div className={styles.planColumnTitle}>{CONSTANTES.TITULO_PLUS}</div>
              <div className={styles.planColumnPrice}>{CONSTANTES.VALOR_PLUS}</div>
              <div className={styles.planPeriod}>{CONSTANTES.PERIODO_PLUS}</div>
              <Link href={CONSTANTES.ROUTE_CADASTRO} className={`${styles.planButton} ${styles.primaryButton}`}>{CONSTANTES.BOTAO_ESCOLHER_PLUS}</Link>
            </div>
            <div className={styles.planColumn}>
              <div className={styles.planTag}>{CONSTANTES.TAG_COMPLETO}</div>
              <div className={styles.planColumnTitle}>{CONSTANTES.TITULO_PREMIUM}</div>
              <div className={styles.planColumnPrice}>{CONSTANTES.VALOR_PREMIUM}</div>
              <div className={styles.planPeriod}>{CONSTANTES.PERIODO_PREMIUM}</div>
              <Link href={CONSTANTES.ROUTE_CADASTRO} className={styles.planButton}>{CONSTANTES.BOTAO_ESCOLHER_PREMIUM}</Link>
            </div>
          </div>

          <div className={styles.featuresList}>
            <div className={styles.featureGroup}>
              <div className={styles.featureGroupTitle}>{CONSTANTES.TITULO_RECURSOS_BASICOS}</div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}><span>{CONSTANTES.ITEM_RECURSOS_BASICOS_01_TITULO}</span> <span className={styles.featureDescription}>{CONSTANTES.ITEM_RECURSOS_BASICOS_01_DESCRICAO}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}><span>{CONSTANTES.ITEM_RECURSOS_BASICOS_02_TITULO}</span> <span className={styles.featureDescription}>{CONSTANTES.ITEM_RECURSOS_BASICOS_02_DESCRICAO}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}><span>{CONSTANTES.ITEM_RECURSOS_BASICOS_03_TITULO}</span> <span className={styles.featureDescription}>{CONSTANTES.ITEM_RECURSOS_BASICOS_03_DESCRICAO}</span> </div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}><span>{CONSTANTES.ITEM_RECURSOS_BASICOS_04_TITULO}</span> <span className={styles.featureDescription}>{CONSTANTES.ITEM_RECURSOS_BASICOS_04_DESCRICAO}</span> </div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}><span>{CONSTANTES.ITEM_RECURSOS_BASICOS_05_TITULO}</span> <span className={styles.featureDescription}>{CONSTANTES.ITEM_RECURSOS_BASICOS_05_DESCRICAO}</span> </div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
              </div>
            </div>

            <div className={styles.featureGroup}>
              <div className={styles.featureGroupTitle}>{CONSTANTES.TITULO_RECURSOS_PLUS}</div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}><span>{CONSTANTES.ITEM_RECURSOS_PLUS_01_TITULO}</span> <span className={styles.featureDescription}>{CONSTANTES.ITEM_RECURSOS_PLUS_01_DESCRICAO}</span> </div>
                <div className={styles.featureCheck}><span className={styles.xMark}>{CONSTANTES.LABEL_X}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}><span>{CONSTANTES.ITEM_RECURSOS_PLUS_02_TITULO}</span> <span className={styles.featureDescription}>{CONSTANTES.ITEM_RECURSOS_PLUS_02_DESCRICAO}</span> </div>
                <div className={styles.featureCheck}><span className={styles.xMark}>{CONSTANTES.LABEL_X}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}><span>{CONSTANTES.ITEM_RECURSOS_PLUS_03_TITULO}</span> <span className={styles.featureDescription}>{CONSTANTES.ITEM_RECURSOS_PLUS_03_DESCRICAO}</span> </div>
                <div className={styles.featureCheck}><span className={styles.xMark}>{CONSTANTES.LABEL_X}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
              </div>
            </div>

            <div className={styles.featureGroup}>
              <div className={styles.featureGroupTitle}>{CONSTANTES.TITULO_RECURSOS_PREMIUM}</div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}><span>{CONSTANTES.ITEM_RECURSOS_PREMIUM_01_TITULO}</span> <span className={styles.featureDescription}>{CONSTANTES.ITEM_RECURSOS_PREMIUM_01_DESCRICAO}</span> </div>
                <div className={styles.featureCheck}><span className={styles.xMark}>{CONSTANTES.LABEL_X}</span></div>
                <div className={styles.featureCheck}><span className={styles.xMark}>{CONSTANTES.LABEL_X}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}><span>{CONSTANTES.ITEM_RECURSOS_PREMIUM_02_TITULO}</span> <span className={styles.featureDescription}>{CONSTANTES.ITEM_RECURSOS_PREMIUM_02_DESCRICAO}</span> </div>
                <div className={styles.featureCheck}><span className={styles.xMark}>{CONSTANTES.LABEL_X}</span></div>
                <div className={styles.featureCheck}><span className={styles.xMark}>{CONSTANTES.LABEL_X}</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>{CONSTANTES.LABEL_CHECK}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 