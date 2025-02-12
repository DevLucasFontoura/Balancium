'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './integracoes.module.css';

interface IntegracaoStatus {
  id: string;
  nome: string;
  status: 'conectado' | 'desconectado';
  ultimaSincronizacao?: string;
}

const BANCOS_DISPONIVEIS = [
  { id: 'nubank', nome: 'Nubank', logo: '/bancos/nubank.svg' },
  { id: 'itau', nome: 'Itaú', logo: '/bancos/itau.svg' },
  { id: 'bradesco', nome: 'Bradesco', logo: '/bancos/bradesco.svg' },
  { id: 'santander', nome: 'Santander', logo: '/bancos/santander.svg' },
  { id: 'bb', nome: 'Banco do Brasil', logo: '/bancos/bb.svg' },
  { id: 'caixa', nome: 'Caixa', logo: '/bancos/caixa.svg' }
];

const SERVICOS_DISPONIVEIS = [
  { id: 'google', nome: 'Google Sheets', logo: '/servicos/google-sheets.svg' },
  { id: 'excel', nome: 'Microsoft Excel', logo: '/servicos/excel.svg' },
  { id: 'nfe', nome: 'Notas Fiscais', logo: '/servicos/nfe.svg' }
];

export function Integracoes() {
  const [integracoes, setIntegracoes] = useState<IntegracaoStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIntegracoes = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().integracoes) {
          setIntegracoes(userDoc.data().integracoes);
        }
      }
      setLoading(false);
    };

    loadIntegracoes();
  }, []);

  const handleConectar = async (id: string, tipo: 'banco' | 'servico') => {
    // Aqui implementaríamos a lógica de conexão com o serviço específico
    console.log(`Conectando com ${id}`);
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Hero Verde */}
      <div className={styles.heroCard}>
        <h1 className={styles.heroTitle}>Integrações</h1>
        <p className={styles.heroSubtitle}>Conecte suas contas e serviços</p>
      </div>

      <div className={styles.content}>
        {/* Bancos */}
        <Card className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Contas Bancárias</h2>
          <p className={styles.sectionDescription}>
            Conecte suas contas bancárias para sincronização automática de transações
          </p>
          
          <div className={styles.integracoesGrid}>
            {BANCOS_DISPONIVEIS.map((banco) => {
              const integracao = integracoes.find(i => i.id === banco.id);
              return (
                <div key={banco.id} className={styles.integracaoCard}>
                  <div className={styles.integracaoInfo}>
                    <div className={styles.logoContainer}>
                      <img src={banco.logo} alt={banco.nome} className={styles.logo} />
                    </div>
                    <div>
                      <h3 className={styles.integracaoNome}>{banco.nome}</h3>
                      {integracao?.status === 'conectado' && (
                        <p className={styles.lastSync}>
                          Última sincronização: {integracao.ultimaSincronizacao}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={integracao?.status === 'conectado' ? 'outline' : 'primary'}
                    onClick={() => handleConectar(banco.id, 'banco')}
                  >
                    {integracao?.status === 'conectado' ? 'Reconectar' : 'Conectar'}
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Outros Serviços */}
        <Card className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Outros Serviços</h2>
          <p className={styles.sectionDescription}>
            Integre com outras ferramentas para expandir suas possibilidades
          </p>
          
          <div className={styles.integracoesGrid}>
            {SERVICOS_DISPONIVEIS.map((servico) => {
              const integracao = integracoes.find(i => i.id === servico.id);
              return (
                <div key={servico.id} className={styles.integracaoCard}>
                  <div className={styles.integracaoInfo}>
                    <div className={styles.logoContainer}>
                      <img src={servico.logo} alt={servico.nome} className={styles.logo} />
                    </div>
                    <div>
                      <h3 className={styles.integracaoNome}>{servico.nome}</h3>
                      {integracao?.status === 'conectado' && (
                        <p className={styles.lastSync}>
                          Última sincronização: {integracao.ultimaSincronizacao}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={integracao?.status === 'conectado' ? 'outline' : 'primary'}
                    onClick={() => handleConectar(servico.id, 'servico')}
                  >
                    {integracao?.status === 'conectado' ? 'Reconectar' : 'Conectar'}
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
} 