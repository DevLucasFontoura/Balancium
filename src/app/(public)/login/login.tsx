import Link from 'next/link';
import styles from './login.module.css';

export function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.contentGrid}>
        {/* Lado esquerdo - Mensagem */}
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            Bem-vindo de volta ao
            <span className={styles.highlight}> Balancium</span>
          </h1>
          <p className={styles.welcomeText}>
            Continue gerenciando suas finanças de forma simples e eficiente
          </p>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <svg className={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Dashboard intuitivo</span>
            </div>
            <div className={styles.featureItem}>
              <svg className={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Controle em tempo real</span>
            </div>
            <div className={styles.featureItem}>
              <svg className={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Relatórios mensais</span>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>
              Entre na sua conta
            </h2>
            <p className={styles.formSubtitle}>
              Insira suas credenciais para acessar
            </p>
            
            <form className={styles.form}>
              <div className={styles.inputGroup}>
                <div>
                  <label htmlFor="email" className={styles.inputLabel}>Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={styles.input}
                    placeholder="seu@email.com"
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
                  />
                </div>
              </div>

              <div className={styles.formFooter}>
                <button type="submit" className={styles.submitButton}>
                  Entrar
                </button>
                <p className={styles.signupText}>
                  Ainda não tem uma conta?{' '}
                  <Link href="/cadastro" className={styles.signupLink}>
                    Criar conta
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