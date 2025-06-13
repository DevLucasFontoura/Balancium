'use client';

import { CONSTANTES } from '@/constants/constantes';
import styles from './layout.module.css';
import mobileStyles from './layoutMobile.module.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { FaHome, FaPlus, FaChartBar, FaCog, FaTable, FaRegLightbulb, FaListAlt, FaTag, FaSignInAlt, FaRocket } from 'react-icons/fa';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Verifica inicialmente
    checkMobile();

    // Adiciona o listener para mudanças de tamanho
    window.addEventListener('resize', checkMobile);

    // Limpa o listener quando o componente é desmontado
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Função para combinar os estilos base com os estilos mobile quando necessário
  const getStyles = (baseStyle: string) => {
    return `${styles[baseStyle]} ${isMobile ? mobileStyles[baseStyle] : ''}`;
  };

  const isActive = (route: string) => {
    const normalize = (path: string) => path.replace(/\/+$/, '');
    return normalize(pathname) === normalize(route);
  };

  return (
    <div className={getStyles('container')}>
      {/* Navbar */}
      <nav className={getStyles('nav')}>
        <div className={getStyles('navInner')}>
          <div className={getStyles('navContent')}>
            {/* Logo */}
            <Link href={CONSTANTES.ROUTE_BEM_VINDO} className={getStyles('logoLink')}>
              <div className={getStyles('logoIcon')} />
              <span className={getStyles('logoText')}>{CONSTANTES.BALANCIUM}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className={getStyles('desktopNav')}>
              <Link href={CONSTANTES.ROUTE_COMO_FUNCIONA} className={getStyles('desktopNavLink')}> {CONSTANTES.COMO_FUNCIONA} </Link>
              <Link href={CONSTANTES.ROUTE_RECURSOS} className={getStyles('desktopNavLink')}> {CONSTANTES.RECURSOS} </Link>
              <Link href={CONSTANTES.ROUTE_PRECOS} className={getStyles('desktopNavLink')}> {CONSTANTES.PRECOS} </Link>
              <Link href={CONSTANTES.ROUTE_LOGIN} className={getStyles('desktopNavLink')}> {CONSTANTES.LOGIN} </Link>
              <Link href={CONSTANTES.ROUTE_CADASTRO} className={getStyles('ctaButton')}> {CONSTANTES.COMECAR_GRATIS} </Link>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={getStyles('mobileMenuButton')} >
              <div className={`${getStyles('menuIcon')} ${isMenuOpen ? getStyles('menuIconOpen') : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && isMobile && (
            <motion.div
              key="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`${mobileStyles.mobileNav} ${mobileStyles.open}`}
            >
              <button
                className={mobileStyles.mobileNavClose}
                onClick={() => setIsMenuOpen(false)}
                aria-label="Fechar menu"
              >
                &times;
              </button>
              <div className={mobileStyles.mobileNavContent}>
                <div className={mobileStyles.menuSectionTitle}>Navegação</div>
                <Link href={CONSTANTES.ROUTE_COMO_FUNCIONA} className={`${mobileStyles.menuItem} ${isActive(CONSTANTES.ROUTE_COMO_FUNCIONA) ? mobileStyles.active : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <FaRegLightbulb className={mobileStyles.menuIcon} />
                  {CONSTANTES.COMO_FUNCIONA}
                </Link>
                <Link href={CONSTANTES.ROUTE_RECURSOS} className={`${mobileStyles.menuItem} ${isActive(CONSTANTES.ROUTE_RECURSOS) ? mobileStyles.active : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <FaListAlt className={mobileStyles.menuIcon} />
                  {CONSTANTES.RECURSOS}
                </Link>
                <Link href={CONSTANTES.ROUTE_PRECOS} className={`${mobileStyles.menuItem} ${isActive(CONSTANTES.ROUTE_PRECOS) ? mobileStyles.active : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <FaTag className={mobileStyles.menuIcon} />
                  {CONSTANTES.PRECOS}
                </Link>
                <div className={mobileStyles.menuSectionTitle}>Conta</div>
                <Link href={CONSTANTES.ROUTE_LOGIN} className={`${mobileStyles.menuItem} ${isActive(CONSTANTES.ROUTE_LOGIN) ? mobileStyles.active : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <FaSignInAlt className={mobileStyles.menuIcon} />
                  {CONSTANTES.LOGIN}
                </Link>
                <Link href={CONSTANTES.ROUTE_CADASTRO} className={`${mobileStyles.menuItem} ${isActive(CONSTANTES.ROUTE_CADASTRO) ? mobileStyles.active : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <FaRocket className={mobileStyles.menuIcon} />
                  {CONSTANTES.COMECAR_GRATIS}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className={getStyles('main')}>{children}</main>

      {/* Footer */}
      <footer className={getStyles('footer')}>
        <div className={getStyles('footerInner')}>
          <div className={getStyles('footerGrid')}>
            <div className={getStyles('footerBrand')}>
              <Link href={CONSTANTES.ROUTE_BEM_VINDO} className={getStyles('footerBrandInner')}>
                <div className={getStyles('logoIcon')} />
                <span className={getStyles('logoText')}>Balancium</span>
              </Link>
              <p className={getStyles('footerBrandText')}> {CONSTANTES.DESCRICAO_DO_PRODUTO} </p>
            </div>
            <div className={getStyles('footerColumn')}>
              <h3 className={getStyles('footerColumnTitle')}>Produto</h3>
              <Link href={CONSTANTES.ROUTE_RECURSOS} className={getStyles('footerColumnLink')}> {CONSTANTES.RECURSOS} </Link>
              <Link href={CONSTANTES.ROUTE_PRECOS} className={getStyles('footerColumnLink')}> {CONSTANTES.PRECOS} </Link>
            </div>
            <div className={getStyles('footerColumn')}>
              <h3 className={getStyles('footerColumnTitle')}>Suporte</h3>
              <Link href={CONSTANTES.ROUTE_CONTATO} className={getStyles('footerColumnLink')}> {CONSTANTES.CONTATO} </Link>
              <Link href={CONSTANTES.ROUTE_AJUDA} className={getStyles('footerColumnLink')}> {CONSTANTES.AJUDA} </Link>
            </div>
            <div className={getStyles('footerColumn')}>
              <h3 className={getStyles('footerColumnTitle')}>Legal</h3>
              <Link href={CONSTANTES.ROUTE_PRIVACIDADE} className={getStyles('footerColumnLink')}> {CONSTANTES.PRIVACIDADE} </Link>
              <Link href={CONSTANTES.ROUTE_TERMOS} className={getStyles('footerColumnLink')}> {CONSTANTES.TERMOS} </Link>
            </div>
          </div>
          <div className={getStyles('footerBottom')}>
            <p className={getStyles('footerCopyright')}> &copy; {new Date().getFullYear()} {CONSTANTES.DIREITO_DE_AUTOR} </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 