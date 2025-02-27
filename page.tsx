"use client";

import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Alert, Row, Col } from "react-bootstrap";
import { useRouter } from "next/navigation";

interface Aluno {
  id_aluno: number;
  tx_nome: string;
  tx_sexo: string;
  dt_nascimento: string;
}

export default function AdminAlunos() {
  const router = useRouter();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [formData, setFormData] = useState({ tx_nome: "", tx_sexo: "", dt_nascimento: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = async () => {
    try {
      const response = await fetch("/api/alunos");
      if (!response.ok) throw new Error("Erro ao carregar alunos");
      const data = await response.json();
      setAlunos(data);
    } catch (err) {
      setError("Erro ao carregar alunos");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedAluno(null);
    setFormData({ tx_nome: "", tx_sexo: "", dt_nascimento: "" });
  };

  const handleShow = (mode: "create" | "edit", aluno?: Aluno) => {
    setModalMode(mode);
    if (aluno) {
      setSelectedAluno(aluno);
      setFormData({ tx_nome: aluno.tx_nome, tx_sexo: aluno.tx_sexo, dt_nascimento: aluno.dt_nascimento });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = modalMode === "create" ? "/api/alunos" : `/api/alunos/${selectedAluno?.id_aluno}`;
      const method = modalMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erro ao salvar aluno");

      setSuccess(modalMode === "create" ? "Aluno criado com sucesso!" : "Aluno atualizado com sucesso!");
      handleClose();
      fetchAlunos();
    } catch (err) {
      setError("Erro ao salvar aluno");
    }
  };

  const handleDelete = async (id_aluno: number) => {
    if (!confirm("Tem certeza que deseja excluir este aluno?")) return;
    try {
      const response = await fetch(`/api/alunos/${id_aluno}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao excluir aluno");
      setSuccess("Aluno excluído com sucesso!");
      fetchAlunos();
    } catch (err) {
      setError("Erro ao excluir aluno");
    }
  };

  return (
    <Container fluid className="mt-5">
      <Row className="justify-content-center text-center mb-4 p-3 border rounded">
        <Col>
          <h1 className="fw-bold" style={{ fontSize: "24px" }}>Administração de Alunos</h1>
        </Col>
      </Row>

      <Row className="d-flex justify-content-between align-items-center mb-3">
        <Col xs={12} md="auto">
          <Button variant="primary" onClick={() => handleShow("create")}>+ Novo Aluno</Button>
        </Col>
        <Col xs={12} md="auto">
          <Button variant="secondary" onClick={() => router.push("/")}>Voltar</Button>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Sexo</th>
            <th>Data de Nascimento</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((aluno) => (
            <tr key={aluno.id_aluno}>
              <td>{aluno.id_aluno}</td>
              <td>{aluno.tx_nome}</td>
              <td>{aluno.tx_sexo}</td>
              <td>{aluno.dt_nascimento}</td>
              <td className="text-end">
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShow("edit", aluno)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(aluno.id_aluno)}>Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === "create" ? "Adicionar Aluno" : "Editar Aluno"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={formData.tx_nome}
                onChange={(e) => setFormData({ ...formData, tx_nome: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sexo</Form.Label>
              <Form.Control
                type="text"
                value={formData.tx_sexo}
                onChange={(e) => setFormData({ ...formData, tx_sexo: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data de Nascimento</Form.Label>
              <Form.Control
                type="date"
                value={formData.dt_nascimento}
                onChange={(e) => setFormData({ ...formData, dt_nascimento: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {modalMode === "create" ? "Adicionar" : "Salvar Alterações"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
