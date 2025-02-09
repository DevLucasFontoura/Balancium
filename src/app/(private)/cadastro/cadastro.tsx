import { EntradaSaidaForm } from '@/app/(private)/componentes/formularios/EntradaSaidaForm';
import styles from './cadastro.module.css';

export function Cadastro() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastrar Transação</h1>
      
      <div className={styles.formWrapper}>
        <div className={styles.formCard}>
          <EntradaSaidaForm />
        </div>
      </div>
    </div>
  );
} 