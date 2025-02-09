import { ResumoAnual } from '@/app/(private)/componentes/resumos/ResumoAnual';
import { GraficoAnual } from '@/app/(private)/componentes/graficos/GraficoAnual';
import styles from './dashboard.module.css';

export function Dashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Painel de Controle</h1>
      
      <div className={styles.gridContainer}>
        <div className={styles.card}>
          <ResumoAnual />
        </div>
        
        <div className={styles.card}>
          <GraficoAnual />
        </div>
      </div>
    </div>
  );
} 