'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import styles from './configuracoes.module.css';

export function Configuracoes() {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await user.delete();
        router.push('/login');
      }
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Verde */}
      <div className={styles.heroCard}>
        <h1 className={styles.heroTitle}>Configurações</h1>
        <p className={styles.heroSubtitle}>Gerencie suas preferências e dados</p>
      </div>

      <div className={styles.content}>
        <div className={styles.mainGrid}>
          {/* Perfil e Conta */}
          <Card className={styles.card}>
            <div className={styles.cardIcon}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Dados da Conta</h3>
            <p className={styles.cardDescription}>
              Atualize suas informações pessoais e dados de contato
            </p>
            <Button 
              variant="outline" 
              className={styles.cardButton}
              onClick={() => router.push('/configuracoes/DadosDaConta')}
            >
              Editar Dados
            </Button>
          </Card>

          {/* Plano e Assinatura */}
          <Card className={styles.card}>
            <div className={styles.cardIcon}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Plano e Assinatura</h3>
            <p className={styles.cardDescription}>
              Gerencie seu plano, pagamentos e faturas
            </p>
            <Button 
              variant="outline" 
              className={styles.cardButton}
              onClick={() => router.push('/configuracoes/PlanoAssinatura')}
            >
              Gerenciar Plano
            </Button>
          </Card>

          {/* Integrações */}
          <Card className={styles.card}>
            <div className={styles.cardIcon}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Integrações</h3>
            <p className={styles.cardDescription}>
              Conecte suas contas bancárias e outros serviços
            </p>
            <Button 
              variant="outline" 
              className={styles.cardButton}
              onClick={() => router.push('/configuracoes/Integracoes')}
            >
              Configurar Integrações
            </Button>
          </Card>

          {/* Exportação de Dados */}
          <Card className={styles.card}>
            <div className={styles.cardIcon}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Exportação de Dados</h3>
            <p className={styles.cardDescription}>
              Exporte seus relatórios e histórico financeiro
            </p>
            <Button 
              variant="outline" 
              className={styles.cardButton}
              onClick={() => router.push('/configuracoes/ExportacaoDados')}
            >
              Exportar Dados
            </Button>
          </Card>
        </div>

        {/* Segurança */}
        <Card className={styles.dangerCard}>
          <div className={styles.dangerContent}>
            <div>
              <h3 className={styles.dangerTitle}>Excluir Conta</h3>
              <p className={styles.dangerDescription}>
                Esta ação é permanente e não pode ser desfeita
              </p>
            </div>
            {!showDeleteConfirm ? (
              <Button 
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
                className={styles.dangerButton}
              >
                Excluir Conta
              </Button>
            ) : (
              <div className={styles.deleteConfirm}>
                <p className={styles.confirmText}>
                  Tem certeza? Esta ação não pode ser desfeita.
                </p>
                <div className={styles.confirmButtons}>
                  <Button 
                    variant="danger"
                    onClick={handleDeleteAccount}
                  >
                    Confirmar Exclusão
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
} 