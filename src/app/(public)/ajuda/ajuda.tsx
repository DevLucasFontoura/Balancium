'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CONSTANTES } from '@/constants/constantes';
import styles from './ajuda.module.css';

interface FAQItem {
  id: string;
  pergunta: string;
  resposta: string;
  categoria: string;
}

const faqData: FAQItem[] = [
  // Primeiros Passos
  { id: CONSTANTES.ID_FAQ_01, pergunta: CONSTANTES.PERGUNTA_01, resposta: CONSTANTES.RESPOSTA_01, categoria: CONSTANTES.CATEGORIA_PRIMEIROS_PASSOS },
  { id: CONSTANTES.ID_FAQ_02, pergunta: CONSTANTES.PERGUNTA_02, resposta: CONSTANTES.RESPOSTA_02, categoria: CONSTANTES.CATEGORIA_PRIMEIROS_PASSOS },
  { id: CONSTANTES.ID_FAQ_03, pergunta: CONSTANTES.PERGUNTA_03, resposta: CONSTANTES.RESPOSTA_03, categoria: CONSTANTES.CATEGORIA_PRIMEIROS_PASSOS },
  { id: CONSTANTES.ID_FAQ_04, pergunta: CONSTANTES.PERGUNTA_04, resposta: CONSTANTES.RESPOSTA_04, categoria: CONSTANTES.CATEGORIA_PRIMEIROS_PASSOS },

  // Dashboard
  { id: CONSTANTES.ID_FAQ_05, pergunta: CONSTANTES.PERGUNTA_05, resposta: CONSTANTES.RESPOSTA_05, categoria: CONSTANTES.CATEGORIA_DASHBOARD },
  { id: CONSTANTES.ID_FAQ_06, pergunta: CONSTANTES.PERGUNTA_06, resposta: CONSTANTES.RESPOSTA_06, categoria: CONSTANTES.CATEGORIA_DASHBOARD },
  { id: CONSTANTES.ID_FAQ_07, pergunta: CONSTANTES.PERGUNTA_07, resposta: CONSTANTES.RESPOSTA_07, categoria: CONSTANTES.CATEGORIA_DASHBOARD },
  { id: CONSTANTES.ID_FAQ_08, pergunta: CONSTANTES.PERGUNTA_08, resposta: CONSTANTES.RESPOSTA_08, categoria: CONSTANTES.CATEGORIA_DASHBOARD },

  // Transações
  { id: CONSTANTES.ID_FAQ_09, pergunta: CONSTANTES.PERGUNTA_09, resposta: CONSTANTES.RESPOSTA_09, categoria: CONSTANTES.CATEGORIA_TRANSACOES },
  { id: CONSTANTES.ID_FAQ_10, pergunta: CONSTANTES.PERGUNTA_10, resposta: CONSTANTES.RESPOSTA_10, categoria: CONSTANTES.CATEGORIA_TRANSACOES },
  { id: CONSTANTES.ID_FAQ_11, pergunta: CONSTANTES.PERGUNTA_11, resposta: CONSTANTES.RESPOSTA_11, categoria: CONSTANTES.CATEGORIA_TRANSACOES },
  { id: CONSTANTES.ID_FAQ_12, pergunta: CONSTANTES.PERGUNTA_12, resposta: CONSTANTES.RESPOSTA_12, categoria: CONSTANTES.CATEGORIA_TRANSACOES },
  { id: CONSTANTES.ID_FAQ_13, pergunta: CONSTANTES.PERGUNTA_13, resposta: CONSTANTES.RESPOSTA_13, categoria: CONSTANTES.CATEGORIA_TRANSACOES },
  { id: CONSTANTES.ID_FAQ_14, pergunta: CONSTANTES.PERGUNTA_14, resposta: CONSTANTES.RESPOSTA_14, categoria: CONSTANTES.CATEGORIA_TRANSACOES },

  // Relatórios
  { id: CONSTANTES.ID_FAQ_15, pergunta: CONSTANTES.PERGUNTA_15, resposta: CONSTANTES.RESPOSTA_15, categoria: CONSTANTES.CATEGORIA_RELATORIOS },
  { id: CONSTANTES.ID_FAQ_16, pergunta: CONSTANTES.PERGUNTA_16, resposta: CONSTANTES.RESPOSTA_16, categoria: CONSTANTES.CATEGORIA_RELATORIOS },
  { id: CONSTANTES.ID_FAQ_17, pergunta: CONSTANTES.PERGUNTA_17, resposta: CONSTANTES.RESPOSTA_17, categoria: CONSTANTES.CATEGORIA_RELATORIOS },
  { id: CONSTANTES.ID_FAQ_18, pergunta: CONSTANTES.PERGUNTA_18, resposta: CONSTANTES.RESPOSTA_18, categoria: CONSTANTES.CATEGORIA_RELATORIOS },
  { id: CONSTANTES.ID_FAQ_19, pergunta: CONSTANTES.PERGUNTA_19, resposta: CONSTANTES.RESPOSTA_19, categoria: CONSTANTES.CATEGORIA_RELATORIOS },

  // Categorias
  { id: CONSTANTES.ID_FAQ_20, pergunta: CONSTANTES.PERGUNTA_20, resposta: CONSTANTES.RESPOSTA_20, categoria: CONSTANTES.CATEGORIA_CATEGORIAS },
  { id: CONSTANTES.ID_FAQ_21, pergunta: CONSTANTES.PERGUNTA_21, resposta: CONSTANTES.RESPOSTA_21, categoria: CONSTANTES.CATEGORIA_CATEGORIAS },
  { id: CONSTANTES.ID_FAQ_22, pergunta: CONSTANTES.PERGUNTA_22, resposta: CONSTANTES.RESPOSTA_22, categoria: CONSTANTES.CATEGORIA_CATEGORIAS },
  { id: CONSTANTES.ID_FAQ_23, pergunta: CONSTANTES.PERGUNTA_23, resposta: CONSTANTES.RESPOSTA_23, categoria: CONSTANTES.CATEGORIA_CATEGORIAS },
  { id: CONSTANTES.ID_FAQ_24, pergunta: CONSTANTES.PERGUNTA_24, resposta: CONSTANTES.RESPOSTA_24, categoria: CONSTANTES.CATEGORIA_CATEGORIAS },
  { id: CONSTANTES.ID_FAQ_25, pergunta: CONSTANTES.PERGUNTA_25, resposta: CONSTANTES.RESPOSTA_25, categoria: CONSTANTES.CATEGORIA_CATEGORIAS },

  // Problemas Técnicos
  { id: CONSTANTES.ID_FAQ_26, pergunta: CONSTANTES.PERGUNTA_26, resposta: CONSTANTES.RESPOSTA_26, categoria: CONSTANTES.CATEGORIA_PROBLEMAS_TECNICOS },
  { id: CONSTANTES.ID_FAQ_27, pergunta: CONSTANTES.PERGUNTA_27, resposta: CONSTANTES.RESPOSTA_27, categoria: CONSTANTES.CATEGORIA_PROBLEMAS_TECNICOS },
  { id: CONSTANTES.ID_FAQ_28, pergunta: CONSTANTES.PERGUNTA_28, resposta: CONSTANTES.RESPOSTA_28, categoria: CONSTANTES.CATEGORIA_PROBLEMAS_TECNICOS },
  { id: CONSTANTES.ID_FAQ_29, pergunta: CONSTANTES.PERGUNTA_29, resposta: CONSTANTES.RESPOSTA_29, categoria: CONSTANTES.CATEGORIA_PROBLEMAS_TECNICOS },
  { id: CONSTANTES.ID_FAQ_30, pergunta: CONSTANTES.PERGUNTA_30, resposta: CONSTANTES.RESPOSTA_30, categoria: CONSTANTES.CATEGORIA_PROBLEMAS_TECNICOS },
  { id: CONSTANTES.ID_FAQ_31, pergunta: CONSTANTES.PERGUNTA_31, resposta: CONSTANTES.RESPOSTA_31, categoria: CONSTANTES.CATEGORIA_PROBLEMAS_TECNICOS },
  { id: CONSTANTES.ID_FAQ_32, pergunta: CONSTANTES.PERGUNTA_32, resposta: CONSTANTES.RESPOSTA_32, categoria: CONSTANTES.CATEGORIA_PROBLEMAS_TECNICOS },
];

