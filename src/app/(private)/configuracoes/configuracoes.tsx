'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { auth, db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { doc, deleteDoc } from 'firebase/firestore';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import styles from './configuracoes.module.css';

export function Configuracoes() {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReauthenticate, setShowReauthenticate] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState('');

  const handleReauthenticate = async () => {
    const user = auth.currentUser;
    if (!user?.email) return;

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      await handleDeleteAccount();
    } catch (error) {
      console.error('Erro na reautenticação:', error);
      toast.error('Senha incorreta. Tente novamente.');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Guarda o uid antes de deletar a conta
      const userId = user.uid;

      try {
        // 1. Primeiro deleta o documento do Firestore
        await deleteDoc(doc(db, 'users', userId));
        
        // 2. Depois deleta a conta do Authentication
        await deleteUser(user);

        toast.success('Conta excluída com sucesso');
        router.push('/');
      } catch (error: any) {
        // Se falhar ao deletar o documento, tenta restaurar
        console.error('Erro ao excluir conta:', error);
        throw error;
      }

    } catch (error: any) {
      console.error('Erro ao excluir conta:', error);
      
      if (error.code === 'auth/requires-recent-login') {
        setShowReauthenticate(true);
        setShowDeleteConfirm(false);
      } else {
        toast.error('Erro ao excluir conta. Tente novamente.');
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
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
          {showReauthenticate ? (
            <div className={styles.deleteConfirm}>
              <h3 className={styles.dangerTitle}>Confirme sua senha</h3>
              <p className={styles.dangerDescription}>
                Por segurança, digite sua senha para confirmar a exclusão da conta.
              </p>
              <div className="mt-4">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="mb-4"
                />
                <div className={styles.confirmButtons}>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleReauthenticate}
                    disabled={isDeleting || !password}
                  >
                    {isDeleting ? 'Excluindo...' : 'Confirmar exclusão'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowReauthenticate(false);
                      setShowDeleteConfirm(false);
                      setPassword('');
                    }}
                    disabled={isDeleting}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          ) : !showDeleteConfirm ? (
            <div className={styles.dangerContent}>
              <div>
                <h3 className={styles.dangerTitle}>Excluir Conta</h3>
                <p className={styles.dangerDescription}>
                  Esta ação é irreversível e todos os seus dados serão perdidos.
                </p>
              </div>
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Excluir Conta
              </Button>
            </div>
          ) : (
            <div className={styles.deleteConfirm}>
              <p className={styles.confirmText}>
                Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.
              </p>
              <div className={styles.confirmButtons}>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Excluindo...' : 'Sim, excluir minha conta'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 