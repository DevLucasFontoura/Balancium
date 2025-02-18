'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import styles from './metasfinanceiras.module.css';

export function MetasFinanceiras() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          variant="ghost"
          className={styles.backButton}
          onClick={() => router.push('/configuracoes')}
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Voltar para Configurações
        </Button>
      </div>

      <Card className={styles.heroCard}>
        <h1 className={styles.heroTitle}>Metas Financeiras</h1>
        <p className={styles.heroSubtitle}>Planeje e acompanhe suas metas financeiras</p>
      </Card>

      <div className={styles.content}>
        <Card className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Suas Metas</h2>
            <Button variant="outline">Nova Meta</Button>
          </div>

          {/* Lista de Metas */}
          <div className={styles.metasGrid}>
            {/* Cards de Metas virão aqui */}
          </div>
        </Card>
      </div>
    </div>
  );
} 