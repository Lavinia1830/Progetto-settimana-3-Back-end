import React, { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const urlAPI = 'http://localhost/progetto_settimana3_backend/wp/wp-json/wp/v2/';

export default function Detail() {
    const [post, setPost] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const { postId } = useParams();

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const response = await fetch(urlAPI + 'posts/' + postId);
            const data = await response.json();
            setPost(data);
            const imageUrlResponse = await fetch(urlAPI + 'media/' + data.featured_media);
            const imageData = await imageUrlResponse.json();
            setImageUrl(imageData.source_url);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    return (
        <>
            <NavBar />
            <Container>
                <div className="detail-page">
                    {post ? (
                        <div className="card my-3">
                            <div className="card-header">
                                <CategoriesRenderer categories={post.categories} />
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{post.title.rendered}</h5>
                                <div className="card-text" dangerouslySetInnerHTML={{ __html: post.content.rendered }}></div>
                                {imageUrl && (
                                    <img src={imageUrl} className='w-100 mb-3' alt="Immagine" />
                                )}
                                {post.author && (
                                    <strong>By: {post.author}</strong>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
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
        try {
            const names = await Promise.all(categories.map(async (category) => {
                const categoryData = await getCategories(category);
                return categoryData.name;
            }));
            setCategoryNames(names);
        } catch (error) {
            console.error('Error fetching category names:', error);
        }
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
        throw error;
    }
};
