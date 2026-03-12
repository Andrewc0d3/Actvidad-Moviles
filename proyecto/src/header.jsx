import { useState } from 'react'
import './header.css'

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const menuItems = [
        { name: "Juegos nuevos", icon: "https://s3.minijuegosgratis.com/media/icons/navbar/icon-navbar-new-color.svg" },
        { name: "Logros", icon: "https://s3.minijuegosgratis.com/media/icons/navbar/icon-navbar-achievements-color.svg" },
        { name: "Trending", icon: "https://s3.minijuegosgratis.com/media/icons/navbar/icon-navbar-trending-color.svg" },
        { name: "Actualizados", icon: "https://s3.minijuegosgratis.com/media/icons/navbar/icon-navbar-updated-color.svg" },
        { name: "Recientes", icon: "https://s3.minijuegosgratis.com/media/icons/navbar/icon-navbar-recent-color.svg" },
        { name: "Random", icon: "https://s3.minijuegosgratis.com/media/icons/navbar/icon-navbar-random-white.svg" },
        { name: "Multijugador", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-multiplayer.svg" },
        { name: "2 Jugadores", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-collections-2players.svg" },
        { name: "Acción", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-action.svg" },
        { name: "Aventuras", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-adventures.svg" },
        { name: "Carreras", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-races.svg" },
        { name: "Clásicos", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-classics.svg" },
        { name: "Mario Bros", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-classic-mariobros.svg" },
        { name: "Infantiles", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-kids.svg" },
        { name: "Pokemon", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-collections-animeandmanga-pokemon.svg" },
        { name: "Mesa", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-board.svg" },
        { name: "Cartas", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-board-cards.svg" },
        { name: "Fútbol", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-sport-football.svg" },
        { name: "Coches", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-collections-cars.svg" },
        { name: "Motos", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-collections-motorcycles.svg" },
        { name: "Vestir", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-management-dressup.svg" },
        { name: "Cocinar", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-management-cooking.svg" },
        { name: "PC", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-collections-videogames.svg" },
        { name: "Minecraft", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-collections-minecraft.svg" },
        { name: "Terror", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-adventures-horror.svg" },
        { name: "Juegos .io", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-io.svg" },
        { name: "Escape", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-adventures-escape.svg" },
        { name: "Dinosaurios", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-collections.svg" },
        { name: "Divertidos", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-collections-fungames.svg" },
        { name: "Guerra", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-action-war.svg" },
        { name: "Armas", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-action-weapons.svg" },
        { name: "Bolas", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-collections-balls.svg" },
        { name: "Matemáticas", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-strategy-maths.svg" },
        { name: "Pintar", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-child-painting.svg" },
        { name: "Moda", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-management-fashion.svg" },
        { name: "Baloncesto", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-sport-basket.svg" },
        { name: "Estrategia", icon: "https://s3.minijuegosgratis.com/media/icons/categories/svg/navbar/icon-cat-strategy.svg" }
    ]


    return (
        <>
            <header className="header">
                <nav className="nav">

                    <div className="nav-left">
                        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}></button>
                        <img src="https://s3.minijuegosgratis.com/media/brand/minijuegos-logo.png?v=_1772347909" alt="Minijuegos" />
                    </div>

                    <div className="nav-center">
                        <input type="text" placeholder="¿A qué jugamos hoy?" />
                    </div>

                    <div className="nav-right">
                        <button className="login-btn"></button>
                    </div>

                </nav>
            </header >

            <nav className={`menu-lateral ${menuOpen ? "open" : ""}`}>
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <a href="#">
                                <img src={item.icon} alt={item.name} />
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    )
}

export default Header