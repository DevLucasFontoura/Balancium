'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { auth, db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import styles from './exportacaodados.module.css';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const ANOS_DISPONIVEIS = Array.from(
  { length: new Date().getFullYear() - 2023 + 1 },
  (_, i) => 2023 + i
).reverse();

interface Categoria {
  id: string;
  nome: string;
  tipo: string;
}

interface Transacao {
  descricao: string;
  categoria: string;
  categoriaNome: string;
  data: Date;
  valor: number;
  tipo: string;
  status: string;
  userId: string;
}

interface DadosPlanilha {
  'Descrição': string;
  'Categoria': string;
  'Data': string;
  'Valor': string;
  'Total Entradas': string;
  'Total Saídas': string;
  'Saldo': string;
}

export function ExportacaoDados() {
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [exportando, setExportando] = useState(false);
  const router = useRouter();

  const buscarCategorias = async (userId: string): Promise<Map<string, string>> => {
    const categoriasMap = new Map<string, string>();
    
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const categorias = userData.categorias || [];
        
        categorias.forEach((categoria: Categoria) => {
          categoriasMap.set(categoria.id, categoria.nome);
        });
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }

    return categoriasMap;
  };

  const buscarDadosDoAno = async (): Promise<Transacao[][]> => {
    const user = auth.currentUser;
    if (!user) return Array(12).fill([]);

    try {
      const categoriasMap = await buscarCategorias(user.uid);

      const transacoesRef = collection(db, 'transacoes');
      const q = query(
        transacoesRef,
        where('userId', '==', user.uid),
        where('status', '==', 'ativo'),
        where('ano', '==', anoSelecionado)
      );

      const querySnapshot = await getDocs(q);
      
      const todasTransacoes = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const categoriaNome = categoriasMap.get(data.categoria);
        
        return {
          descricao: data.descricao || '',
          categoria: data.categoria,
          categoriaNome: categoriaNome || 'Categoria Removida',
          data: new Date(data.data),
          valor: data.tipo === 'entrada' ? Number(data.valor) : -Number(data.valor),
          tipo: data.tipo,
          status: data.status,
          userId: data.userId
        } as Transacao;
      });

      // Organizar por mês
      const transacoesPorMes = Array.from({ length: 12 }, () => [] as Transacao[]);
      todasTransacoes.forEach(transacao => {
        const mes = transacao.data.getMonth();
        transacoesPorMes[mes].push(transacao);
      });

      // Ordenar transações por data em cada mês
      transacoesPorMes.forEach(transacoes => {
        transacoes.sort((a, b) => a.data.getTime() - b.data.getTime());
      });

      return transacoesPorMes;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      return Array(12).fill([]);
    }
  };

  const formatarDadosParaPlanilha = (transacoes: Transacao[]): DadosPlanilha[] => {
    let totalEntradas = 0;
    let totalSaidas = 0;

    const dadosFormatados = transacoes.map(t => {
      const valor = t.valor;
      if (valor > 0) {
        totalEntradas += valor;
      } else {
        totalSaidas += Math.abs(valor);
      }

      return {
        'Descrição': t.descricao,
        'Categoria': t.categoriaNome,
        'Data': t.data.toLocaleDateString('pt-BR'),
        'Valor': valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        'Total Entradas': totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        'Total Saídas': totalSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        'Saldo': (totalEntradas - totalSaidas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      };
    });

    // Adicionar linha de totais se houver dados
    if (dadosFormatados.length > 0) {
      dadosFormatados.push({
        'Descrição': 'TOTAL DO MÊS',
        'Categoria': '',
        'Data': '',
        'Valor': '',
        'Total Entradas': totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        'Total Saídas': totalSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        'Saldo': (totalEntradas - totalSaidas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      });
    }

    return dadosFormatados;
  };

  const handleExportar = async () => {
    setExportando(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      const transacoesPorMes = await buscarDadosDoAno();
      const workbook = XLSX.utils.book_new();

      // Configurar largura das colunas
      const colunas = [
        { wch: 40 }, // Descrição
        { wch: 20 }, // Categoria
        { wch: 15 }, // Data
        { wch: 15 }, // Valor
        { wch: 15 }, // Total Entradas
        { wch: 15 }, // Total Saídas
        { wch: 15 }, // Saldo
      ];

      // Criar uma aba para cada mês
      transacoesPorMes.forEach((transacoes, index) => {
        const dadosFormatados = formatarDadosParaPlanilha(transacoes);
        const worksheet = XLSX.utils.json_to_sheet(
          dadosFormatados.length > 0 
            ? dadosFormatados 
            : [{
                'Descrição': '',
                'Categoria': '',
                'Data': '',
                'Valor': '',
                'Total Entradas': '',
                'Total Saídas': '',
                'Saldo': ''
              }]
        );

        // Aplicar largura das colunas
        worksheet['!cols'] = colunas;

        XLSX.utils.book_append_sheet(workbook, worksheet, MESES[index]);
      });

      // Gerar o arquivo
      const nomeArquivo = `Dados_Balancium_${user.displayName || user.email}_${anoSelecionado}.xlsx`;
      XLSX.writeFile(workbook, nomeArquivo);
      
      toast.success('Exportação concluída com sucesso!');
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast.error('Erro ao exportar dados. Tente novamente.');
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header com botão voltar */}
      <div className={styles.header}>
        <Button
          variant="secondary"
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

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroIcon}>
          <svg className="w-16 h-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className={styles.heroTitle}>Exportação de Dados</h1>
        <p className={styles.heroSubtitle}>
          Exporte seus dados financeiros para Excel e mantenha um backup completo de suas transações
        </p>
      </div>

      {/* Conteúdo principal sem Card */}
      <div className={styles.mainCard} style={{ background: 'none', boxShadow: 'none', border: 'none', padding: 0 }}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className={styles.cardTitle}>Exportar Dados Financeiros</h2>
            <p className={styles.cardDescription}>
              Selecione o ano e exporte todos os seus dados organizados por mês
            </p>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Ano dos Dados
            </label>
            <Select
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(Number(e.target.value))}
              className={styles.select}
            >
              {ANOS_DISPONIVEIS.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </Select>
          </div>

          <div className={styles.featuresList}>
            <h3 className={styles.featuresTitle}>O que será exportado:</h3>
            <ul className={styles.featuresGrid}>
              <li className={styles.featureItem}>
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Todas as transações do ano selecionado</span>
              </li>
              <li className={styles.featureItem}>
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Organização por mês em abas separadas</span>
              </li>
              <li className={styles.featureItem}>
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Descrição, categoria e valores detalhados</span>
              </li>
              <li className={styles.featureItem}>
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Totais acumulados de entradas e saídas</span>
              </li>
              <li className={styles.featureItem}>
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Formato Excel (.xlsx) compatível</span>
              </li>
              <li className={styles.featureItem}>
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Backup completo dos seus dados</span>
              </li>
            </ul>
          </div>

          <div className={styles.exportActions}>
            <Button
              variant="primary"
              onClick={handleExportar}
              disabled={exportando}
              className={styles.exportButton}
            >
              {exportando ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exportando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exportar Dados do {anoSelecionado}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 