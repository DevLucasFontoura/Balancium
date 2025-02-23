import { TabelaMensal } from '@/app/(private)/componentes/tabelas/TabelaMensal';
import { EntradaSaidaForm } from '@/app/(private)/componentes/formularios/EntradaSaidaForm';
import styles from './mensal.module.css';

interface MensalProps {
  mes: string;
}

export function Mensal({ mes }: MensalProps) {
  const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
  const mesNumerico = parseInt(mes, 10);
  const anoAtual = new Date().getFullYear();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Controle de {mesCapitalizado}</h1>

      <div className={styles.gridContainer}>
        <div className={styles.formSection}>
          <div className={styles.card}>
            <h2 className={styles.subtitle}>Nova Transação</h2>
            <EntradaSaidaForm />
          </div>
        </div>

        <div className={styles.card}>
          <TabelaMensal 
            mes={mesNumerico} 
            ano={anoAtual}
          />
        </div>
      </div>
    </div>
  );
} 