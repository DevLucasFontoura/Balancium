'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import styles from './planoassinatura.module.css';
import { useRouter } from 'next/navigation';

interface UserPlan {
  type: 'free' | 'pro' | 'enterprise';
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
    preco: 'R$ 0,00',
    recursos: [
      'Controle básico de despesas',
      'Relatórios mensais',
      'Até 100 transações/mês'
    ]
  },
  pro: {
    nome: 'Profissional',
    preco: 'R$ 29,90/mês',
    recursos: [
      'Transações ilimitadas',
      'Relatórios avançados',
      'Suporte prioritário',
      'Exportação de dados',
      'Integrações bancárias'
    ]
  },
  enterprise: {
    nome: 'Empresarial',
    preco: 'R$ 99,90/mês',
    recursos: [
      'Tudo do plano Pro',
      'API dedicada',
      'Suporte 24/7',
      'Múltiplos usuários',
      'Personalização avançada'
    ]
  }
};

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

  // Formata a data de início do plano
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

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
      {/* Hero Verde */}
      <div className={styles.heroCard}>
        <h1 className={styles.heroTitle}>Plano e Assinatura</h1>
        <p className={styles.heroSubtitle}>Gerencie seu plano e pagamentos</p>
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
          <div className={styles.planInfo}>
            <p>Início do plano: {userData?.plan ? formatDate(userData.plan.startDate) : ''}</p>
          </div>
        </Card>

        {/* Grade de Planos */}
        <div className={styles.plansGrid}>
          {Object.entries(PLANOS).map(([key, plano]) => (
            <Card key={key} className={styles.planCard}>
              <h3 className={styles.planTitle}>{plano.nome}</h3>
              <p className={styles.planPrice}>{plano.preco}</p>
              <ul className={styles.planFeatures}>
                {plano.recursos.map((recurso, index) => (
                  <li key={index} className={styles.featureItem}>
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {recurso}
                  </li>
                ))}
              </ul>
              <Button 
                variant={userData?.plan?.type === key ? 'outline' : 'primary'}
                className={styles.planButton}
                disabled={userData?.plan?.type === key}
              >
                {userData?.plan?.type === key ? 'Plano Atual' : 'Escolher Plano'}
              </Button>
            </Card>
          ))}
        </div>

        {/* Histórico de Pagamentos - Apenas para planos pagos */}
        {userData?.plan?.type !== 'free' && (
          <Card className={styles.historyCard}>
            <h3 className={styles.historyTitle}>Histórico de Pagamentos</h3>
            <div className={styles.historyTable}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Fatura</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Histórico será implementado quando houver pagamentos */}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 