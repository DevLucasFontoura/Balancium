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

  return (
    <div className={styles.container}>
      <div className={styles.heroCard}>
        <h1 className={styles.heroTitle}>Exportação de Dados</h1>
        <p className={styles.heroSubtitle}>Exporte seu histórico financeiro</p>
      </div>

      <div className={styles.content}>
        <Card className={styles.exportCard}>
          <h2 className={styles.cardTitle}>Nova Exportação</h2>
          
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
      </div>
    </div>
  );
} 