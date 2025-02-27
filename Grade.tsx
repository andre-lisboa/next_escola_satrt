"use client";
import { useEffect, useState } from "react";
import { Container, Form, Table, Spinner, Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import {MenuHamburguer} from "./MenuHamburguer"; // Importa o menu

interface CursoAPI {
  id_curso: number;
  tx_descricao: string;
}

interface CursoFormatado {
  codigo: string;
  nome: string;
}

interface Disciplina {
  codigo: string;
  nome: string;
  creditos: number;
}

interface DisciplinaAPI {
  id_disciplina: number;
  tx_descricao: string;
  in_carga_horaria: number;
  id_curso: number;
  id_tipo_disciplina: number;
  tx_sigla: string;
  in_periodo: number;
}

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [cursos, setCursos] = useState<CursoFormatado[]>([]);
  const [selectedCurso, setSelectedCurso] = useState<string>("");
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState({ cursos: false, disciplinas: false });
  const [error, setError] = useState({ cursos: "", disciplinas: "" });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchCursos = async () => {
      try {
        setLoading((prev) => ({ ...prev, cursos: true }));
        const response = await fetch("/api/cursos");

        if (!response.ok) throw new Error("Erro ao carregar cursos");

        const data: CursoAPI[] = await response.json();
        const cursosFormatados = data.map((curso) => ({
          codigo: curso.id_curso.toString(),
          nome: curso.tx_descricao,
        }));
        setCursos(cursosFormatados);
        setError((prev) => ({ ...prev, cursos: "" }));
      } catch (err) {
        setError((prev) => ({
          ...prev,
          cursos: err instanceof Error ? err.message : "Erro desconhecido",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, cursos: false }));
      }
    };

    fetchCursos();
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !selectedCurso) return;

    const fetchDisciplinas = async () => {
      try {
        setLoading((prev) => ({ ...prev, disciplinas: true }));
        const response = await fetch(`/api/cursos/${selectedCurso}/disciplinas`);

        if (!response.ok) throw new Error("Erro ao carregar disciplinas");

        const data = await response.json();

        const disciplinasFormatadas = data.map((disc: DisciplinaAPI) => ({
          codigo: disc.id_disciplina.toString(),
          nome: disc.tx_descricao,
          creditos: disc.in_carga_horaria,
        }));

        setDisciplinas(disciplinasFormatadas);
        setError((prev) => ({ ...prev, disciplinas: "" }));
      } catch (err) {
        setError((prev) => ({
          ...prev,
          disciplinas: err instanceof Error ? err.message : "Erro desconhecido",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, disciplinas: false }));
      }
    };

    fetchDisciplinas();
  }, [isClient, selectedCurso]);

  if (!isClient) return null;

  return (
    <Container fluid className="mt-5">
      {/* Cabeçalho com Título e Menu Hambúrguer */}
      <header ><MenuHamburguer /></header>
      <div className="divgrad" 
        >
          <h1 className="h1grad">Grade de Disciplinas</h1>
          
        </div>

      {/* Seleção de Curso */}
      <Form.Group controlId="cursoSelect" className="mb-4">
        <Form.Label>Selecione um Curso:</Form.Label>
        <Form.Select
          value={selectedCurso}
          onChange={(e) => setSelectedCurso(e.target.value)}
          disabled={loading.cursos}
        >
          <option key="default" value="">
            -- SELECIONE --
          </option>
          {cursos.map((curso: CursoFormatado) => (
            <option key={`curso-${curso.codigo}`} value={curso.codigo}>
              {curso.nome}
            </option>
          ))}
        </Form.Select>

        {loading.cursos && <Spinner animation="border" size="sm" className="mt-2" />}
        {error.cursos && <Alert variant="danger" className="mt-2">{error.cursos}</Alert>}
      </Form.Group>

      {/* Tabela de Disciplinas */}
      {selectedCurso && (
        <div className="table-responsive">
          <h4>Disciplinas do Curso</h4>

          {loading.disciplinas ? (
            <Spinner animation="border" />
          ) : error.disciplinas ? (
            <Alert variant="danger">{error.disciplinas}</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Créditos</th>
                </tr>
              </thead>
              <tbody>
                {disciplinas.map((disciplina: Disciplina) => (
                  <tr key={`disciplina-${disciplina.codigo}`}>
                    <td>{disciplina.codigo}</td>
                    <td>{disciplina.nome}</td>
                    <td>{disciplina.creditos}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}
    </Container>
  );
}

