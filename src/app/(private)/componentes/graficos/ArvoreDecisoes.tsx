'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import Tree from 'react-d3-tree';
import styles from './ArvoreDecisoes.module.css';

interface TreeNode {
  name: string;
  attributes?: {
    valor: string;
  };
  children?: TreeNode[];
}

export function ArvoreDecisoes() {
  const [data, setData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const anoAtual = new Date().getFullYear();
        const mesAtual = new Date().getMonth() + 1;

        const q = query(
          collection(db, 'transacoes'),
          where('userId', '==', user.uid),
          where('ano', '==', anoAtual),
          where('mes', '==', mesAtual),
          where('status', '==', 'ativo')
        );

        const querySnapshot = await getDocs(q);
        const transacoes = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        // Agrupa transações por categoria
        const categorias = transacoes.reduce((acc: { [key: string]: number }, transacao: any) => {
          const categoria = transacao.categoria;
          if (!acc[categoria]) acc[categoria] = 0;
          acc[categoria] += transacao.valor;
          return acc;
        }, {});

        // Cria a estrutura da árvore no formato do react-d3-tree
        const arvore: TreeNode[] = [{
          name: 'Finanças',
          attributes: {
            valor: `R$ ${Object.values(categorias).reduce((a, b) => a + b, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          },
          children: Object.entries(categorias).map(([categoria, valor]) => ({
            name: categoria.charAt(0).toUpperCase() + categoria.slice(1),
            attributes: {
              valor: `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            }
          }))
        }];

        setData(arvore);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const renderCustomNode = ({ nodeDatum, toggleNode }: any) => (
    <g>
      <circle r="35" fill="#10B981" className={styles.node} />
      <text
        dy="0"
        x="0"
        textAnchor="middle"
        className={styles.nodeLabel}
        style={{ fill: 'white' }}
      >
        {nodeDatum.name}
      </text>
      {nodeDatum.attributes?.valor && (
        <text
          dy="20"
          x="0"
          textAnchor="middle"
          className={styles.nodeValue}
          style={{ fill: 'white' }}
        >
          {nodeDatum.attributes.valor}
        </text>
      )}
    </g>
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Árvore de Decisões Financeiras</h3>
        <p className={styles.subtitle}>
          Visualize a distribuição dos seus gastos e tome decisões informadas
        </p>
      </div>

      <div className={styles.treeContainer}>
        <Tree
          data={data[0]}
          orientation="vertical"
          pathFunc="step"
          separation={{ siblings: 2, nonSiblings: 2.5 }}
          translate={{ x: window.innerWidth / 3, y: 100 }}
          renderCustomNodeElement={renderCustomNode}
          nodeSize={{ x: 200, y: 100 }}
          zoomable={true}
          draggable={true}
        />
      </div>
    </div>
  );
} 