export function Ajuda() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={styles.headerContent}>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={styles.titleIcon}></span> {CONSTANTES.TITULO_PAGINA_AJUDA}
          </motion.h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {CONSTANTES.DESCRICAO_PAGINA_AJUDA}
          </motion.p>
        </div>
      </motion.div>

      {/* Quick Start Guide */}
      <div className={styles.section}>
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className={styles.sectionIcon}>🚀</span> {CONSTANTES.TITULO_PRIMEIROS_PASSOS}
        </motion.h2>
        <div className={styles.quickStartGrid}>
          <motion.div 
            className={styles.quickStartCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.3 }
            }}
          >
            <div className={styles.quickStartIcon}>1</div>
            <h3>{CONSTANTES.TITULO_CRIAR_CONTA}</h3>
            <p>{CONSTANTES.DESCRICAO_CRIAR_CONTA}</p>
            <Link href={CONSTANTES.ROUTE_CADASTRO} className={styles.quickStartLink}>
              {CONSTANTES.LINK_CRIAR_CONTA}
            </Link>
          </motion.div>
          <motion.div 
            className={styles.quickStartCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.3 }
            }}
          >
            <div className={styles.quickStartIcon}>2</div>
            <h3>{CONSTANTES.TITULO_CONFIGURAR_CATEGORIAS}</h3>
            <p>{CONSTANTES.DESCRICAO_CONFIGURAR_CATEGORIAS}</p>
          </motion.div>
          <motion.div 
            className={styles.quickStartCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.3 }
            }}
          >
            <div className={styles.quickStartIcon}>3</div>
            <h3>{CONSTANTES.TITULO_ADICIONAR_TRANSACOES}</h3>
            <p>{CONSTANTES.DESCRICAO_ADICIONAR_TRANSACOES}</p>
          </motion.div>
          <motion.div 
            className={styles.quickStartCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.3 }
            }}
          >
            <div className={styles.quickStartIcon}>4</div>
            <h3>{CONSTANTES.TITULO_ANALISAR_RELATORIOS}</h3>
            <p>{CONSTANTES.DESCRICAO_ANALISAR_RELATORIOS}</p>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className={styles.section}>
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className={styles.sectionIcon}></span>{CONSTANTES.TITULO_PERGUNTAS_FREQUENTES}
        </motion.h2>
        
        <div className={styles.faqList}>
          {faqData.map((item, index) => (
            <motion.div 
              key={item.id} 
              className={styles.faqItem}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              whileHover={{ scale: 1.01 }}
            >
              <motion.button
                onClick={() => toggleItem(item.id)}
                className={styles.faqQuestion}
                aria-label={CONSTANTES.LABEL_EXPANDIR_PERGUNTA}
                whileHover={{ 
                  backgroundColor: "rgba(0, 0, 0, 0.05)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={styles.faqQuestionText}>{item.pergunta}</span>
                <motion.svg 
                  className={styles.faqIcon}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ 
                    rotate: expandedItems.has(item.id) ? 180 : 0 
                  }}
                  transition={{ 
                    duration: 0.25,
                    ease: "easeOut"
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>
              {expandedItems.has(item.id) && (
                <motion.div 
                  className={styles.faqAnswer}
                  initial={{ 
                    opacity: 0, 
                    scaleY: 0,
                    transformOrigin: "top"
                  }}
                  animate={{ 
                    opacity: 1, 
                    scaleY: 1
                  }}
                  transition={{ 
                    duration: 0.25,
                    ease: "easeOut"
                  }}
                >
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.2,
                      delay: 0.1
                    }}
                  >
                    {item.resposta}
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className={styles.section}>
        <motion.div 
          className={styles.contactCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
        >
          <div className={styles.contactContent}>
            <h2 className={styles.contactTitle}>{CONSTANTES.TITULO_CONTATO_SUPORTE}</h2>
            <p className={styles.contactText}>{CONSTANTES.DESCRICAO_CONTATO_SUPORTE}</p>
            <div className={styles.contactButtons}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/contato" className={styles.contactButtonPrimary}>
                  {CONSTANTES.BOTAO_ENTRAR_CONTATO}
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/como-funciona" className={styles.contactButtonSecondary}>
                  {CONSTANTES.BOTAO_COMO_FUNCIONA}
                </Link>
              </motion.div>
            </div>
          </div>
          <motion.div 
            className={styles.contactIcon}
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            💬
          </motion.div>
        </motion.div>
      </div>

      {/* Back to Top Button */}
      <motion.button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={styles.backToTop}
        aria-label={CONSTANTES.LABEL_VOLTAR_AO_TOPO}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ 
          scale: 1.1,
          transition: { duration: 0.2 }
        }}
        whileTap={{ 
          scale: 0.9,
          transition: { duration: 0.1 }
        }}
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
}

