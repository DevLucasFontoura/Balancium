'use client';

import { motion } from 'framer-motion';
import styles from './privacidade.module.css';

export function Privacidade() {
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
            <span className={styles.titleIcon}>🛡️</span> 
            Política de Privacidade
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
            A Balancium ("nós", "nosso" ou "empresa") está comprometida em proteger sua privacidade. 
            Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas 
            informações pessoais quando você usa nossa plataforma de gestão financeira.
          </p>
          <p className={styles.paragraph}>
            Ao usar o Balancium, você confia em nós com suas informações financeiras. 
            Tomamos essa responsabilidade muito a sério e implementamos medidas rigorosas 
            para garantir a segurança e privacidade de seus dados.
          </p>
        </motion.section>

        {/* Informações que Coletamos */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className={styles.sectionTitle}>2. Informações que Coletamos</h2>
          
          <h3 style={{ color: '#13ba82', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '600' }}>
            Informações Pessoais
          </h3>
          <ul className={styles.list}>
            <li><strong>Dados de Registro:</strong> Nome, e-mail, senha e informações de perfil</li>
            <li><strong>Dados de Contato:</strong> Endereço de e-mail para comunicações</li>
            <li><strong>Informações de Conta:</strong> Preferências e configurações do usuário</li>
          </ul>

          <h3 style={{ color: '#13ba82', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '600', marginTop: '2rem' }}>
            Dados Financeiros
          </h3>
          <ul className={styles.list}>
            <li><strong>Transações:</strong> Receitas, despesas, valores e datas</li>
            <li><strong>Categorias:</strong> Classificação personalizada de transações</li>
            <li><strong>Metas Financeiras:</strong> Objetivos e planos financeiros</li>
            <li><strong>Relatórios:</strong> Dados para geração de análises e gráficos</li>
          </ul>

          <h3 style={{ color: '#13ba82', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '600', marginTop: '2rem' }}>
            Dados Técnicos
          </h3>
          <ul className={styles.list}>
            <li><strong>Logs de Acesso:</strong> Data, hora e IP de login</li>
            <li><strong>Dispositivo:</strong> Tipo de dispositivo e navegador</li>
            <li><strong>Cookies:</strong> Para melhorar a experiência do usuário</li>
            <li><strong>Analytics:</strong> Dados de uso para melhorias do serviço</li>
          </ul>
        </motion.section>

        {/* Como Usamos Suas Informações */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className={styles.sectionTitle}>3. Como Usamos Suas Informações</h2>
          
          <div className={styles.highlightBox}>
            <h3>Principais Finalidades</h3>
            <p>
              Utilizamos suas informações exclusivamente para fornecer, melhorar e personalizar 
              nossos serviços de gestão financeira, sempre respeitando seus direitos e preferências.
            </p>
          </div>

          <ul className={styles.list}>
            <li><strong>Fornecimento do Serviço:</strong> Processar transações e gerar relatórios</li>
            <li><strong>Personalização:</strong> Adaptar a interface às suas preferências</li>
            <li><strong>Comunicação:</strong> Enviar notificações importantes sobre sua conta</li>
            <li><strong>Segurança:</strong> Detectar e prevenir atividades fraudulentas</li>
            <li><strong>Melhorias:</strong> Analisar dados para aprimorar nossos serviços</li>
            <li><strong>Suporte:</strong> Responder suas dúvidas e solicitações</li>
            <li><strong>Conformidade:</strong> Cumprir obrigações legais e regulamentares</li>
          </ul>
        </motion.section>

        {/* Compartilhamento de Dados */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className={styles.sectionTitle}>4. Compartilhamento de Dados</h2>
          
          <div className={styles.highlightBox}>
            <h3>Nosso Compromisso</h3>
            <p>
              <strong>NÃO vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros</strong> 
              para fins comerciais. Seus dados financeiros são sua propriedade e permanecem confidenciais.
            </p>
          </div>

          <p className={styles.paragraph}>
            <strong>Exceções limitadas:</strong>
          </p>
          <ul className={styles.list}>
            <li><strong>Prestadores de Serviços:</strong> Empresas que nos ajudam a operar a plataforma (hospedagem, segurança)</li>
            <li><strong>Obrigação Legal:</strong> Quando exigido por lei ou ordem judicial</li>
            <li><strong>Proteção de Direitos:</strong> Para proteger nossos direitos, propriedade ou segurança</li>
            <li><strong>Consentimento Explícito:</strong> Apenas com sua autorização prévia e específica</li>
          </ul>
        </motion.section>

        {/* Segurança dos Dados */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className={styles.sectionTitle}>5. Segurança dos Dados</h2>
          
          <p className={styles.paragraph}>
            Implementamos medidas de segurança de nível bancário para proteger suas informações:
          </p>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Medida de Segurança</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Criptografia SSL/TLS</strong></td>
                <td>Dados transmitidos com criptografia de 256 bits</td>
              </tr>
              <tr>
                <td><strong>Criptografia em Repouso</strong></td>
                <td>Dados armazenados com criptografia AES-256</td>
              </tr>
              <tr>
                <td><strong>Autenticação de Dois Fatores</strong></td>
                <td>Proteção adicional para sua conta</td>
              </tr>
              <tr>
                <td><strong>Backups Seguros</strong></td>
                <td>Backups criptografados em múltiplas localizações</td>
              </tr>
              <tr>
                <td><strong>Monitoramento 24/7</strong></td>
                <td>Sistema de detecção de intrusão ativo</td>
              </tr>
              <tr>
                <td><strong>Auditorias Regulares</strong></td>
                <td>Testes de segurança e vulnerabilidades</td>
              </tr>
            </tbody>
          </table>
        </motion.section>

        {/* Seus Direitos */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>6. Seus Direitos (LGPD)</h2>
          
          <p className={styles.paragraph}>
            Conforme a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
          </p>

          <ul className={styles.list}>
            <li><strong>Acesso:</strong> Solicitar informações sobre quais dados temos sobre você</li>
            <li><strong>Correção:</strong> Solicitar correção de dados incorretos ou incompletos</li>
            <li><strong>Exclusão:</strong> Solicitar a exclusão de seus dados pessoais</li>
            <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
            <li><strong>Revogação:</strong> Revogar consentimento a qualquer momento</li>
            <li><strong>Oposição:</strong> Opor-se ao tratamento de seus dados</li>
            <li><strong>Revisão:</strong> Solicitar revisão de decisões automatizadas</li>
            <li><strong>Denúncia:</strong> Denunciar violações à autoridade competente</li>
          </ul>

          <div className={styles.highlightBox}>
            <h3>Como Exercer Seus Direitos</h3>
            <p>
              Para exercer qualquer um desses direitos, entre em contato conosco através do e-mail 
              <strong> privacidade@balancium.com</strong>. Responderemos em até 15 dias úteis.
            </p>
          </div>
        </motion.section>

        {/* Cookies e Tecnologias Similares */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className={styles.sectionTitle}>7. Cookies e Tecnologias Similares</h2>
          
          <p className={styles.paragraph}>
            Utilizamos cookies e tecnologias similares para melhorar sua experiência:
          </p>

          <ul className={styles.list}>
            <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico da plataforma</li>
            <li><strong>Cookies de Performance:</strong> Para analisar como você usa nosso serviço</li>
            <li><strong>Cookies de Funcionalidade:</strong> Para lembrar suas preferências</li>
            <li><strong>Cookies de Segurança:</strong> Para proteger contra atividades maliciosas</li>
          </ul>

          <p className={styles.paragraph}>
            Você pode gerenciar suas preferências de cookies através das configurações do seu navegador. 
            Note que desabilitar cookies essenciais pode afetar o funcionamento da plataforma.
          </p>
        </motion.section>

        {/* Retenção de Dados */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className={styles.sectionTitle}>8. Retenção de Dados</h2>
          
          <p className={styles.paragraph}>
            Mantemos seus dados apenas pelo tempo necessário para cumprir as finalidades descritas 
            nesta política ou conforme exigido por lei:
          </p>

          <ul className={styles.list}>
            <li><strong>Dados da Conta:</strong> Mantidos enquanto sua conta estiver ativa</li>
            <li><strong>Dados Financeiros:</strong> Mantidos conforme sua preferência (você pode excluir a qualquer momento)</li>
            <li><strong>Logs de Segurança:</strong> Mantidos por até 2 anos para fins de segurança</li>
            <li><strong>Dados de Analytics:</strong> Anonimizados após 12 meses</li>
            <li><strong>Dados de Marketing:</strong> Removidos imediatamente após revogação do consentimento</li>
          </ul>

          <p className={styles.paragraph}>
            Após o período de retenção, seus dados são excluídos permanentemente ou anonimizados.
          </p>
        </motion.section>

        {/* Transferências Internacionais */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <h2 className={styles.sectionTitle}>9. Transferências Internacionais</h2>
          
          <p className={styles.paragraph}>
            Seus dados são processados e armazenados no Brasil. Caso seja necessário transferir 
            dados para outros países, garantimos que:
          </p>

          <ul className={styles.list}>
            <li>O país de destino ofereça nível adequado de proteção de dados</li>
            <li>Exista acordo específico de transferência de dados</li>
            <li>As medidas de segurança sejam mantidas</li>
            <li>Você seja informado sobre a transferência</li>
          </ul>
        </motion.section>

        {/* Menores de Idade */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h2 className={styles.sectionTitle}>10. Menores de Idade</h2>
          
          <p className={styles.paragraph}>
            O Balancium não coleta intencionalmente dados pessoais de menores de 18 anos. 
            Se você é menor de idade:
          </p>

          <ul className={styles.list}>
            <li>Você deve ter consentimento parental para usar nossos serviços</li>
            <li>Seus pais ou responsáveis devem revisar esta política</li>
            <li>Podemos solicitar verificação de idade quando necessário</li>
            <li>Se descobrirmos dados de menores sem consentimento, os excluiremos imediatamente</li>
          </ul>
        </motion.section>

        {/* Alterações na Política */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <h2 className={styles.sectionTitle}>11. Alterações na Política</h2>
          
          <p className={styles.paragraph}>
            Podemos atualizar esta Política de Privacidade periodicamente. Quando fizermos alterações:
          </p>

          <ul className={styles.list}>
            <li>Atualizaremos a data de "Última atualização" no topo desta página</li>
            <li>Enviaremos notificação por e-mail para mudanças significativas</li>
            <li>Exibiremos um aviso na plataforma por 30 dias</li>
            <li>Manteremos versões anteriores disponíveis para consulta</li>
          </ul>

          <p className={styles.paragraph}>
            Seu uso contínuo do serviço após as alterações constitui aceitação da nova política.
          </p>
        </motion.section>

        {/* Contato */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h2 className={styles.sectionTitle}>12. Contato</h2>
          
          <p className={styles.paragraph}>
            Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, 
            entre em contato conosco:
          </p>

          <ul className={styles.list}>
            <li><strong>E-mail de Privacidade:</strong> privacidade@balancium.com</li>
            <li><strong>E-mail Geral:</strong> suporte@balancium.com</li>
            <li><strong>Endereço:</strong> Brasília, DF, Brasil</li>
            <li><strong>Horário de Atendimento:</strong> Segunda a Sexta, 9h às 18h (BRT)</li>
          </ul>

          <div className={styles.highlightBox}>
            <h3>Encarregado de Proteção de Dados (DPO)</h3>
            <p>
              Nomeado conforme exigido pela LGPD, nosso DPO está disponível para responder 
              suas dúvidas sobre proteção de dados através do e-mail: <strong>dpo@balancium.com</strong>
            </p>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <motion.section 
        className={styles.footer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.3 }}
      >
        <p className={styles.footerText}>
          Esta Política de Privacidade é parte integrante dos Termos de Uso do Balancium. 
          Ao usar nossos serviços, você concorda com o tratamento de seus dados conforme descrito nesta política.
        </p>
      </motion.section>
    </div>
  );
}
