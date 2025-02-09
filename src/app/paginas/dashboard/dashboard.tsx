import { ResumoAnual } from '@/app/componentes/resumos/ResumoAnual';
import { GraficoAnual } from '@/app/componentes/graficos/GraficoAnual';
import Link from 'next/link';
import styles from './dashboard.module.css';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

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
      
      <div className={styles.mesesGrid}>
        {MESES.map((mes) => (
          <Link
            key={mes}
            href={`/mensal/${mes.toLowerCase()}`}
            className={styles.mesCard}
          >
            <div className={styles.mesHeader}>
              <h2 className={styles.mesTitle}>{mes}</h2>
              <span className={styles.mesIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <div className={styles.mesSubtitle}>
              Visualizar transações
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 