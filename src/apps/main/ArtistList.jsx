import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { Link } from 'react-router-dom';
import '../../style/work/work.scss';
import MusicItem from '../components/Music/MusicItem';
import MusicPlayer from '../components/Music/MusicPlayer';

const ArtistList = () => {
  const [artists, setArtists] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const { data } = await axios.get('/music');
        const grouped = data.reduce((acc, track) => {
          const artistName = track.artist || 'Unknown Artist';
          
          if (!acc[artistName]) {
            // Устанавливаем дефолтное изображение
            let cover = track.image || 'https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_960_720.png';
            
            // Переопределяем изображение для Queen
            if (artistName.toLowerCase().trim() === 'queen') {
              cover = 'https://i.scdn.co/image/b040846ceba13c3e9c125d68389491094e7f2982';
            }

            if (artistName.toLowerCase().trim() === 'atomglide') {
                cover = 'https://i1.sndcdn.com/artworks-sb7bSnJuhq4CHDfY-cSm8mg-t500x500.jpg';
              }
              if (artistName.toLowerCase().trim() === 'eminem') {
                cover = 'https://tophit.com/_next/image?url=https%3A%2F%2Ff.tophit.com%2Fget.php%3Fw%3D1080%26h%3D1080%26id%3D2236&w=256&q=75';
              }

            acc[artistName] = {
              name: artistName,
              tracks: [],
              cover: cover
            };
          }
          
          acc[artistName].tracks.push(track);
          return acc;
        }, {});

        setArtists(grouped);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  if (loading) return <div className="loading">Загрузка...</div>;

  // Return statement ниже...
  return (
    <div className="mu">
        <div className='ad-music'>
        <h1 className='ad-music-title'>Список артистов</h1>
        <h4 className="ad-music-subtitle">
        На этой странице собраны все артисты, которые были отмечены под треками как авторы песен. Здесь не показывается, кто загрузил трек, а лишь только исполнители песен.
        </h4>
      </div>
      <h1>Все исполнители</h1>
      <div className="artists-grid">
        {Object.values(artists).map(artist => (
          <Link 
            to={`/artist/${encodeURIComponent(artist.name)}`} 
            key={artist.name} 
            className="artist-card"
          >
            <img 
              src={artist.cover} 
              alt={artist.name} 
              className="artist-cover"
            />
            <div className="artist-info">
              <h3>{artist.name}</h3>
              <p>{artist.tracks.length} треков</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArtistList;