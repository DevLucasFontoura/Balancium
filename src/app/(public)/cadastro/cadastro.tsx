import styles from './cadastro.module.css';

export function Cadastro() {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div>
          <h2 className={styles.title}>
            Crie sua conta
          </h2>
        </div>
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <div>
              <label htmlFor="name" className="sr-only">Nome</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={styles.inputTop}
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={styles.inputMiddle}
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
              Criar conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 