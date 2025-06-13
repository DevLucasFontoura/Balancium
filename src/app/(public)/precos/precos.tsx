"use client";
import { CONSTANTES } from '@/constants/constantes';
import styles from './precos.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import mobileStyles from './precosMobile.module.css';
import { FaCheck, FaTimes } from 'react-icons/fa';

export function Precos() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dados dos planos e recursos (exemplo, adapte conforme seu CONSTANTES)
  const planos = [
    {
      nome: 'Gratuito',
      preco: 'R$0,00',
      periodo: 'para sempre',
      botao: 'Começar Agora',
      recursos: [true, true, true, true, true, false, false, false, false, false],
    },
    {
      nome: 'Plus',
      preco: 'R$9,90',
      periodo: 'por mês',
      botao: 'Escolher Plus',
      recursos: [true, true, true, true, true, true, true, true, false, false],
    },
    {
      nome: 'Premium',
      preco: 'R$19,90',
      periodo: 'por mês',
      botao: 'Escolher Premium',
      recursos: [true, true, true, true, true, true, true, true, true, true],
    },
  ];
  const recursos = [
    'Armazenamento Ilimitado',
    'Suporte por email',
    'Controle Básico',
    'Relatórios Mensais',
    'Categorias Básicas',
    'Editar Transações',
    'Relatório Mensal',
    'Dashboard',
    'Configurações',
    'Outros Recursos Premium',
  ];

  if (isMobile) {
    return (
      <div className={styles.container}>
        <section className={styles.pricingSection}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}> {CONSTANTES.TITULO_PAGINA_PRECOS_01} <span className={styles.highlight}>{CONSTANTES.TITULO_PAGINA_PRECOS_02}</span> </h1>
            <p className={styles.subtitle}> {CONSTANTES.DESCRICAO_PAGINA_PRECOS} </p>
          </div>
          {planos.map((plano, idx) => (
            <div key={plano.nome} className={mobileStyles.planCard}>
              <div className={mobileStyles.planHeader}>
                <span className={mobileStyles.planName}>{plano.nome}</span>
                <span className={mobileStyles.planPrice}>{plano.preco}</span>
                <span className={mobileStyles.planPeriod}>{plano.periodo}</span>
              </div>
              <ul className={mobileStyles.featuresList}>
                {recursos.map((recurso, i) => (
                  <li key={recurso}>
                    {plano.recursos[i] ? <FaCheck color="#13ba82" /> : <FaTimes color="#dc2626" />} {recurso}
                  </li>
                ))}
              </ul>
              <button className={mobileStyles.planButton}>{plano.botao}</button>
            </div>
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <section className={styles.pricingSection}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}> {CONSTANTES.TITULO_PAGINA_PRECOS_01} <span className={styles.highlight}>{CONSTANTES.TITULO_PAGINA_PRECOS_02}</span> </h1>
          <p className={styles.subtitle}> {CONSTANTES.DESCRICAO_PAGINA_PRECOS} </p>
        </div>
        
        <div className={styles.comparisonTable}>
          <div className={styles.plansHeader}>
            <div className={styles.featureHeader}>{CONSTANTES.TITULO_RECURSOS_CARD}</div>
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