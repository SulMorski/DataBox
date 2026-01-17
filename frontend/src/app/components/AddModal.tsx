'use client'

import { Modal, Button, Form } from "react-bootstrap";
import {useCallback, useState} from "react";
import { useDropzone } from "react-dropzone";
import MultiSelectTags from "@/app/components/MultiSelectTags";


type AddItemModalProps = {
    show: boolean;
    onClose: () => void;
};

const AddItemModal: React.FC<AddItemModalProps> = ({ show, onClose }) => {
    const [type, setType] = useState("note");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [file, setFile] = useState<File | null>(null);

    const [tags, setTags] = useState<number[]>([]);

    const allTags = [
        {
            "id": 29,
            "name": "design"
        },
        {
            "id": 1,
            "name": "DIY"
        },
        {
            "id": 2,
            "name": "filmy"
        },
        {
            "id": 3,
            "name": "fotoblog"
        },
        {
            "id": 4,
            "name": "fotografia"
        },
        {
            "id": 5,
            "name": "gaming"
        },
        {
            "id": 6,
            "name": "gotowanie"
        },
        {
            "id": 7,
            "name": "grafika"
        },
        {
            "id": 8,
            "name": "inspiracja"
        },
        {
            "id": 9,
            "name": "literatura"
        },
        {
            "id": 10,
            "name": "marketing"
        },
        {
            "id": 11,
            "name": "motywacja"
        },
        {
            "id": 12,
            "name": "muzyka"
        },
        {
            "id": 13,
            "name": "nauka"
        },
        {
            "id": 14,
            "name": "podróże"
        },
        {
            "id": 15,
            "name": "pomysły"
        },
        {
            "id": 16,
            "name": "praca"
        },
        {
            "id": 27,
            "name": "programowanie"
        },
        {
            "id": 18,
            "name": "projekty"
        },
        {
            "id": 17,
            "name": "przepisy"
        },
        {
            "id": 19,
            "name": "rozrywka"
        },
        {
            "id": 21,
            "name": "sport"
        },
        {
            "id": 28,
            "name": "szkoła"
        },
        {
            "id": 20,
            "name": "sztuka"
        },
        {
            "id": 22,
            "name": "technologia"
        },
        {
            "id": 30,
            "name": "tutorial"
        },
        {
            "id": 23,
            "name": "tutoriale"
        },
        {
            "id": 24,
            "name": "video"
        },
        {
            "id": 25,
            "name": "zakupy"
        },
        {
            "id": 26,
            "name": "zdrowie"
        }
    ];

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFile(acceptedFiles[0]);
    }, []);

    function isValidUrl(link: string) {
        try {
            const url = new URL(link);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch {
            return false;
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
    });

    const handleAdd = async () => {
        const userId = String(localStorage.getItem("userId")!=null?localStorage.getItem("userId"):sessionStorage.getItem("userId"));
        const formData = new FormData();
        formData.append("userId",userId);
        formData.append("title", title);
        formData.append("content", content);
        formData.append("type", type);
        formData.append("isFavorite", "false");
        tags.forEach(id => formData.append("TagIds", id.toString()));
        if (type === "link") {
            if (!isValidUrl(content)) {
                alert("Niepoprawny link!");
                return;
            }
        } else if (type === "image") {
            if (!file) {
                alert("Nie wybrano pliku!");
                return;
            }
            formData.append("ImageFile", file);
            formData.set("content", "");
        }

        const res = await fetch("https://localhost:7218/api/user/items/add", {
            method: "POST",
            body: formData,
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Błąd wysyłki");
        }
        onClose();
        window.location.reload();
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Dodaj nowy item</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Select typu itemu */}
                <Form.Group className="mb-3">
                    <Form.Label>Wybierz typ</Form.Label>
                    <Form.Select
                        value={type}
                        onChange={(e) => setType(e.target.value as "note" | "link" | "image")}
                    >
                        <option value="note">Notatka</option>
                        <option value="link">Link</option>
                        <option value="image">Obraz</option>
                    </Form.Select>
                </Form.Group>

                {/* Notatka */}
                {type === "note" && (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Tytuł</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Wpisz tytuł notatki"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Zawartość</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Wpisz treść notatki"
                            />
                        </Form.Group>
                        <MultiSelectTags
                            options={allTags}
                            selectedTags={tags}
                            onChange={(ids) => setTags(ids)}
                            readOnly={false}
                        />
                    </>
                )}

                {/* Link */}
                {type === "link" && (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Tytuł</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Wpisz tytuł linku"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Adres linku</Form.Label>
                            <Form.Control
                                type="text"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Wpisz adres linku"
                            />
                        </Form.Group>
                        <MultiSelectTags
                            options={allTags}
                            selectedTags={tags}
                            onChange={(ids) => setTags(ids)}
                            readOnly={false}
                        />
                    </>
                )}

                {/* Obraz */}
                {type === "image" && (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Tytuł</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Wpisz tytuł obrazu"
                            />
                        </Form.Group>
                        <div
                            {...getRootProps()}
                            className={`border p-3 text-center ${
                                isDragActive ? "bg-light" : ""
                            }`}
                            style={{ cursor: "pointer" }}
                        >
                            <input {...getInputProps()}/>
                            {file ? (
                                <p>Wybrany plik: {file.name}</p>
                            ) : (
                                <p>Przeciągnij plik tutaj lub kliknij, aby wybrać</p>
                            )}
                        </div>
                        <MultiSelectTags
                            options={allTags}
                            selectedTags={tags}
                            onChange={(ids) => setTags(ids)}
                            readOnly={false}
                        />
                    </>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Anuluj
                </Button>
                <Button variant="primary" onClick={handleAdd}>
                    Dodaj
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddItemModal;