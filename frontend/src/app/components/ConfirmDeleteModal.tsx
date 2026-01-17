'use client';

import { Modal, Button } from "react-bootstrap";

type ConfirmDeleteModalProps = {
    show: boolean;
    onResolve: (result: boolean) => void;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
                                                                   show,
                                                                   onResolve,
                                                               }) => {
    return (

        <Modal show={show} onHide={() => onResolve(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Potwierdź usunięcie</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                Czy na pewno chcesz usunąć ten element?
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => onResolve(false)}>
                    Anuluj
                </Button>
                <Button variant="danger" onClick={() => onResolve(true)}>
                    Usuń
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default ConfirmDeleteModal;