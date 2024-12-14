import React from 'react';
import { useLocation } from 'react-router-dom';

const ErrorPage: React.FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const message = query.get("message") || "An unexpected error occurred.";

    return (
        <div className="error-page">
            <h1>Error</h1>
            <p>{message}</p>
            <a href="/">Return to Home</a>
        </div>
    );
};

export default ErrorPage;