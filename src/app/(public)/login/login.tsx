'use client';

import { CategorizationIcon } from '@/components/icons/CategorizationIcon';
import { DashboardIcon } from '@/components/icons/DashboardIcon';
import { ReportsIcon } from '@/components/icons/ReportsIcon';
import { CONSTANTES } from '@/constants/constantes';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import styles from './login.module.css';
import { useState } from 'react';
import Link from 'next/link';

export function Login() {
  const router = useRouter();
  const { signIn, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: CONSTANTES.LABEL_BLANK,
    password: CONSTANTES.LABEL_BLANK
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn(formData);
    if (result) {
      router.push(CONSTANTES.ROUTE_BEM_VINDO_LOGADO);
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
        <div className={styles.welcomeSection}>

          <h1 className={styles.welcomeTitle}> {CONSTANTES.TITULO_BEM_VINDO_LOGIN} <span className={styles.highlight}>{CONSTANTES.TITULO_BEM_VINDO_LOGIN_PARTE_02}</span> </h1>

          <p className={styles.welcomeText}> {CONSTANTES.DESCRICAO_BEM_VINDO_LOGIN} </p>

          <div className={styles.features}>
            <div className={styles.featureItem}> <DashboardIcon className={styles.featureIcon} /> <span> {CONSTANTES.FEATURE_DASHBOARD_INTUITIVO} </span> </div>
            <div className={styles.featureItem}> <CategorizationIcon className={styles.featureIcon} /> <span> {CONSTANTES.FEATURE_CATEGORIZACAO_AUTOMATICO} </span> </div>
            <div className={styles.featureItem}> <ReportsIcon className={styles.featureIcon} /> <span> {CONSTANTES.FEATURE_RELATORIOS_DETALHADOS} </span> </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formContainer}>

            <h2 className={styles.formTitle}> {CONSTANTES.TITULO_FORM_LOGIN} </h2>
            <p className={styles.formSubtitle}> {CONSTANTES.DESCRICAO_FORM_LOGIN} </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor={CONSTANTES.LABEL_EMAIL} className={styles.inputLabel}> {CONSTANTES.LABEL_EMAIL} </label>
                <input
                  id={CONSTANTES.LABEL_EMAIL}
                  name={CONSTANTES.LABEL_EMAIL}
                  type={CONSTANTES.LABEL_EMAIL}
                  required
                  className={styles.input}
                  placeholder={CONSTANTES.PLACEHOLDER_EMAIL}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.inputLabel}>
                  {CONSTANTES.LABEL_SENHA}
                </label>
                <input
                  id={CONSTANTES.LABEL_PASSWORD}
                  name={CONSTANTES.LABEL_PASSWORD}
                  type={CONSTANTES.LABEL_PASSWORD}
                  required
                  className={styles.input}
                  placeholder={CONSTANTES.PLACEHOLDER_PASSWORD}
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {error && ( <div className={styles.errorMessage}> {error} </div> )}

              <div className={styles.formFooter}>
                <button 
                  type={CONSTANTES.LABEL_SUBMIT} 
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? CONSTANTES.BOTAO_BEM_VINDO_LOGIN_ENTRANDO : CONSTANTES.BOTAO_BEM_VINDO_LOGIN_ENTRAR}
                </button>

                <p className={styles.signupText}>
                  {CONSTANTES.BOTAO_BEM_VINDO_LOGIN_AINDA_NAO_TEM_CONTA}
                  <Link href={CONSTANTES.ROUTE_CADASTRO} className={styles.signupLink}> {CONSTANTES.BOTAO_BEM_VINDO_LOGIN_CRIAR_CONTA} </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 