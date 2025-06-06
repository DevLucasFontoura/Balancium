'use client';

import { CONSTANTES } from '@/constants/constantes';
import styles from './layout.module.css';
import { useState } from 'react';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navContent}>
            {/* Logo */}
            <Link href={CONSTANTES.ROUTE_BEM_VINDO} className={styles.logoLink}>
              <div className={styles.logoIcon} />
              <span className={styles.logoText}>{CONSTANTES.BALANCIUM}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className={styles.desktopNav}>
              <Link href={CONSTANTES.ROUTE_COMO_FUNCIONA} className={styles.desktopNavLink}> {CONSTANTES.COMO_FUNCIONA} </Link>
              <Link href={CONSTANTES.ROUTE_RECURSOS} className={styles.desktopNavLink}> {CONSTANTES.RECURSOS} </Link>
              <Link href={CONSTANTES.ROUTE_PRECOS} className={styles.desktopNavLink}> {CONSTANTES.PRECOS} </Link>
              <Link href={CONSTANTES.ROUTE_LOGIN} className={styles.desktopNavLink}> {CONSTANTES.LOGIN} </Link>
              <Link href={CONSTANTES.ROUTE_CADASTRO} className={styles.ctaButton}> {CONSTANTES.COMECAR_GRATIS} </Link>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={styles.mobileMenuButton} >
              <div className={`${styles.menuIcon} ${isMenuOpen ? styles.menuIconOpen : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={styles.mobileNav}>
            <div className={styles.mobileNavContent}>
              <Link href={CONSTANTES.ROUTE_COMO_FUNCIONA} className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}> {CONSTANTES.COMO_FUNCIONA} </Link>
              <Link href={CONSTANTES.ROUTE_RECURSOS} className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}> {CONSTANTES.RECURSOS} </Link>
              <Link href={CONSTANTES.ROUTE_PRECOS} className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}> {CONSTANTES.PRECOS} </Link>
              <Link href={CONSTANTES.ROUTE_LOGIN} className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}> {CONSTANTES.LOGIN} </Link>
              <Link href={CONSTANTES.ROUTE_CADASTRO} className={styles.mobileCtaButton} onClick={() => setIsMenuOpen(false)}> {CONSTANTES.COMECAR_GRATIS} </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className={styles.main}>{children}</main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <Link href={CONSTANTES.ROUTE_BEM_VINDO} className={styles.footerBrandInner}>
                <div className={styles.logoIcon} />
                <span className={styles.logoText}>Balancium</span>
              </Link>
              <p className={styles.footerBrandText}> {CONSTANTES.DESCRICAO_DO_PRODUTO} </p>
            </div>
            <div className={styles.footerColumn}>
              <h3 className={styles.footerColumnTitle}>Produto</h3>
              <Link href={CONSTANTES.ROUTE_RECURSOS} className={styles.footerColumnLink}> {CONSTANTES.RECURSOS} </Link>
              <Link href={CONSTANTES.ROUTE_PRECOS} className={styles.footerColumnLink}> {CONSTANTES.PRECOS} </Link>
            </div>
            <div className={styles.footerColumn}>
              <h3 className={styles.footerColumnTitle}>Suporte</h3>
              <Link href={CONSTANTES.ROUTE_CONTATO} className={styles.footerColumnLink}> {CONSTANTES.CONTATO} </Link>
              <Link href={CONSTANTES.ROUTE_AJUDA} className={styles.footerColumnLink}> {CONSTANTES.AJUDA} </Link>
            </div>
            <div className={styles.footerColumn}>
              <h3 className={styles.footerColumnTitle}>Legal</h3>
              <Link href={CONSTANTES.ROUTE_PRIVACIDADE} className={styles.footerColumnLink}> {CONSTANTES.PRIVACIDADE} </Link>
              <Link href={CONSTANTES.ROUTE_TERMOS} className={styles.footerColumnLink}> {CONSTANTES.TERMOS} </Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p className={styles.footerCopyright}> &copy; {new Date().getFullYear()} {CONSTANTES.DIREITO_DE_AUTOR} </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 