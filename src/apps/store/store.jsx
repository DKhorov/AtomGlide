import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../../style/store/store.scss';
import { FaSearch, FaStar, FaDownload, FaShare, FaHeart } from 'react-icons/fa';

const Store = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Все' },
    { id: 'apps', label: 'Приложения' },
    { id: 'games', label: 'Игры' },
    { id: 'education', label: 'Образование' },
    { id: 'productivity', label: 'Продуктивность' },
    { id: 'entertainment', label: 'Развлечения' }
  ];

  const featuredApps = [
    {
      id: 1,
      title: 'Visual Studio Code',
      subtitle: 'Редактор кода нового поколения от Microsoft',
      image: 'https://code.visualstudio.com/assets/docs/getstarted/userinterface/sidebyside.png',
      description: 'Мощный редактор кода с искусственным интеллектом'
    }
  ];

  const apps = [
    {
      id: 1,
      name: 'AtomGlide Dock',
      developer: 'DK Studio',
      category: 'education',
      rating: 4.9,
      reviews: '3.2K',
      price: 'woon',
      image: 'https://www.cti-commission.fr/wp-content/uploads/2018/01/my-documents-png-image-24592.png'
    },
    {
      id: 2,
      name: 'AtomGlide Music',
      developer: 'DK Studio',
      category: 'music',
      rating: 4.9,
      reviews: '3.2K',
      price: 'soon',
      image: 'https://purepng.com/public/uploads/large/purepng.com-music-iconsymbolsiconsapple-iosiosios-8-iconsios-8-721522596085b6osz.png'
    },

  ];

  return (
    <div className="store-container">
      {/* Featured App */}
      <div className="featured-app">
        <img 
          src={featuredApps[0].image} 
          alt={featuredApps[0].title} 
          className="featured-image"
        />
        <div className="featured-content">
          <span className="featured-badge">ПРИЛОЖЕНИЕ ДНЯ</span>
          <h1 className="featured-title">{featuredApps[0].title}</h1>
          <h2 className="featured-subtitle">{featuredApps[0].subtitle}</h2>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Поиск приложений..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="categories">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="apps-grid">
        {apps
          .filter(app => 
            selectedCategory === 'all' || app.category === selectedCategory
          )
          .filter(app =>
            searchQuery === '' || 
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.developer.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((app) => (
            <div className="app-card" key={app.id}>
              <div className="app-content">
                <div className="app-header">
                  <img src={app.image} alt="" className="app-icon" />
                  <div className="app-info">
                    <h3 className="app-name">{app.name}</h3>
                    <span className="app-developer">{app.developer}</span>
                  </div>
                </div>
                
                <div className="app-actions">
                  <button className="download-button">
                    <FaDownload className="button-icon" />
                    <span>{app.price}</span>
                  </button>
                  <div className="action-buttons">
                    <button className="icon-button">
                      <FaShare />
                    </button>
                    <button className="icon-button">
                      <FaHeart />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Store;