import React, { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import {Container} from 'react-bootstrap'
import {Link} from 'react-router-dom'

const urlAPI = 'http://localhost/progetto_settimana3_backend/wp/wp-json/wp/v2/';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    console.log(posts)
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch(urlAPI + 'posts');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredPosts = posts.filter(post => {
        return post.title.rendered.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <>
            <NavBar />
            <Container>
                <div className="posts">
                    <h1 className="my-3">Posts Page Wordpress</h1>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className='w-100'
                    />
                    {filteredPosts.map((post, index) => (
                        <div className="card my-3" key={index}>
                            <div className="card-header">
                                <CategoriesRenderer categories={post.categories} />
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{post.title.rendered}</h5>
                                <div className="card-text" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}></div>
                                {post.author &&(
                                    <b>By: <Link to={`/users/${post.author}`}>{post.author}</Link></b>                                    
                                )}
                                <Link to={`/posts/${post.id}`} className="ms-3 btn btn-dark">Dettaglio</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
            
        </>
    );
}

// Componente per il rendering delle categorie
const CategoriesRenderer = ({ categories }) => {
    const [categoryNames, setCategoryNames] = useState([]);

    useEffect(() => {
        fetchCategoryNames();
    }, [categories]);

    const fetchCategoryNames = async () => {
        const names = await Promise.all(categories.map(async (category) => {
            const categoryData = await getCategories(category);
            return categoryData.name;
        }));
        setCategoryNames(names);
    };

    return (
        <span>{categoryNames.join(', ')}</span>
    );
};

// Funzione per ottenere le categorie
const getCategories = async (id) => {
    try {
        const response = await fetch(urlAPI + 'categories/' + id);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

