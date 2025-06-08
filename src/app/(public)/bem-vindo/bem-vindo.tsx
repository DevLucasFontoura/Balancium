import { CONSTANTES } from '@/constants/constantes';
import styles from './bem-vindo.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiSolidUserCircle } from 'react-icons/bi';

export function BemVindo() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const totalTestimonials = 5;

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % totalTestimonials);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + totalTestimonials) % totalTestimonials);
  };

  const getTestimonialData = (index: number) => {
    const testimonials = [
      { text: CONSTANTES.TESTEMUNHO_01, name: CONSTANTES.NOME_TESTEMUNHO_01, role: CONSTANTES.CARGO_TESTEMUNHO_01 },
      { text: CONSTANTES.TESTEMUNHO_02, name: CONSTANTES.NOME_TESTEMUNHO_02, role: CONSTANTES.CARGO_TESTEMUNHO_02 },
      { text: CONSTANTES.TESTEMUNHO_03, name: CONSTANTES.NOME_TESTEMUNHO_03, role: CONSTANTES.CARGO_TESTEMUNHO_03 },
      { text: CONSTANTES.TESTEMUNHO_04, name: CONSTANTES.NOME_TESTEMUNHO_04, role: CONSTANTES.CARGO_TESTEMUNHO_04 },
      { text: CONSTANTES.TESTEMUNHO_05, name: CONSTANTES.NOME_TESTEMUNHO_05, role: CONSTANTES.CARGO_TESTEMUNHO_05 }
    ];
    return testimonials[index];
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
    if (newDirection > 0) {
      nextTestimonial();
    } else {
      prevTestimonial();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundElements}>
        <div className={styles.gradientOrb} />
        <div className={styles.gradientOrb2} />
      </div>
      
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}> <span>{CONSTANTES.TITULO_BEM_VINDO_01}</span> <span>{CONSTANTES.TITULO_BEM_VINDO_02}</span> </h1>
          <div className={styles.heroGrid}>
            <div className={styles.textContent}>
              <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_BEM_VINDO}</p>
              <div className={styles.buttonGroup}>
                <Link href={CONSTANTES.ROUTE_CADASTRO} className="btn-primary">{CONSTANTES.COMECAR_GRATIS}</Link>
                <Link href={CONSTANTES.ROUTE_COMO_FUNCIONA} className={styles.secondaryButton}>{CONSTANTES.SAIBA_MAIS}</Link>
              </div>
            </div>
            <div className={styles.heroImage}>
              <div className={styles.imageContainer}>
                <Image src={CONSTANTES.IMAGEM_INICIAL_BEM_VINDO} alt="Preview do Dashboard do Balancium" fill
                  style={{ objectFit: 'contain', padding: '1.5rem' }}
                  priority
                  quality={100}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.benefitsContent}>

          <h2 className={styles.sectionTitle}> {CONSTANTES.TITULO_BENEFICIOS} </h2>

          <div className={styles.benefitsGrid}>

            <div className={styles.benefitCard}> <div className={`${styles.benefitIcon} ${styles.benefitIcon1}`} />
              <h3 className={styles.benefitTitle}> {CONSTANTES.CARD_BENEFICIOS_01}</h3>
              <p className={styles.benefitText}> {CONSTANTES.DESCRICAO_BENEFICIOS_01} </p>
            </div>

            <div className={styles.benefitCard}>  <div className={`${styles.benefitIcon} ${styles.benefitIcon2}`} />
              <h3 className={styles.benefitTitle}> {CONSTANTES.CARD_BENEFICIOS_02}</h3>
              <p className={styles.benefitText}> {CONSTANTES.DESCRICAO_BENEFICIOS_02} </p>
            </div>

            <div className={styles.benefitCard}> <div className={`${styles.benefitIcon} ${styles.benefitIcon3}`} />
              <h3 className={styles.benefitTitle}> {CONSTANTES.CARD_BENEFICIOS_03}</h3>
              <p className={styles.benefitText}> {CONSTANTES.DESCRICAO_BENEFICIOS_03} </p>
            </div>

            <div className={styles.benefitCard}> <div className={`${styles.benefitIcon} ${styles.benefitIcon4}`} />
              <h3 className={styles.benefitTitle}> {CONSTANTES.CARD_BENEFICIOS_04}</h3>
              <p className={styles.benefitText}> {CONSTANTES.DESCRICAO_BENEFICIOS_04} </p>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialSection}>
        <div className={styles.benefitsContent}>
          <h2 className={styles.sectionTitle}> {CONSTANTES.TITULO_TESTEMUNHOS} </h2>
          
          <div className={styles.testimonialContainer}>
            <motion.button 
              className={styles.testimonialArrow} 
              onClick={() => paginate(-1)}
              aria-label="Testimonial anterior"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={styles.arrowIcon} />
            </motion.button>

            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 120, damping: 30 },
                  opacity: { duration: 0.35 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className={styles.testimonialCard}
              >
                <p className={styles.testimonialText}>
                  {getTestimonialData(currentTestimonial).text}
                </p>
                <div className={styles.testimonialAuthor}>
                  <motion.div 
                    className={styles.authorAvatar}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <BiSolidUserCircle size={48} color="#CBD5E1" />
                  </motion.div>
                  <div className={styles.authorInfo}>
                    <motion.div 
                      className={styles.authorName}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {getTestimonialData(currentTestimonial).name}
                    </motion.div>
                    <motion.div 
                      className={styles.authorRole}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {getTestimonialData(currentTestimonial).role}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.button 
              className={`${styles.testimonialArrow} ${styles.arrowRight}`}
              onClick={() => paginate(1)}
              aria-label="Próximo testimonial"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={styles.arrowIcon} />
            </motion.button>
          </div>

          <div className={styles.testimonialDots}>
            {[...Array(totalTestimonials)].map((_, index) => (
              <motion.button
                key={index}
                className={`${styles.testimonialDot} ${index === currentTestimonial ? styles.activeDot : ''}`}
                onClick={() => {
                  setCurrentTestimonial(index);
                  setPage([index, index > currentTestimonial ? 1 : -1]);
                }}
                aria-label={`Ir para testimonial ${index + 1}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.benefitsContent}>
          <h2 className={styles.ctaTitle}> {CONSTANTES.TITULO_CTA} </h2>
          <p className={styles.ctaText}> {CONSTANTES.DESCRICAO_CTA} </p>
          <Link href={CONSTANTES.ROUTE_CADASTRO} className={styles.ctaButton}> {CONSTANTES.BOTAO_CTA} </Link>
        </div>
      </section>
    </div>
  );
} 