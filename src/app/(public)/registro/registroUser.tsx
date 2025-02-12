'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import styles from './registroUser.module.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { toast } from 'react-hot-toast';

interface FormData {
  name: string;
  email: string;
  password: string;
}

export function Registro() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Criar conta de autenticação
      const authResult = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      if (authResult && authResult.user) {
        // Criar documento do usuário no Firestore
        const userData = {
          name: formData.name,
          email: formData.email,
          uid: authResult.user.uid,
          createdAt: new Date().toISOString(),
          settings: {
            currency: 'BRL',
            language: 'pt-BR'
          },
          plan: {
            type: 'free',
            features: [
              'Controle básico de despesas',
              'Relatórios mensais',
              'Até 100 transações/mês'
            ],
            startDate: new Date().toISOString(),
            status: 'active'
          }
        };

        await setDoc(doc(db, 'users', authResult.user.uid), userData);
        toast.success('Conta criada com sucesso!');
        router.push('/BemVindoLogado');
      }
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Este e-mail já está em uso.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('A senha deve ter pelo menos 6 caracteres.');
      } else {
        toast.error('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentGrid}>
        {/* Lado esquerdo - Mensagem */}
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            Comece sua jornada no
            <span className={styles.highlight}> Balancium</span>
          </h1>
          <p className={styles.welcomeText}>
            Junte-se a milhares de pessoas que já controlam suas finanças de forma simples
          </p>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <svg className={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M5 13l4 4L19 7" />
              </svg>
              <span>Cadastro gratuito</span>
            </div>
            <div className={styles.featureItem}>
              <svg className={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Comece em segundos</span>
            </div>
            <div className={styles.featureItem}>
              <svg className={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Sem custos ocultos</span>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>
              Crie sua conta
            </h2>
            <p className={styles.formSubtitle}>
              Preencha os dados abaixo para começar
            </p>
            
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <div>
                  <label htmlFor="name" className={styles.inputLabel}>Nome completo</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className={styles.input}
                    placeholder="João Silva"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={styles.inputLabel}>Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={styles.input}
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className={styles.inputLabel}>Senha</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className={styles.input}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.formFooter}>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? 'Criando conta...' : 'Criar conta gratuitamente'}
                </button>
                <p className={styles.loginText}>
                  Já tem uma conta?{' '}
                  <Link href="/login" className={styles.loginLink}>
                    Fazer login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 