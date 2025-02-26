'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { auth, db } from '@/lib/firebase/config';
import styles from './exportacaodados.module.css';

const TIPOS_RELATORIO = [
  { id: 'transacoes', nome: 'Relatório de Transações' },
  { id: 'categorias', nome: 'Análise por Categorias' },
  { id: 'previsoes', nome: 'Previsões Financeiras' },
  { id: 'completo', nome: 'Relatório Completo' }
];

const FORMATOS_EXPORTACAO = [
  { id: 'excel', nome: 'Microsoft Excel (.xlsx)', icon: '📊' },
  { id: 'csv', nome: 'CSV (.csv)', icon: '📝' },
  { id: 'pdf', nome: 'PDF (.pdf)', icon: '📄' }
];

export function ExportacaoDados() {
  const [tipoRelatorio, setTipoRelatorio] = useState('transacoes');
  const [formato, setFormato] = useState('excel');
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);
  const [exportando, setExportando] = useState(false);
  const [ultimasExportacoes, setUltimasExportacoes] = useState([
    {
      id: 1,
      tipo: 'Relatório de Transações',
      formato: 'Excel',
      data: '01/03/2024 14:30',
      status: 'Concluído'
    },
    {
      id: 2,
      tipo: 'Análise por Categorias',
      formato: 'PDF',
      data: '28/02/2024 10:15',
      status: 'Concluído'
    }
  ]);

  const handleExportar = async () => {
    setExportando(true);
    try {
      // Aqui implementaríamos a lógica real de exportação
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulação
      console.log('Exportando:', {
        tipoRelatorio,
        formato,
        dataInicio,
        dataFim
      });
    } catch (error) {
      console.error('Erro na exportação:', error);
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Verde */}
      <div className={styles.heroCard}>
        <h1 className={styles.heroTitle}>Exportação de Dados</h1>
        <p className={styles.heroSubtitle}>Exporte seus relatórios e histórico financeiro</p>
      </div>

      <div className={styles.content}>
        {/* Configurações de Exportação */}
        <Card className={styles.exportCard}>
          <h2 className={styles.cardTitle}>Nova Exportação</h2>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tipo de Relatório</label>
              <Select
                value={tipoRelatorio}
                onChange={(e) => setTipoRelatorio(e.target.value)}
                className={styles.select}
              >
                {TIPOS_RELATORIO.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </option>
                ))}
              </Select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Formato de Exportação</label>
              <div className={styles.formatosGrid}>
                {FORMATOS_EXPORTACAO.map((f) => (
                  <button
                    key={f.id}
                    className={`${styles.formatoButton} ${formato === f.id ? styles.formatoSelected : ''}`}
                    onClick={() => setFormato(f.id)}
                  >
                    <span className={styles.formatoIcon}>{f.icon}</span>
                    {f.nome}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.dateRange}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Data Inicial</label>
                <DatePicker
                  date={dataInicio}
                  onChange={(date: Date | undefined) => setDataInicio(date)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Data Final</label>
                <DatePicker
                  date={dataFim}
                  onChange={(date: Date | undefined) => setDataFim(date)}
                />
              </div>
            </div>
          </div>

          <div className={styles.exportActions}>
            <Button
              variant="primary"
              onClick={handleExportar}
              disabled={exportando || !dataInicio || !dataFim}
            >
              {exportando ? 'Exportando...' : 'Exportar Dados'}
            </Button>
          </div>
        </Card>

        {/* Histórico de Exportações */}
        <Card className={styles.historyCard}>
          <h2 className={styles.cardTitle}>Histórico de Exportações</h2>
          <div className={styles.historyTable}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Relatório</th>
                  <th>Formato</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {ultimasExportacoes.map((exp) => (
                  <tr key={exp.id}>
                    <td>{exp.tipo}</td>
                    <td>{exp.formato}</td>
                    <td>{exp.data}</td>
                    <td>
                      <span className={styles.statusBadge}>{exp.status}</span>
                    </td>
                    <td>
                      <Button 
                        variant="secondary"
                        size="sm"
                      >
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
} 