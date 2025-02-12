'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import styles from './planoassinatura.module.css';

interface PlanoData {
  tipo: 'free' | 'pro' | 'enterprise';
  dataRenovacao: string;
  status: 'ativo' | 'inativo' | 'pendente';
}

const PLANOS = {
  free: {
    nome: 'Gratuito',
    preco: 'R$ 0,00',
    recursos: [
      'Até 100 transações/mês',
      'Relatórios básicos',
      'Suporte por email'
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

export function PlanoAssinatura() {
  const [planoAtual, setPlanoAtual] = useState<PlanoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlanoData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setPlanoAtual(userDoc.data().plano as PlanoData);
        }
      }
      setLoading(false);
    };

    loadPlanoData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
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
                {planoAtual ? PLANOS[planoAtual.tipo].nome : 'Carregando...'}
              </p>
            </div>
            <div className={styles.planStatus}>
              <span className={`${styles.statusBadge} ${styles[planoAtual?.status || '']}`}>
                {planoAtual?.status === 'ativo' ? 'Ativo' : 'Pendente'}
              </span>
            </div>
          </div>
          <div className={styles.planInfo}>
            <p>Próxima renovação: {planoAtual?.dataRenovacao}</p>
            <Button variant="outline">Gerenciar Pagamento</Button>
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
                variant={planoAtual?.tipo === key ? 'outline' : 'primary'}
                className={styles.planButton}
                disabled={planoAtual?.tipo === key}
              >
                {planoAtual?.tipo === key ? 'Plano Atual' : 'Escolher Plano'}
              </Button>
            </Card>
          ))}
        </div>

        {/* Histórico de Pagamentos */}
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
                <tr>
                  <td>01/03/2024</td>
                  <td>R$ 29,90</td>
                  <td>
                    <span className={styles.statusBadge}>Pago</span>
                  </td>
                  <td>
                    <Button variant="ghost" size="sm">Download</Button>
                  </td>
                </tr>
                {/* Adicione mais linhas conforme necessário */}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
} 