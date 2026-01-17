'use client'

import { Modal, Button, Form } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import MultiSelectTags from "@/app/components/MultiSelectTags";

type ItemType = "note" | "link" | "image";

type EditModalProps = {
    show: boolean;
    onClose: () => void;
    item: {
        userId: string;
        id: number;
        type: string;
        title: string;
        content: string;
        tagIds: number[];
    };
};

const EditModal: React.FC<EditModalProps> = ({ show, onClose, item }) => {
    const [title, setTitle] = useState(item.title);
    const [content, setContent] = useState(item.content);
    const [tags, setTags] = useState<number[]>(item.tagIds);
    const [file, setFile] = useState<File | null>(null);

    type FormState = {
        title: string;
        content: string;
        tags: number[];
        file: File | null;
    };

    const [form, setForm] = useState<FormState>(() => ({
        title: item.title,
        content: item.content,
        tags: item.tagIds,
        file: null,
    }));

    const allTags = [
        { id: 29, name: "design" },
        { id: 1, name: "DIY" },
        { id: 2, name: "filmy" },
        { id: 3, name: "fotoblog" },
        { id: 4, name: "fotografia" },
        { id: 5, name: "gaming" },
        { id: 6, name: "gotowanie" },
        { id: 7, name: "grafika" },
        { id: 8, name: "inspiracja" },
        { id: 9, name: "literatura" },
        { id: 10, name: "marketing" },
        { id: 11, name: "motywacja" },
        { id: 12, name: "muzyka" },
        { id: 13, name: "nauka" },
        { id: 14, name: "podróże" },
        { id: 15, name: "pomysły" },
        { id: 16, name: "praca" },
        { id: 17, name: "przepisy" },
        { id: 18, name: "projekty" },
        { id: 19, name: "rozrywka" },
        { id: 20, name: "sztuka" },
        { id: 21, name: "sport" },
        { id: 22, name: "technologia" },
        { id: 23, name: "tutoriale" },
        { id: 24, name: "video" },
        { id: 25, name: "zakupy" },
        { id: 26, name: "zdrowie" },
        { id: 27, name: "programowanie" },
        { id: 28, name: "szkoła" },
        { id: 30, name: "tutorial" }
    ];

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFile = acceptedFiles[0];
        setForm(prev => ({ ...prev, file: newFile }));
        setFile(newFile);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
    });

    function isValidUrl(link: string) {
        try {
            const url = new URL(link);
            return ["http:", "https:"].includes(url.protocol);
        } catch {
            return false;
        }
    }

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("userId",item.userId)
        formData.append("id", item.id.toString());
        formData.append("title", title);
        formData.append("content", content);
        tags.forEach(id => formData.append("TagIds", id.toString()));

        if (item.type === "image" && file) {
            formData.append("ImageFile", file);
        }

        if (item.type === "link" && !isValidUrl(content)) {
            alert("Niepoprawny link!");
            return;
        }
        const res = await fetch("https://localhost:7218/api/user/items/update", {
            method: "PUT",
            body: formData,
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Błąd zapisu");
        }
        console.log(formData);

        onClose();
        window.location.reload();
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edytuj {item.type}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Tytuł</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>

                {item.type === "note" && (
                    <Form.Group className="mb-3">
                        <Form.Label>Treść</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>
                )}

                {item.type === "link" && (
                    <Form.Group className="mb-3">
                        <Form.Label>Adres linku</Form.Label>
                        <Form.Control
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>
                )}

                {item.type === "image" && (
                    <div
                        {...getRootProps()}
                        className={`border p-3 text-center ${isDragActive ? "bg-light" : ""}`}
                        style={{ cursor: "pointer" }}
                    >
                        <input {...getInputProps()} />
                        {file ? (
                            <p>Nowy plik: {file.name}</p>
                        ) : (
                            <p>Kliknij lub przeciągnij nowy obraz (opcjonalnie)</p>
                        )}
                    </div>
                )}

                <MultiSelectTags
                    options={allTags}
                    selectedTags={tags}
                    onChange={(tags) => setForm(prev => ({ ...prev, tags }))}
                />
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Anuluj
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Zapisz zmiany
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditModal;
