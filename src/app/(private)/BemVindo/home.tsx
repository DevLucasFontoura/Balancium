'use client';

import { BemVindoNewTransactionIcon } from '@/components/icons/BemVindoNewTransactionIcon';
import { BemVindoDashboardIcon } from '@/components/icons/BemVindoDashboardIcon';
import { BemVindoReportsIcon } from '@/components/icons/BemVindoReportsIcon';
import { ResumoAnual } from '../componentes/resumos/ResumoAnual';
import { financialTips } from './data/financialTips';
import { CONSTANTES } from '@/constants/constantes';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styles from './home.module.css';
import Link from 'next/link';

interface UserData {
  name: string;
  email: string;
  settings: {
    currency: string;
    language: string;
  };
}

export function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [randomTips, setRandomTips] = useState<typeof financialTips>([]);

  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error(CONSTANTES.ERRO_AO_CARREGAR_DADOS_DO_USUARIO, error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    // Função para selecionar 3 dicas aleatórias
    const getRandomTips = () => {
      const shuffled = [...financialTips].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    };

    setRandomTips(getRandomTips());
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}><div className={styles.loadingSpinner}></div></div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Seção de Boas-vindas */}
      <section className={styles.welcomeHero}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>{CONSTANTES.LABEL_OLA}, {userData?.name || CONSTANTES.LABEL_USUARIO}! 👋</h1>
          <p className={styles.welcomeMessage}>{CONSTANTES.DESCRICAO_BEM_VINDO_LOGADO}</p>
        </div>
        
        {/* Usando o ResumoAnual aqui */}
        <div className={styles.resumoAnualContainer}><ResumoAnual /></div>
      </section>

      {/* Seção de Ações Rápidas */}
      <section className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>{CONSTANTES.TITULO_ACOES_RAPIDAS}</h2>
        <div className={styles.actionGrid}>
          <Link href={CONSTANTES.ROUTE_NOVA_TRANSACAO}>
            <div className={`${styles.actionCard} ${styles.primaryAction}`}>
              <div className={styles.actionIcon}><BemVindoNewTransactionIcon /></div>
              <h3 className={styles.actionTitle}>{CONSTANTES.TITULO_ACOES_RAPIDAS_NOVA_TRANSACAO}</h3>
              <p className={styles.actionDescription}>{CONSTANTES.DESCRICAO_ACOES_RAPIDAS_NOVA_TRANSACAO}</p>
            </div>
          </Link>

          <Link href={CONSTANTES.ROUTE_RELATORIOS}>
            <div className={styles.actionCard}>
              <div className={styles.actionIcon}><BemVindoReportsIcon /></div>
              <h3 className={styles.actionTitle}>{CONSTANTES.TITULO_ACOES_RAPIDAS_RELATORIOS}</h3>
              <p className={styles.actionDescription}>{CONSTANTES.DESCRICAO_ACOES_RAPIDAS_RELATORIOS}</p>
            </div>
          </Link>

          <Link href={CONSTANTES.ROUTE_DASHBOARD}>
            <div className={styles.actionCard}>
              <div className={styles.actionIcon}><BemVindoDashboardIcon /></div>
              <h3 className={styles.actionTitle}>{CONSTANTES.TITULO_ACOES_RAPIDAS_DASHBOARD}</h3>
              <p className={styles.actionDescription}>{CONSTANTES.DESCRICAO_ACOES_RAPIDAS_DASHBOARD}</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Seção de Dicas */}
      <section className={styles.tipsSection}>
        <h2 className={styles.sectionTitle}>{CONSTANTES.TITULO_DICAS_PARA_VOCE}</h2>
        <div className={styles.tipsGrid}>
          {randomTips.map((tip, index) => (
            <div key={index} className={styles.tipCard}>
              <div className={styles.tipIcon}>{tip.icon}</div>
              <h3 className={styles.tipTitle}>{tip.title}</h3>
              <p className={styles.tipDescription}>
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 