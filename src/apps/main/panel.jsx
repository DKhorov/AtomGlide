import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const QAZ = () => {
  // Функция для определения мобильных устройств и планшетов
  const isMobileOrTablet = () => {
    // Строгая проверка user agent
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };

  // Если это мобильное устройство или планшет - не рендерим компонент
  if (isMobileOrTablet()) {
    return null;
  }

  return (
      <Card sx={{ maxWidth: 230 }} className='qazwsxedc'>
      <CardMedia
        sx={{ height: 140 }}
        image="https://atomglidedev.ru/uploads/1747340611514-100962257.jpeg"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="p" component="div">
          DK Studio Community
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Телеграм-канал автора: новости о проекте, обновления, посты дня и многое другое ждут тебя — @dkdevelop.

        </Typography>
      </CardContent>
      <CardActions>
<Button size="medium" href="https://t.me/dkdevelop">Открыть Telegram</Button>
      </CardActions>
    </Card>
  );
};

export default QAZ;