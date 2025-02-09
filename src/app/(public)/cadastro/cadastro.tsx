'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import styles from './cadastro.module.css';

export function Cadastro() {
  const router = useRouter();
  const { signUp, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Tentando criar conta com:', formData); // Para debug
    
    const result = await signUp(formData);
    
    if (result) {
      console.log('Conta criada com sucesso:', result); // Para debug
      router.push('/dashboard');
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
            
            {error && (
              <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
                {error}
              </div>
            )}
            
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
                  disabled={loading}
                >
                  {loading ? 'Criando conta...' : 'Criar conta gratuitamente'}
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