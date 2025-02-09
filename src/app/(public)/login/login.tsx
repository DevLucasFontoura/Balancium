import styles from './login.module.css';

export function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div>
          <h2 className={styles.title}>
            Entre na sua conta
          </h2>
        </div>
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={styles.inputTop}
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={styles.inputBottom}
                placeholder="Senha"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={styles.submitButton}
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 