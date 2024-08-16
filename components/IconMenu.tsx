import React from 'react';
import styles from '@/styles/IconMenu.module.css';
import { FaHome, FaCalendarAlt, FaClipboardList, FaCog } from 'react-icons/fa';

const IconMenu: React.FC = () => {
  return (
    <nav className={styles.iconMenu}>
      <a href="#" className={styles.iconItem}>
        <FaHome />
        <span>Home</span>
      </a>
      <a href="#" className={styles.iconItem}>
        <FaCalendarAlt />
        <span>Calendar</span>
      </a>
      <a href="#" className={styles.iconItem}>
        <FaClipboardList />
        <span>Tasks</span>
      </a>
      <a href="#" className={styles.iconItem}>
        <FaCog />
        <span>Settings</span>
      </a>
    </nav>
  );
};

export default IconMenu;
