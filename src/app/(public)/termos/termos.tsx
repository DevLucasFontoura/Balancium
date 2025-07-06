'use client';

import { motion } from 'framer-motion';
import { CONSTANTES } from '@/constants/constantes';
import styles from './termos.module.css';

export function Termos() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <motion.section 
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>📋</span> 
            Termos de Uso
          </h1>
          <p className={styles.subtitle}>
            Última atualização: {new Date().toLocaleDateString('pt-BR')} | Versão 1.0
          </p>
        </div>
      </motion.section>

      {/* Conteúdo Principal */}
      <div className={styles.content}>
        {/* Introdução */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className={styles.sectionTitle}>1. Introdução</h2>
          <p className={styles.paragraph}>
            Bem-vindo ao Balancium! Estes Termos de Uso ("Termos") regem o uso da plataforma Balancium 
            ("Serviço") fornecida pela Balancium ("nós", "nosso" ou "empresa").
          </p>
          <p className={styles.paragraph}>
            Ao acessar ou usar nosso Serviço, você concorda em cumprir e estar vinculado a estes Termos. 
            Se você não concordar com qualquer parte destes termos, não deve usar nosso Serviço.
          </p>
        </motion.section>

        {/* Definições */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className={styles.sectionTitle}>2. Definições</h2>
          <p className={styles.paragraph}>
            Para os fins destes Termos:
          </p>
          <ul className={styles.list}>
            <li><strong>"Serviço"</strong> refere-se à plataforma Balancium, incluindo todos os recursos e funcionalidades</li>
            <li><strong>"Usuário"</strong> refere-se a qualquer pessoa que acesse ou use o Serviço</li>
            <li><strong>"Conta"</strong> refere-se ao registro individual do usuário no Serviço</li>
            <li><strong>"Dados"</strong> refere-se a todas as informações fornecidas pelo usuário</li>
            <li><strong>"Conteúdo"</strong> refere-se a dados, informações e materiais enviados pelo usuário</li>
          </ul>
        </motion.section>

        {/* Descrição do Serviço */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className={styles.sectionTitle}>3. Descrição do Serviço</h2>
          <p className={styles.paragraph}>
            O Balancium é uma plataforma de gestão financeira pessoal que oferece:
          </p>
          <ul className={styles.list}>
            <li>Registro e categorização de receitas e despesas</li>
            <li>Visualização de relatórios e gráficos financeiros</li>
            <li>Configuração de categorias personalizadas</li>
            <li>Exportação de dados financeiros</li>
            <li>Análises e insights sobre finanças pessoais</li>
            <li>Dashboard interativo com métricas em tempo real</li>
            <li>Relatórios mensais e anuais detalhados</li>
            <li>Funcionalidades de backup e sincronização</li>
          </ul>
        </motion.section>

        {/* Elegibilidade e Registro */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className={styles.sectionTitle}>4. Elegibilidade e Registro</h2>
          <p className={styles.paragraph}>
            Para usar o Balancium, você deve:
          </p>
          <ul className={styles.list}>
            <li>Ter pelo menos 18 anos de idade ou ter consentimento parental</li>
            <li>Fornecer informações precisas e completas durante o registro</li>
            <li>Manter a confidencialidade de suas credenciais de acesso</li>
            <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
            <li>Ser responsável por todas as atividades em sua conta</li>
          </ul>
          <p className={styles.paragraph}>
            Reservamo-nos o direito de recusar o registro ou encerrar contas que violem estes Termos.
          </p>
        </motion.section>

        {/* Uso Aceitável */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className={styles.sectionTitle}>5. Uso Aceitável</h2>
          <p className={styles.paragraph}>
            Você concorda em usar o Serviço apenas para fins legais e de acordo com estes Termos. 
            Você não deve:
          </p>
          <ul className={styles.list}>
            <li>Usar o Serviço para atividades ilegais ou fraudulentas</li>
            <li>Tentar acessar contas de outros usuários sem autorização</li>
            <li>Interferir no funcionamento ou segurança do Serviço</li>
            <li>Transmitir vírus, malware ou código malicioso</li>
            <li>Usar o Serviço para spam, phishing ou conteúdo inadequado</li>
            <li>Violar direitos de propriedade intelectual</li>
            <li>Realizar engenharia reversa ou descompilar o software</li>
            <li>Usar bots ou scripts automatizados sem permissão</li>
          </ul>
        </motion.section>

        {/* Privacidade e Proteção de Dados */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>6. Privacidade e Proteção de Dados</h2>
          <p className={styles.paragraph}>
            Sua privacidade é fundamental para nós. Nossa Política de Privacidade, incorporada por referência 
            a estes Termos, explica como coletamos, usamos, armazenamos e protegemos suas informações.
          </p>
          <p className={styles.paragraph}>
            <strong>Princípios de Proteção:</strong>
          </p>
          <ul className={styles.list}>
            <li>Você mantém a propriedade de seus dados financeiros</li>
            <li>Utilizamos criptografia de ponta a ponta para proteger seus dados</li>
            <li>Não vendemos, alugamos ou compartilhamos dados pessoais com terceiros</li>
            <li>Coletamos apenas dados necessários para o funcionamento do Serviço</li>
            <li>Você pode solicitar a exclusão de seus dados a qualquer momento</li>
            <li>Cumprimos com a LGPD (Lei Geral de Proteção de Dados)</li>
          </ul>
        </motion.section>

        {/* Planos e Pagamentos */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className={styles.sectionTitle}>7. Planos de Assinatura e Pagamentos</h2>
          <p className={styles.paragraph}>
            O Balancium oferece diferentes planos de assinatura:
          </p>
          <ul className={styles.list}>
            <li><strong>Plano Gratuito:</strong> Acesso básico com funcionalidades limitadas</li>
            <li><strong>Plano Plus (R$ 9,90/mês):</strong> Recursos avançados incluindo edição de transações e categorias</li>
            <li><strong>Plano Premium (R$ 19,90/mês):</strong> Recursos completos incluindo exportação e anexos</li>
          </ul>
          <p className={styles.paragraph}>
            <strong>Termos de Pagamento:</strong>
          </p>
          <ul className={styles.list}>
            <li>As assinaturas são renovadas automaticamente</li>
            <li>Pagamentos são processados de forma segura</li>
            <li>Você pode cancelar a qualquer momento através das configurações</li>
            <li>Reembolsos são avaliados caso a caso</li>
            <li>Preços podem ser alterados com aviso prévio de 30 dias</li>
          </ul>
        </motion.section>

        {/* Propriedade Intelectual */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className={styles.sectionTitle}>8. Propriedade Intelectual</h2>
          <p className={styles.paragraph}>
            O Serviço e todo o conteúdo relacionado, incluindo mas não se limitando a software, design, 
            textos, gráficos, interfaces e algoritmos, são propriedade da Balancium ou de nossos licenciadores.
          </p>
          <p className={styles.paragraph}>
            Você mantém a propriedade de seus dados financeiros, mas concede à Balancium uma licença 
            não exclusiva para processar e armazenar esses dados conforme necessário para fornecer o Serviço.
          </p>
        </motion.section>

        {/* Limitações de Responsabilidade */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <h2 className={styles.sectionTitle}>9. Limitações de Responsabilidade</h2>
          <p className={styles.paragraph}>
            O Balancium é fornecido "como está" e "conforme disponível". Não garantimos que o Serviço 
            será ininterrupto, livre de erros ou seguro.
          </p>
          <p className={styles.paragraph}>
            <strong>Limitações:</strong>
          </p>
          <ul className={styles.list}>
            <li>Não somos responsáveis por decisões financeiras baseadas nos dados fornecidos</li>
            <li>Não garantimos a precisão absoluta dos cálculos ou relatórios</li>
            <li>Não somos responsáveis por perda de dados devido a falhas técnicas</li>
            <li>Não garantimos compatibilidade com todos os dispositivos ou navegadores</li>
            <li>Nossa responsabilidade é limitada ao valor pago pelo serviço nos últimos 12 meses</li>
          </ul>
        </motion.section>

        {/* Indenização */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h2 className={styles.sectionTitle}>10. Indenização</h2>
          <p className={styles.paragraph}>
            Você concorda em indenizar e isentar a Balancium, seus diretores, funcionários e agentes 
            de qualquer reclamação, dano, perda ou despesa (incluindo honorários advocatícios) 
            decorrentes do seu uso do Serviço ou violação destes Termos.
          </p>
        </motion.section>

        {/* Modificações dos Termos */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <h2 className={styles.sectionTitle}>11. Modificações dos Termos</h2>
          <p className={styles.paragraph}>
            Reservamo-nos o direito de modificar estes Termos a qualquer momento. As alterações 
            entrarão em vigor imediatamente após a publicação no Serviço.
          </p>
          <p className={styles.paragraph}>
            Seu uso contínuo do Serviço após as modificações constitui aceitação dos novos Termos. 
            Recomendamos que você revise periodicamente estes Termos para estar ciente de quaisquer alterações.
          </p>
        </motion.section>

        {/* Rescisão */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h2 className={styles.sectionTitle}>12. Rescisão</h2>
          <p className={styles.paragraph}>
            Você pode encerrar sua conta a qualquer momento através das configurações da sua conta. 
            Podemos suspender ou encerrar sua conta imediatamente se você:
          </p>
          <ul className={styles.list}>
            <li>Violar estes Termos de Uso</li>
            <li>Usar o Serviço de forma fraudulenta ou ilegal</li>
            <li>Interferir no funcionamento do Serviço</li>
            <li>Não pagar taxas devidas (para planos pagos)</li>
          </ul>
          <p className={styles.paragraph}>
            Após o encerramento, seus dados podem ser excluídos permanentemente após 30 dias, 
            conforme nossa Política de Privacidade.
          </p>
        </motion.section>

        {/* Lei Aplicável e Jurisdição */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <h2 className={styles.sectionTitle}>13. Lei Aplicável e Jurisdição</h2>
          <p className={styles.paragraph}>
            Estes Termos são regidos pelas leis do Brasil. Qualquer disputa será resolvida nos 
            tribunais competentes da jurisdição brasileira, com renúncia expressa a qualquer outro foro.
          </p>
          <p className={styles.paragraph}>
            Em caso de litígio, as partes se comprometem a tentar resolver a questão através de 
            mediação antes de recorrer ao Poder Judiciário.
          </p>
        </motion.section>

        {/* Disposições Gerais */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <h2 className={styles.sectionTitle}>14. Disposições Gerais</h2>
          <ul className={styles.list}>
            <li><strong>Integralidade:</strong> Estes Termos constituem o acordo completo entre as partes</li>
            <li><strong>Divisibilidade:</strong> Se qualquer disposição for considerada inválida, as demais permanecem válidas</li>
            <li><strong>Renúncia:</strong> A falha em fazer valer qualquer direito não constitui renúncia</li>
            <li><strong>Cessão:</strong> Você não pode ceder estes Termos sem nosso consentimento por escrito</li>
            <li><strong>Força Maior:</strong> Não somos responsáveis por eventos fora de nosso controle</li>
          </ul>
        </motion.section>

        {/* Contato */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <h2 className={styles.sectionTitle}>15. Contato</h2>
          <p className={styles.paragraph}>
            Se você tiver dúvidas sobre estes Termos, entre em contato conosco:
          </p>
          <ul className={styles.list}>
            <li><strong>E-mail:</strong> suporte@balancium.com</li>
            <li><strong>Página de Contato:</strong> /contato</li>
            <li><strong>Horário de Atendimento:</strong> Segunda a Sexta, 9h às 18h (BRT)</li>
            <li><strong>Endereço:</strong> Brasília, DF, Brasil</li>
          </ul>
        </motion.section>
      </div>

      {/* Footer */}
      <motion.section 
        className={styles.footer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <p className={styles.footerText}>
          Ao usar o Balancium, você confirma que leu, entendeu e concorda com estes Termos de Uso. 
          Estes Termos são efetivos a partir da data de publicação e substituem todos os acordos anteriores.
        </p>
      </motion.section>
    </div>
  );
}
