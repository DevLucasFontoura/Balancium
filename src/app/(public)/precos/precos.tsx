import Link from 'next/link';
import styles from './precos.module.css';

export function Precos() {
  return (
    <div className={styles.container}>
      <section className={styles.pricingSection}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            Planos e Preços <span className={styles.highlight}>Balancium</span>
          </h1>
          <p className={styles.subtitle}>
            Escolha o plano ideal para suas necessidades e comece a transformar suas finanças hoje
          </p>
        </div>
        
        <div className={styles.comparisonTable}>
          <div className={styles.plansHeader}>
            <div className={styles.featureHeader}>Recursos</div>
            <div className={styles.planColumn}>
              <div className={styles.planTag}>Básico</div>
              <div className={styles.planColumnTitle}>Gratuito</div>
              <div className={styles.planColumnPrice}>R$ 0,00</div>
              <div className={styles.planPeriod}>para sempre</div>
              <Link href="/cadastro" className={styles.planButton}>Começar Agora</Link>
            </div>
            <div className={`${styles.planColumn} ${styles.popularPlan}`}>
              <div className={styles.planTag}>Mais Popular</div>
              <div className={styles.planColumnTitle}>Plus</div>
              <div className={styles.planColumnPrice}>R$ 9,90</div>
              <div className={styles.planPeriod}>por mês</div>
              <Link href="/cadastro" className={`${styles.planButton} ${styles.primaryButton}`}>Escolher Plus</Link>
            </div>
            <div className={styles.planColumn}>
              <div className={styles.planTag}>Completo</div>
              <div className={styles.planColumnTitle}>Premium</div>
              <div className={styles.planColumnPrice}>R$ 19,90</div>
              <div className={styles.planPeriod}>por mês</div>
              <Link href="/cadastro" className={styles.planButton}>Escolher Premium</Link>
            </div>
          </div>

          <div className={styles.featuresList}>
            <div className={styles.featureGroup}>
              <div className={styles.featureGroupTitle}>Recursos Básicos</div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Armazenamento Ilimitado</span>
                  <span className={styles.featureDescription}>Sem limites para seus dados</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Suporte por email</span>
                  <span className={styles.featureDescription}>Atendimento via email</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Controle Básico</span>
                  <span className={styles.featureDescription}>Gestão de receitas e despesas</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Relatórios Mensais</span>
                  <span className={styles.featureDescription}>Resumo mensal das suas finanças</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Categorias Básicas</span>
                  <span className={styles.featureDescription}>Categorias predefinidas</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
            </div>

            <div className={styles.featureGroup}>
              <div className={styles.featureGroupTitle}>Recursos Plus</div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Editar Transações</span>
                  <span className={styles.featureDescription}>Edição completa de lançamentos</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Editar Categorias</span>
                  <span className={styles.featureDescription}>Personalização de categorias</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Criar Categorias</span>
                  <span className={styles.featureDescription}>Criação de novas categorias</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
            </div>

            <div className={styles.featureGroup}>
              <div className={styles.featureGroupTitle}>Recursos Premium</div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Exportar Dados</span>
                  <span className={styles.featureDescription}>Exportação de relatórios</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
                <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureName}>
                  <span>Anexar Arquivos</span>
                  <span className={styles.featureDescription}>Anexe comprovantes às transações</span>
                </div>
                <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
                <div className={styles.featureCheck}><span className={styles.xMark}>×</span></div>
                <div className={styles.featureCheck}><span className={styles.checkMark}>✓</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 