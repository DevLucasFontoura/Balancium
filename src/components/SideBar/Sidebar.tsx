'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { CONSTANTES } from '@/constants/constantes';
import styles from './SideBar.module.css';
import { useSidebar } from '@/contexts/SidebarContext';

interface UserData {
  name: string;
  email: string;
}

const menuItems = [
  {
    category: 'Home',
    items: [
      {
        title: 'Bem Vindo',
        path: CONSTANTES.ROUTE_BEM_VINDO_LOGADO,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
    ],
  },
  {
    category: 'Transações',
    items: [
      {
        title: 'Nova Transação',
        path: CONSTANTES.ROUTE_NOVA_TRANSACAO,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        ),
      },
      {
        title: 'Relatório Mensal',
        path: CONSTANTES.ROUTE_RELATORIOS,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
    ],
  },
  {
    category: 'Análises',
    items: [
      {
        title: 'Dashboard',
        path: CONSTANTES.ROUTE_DASHBOARD,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        ),
      },
      {
        title: 'Metas',
        path: CONSTANTES.ROUTE_METAS,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
    ],
  },
  {
    category: 'Configurações',
    items: [
      {
        title: 'Configurações',
        path: CONSTANTES.ROUTE_CONFIGURACOES,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
    ],
  },
];

function useIsDesktop() {
  // Inicializa como true se não houver window (SSR), para evitar sumiço inicial
  const [isDesktop, setIsDesktop] = useState(
    typeof window === 'undefined' ? true : window.innerWidth >= 1024
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isDesktop;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const isDesktop = useIsDesktop();
  const { isOpen, toggle } = useSidebar();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // mobile only

  // Sidebar está sempre aberta no desktop se isOpen, abre/fecha no mobile
  const showSidebar = (isDesktop && isOpen) || (!isDesktop && isMenuOpen);
  const showMenuButton = !isDesktop;
  const showOverlay = isMenuOpen && !isDesktop;

  // Fecha menu ao clicar em link só no mobile
  const handleLinkClick = () => {
    if (!isDesktop) setIsMenuOpen(false);
  };

  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
        }
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/bem-vindo');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Pegar as iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Header só no mobile */}
      {showMenuButton && (
        <div className={styles.mobileHeader}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={styles.menuButton}
            aria-label="Menu"
          >
            <svg 
              className={styles.menuIcon}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <div className={styles.logoContainer}>
            <svg className={styles.logoIcon} fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
            </svg>
            <span className={styles.logoText}>Balancium</span>
          </div>
        </div>
      )}

      {/* Overlay só no mobile */}
      {showOverlay && (
        <div 
          className={styles.overlay}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar fixa no desktop, abre/fecha no mobile */}
      {isDesktop ? (
        <aside className={`${styles.sidebar} ${!isOpen ? styles.sidebarClosed : ''}`}>
          <div className={styles.sidebarHeader}>
            <button
              onClick={toggle}
              className={styles.menuButton}
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <svg 
                className={styles.menuIcon}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <div className={styles.logoContainer}>
              <svg className={styles.logoIcon} fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
              </svg>
              <span className={styles.logoText}>Balancium</span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className={styles.nav}>
            {menuItems.map((category, index) => (
              <div key={index} className={styles.category}>
                <h3 className={styles.categoryTitle}>
                  {category.category}
                </h3>
                {category.items.map((item) => {
                  const isActive = pathname.replace(/\/$/, '') === item.path.replace(/\/$/, '');
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={handleLinkClick}
                      className={`${styles.menuLink} ${isActive ? styles.menuLinkActive : styles.menuLinkInactive}`}
                    >
                      <span className={isActive ? styles.menuIconActive : styles.menuIconInactive}>
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer com User Profile e Logout */}
          <div className={styles.footer}>
            {/* Logout Button */}
            <div className={styles.userProfile}>
              <button
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                <svg className={styles.logoutIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sair</span>
              </button>
            </div>

            {/* User Profile */}
            <div className={styles.userProfile}>
              <div className={styles.userContainer}>
                <div className={styles.userAvatar}>
                  <span className={styles.userInitials}>
                    {userData ? getInitials(userData.name) : ''}
                  </span>
                </div>
                <div className={styles.userInfo}>
                  <p className={styles.userName}>
                    {userData?.name || CONSTANTES.PLACEHOLDER_CARREGANDO}
                  </p>
                  <p className={styles.userEmail}>
                    {userData?.email || CONSTANTES.PLACEHOLDER_CARREGANDO}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      ) : (
        showSidebar && (
          <aside className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarVisible : ''}`}>
            <div className={styles.sidebarHeader}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={styles.menuButton}
                aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                <svg 
                  className={styles.menuIcon}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
              <div className={styles.logoContainer}>
                <svg className={styles.logoIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                </svg>
                <span className={styles.logoText}>Balancium</span>
              </div>
            </div>

            {/* Menu Items */}
            <nav className={styles.nav}>
              {menuItems.map((category, index) => (
                <div key={index} className={styles.category}>
                  <h3 className={styles.categoryTitle}>
                    {category.category}
                  </h3>
                  {category.items.map((item) => {
                    const isActive = pathname.replace(/\/$/, '') === item.path.replace(/\/$/, '');
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={handleLinkClick}
                        className={`${styles.menuLink} ${isActive ? styles.menuLinkActive : styles.menuLinkInactive}`}
                      >
                        <span className={isActive ? styles.menuIconActive : styles.menuIconInactive}>
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Footer com User Profile e Logout */}
            <div className={styles.footer}>
              {/* Logout Button */}
              <div className={styles.userProfile}>
                <button
                  onClick={handleLogout}
                  className={styles.logoutButton}
                >
                  <svg className={styles.logoutIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sair</span>
                </button>
              </div>

              {/* User Profile */}
              <div className={styles.userProfile}>
                <div className={styles.userContainer}>
                  <div className={styles.userAvatar}>
                    <span className={styles.userInitials}>
                      {userData ? getInitials(userData.name) : ''}
                    </span>
                  </div>
                  <div className={styles.userInfo}>
                    <p className={styles.userName}>
                      {userData?.name || CONSTANTES.PLACEHOLDER_CARREGANDO}
                    </p>
                    <p className={styles.userEmail}>
                      {userData?.email || CONSTANTES.PLACEHOLDER_CARREGANDO}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )
      )}
    </>
  );
} 