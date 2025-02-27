import { useState, useEffect } from "react";
import { TiThMenu } from "react-icons/ti";
import { IoCloseSharp } from "react-icons/io5";
import '@/app/globals.css';


export function MenuHamburguer() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className={`nav-container ${menuOpen ? "menu-open" : ""}`}>
      {/* Ícone do menu hamburguer */}
      <div className="mobile-content" onClick={() => setMenuOpen((prev) => !prev)}>
        {menuOpen ? <IoCloseSharp color="white" size={24} /> : <TiThMenu color="white" size={24} />}
      </div>

      {/* Lista de links */}
      <ul className="nav-list">
      <li>
          <a href="/admin/instituicao" className="nav-link">Adm. Instituições</a>
        </li>
        <li>
          <a href="/admin/cursos" className="nav-link">Adm. Cursos</a>
        </li>
        <li>
          <a href="/admin/disciplinas" className="nav-link">Adm. Disciplinas</a>
          </li>
        <li>
          <a href="/admin/professores" className="nav-link">Adm. Professores</a>
        </li>
        <li>
          <a href="/admin/alunos" className="nav-link">Adm. Alunos</a>
        </li> 
      </ul>
    </nav>
  );
}
