import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ModalProps } from './interfaces';
import './StarRating.css';

const NotesModal: React.FC<ModalProps> = ({
  show,
  onClose,
  onSave,
  value,
  onChange,
  title,
}) => {

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          as="textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your notes..."
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onSave}>
          Save
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotesModal;
