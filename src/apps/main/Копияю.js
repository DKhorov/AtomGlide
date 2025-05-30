app.post('/music/upload', 
  checkAuth,
  uploadLimiter,
  uploadMusic.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      // 1. Проверка наличия аудиофайла
      if (!req.files?.audio?.[0]) {
        console.error('Ошибка: Аудиофайл не был загружен');
        return res.status(400).json({ 
          success: false,
          message: 'Аудиофайл обязателен для загрузки' 
        });
      }

      const audioFile = req.files.audio[0];
      const coverFile = req.files?.cover?.[0];

      // 2. Валидация MIME-типа аудио
      const validAudioMimeTypes = [
        'audio/mpeg', // MP3
        'audio/wav',  // WAV
        'audio/ogg',  // OGG
        'audio/x-m4a', // M4A
        'audio/aac'   // AAC
      ];

      if (!validAudioMimeTypes.includes(audioFile.mimetype)) {
        console.error('Неверный MIME-тип аудио:', audioFile.mimetype);
        fs.unlinkSync(audioFile.path);
        if (coverFile) fs.unlinkSync(coverFile.path);
        return res.status(400).json({
          success: false,
          message: 'Неподдерживаемый тип аудиофайла. Разрешены только MP3, WAV, OGG, M4A, AAC'
        });
      }

      // 3. Валидация MIME-типа обложки (если есть)
      if (coverFile) {
        const validImageMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp'
        ];

        if (!validImageMimeTypes.includes(coverFile.mimetype)) {
          console.error('Неверный MIME-тип обложки:', coverFile.mimetype);
          fs.unlinkSync(audioFile.path);
          fs.unlinkSync(coverFile.path);
          return res.status(400).json({
            success: false,
            message: 'Неподдерживаемый тип изображения. Разрешены только JPEG, PNG, GIF, WebP'
          });
        }
      }

      // 4. Проверка расширений файлов
      const validAudioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
      const audioExt = path.extname(audioFile.originalname).toLowerCase();

      if (!validAudioExtensions.includes(audioExt)) {
        console.error('Неверное расширение аудиофайла:', audioExt);
        fs.unlinkSync(audioFile.path);
        if (coverFile) fs.unlinkSync(coverFile.path);
        return res.status(400).json({
          success: false,
          message: 'Неподдерживаемое расширение аудиофайла'
        });
      }

      if (coverFile) {
        const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const imageExt = path.extname(coverFile.originalname).toLowerCase();

        if (!validImageExtensions.includes(imageExt)) {
          console.error('Неверное расширение обложки:', imageExt);
          fs.unlinkSync(audioFile.path);
          fs.unlinkSync(coverFile.path);
          return res.status(400).json({
            success: false,
            message: 'Неподдерживаемое расширение изображения'
          });
        }
      }

      // 5. Подготовка данных для сохранения
      const musicData = {
        title: req.body.title || path.parse(audioFile.originalname).name,
        artist: req.body.artist || 'Неизвестный исполнитель',
        user: req.userId,
        filePath: `/music/${audioFile.filename}`,
        genre: req.body.genre || 'Other',
        duration: req.body.duration || 0,
        size: audioFile.size,
        mimetype: audioFile.mimetype
      };

      // 6. Добавляем обложку, если есть
      if (coverFile) {
        musicData.coverImage = `/covers/${coverFile.filename}`;
      }

      // 7. Опциональные поля
      if (req.body.album) musicData.album = req.body.album;
      if (req.body.lyrics) musicData.lyrics = req.body.lyrics;
      if (req.body.explicit) musicData.explicit = req.body.explicit === 'true';
      if (req.body.isPodcast) musicData.isPodcast = req.body.isPodcast === 'true';

      // 8. Сохранение в базу данных
      const newMusic = new MusicModel(musicData);
      await newMusic.save();

      // 9. Логирование успешной загрузки
      console.log(`Файлы успешно загружены: 
        Аудио: ${audioFile.filename}
        Обложка: ${coverFile?.filename || 'не загружена'}
      `);

      // 10. Ответ клиенту
      res.status(201).json({
        success: true,
        message: 'Музыка успешно загружена',
        data: {
          id: newMusic._id,
          title: newMusic.title,
          audioUrl: `/uploads/music/${audioFile.filename}`,
          coverUrl: coverFile ? `/uploads/covers/${coverFile.filename}` : null,
          artist: newMusic.artist,
          duration: newMusic.duration
        }
      });

    } catch (err) {
      console.error('Ошибка при загрузке музыки:', err);

      // Удаляем файлы в случае ошибки
      if (req.files?.audio?.[0]?.path) {
        try {
          fs.unlinkSync(req.files.audio[0].path);
          console.log('Аудиофайл удален');
        } catch (unlinkErr) {
          console.error('Ошибка при удалении аудиофайла:', unlinkErr);
        }
      }
      
      if (req.files?.cover?.[0]?.path) {
        try {
          fs.unlinkSync(req.files.cover[0].path);
          console.log('Обложка удалена');
        } catch (unlinkErr) {
          console.error('Ошибка при удалении обложки:', unlinkErr);
        }
      }

      // Определяем тип ошибки
      let errorMessage = 'Произошла ошибка при загрузке';
      let statusCode = 500;

      if (err.name === 'ValidationError') {
        statusCode = 400;
        errorMessage = 'Ошибка валидации данных: ' + Object.values(err.errors).map(e => e.message).join(', ');
      } else if (err.code === 11000) {
        statusCode = 409;
        errorMessage = 'Такой файл уже существует';
      }

      res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
);

// Middleware для обработки ошибок Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer Error:', err);

    let message = 'Ошибка загрузки файла';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = `Размер файла превышает ${uploadMusic.limits.fileSize / (1024 * 1024)}MB`;
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Превышено количество файлов';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Неподдерживаемый тип файла';
    }

    return res.status(400).json({ 
      success: false,
      message 
    });
  }
  next(err);
});