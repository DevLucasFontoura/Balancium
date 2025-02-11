'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import styles from './configuracoes.module.css';

export function Configuracoes() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
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
      <div className={styles.header}>
        <h1 className={styles.title}>Configurações</h1>
        <p className={styles.subtitle}>Personalize sua experiência no Balancium</p>
      </div>

      <div className={styles.content}>
        {/* Perfil e Tema */}
        <section className={styles.section}>
          <div className={styles.sectionGrid}>
            <Card className={styles.card}>
              <div className={styles.cardIcon}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Perfil</h3>
              <p className={styles.cardDescription}>
                Gerencie suas informações pessoais e preferências de conta
              </p>
              <Button variant="outline" className={styles.cardButton}>
                Editar Perfil
              </Button>
            </Card>

            <Card className={styles.card}>
              <div className={styles.cardIcon}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Aparência</h3>
              <p className={styles.cardDescription}>
                Escolha entre tema claro ou escuro
              </p>
              <div className={styles.themeButtons}>
                <Button
                  variant={theme === 'light' ? 'primary' : 'outline'}
                  onClick={() => toggleTheme()}
                  className={styles.themeButton}
                >
                  {theme === 'light' ? 'Tema Claro ✓' : 'Tema Claro'}
                </Button>
                <Button
                  variant={theme === 'dark' ? 'primary' : 'outline'}
                  onClick={() => toggleTheme()}
                  className={styles.themeButton}
                >
                  {theme === 'dark' ? 'Tema Escuro ✓' : 'Tema Escuro'}
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Preferências */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Preferências</h2>
          <div className={styles.sectionGrid}>
            <Card className={styles.card}>
              <div className={styles.cardIcon}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Notificações</h3>
              <p className={styles.cardDescription}>
                Gerencie suas preferências de notificações
              </p>
              <Button variant="outline" className={styles.cardButton}>
                Configurar
              </Button>
            </Card>

            <Card className={styles.card}>
              <div className={styles.cardIcon}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Metas Financeiras</h3>
              <p className={styles.cardDescription}>
                Defina e acompanhe suas metas financeiras
              </p>
              <Button variant="outline" className={styles.cardButton}>
                Gerenciar Metas
              </Button>
            </Card>
          </div>
        </section>

        {/* Segurança */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Segurança</h2>
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
        </section>
      </div>
    </div>
  );
} 