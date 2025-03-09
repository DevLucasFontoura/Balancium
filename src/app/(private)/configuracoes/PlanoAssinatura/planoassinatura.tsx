'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import styles from './planoassinatura.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        <p className={styles.heroSubtitle}>
          Gerencie seu plano e recursos disponíveis
        </p>
      </div>

      <div className={styles.content}>
        {/* Card do Plano Atual */}
        <Card className={styles.currentPlanCard}>
          <div className={styles.currentPlanHeader}>
            <div>
              <h2 className={styles.currentPlanTitle}>Seu Plano Atual</h2>
              <p className={styles.currentPlanType}>
                {userData?.plan?.type === 'free' ? 'Gratuito' : 
                 userData?.plan?.type === 'plus' ? 'Plus' : 'Premium'}
              </p>
              <p className={styles.currentPlanPrice}>
                {userData?.plan?.type === 'free' ? 'R$ 0,00' : 
                 userData?.plan?.type === 'plus' ? 'R$ 9,90/mês' : 'R$ 19,90/mês'}
              </p>
            </div>
            <div className={styles.planStatus}>
              <span className={`${styles.statusBadge} ${styles[userData?.plan?.status || '']}`}>
                {userData?.plan?.status === 'active' ? 'Ativo' : 'Pendente'}
              </span>
              <p className={styles.planStartDate}>
                Desde {new Date(userData?.plan?.startDate || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Tabela de Comparação */}
        <div className={styles.comparisonTable}>
          <div className={styles.plansHeader}>
            <div className={styles.featureHeader}>Recursos</div>
            <div className={styles.planColumn}>
              <div className={styles.planTag}>Básico</div>
              <div className={styles.planColumnTitle}>Gratuito</div>
              <div className={styles.planColumnPrice}>R$ 0,00</div>
              <div className={styles.planPeriod}>para sempre</div>
              <Button 
                variant={userData?.plan?.type === 'free' ? 'outline' : 'primary'}
                className={styles.planButton}
                disabled={userData?.plan?.type === 'free'}
              >
                {userData?.plan?.type === 'free' ? 'Plano Atual' : 'Começar Agora'}
              </Button>
            </div>
            <div className={`${styles.planColumn} ${styles.popularPlan}`}>
              <div className={styles.planTag}>Mais Popular</div>
              <div className={styles.planColumnTitle}>Plus</div>
              <div className={styles.planColumnPrice}>R$ 9,90</div>
              <div className={styles.planPeriod}>por mês</div>
              <Button 
                variant={userData?.plan?.type === 'plus' ? 'outline' : 'primary'}
                className={`${styles.planButton} ${styles.primaryButton}`}
                disabled={userData?.plan?.type === 'plus'}
              >
                {userData?.plan?.type === 'plus' ? 'Plano Atual' : 'Escolher Plus'}
              </Button>
            </div>
            <div className={styles.planColumn}>
              <div className={styles.planTag}>Completo</div>
              <div className={styles.planColumnTitle}>Premium</div>
              <div className={styles.planColumnPrice}>R$ 19,90</div>
              <div className={styles.planPeriod}>por mês</div>
              <Button 
                variant={userData?.plan?.type === 'premium' ? 'outline' : 'primary'}
                className={styles.planButton}
                disabled={userData?.plan?.type === 'premium'}
              >
                {userData?.plan?.type === 'premium' ? 'Plano Atual' : 'Escolher Premium'}
              </Button>
            </div>
          </div>

          <div className={styles.featuresList}>
            <div className={styles.featureGroup}>
              <div className={styles.featureGroupTitle}>Recursos Básicos</div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Armazenamento Ilimitado</span>
                  <span className={styles.featureDescription}>Sem limites para seus dados</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Suporte por email</span>
                  <span className={styles.featureDescription}>Atendimento via email</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Controle Básico</span>
                  <span className={styles.featureDescription}>Gestão de receitas e despesas</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Relatórios Mensais</span>
                  <span className={styles.featureDescription}>Resumo mensal das suas finanças</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Categorias Básicas</span>
                  <span className={styles.featureDescription}>Categorias predefinidas</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
            </div>

            <div className={styles.featureGroup}>
              <div className={styles.featureGroupTitle}>Recursos Plus</div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Editar Transações</span>
                  <span className={styles.featureDescription}>Edição completa de lançamentos</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Editar Categorias</span>
                  <span className={styles.featureDescription}>Personalização de categorias</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Criar Categorias</span>
                  <span className={styles.featureDescription}>Criação de novas categorias</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
            </div>

            <div className={styles.featureGroup}>
              <div className={styles.featureGroupTitle}>Recursos Premium</div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Exportar Dados</span>
                  <span className={styles.featureDescription}>Exportação de relatórios</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
                <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Anexar Arquivos</span>
                  <span className={styles.featureDescription}>Anexe comprovantes às transações</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
                <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 