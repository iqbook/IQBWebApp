import React from 'react'
import style from './ErrorPage.module.css'
import { useNavigate } from 'react-router-dom'

const ErrorPage = () => {
    const navigate = useNavigate()

    return (
        <main className={style.error_page_container}>
            <div>
                <p>404</p>
                <p>Page not found</p>
                <button onClick={() => navigate("/")}>Go back</button>
            </div>
        </main>
    )
}

export default ErrorPage