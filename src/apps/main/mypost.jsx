import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFollowingPosts } from '../../redux/slices/posts'; // Измененный импорт
import { Post } from '../post/post';
import '../../style/work/work.scss';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { selectIsAuth } from '../../redux/slices/auth';

const MePost = () => {
  const dispatch = useDispatch();
  const { followingPosts } = useSelector(state => state.posts); // Изменено получение данных
  const userData = useSelector(state => state.auth.data);
  const [fadeIn, setFadeIn] = useState(false);
  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    dispatch(fetchFollowingPosts()); // Загрузка постов подписок
    setTimeout(() => setFadeIn(true), 300);
  }, [dispatch]);

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="mepost-main">
      <div className="post-main">
        {followingPosts.items?.length > 0 ? (
          followingPosts.items.map((post) => (
            <Post
              key={post._id}
              _id={post._id}
              imageUrl={post.imageUrl}
              title={post.title}
              description={post.description}
              text={post.text}
              tags={post.tags}
              language={post.language}
              viewsCount={post.viewsCount}
              commentsCount={post.commentsCount}
              user={post.user || {}}
              createdAt={post.createdAt}
              isEditable={userData?._id === (post.user?._id || null)}
              likesCount={post.likes?.count || 0}
              dislikesCount={post.dislikes?.count || 0}
            />
          ))
        ) : (
          <div className="no-posts-container">
            <p className="no-posts">Нет новых постов от ваших подписок</p>
            <Link to="/explore" className="discover-link">
              Найти интересных авторов
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MePost;