'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import styles from './planoassinatura.module.css';
import { useRouter } from 'next/navigation';

interface UserPlan {
  type: 'free' | 'plus' | 'premium';
  features: string[];
  startDate: string;
  status: 'active' | 'inactive' | 'pending';
}

interface UserData {
  plan: UserPlan;
  email: string;
  name: string;
}

const PLANOS = {
  free: {
    nome: 'Gratuito',
    preco: 'R$ 0,00'
  },
  plus: {
    nome: 'Plus',
    preco: 'R$ 9,90/mês'
  },
  premium: {
    nome: 'Premium',
    preco: 'R$ 19,90/mês'
  }
};

const RECURSOS = [
  {
    nome: 'Armazenamento Ilimitado',
    free: true,
    plus: true,
    premium: true
  },
  {
    nome: 'Suporte por email',
    free: true,
    plus: true,
    premium: true
  },
  {
    nome: 'Controle Básico',
    free: true,
    plus: true,
    premium: true
  },
  {
    nome: 'Relatórios Mensais',
    free: true,
    plus: true,
    premium: true
  },
  {
    nome: 'Categorias Básicas',
    free: true,
    plus: true,
    premium: true
  },
  {
    nome: 'Editar Transações',
    free: false,
    plus: true,
    premium: true
  },
  {
    nome: 'Editar Categorias',
    free: false,
    plus: true,
    premium: true
  },
  {
    nome: 'Criar Categorias',
    free: false,
    plus: true,
    premium: true
  },
  {
    nome: 'Exportar Dados',
    free: false,
    plus: true,
    premium: true
  },
  {
    nome: 'Anexar Arquivos',
    free: false,
    plus: false,
    premium: true
  },
  
];

export default function PlanoAssinatura() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <button
        onClick={() => router.push('/configuracoes')}
        className={styles.backButton}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Voltar
      </button>

      <div className={styles.heroCard}>
        <h1 className={styles.heroTitle}>Plano e Assinatura</h1>
        <p className={styles.heroSubtitle}>Escolha o melhor plano para você</p>
      </div>

      <div className={styles.content}>
        {/* Plano Atual */}
        <Card className={styles.currentPlanCard}>
          <div className={styles.currentPlanHeader}>
            <div>
              <h2 className={styles.currentPlanTitle}>Seu Plano Atual</h2>
              <p className={styles.currentPlanType}>
                {userData?.plan ? PLANOS[userData.plan.type].nome : 'Carregando...'}
              </p>
            </div>
            <div className={styles.planStatus}>
              <span className={`${styles.statusBadge} ${styles[userData?.plan?.status || '']}`}>
                {userData?.plan?.status === 'active' ? 'Ativo' : 'Pendente'}
              </span>
            </div>
          </div>
        </Card>

        {/* Tabela de Comparação */}
        <div className={styles.comparisonTable}>
          {/* Cabeçalho dos Planos */}
          <div className={styles.plansHeader}>
            <div className={styles.featureHeader}>
              <h2>Recursos</h2>
            </div>
            {Object.entries(PLANOS).map(([key, plano]) => (
              <div key={key} className={styles.planColumn}>
                <h3 className={styles.planColumnTitle}>{plano.nome}</h3>
                <p className={styles.planColumnPrice}>{plano.preco}</p>
                <Button 
                  variant={userData?.plan?.type === key ? 'outline' : 'primary'}
                  className={`${styles.planButton} ${key === 'premium' ? styles.premiumButton : ''}`}
                  disabled={userData?.plan?.type === key}
                >
                  {userData?.plan?.type === key ? 'Plano Atual' : 'Escolher Plano'}
                </Button>
              </div>
            ))}
          </div>

          {/* Lista de Recursos */}
          <div className={styles.featuresList}>
            {RECURSOS.map((recurso, index) => (
              <div key={index} className={styles.featureRow}>
                <div className={styles.featureName}>{recurso.nome}</div>
                <div className={`${styles.featureCheck} ${recurso.free ? styles.checkMark : styles.xMark}`}>
                  {recurso.free ? '✓' : '×'}
                </div>
                <div className={`${styles.featureCheck} ${recurso.plus ? styles.checkMark : styles.xMark}`}>
                  {recurso.plus ? '✓' : '×'}
                </div>
                <div className={`${styles.featureCheck} ${recurso.premium ? styles.checkMark : styles.xMark}`}>
                  {recurso.premium ? '✓' : '×'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 