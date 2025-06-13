'use client';

import { CategorizationIcon } from '@/components/icons/CategorizationIcon';
import { DashboardIcon } from '@/components/icons/DashboardIcon';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ReportsIcon } from '@/components/icons/ReportsIcon';
import { CONSTANTES } from '@/constants/constantes';
import { doc, setDoc } from 'firebase/firestore';
import styles from './registroUser.module.css';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase/config';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import mobileStyles from './registroUserMobile.module.css';

interface FormData {
  name: string;
  email: string;
  password: string;
}

export function Registro() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: CONSTANTES.LABEL_BLANK,
    email: CONSTANTES.LABEL_BLANK,
    password: CONSTANTES.LABEL_BLANK
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authResult = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      if (authResult && authResult.user) {
        const userData = {
          name: formData.name,
          email: formData.email,
          uid: authResult.user.uid,
          createdAt: new Date().toISOString(),
          settings: { currency: CONSTANTES.LABEL_BRL, language: CONSTANTES.LABEL_PT_BR },
          plan: {
            type: CONSTANTES.LABEL_FREE,
            features: [ CONSTANTES.FEATURE_FREE_01, CONSTANTES.FEATURE_FREE_02, CONSTANTES.FEATURE_FREE_03 ],
            startDate: new Date().toISOString(),
            status: CONSTANTES.LABEL_ACTIVE
          }
        };

        await setDoc(doc(db, CONSTANTES.LABEL_USERS, authResult.user.uid), userData);
        toast.success(CONSTANTES.CONTA_CRIADA_COM_SUCESSO);
        router.push(CONSTANTES.ROUTE_BEM_VINDO_LOGADO);
      }
    } catch (error: any) {
      console.error(CONSTANTES.ERRO_AO_CRIAR_CONTA, error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error(CONSTANTES.ESTE_EMAIL_JA_ESTA_EM_USO);
      } else if (error.code === 'auth/weak-password') {
        toast.error(CONSTANTES.SENHA_DEVE_TER_PELO_MENOS_6_CARACTERES);
      } else {
        toast.error(CONSTANTES.ERRO_AO_CRIAR_CONTA);
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

  if (isMobile) {
    return (
      <div className={mobileStyles.registroCard}>
        <div className={mobileStyles.registroTitle}>Criar Conta</div>
        <form className={mobileStyles.registroForm}>
          <input type="text" placeholder="Nome completo" className={mobileStyles.input} />
          <input type="email" placeholder="E-mail" className={mobileStyles.input} />
          <input type="password" placeholder="Senha" className={mobileStyles.input} />
          <button type="submit" className={mobileStyles.button}>Criar Conta</button>
        </form>
        <a href="#" className={mobileStyles.link}>Já tem conta? Entrar</a>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentGrid}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}> {CONSTANTES.TITULO_REGISTRO} <span className={styles.highlight}> {CONSTANTES.TITULO_REGISTRO_PARTE_02}</span> </h1>
          <p className={styles.welcomeText}> {CONSTANTES.DESCRICAO_REGISTRO} </p>
          <div className={styles.features}>
            <div className={styles.featureItem}> <DashboardIcon className={styles.featureIcon} /> <span>{CONSTANTES.FEATURE_DASHBOARD_INTUITIVO}</span> </div>
            <div className={styles.featureItem}> <CategorizationIcon className={styles.featureIcon} /> <span>{CONSTANTES.FEATURE_CATEGORIZACAO_AUTOMATICO}</span> </div>
            <div className={styles.featureItem}> <ReportsIcon className={styles.featureIcon} /> <span>{CONSTANTES.FEATURE_RELATORIOS_DETALHADOS}</span> </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}> {CONSTANTES.TITULO_FORM_REGISTRO} </h2>
            <p className={styles.formSubtitle}> {CONSTANTES.DESCRICAO_FORM_REGISTRO} </p>
            
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor={CONSTANTES.LABEL_NOME} className={styles.inputLabel}> {CONSTANTES.LABEL_NOME_COMPLETO} </label>
                <input
                  id={CONSTANTES.LABEL_NOME}
                  name={CONSTANTES.LABEL_NOME}
                  type={CONSTANTES.LABEL_TEXT}
                  required
                  className={styles.input}
                  placeholder={CONSTANTES.PLACEHOLDER_NOME}
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

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
                <label htmlFor={CONSTANTES.LABEL_PASSWORD} className={styles.inputLabel}> {CONSTANTES.LABEL_SENHA} </label>
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

              <div className={styles.formFooter}>
                <button 
                  type={CONSTANTES.LABEL_SUBMIT} 
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? CONSTANTES.BOTAO_REGISTRO_ENTRANDO : CONSTANTES.BOTAO_REGISTRO}
                </button>
                <p className={styles.loginText}> {CONSTANTES.BOTAO_REGISTRO_JA_TEM_CONTA} <Link href={CONSTANTES.ROUTE_LOGIN} className={styles.loginLink}> {CONSTANTES.BOTAO_REGISTRO_FAZER_LOGIN} </Link> </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 