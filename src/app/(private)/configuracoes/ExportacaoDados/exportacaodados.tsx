'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { auth, db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, getDoc, addDoc, Timestamp } from 'firebase/firestore';
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
  const [importando, setImportando] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const buscarCategorias = async (userId: string): Promise<Map<string, string>> => {
    const categoriasMap = new Map<string, string>();
    
    try {
      // Buscar o documento do usuário
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const categorias = userData.categorias || [];
        
        console.log('Categorias encontradas no documento do usuário:', categorias);
        
        // Mapear as categorias do usuário
        categorias.forEach((categoria: Categoria) => {
          console.log(`Categoria do usuário encontrada: ${categoria.id} - ${categoria.nome}`);
          categoriasMap.set(categoria.id, categoria.nome);
        });
        
        console.log(`Total de categorias encontradas: ${categoriasMap.size}`);
        console.log('Mapa final de categorias:', Object.fromEntries(categoriasMap));
      } else {
        console.log('Documento do usuário não encontrado');
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
      // Primeiro buscar todas as categorias
      const categoriasMap = await buscarCategorias(user.uid);

      const transacoesRef = collection(db, 'transacoes');
      const q = query(
        transacoesRef,
        where('userId', '==', user.uid),
        where('status', '==', 'ativo'),
        where('ano', '==', anoSelecionado)
      );

      const querySnapshot = await getDocs(q);
      console.log(`Encontradas ${querySnapshot.docs.length} transações`);
      
      const todasTransacoes = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const categoriaNome = categoriasMap.get(data.categoria);
        console.log(`Transação: ${data.descricao}, Categoria ID: ${data.categoria}, Nome: ${categoriaNome}`);
        
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
        'Categoria': t.categoriaNome, // Usando o nome da categoria em vez do ID
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

  const handleImportarArquivo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportando(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      const workbook = await file.arrayBuffer().then(buffer => XLSX.read(buffer));
      
      // Verificar se todas as abas dos meses existem
      const expectedSheets = new Set(MESES);
      const actualSheets = new Set(workbook.SheetNames);
      
      if (!MESES.every(mes => actualSheets.has(mes))) {
        toast.error('Formato inválido: A planilha deve conter uma aba para cada mês do ano');
        return;
      }

      let transacoesImportadas = 0;
      const transacoesRef = collection(db, 'transacoes');

      for (const mes of MESES) {
        const worksheet = workbook.Sheets[mes];
        const data = XLSX.utils.sheet_to_json<any>(worksheet);

        for (const row of data) {
          // Pular a linha de totais
          if (row['Descrição'] === 'TOTAL DO MÊS') continue;

          // Converter valor de string para número
          const valorStr = row['Valor'].replace('R$', '').replace('.', '').replace(',', '.').trim();
          const valor = Math.abs(parseFloat(valorStr));
          
          const data = new Date(row['Data'].split('/').reverse().join('-'));
          
          await addDoc(transacoesRef, {
            descricao: row['Descrição'],
            categoria: row['Categoria'],
            valor: valor,
            data: Timestamp.fromDate(data),
            tipo: parseFloat(valorStr) >= 0 ? 'entrada' : 'saida',
            status: 'ativo',
            userId: user.uid,
            ano: data.getFullYear(),
            mes: data.getMonth() + 1
          });

          transacoesImportadas++;
        }
      }

      toast.success(`${transacoesImportadas} transações importadas com sucesso!`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erro na importação:', error);
      toast.error('Erro ao importar dados. Verifique o formato do arquivo.');
    } finally {
      setImportando(false);
    }
  };

  const gerarModeloImportacao = () => {
    const dadosExemplo = [
      {
        'Descrição': 'Netflix',
        'Categoria': 'Entretenimento',
        'Data': '05/01/2024',
        'Valor': 'R$ -39,90',
        'Total Entradas': 'R$ 0,00',
        'Total Saídas': 'R$ 39,90',
        'Saldo': 'R$ -39,90'
      },
      {
        'Descrição': 'Freelance Design',
        'Categoria': 'Renda Extra',
        'Data': '10/01/2024',
        'Valor': 'R$ 850,00',
        'Total Entradas': 'R$ 850,00',
        'Total Saídas': 'R$ 39,90',
        'Saldo': 'R$ 810,10'
      },
      {
        'Descrição': 'Mercado Livre',
        'Categoria': 'Compras',
        'Data': '15/01/2024',
        'Valor': 'R$ -156,90',
        'Total Entradas': 'R$ 850,00',
        'Total Saídas': 'R$ 196,80',
        'Saldo': 'R$ 653,20'
      },
      {
        'Descrição': 'TOTAL DO MÊS',
        'Categoria': '',
        'Data': '',
        'Valor': '',
        'Total Entradas': 'R$ 850,00',
        'Total Saídas': 'R$ 196,80',
        'Saldo': 'R$ 653,20'
      }
    ];

    const dadosVazios = [{
      'Descrição': '',
      'Categoria': '',
      'Data': '',
      'Valor': '',
      'Total Entradas': '',
      'Total Saídas': '',
      'Saldo': ''
    }];

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
    MESES.forEach((mes, index) => {
      // Usar dados de exemplo apenas para Janeiro (índice 0)
      const dados = index === 0 ? dadosExemplo : dadosVazios;
      const worksheet = XLSX.utils.json_to_sheet(dados);
      worksheet['!cols'] = colunas;
      XLSX.utils.book_append_sheet(workbook, worksheet, mes);
    });

    // Gerar o arquivo
    XLSX.writeFile(workbook, 'Dados_Balancium_Modelo_Importacao.xlsx');
  };

  return (
    <div className={styles.container}>
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

      <Card className={styles.heroCard}>
        <h1 className={styles.heroTitle}>Exportação e Importação</h1>
        <p className={styles.heroSubtitle}>Exporte ou importe seus dados financeiros</p>
      </Card>

      <div className={styles.content}>
        <Card className={styles.exportCard}>
          <h2 className={styles.cardTitle}>Exportar Dados</h2>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ano</label>
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
          </div>

          <div className={styles.exportActions}>
            <Button
              variant="primary"
              onClick={handleExportar}
              disabled={exportando}
              className={styles.exportButton}
            >
              {exportando ? 'Exportando...' : 'Exportar para Excel (.xlsx)'}
            </Button>
          </div>
        </Card>

        <Card className={styles.importCard}>
          <h2 className={styles.cardTitle}>Importar Dados</h2>
          
          <div className={styles.importInstructions}>
            <h3>Instruções para Importação:</h3>
            <ol>
              <li>O arquivo deve estar no formato .xlsx (Excel)</li>
              <li>Deve conter 12 abas, uma para cada mês do ano (Janeiro a Dezembro)</li>
              <li>Cada aba deve conter as seguintes colunas:
                <ul>
                  <li>Descrição</li>
                  <li>Categoria</li>
                  <li>Data (formato dd/mm/aaaa)</li>
                  <li>Valor (formato R$ 0,00)</li>
                  <li>Total Entradas</li>
                  <li>Total Saídas</li>
                  <li>Saldo</li>
                </ul>
              </li>
              <li>Valores positivos serão considerados entradas</li>
              <li>Valores negativos serão considerados saídas</li>
            </ol>
            <div className={styles.templateDownload}>
              <p>Baixe o modelo de planilha para importação:</p>
              <Button
                variant="secondary"
                onClick={gerarModeloImportacao}
                className={styles.templateButton}
              >
                Baixar Modelo de Planilha
              </Button>
            </div>
          </div>

          <div className={styles.importActions}>
            <input
              type="file"
              accept=".xlsx"
              onChange={handleImportarArquivo}
              disabled={importando}
              ref={fileInputRef}
              className={styles.fileInput}
            />
            <p className={styles.importStatus}>
              {importando ? 'Importando dados...' : 'Selecione um arquivo .xlsx para importar'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
} 