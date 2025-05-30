import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, fetchTags } from '../../redux/slices/posts';
import { Post } from '../post/post';
import '../../style/work/work.scss';
import { selectIsAuth } from '../../redux/slices/auth';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Work = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector(state => state.posts);
  const userData = useSelector(state => state.auth.data);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [post, setPost] = React.useState(null);
  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    setTimeout(() => setFadeIn(true), 300);
  }, [dispatch]);

  const sortedPosts = [...posts.items].sort((a, b) => 
    (b.likes?.count || 0) - (a.likes?.count || 0) // Сортировка по лайкам
  );
  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="mepost-main">
      <div className="posts-grid">
        {sortedPosts.map((post) => (
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
            user={{
              ...post.user,
              accountType: post.user?.accountType
            }}
            createdAt={post.createdAt}
            isEditable={userData?._id === (post.user?._id || null)}
            likesCount={post.likes?.count || 0}
            dislikesCount={post.dislikes?.count || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default Work;
