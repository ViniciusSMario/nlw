import React from 'react';
import logo from '../../assets/logo.svg';
import { FiLogIn } from 'react-icons/fi';
import './styles.css';
import { Link } from 'react-router-dom';


const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta"></img>
                </header>
                <main>
                    <h1>Seu MarketPlace de coleta de resíduos</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coletas de forma eficiente</p>

                    <Link to="/create-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </main>

            </div>
        </div>
    );
}

export default Home;