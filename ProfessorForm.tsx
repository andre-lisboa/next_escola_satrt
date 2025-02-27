import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface Instituicao {
  id_instituicao: number;
  tx_sigla: string;
  tx_descricao: string;
}

interface ProfessorFormProps {
  show: boolean;
  handleClose: () => void;
  professorSelecionado: any;
  handleSave: (professor: any) => void;
  instituicoes: Instituicao[];
}

const ProfessorForm: React.FC<ProfessorFormProps> = ({
  show,
  handleClose,
  professorSelecionado,
  handleSave,
  instituicoes,
}) => {
  const [formData, setFormData] = useState({
    id_professor: "",
    tx_nome: "",
    tx_sexo: "M",
    tx_estado_civil: "S",
    dt_nascimento: "",
    tx_telefone: "",
    id_instituicao: "",
  });

  useEffect(() => {
    if (professorSelecionado) {
      setFormData({
        ...professorSelecionado,
        id_instituicao: professorSelecionado.id_instituicao?.toString() || "",
        tx_sexo: professorSelecionado.tx_sexo || "M",
        tx_estado_civil: professorSelecionado.tx_estado_civil || "S"
      });
    } else {
      setFormData({
        id_professor: "",
        tx_nome: "",
        tx_sexo: "M",
        tx_estado_civil: "S",
        dt_nascimento: "",
        tx_telefone: "",
        id_instituicao: ""
      });
    }
  }, [show]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const payload = {
        ...formData,
        tx_estado_civil: formData.tx_estado_civil.toUpperCase(), // Garante que seja sempre maiúsculo
        id_instituicao: formData.id_instituicao ? parseInt(formData.id_instituicao) : null
      };
  
      console.log("Enviando dados corrigidos:", payload); // Para verificar se agora está correto
  
      await handleSave(payload);
    } catch (err: unknown) {
      console.error("Erro ao criar o professor:", err);
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Ocorreu um erro inesperado.");
      }
    }
  };
  

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {formData.id_professor ? "Editar Professor" : "Adicionar Professor"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome Completo*</Form.Label>
            <Form.Control
              type="text"
              name="tx_nome"
              value={formData.tx_nome}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sexo*</Form.Label>
            <Form.Select
              name="tx_sexo"
              value={formData.tx_sexo}
              onChange={handleChange}
              required
            >
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estado Civil*</Form.Label>
            <Form.Select
              name="tx_estado_civil"
              value={formData.tx_estado_civil}
              onChange={handleChange}
              required
            >
              <option value="S">Solteiro(a)</option>
              <option value="C">Casado(a)</option>
              <option value="D">Divorciado(a)</option>
              <option value="V">Viúvo(a)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data de Nascimento*</Form.Label>
            <Form.Control
              type="date"
              name="dt_nascimento"
              value={formData.dt_nascimento}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="text"
              name="tx_telefone"
              value={formData.tx_telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Instituição</Form.Label>
            <Form.Select
              name="id_instituicao"
              value={formData.id_instituicao}
              onChange={handleChange}
            >
              <option value="">Selecione uma instituição...</option>
              {instituicoes.map((instituicao) => (
                <option
                  key={instituicao.id_instituicao}
                  value={instituicao.id_instituicao}
                >
                  {instituicao.tx_sigla} - {instituicao.tx_descricao}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <p className="text-muted mt-3">* Campos obrigatórios</p>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfessorForm;
