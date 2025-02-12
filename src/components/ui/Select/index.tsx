import { forwardRef, SelectHTMLAttributes } from 'react';
import styles from './select.module.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, children, ...props }, ref) => {
    return (
      <div className={styles.selectWrapper}>
        <select
          className={`${styles.select} ${error ? styles.error : ''} ${className}`}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select'; 