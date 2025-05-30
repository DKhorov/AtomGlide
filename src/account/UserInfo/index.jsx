import React from 'react';
import { Avatar } from '@mui/material';
import styles from './UserInfo.module.scss';
import VerifiedIcon from '@mui/icons-material/Verified'; // Добавлено
import StoreIcon from '@mui/icons-material/Store'; 
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'только что';
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval + ' год' + (interval === 1 ? '' : '') + ' назад';
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + ' мес' + (interval === 1 ? '' : '') + ' назад';
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + ' д' + (interval === 1 ? '' : '') + ' назад';
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + ' ч' + (interval === 1 ? '' : '') + ' назад';
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + ' мин' + (interval === 1 ? '' : '') + ' назад';
  }
  return 'только что';
};

export const UserInfo = ({ 
  avatarUrl, 
  fullName, 
  additionalText, 
  postTag,
  accountType // Добавлен новый проп
}) => {
  // Определяем условия для значков
  const showVerifiedBadge = accountType === 'verified_user' || accountType === 'admin';
  const showShopBadge = accountType === 'shop';

  const formattedText = additionalText ? formatTimeAgo(additionalText) : null;
  
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    let initials = parts[0].substring(0, 1).toUpperCase();
    if (parts.length > 1) {
      initials += parts[1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <div className={styles.root}>
      {avatarUrl ? (
        <Avatar 
          className={styles.avata2r} 
          src={avatarUrl} 
          alt={fullName} 
        />
      ) : (
        <Avatar className={styles.avatar}>
          {getInitials(fullName)}
        </Avatar>
      )}
      <div className={styles.userDetails}>
      <span className={styles.userName}>{fullName}</span>
      
        <div className={styles.metaInfo}>
         {postTag && (
            <span className={styles.postTag}>#{postTag}</span>
          )}
          {additionalText && (
            <span className={styles.additional}>{formattedText}</span>
          )}
        </div>
        
      </div>
      {showVerifiedBadge && (
            <VerifiedIcon 
              className={styles.verifiedBadge} 
              fontSize="inherit" 
              color="primary" 
            />
          )}
          {showShopBadge && (
            <StoreIcon 
              className={styles.shopBadge} 
              fontSize="inherit" 
              color="primary" 
            />
          )}
    </div>
  );
};