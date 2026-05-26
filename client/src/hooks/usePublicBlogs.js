import { useEffect, useState } from 'react';
import axios from 'axios';

const usePublicBlogs = (limit) => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get('/api/content/blogs');
        if (!mounted) return;

        const items = Array.isArray(data) ? data : [];
        setBlogs(typeof limit === 'number' ? items.slice(0, limit) : items);
      } catch {
        if (mounted) setBlogs([]);
      }
    };

    fetchBlogs();

    return () => {
      mounted = false;
    };
  }, [limit]);

  return blogs;
};

export default usePublicBlogs;
