'use client'
import React, {useEffect, useRef, useState} from "react";
import {Accordion, Button, Container} from "react-bootstrap";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import SortableItem from "@/app/components/SortableItem";
import { FaSignOutAlt } from "react-icons/fa";
import {useRouter} from 'next/navigation';


import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
} from "@dnd-kit/core";

import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {FaPlus} from "react-icons/fa";
import SimpleModal from "../components/AddModal";
import EditModal from "@/app/components/EditModal";
import MultiSelectTags from "@/app/components/MultiSelectTags";

/* ---------------- MAIN COMPONENT ---------------- */

const Main: React.FC = () => {

    const router = useRouter();


    const [items, setItems] = useState<AccordionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const sensors = useSensors(useSensor(PointerSensor));
    const [showAddModal, setShowAddModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<AccordionItem | null>(null);

    const [selectedTags, setSelectedTags] = useState<number[]>([]);
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

    const visibleItems = items.filter(item => {
        // filtr po ulubionych
        const favoriteCheck = !showFavoritesOnly || item.isFavorite;

        // filtr po zaznaczonych tagach
        const tagsCheck =
            selectedTags.length === 0 || // jeśli nie wybrano żadnych tagów → wszystkie pasują
            selectedTags.every(tagId => (item.tagIds ?? []).includes(tagId));

        return favoriteCheck && tagsCheck;
    });

    useEffect(() => {
        //dziwne magie żeby unikać błędów
        const userId = localStorage.getItem("userId")!=null?localStorage.getItem("userId"):sessionStorage.getItem("userId");
        const username = localStorage.getItem("username")!=null?localStorage.getItem("username"):sessionStorage.getItem("username");
        setUserId(userId);
        setUsername(username);
        if (userId == null) {
            setTimeout(() => {
                setError('Nie zalogowany');
                setLoading(false);
                router.push("/login")
            }, 0);
            return;
        }
        fetch(`https://localhost:7218/api/user/items/${userId}`)
            .then((res) => res.json())
            .then((data: AccordionItem[]) => {
                setItems(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Błąd pobierania itemów');
                setLoading(false);
            });
    }, []);
    //
    const firstChange = useRef(true);
    useEffect(() => {
        if (firstChange.current) {
            // pomijamy pierwsze ustawienie danych po fetchu
            firstChange.current = false;
            return;
        }

        const payload = items.map((item, index) => ({
            id: item.id,
            position: index,
        }));

        fetch(`https://localhost:7218/api/user/items/${localStorage.getItem('userId')}/positions`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    }, [items]);

    const confirmDelete = (): Promise<boolean> => {
        setShowConfirm(true);

        return new Promise((resolve) => {
            setResolver(() => resolve);
        });
    };
    const handleResolve = (result: boolean) => {
        setShowConfirm(false);
        resolver?.(result);
        setResolver(null);
    };

    const handleEditClick = (item: AccordionItem) => {
        setSelectedItem(item);   // zapisujemy który item edytujemy
        setShowEditModal(true);  // pokazujemy modal
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setSelectedItem(null);
    };

    //zmiana favorite
    const toggleFavorite = async (id: number) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
            )
        );
        console.log(id);
        try {
            const res = await fetch(`https://localhost:7218/api/User/items/${id}/favorite`, {
                method: "PATCH",
            });
            if (!res.ok) throw new Error("Nie udało się zmienić ulubionego");
            const data = await res.json();

            // synchronizacja stanu z backendem (opcjonalne)
            setItems(prevItems =>
                prevItems.map(item =>
                    item.id === id ? { ...item, isFavorite: data.isFavorite } : item
                )
            );
        } catch (err) {
            console.error(err);
            // przy niepowodzeniu można cofnąć zmianę w UI
            setItems(prevItems =>
                prevItems.map(item =>
                    item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
                )
            );
        }
    };

    const Delete = async (id: number) => {
        try {
            const userId = localStorage.getItem("userId")!=null?localStorage.getItem("userId"):sessionStorage.getItem("userId");
            console.log(userId)
            if (!userId) return;

            // potwierdzenie przed usunięciem
            const confirmed = await confirmDelete();
            if (!confirmed) return;

            const res = await fetch(`https://localhost:7218/api/user/items/${userId}/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Błąd podczas usuwania itemu');

            // usuń item z wyświetlania stanu
            setItems((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error(err);
            alert('Nie udało się usunąć itemu');
        }
    };


    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setItems((prev) => {
                const oldIndex = prev.findIndex((i) => i.id === active.id);
                const newIndex = prev.findIndex((i) => i.id === over.id);
                return arrayMove(prev, oldIndex, newIndex);

            });
        }

        setActiveId(null);

    };

    function handleLogout() {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('username');
        router.push('/login');
    }

    const Edit = async (item: AccordionItem) => {
        handleEditClick(item)
    }

    return (
        <Container className="p-4">
            <div className="d-flex align-items justify-content-between">
                <div>

                </div>
                <Button
                    variant="outline-danger"
                    className="d-flex align-items-center gap-2"
                    onClick={handleLogout}
                    style={{marginBottom: '10px'}}
                >
                    <FaSignOutAlt />
                    Wyloguj
                </Button>
            </div>

            <div className="d-flex flex-wrap align-items-center justify-content-between">
                <h2>Witaj {username}</h2>
                <div className="d-flex align-items-center gap-2">
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            padding: "0.5rem 2rem",
                            marginRight: "0.5rem",
                            fontSize: "1.2rem",
                            width: "100%",
                            maxWidth: "300px",
                            whiteSpace: "nowrap",
                            backgroundColor: showFavoritesOnly ? "#0d6efd" : "#f0f0f0", // niebieski jak aktywny, szary jak nie
                            color: showFavoritesOnly ? "#fff" : "#000",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            marginBottom: "0.5rem",

                        }}
                    >
                        <input
                            type="checkbox"
                            checked={showFavoritesOnly}
                            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                            style={{
                                width: "1.2rem",
                                height: "1.9rem",
                                cursor: "pointer",
                            }}
                        />
                        Tylko ulubione
                    </label>
                    {/* przycisk dodaj */}
                    <Button
                        className="d-flex align-items-center justify-content-center gap-2"
                        style={{ padding: "0.5rem 2rem", fontSize: "1.2rem", width: "100%" ,maxWidth: "300px", marginBottom: "0.5rem",}}
                        onClick={() => setShowAddModal(true)}
                    >
                        <FaPlus style={{ fontSize: "1.4rem" }} />
                        Dodaj
                    </Button>
                    <SimpleModal
                        show={showAddModal}
                        onClose={() => setShowAddModal(false)}
                    />

                </div>

            </div>
            <div className="d-flex flex-wrap justify-content-between">
                <h2>Twój schowek</h2>
                <div style={{width: "377px", marginLeft: "auto"}}>
                    <MultiSelectTags
                        options={allTags}
                        selectedTags={selectedTags}
                        onChange={(ids) => setSelectedTags(ids)}
                        readOnly={false}
                    />
                </div>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                {visibleItems.length === 0 ? (
                    <h2 style={{ textAlign: "center", padding: "1rem", color: "#666" }}>
                        <p>Pusto. Dodaj coś, albo usuń tagi.</p>
                    </h2>
                ) : (
                <SortableContext
                    items={visibleItems.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <Accordion>
                        {visibleItems.map((item, index) => (
                            <SortableItem
                                key={item.id}
                                {...item}
                                eventKey={String(index)}
                                toggleFavorite={toggleFavorite}
                                Delete={Delete}
                                Edit={(item: AccordionItem) => Edit(item)}
                            />
                        ))}
                    </Accordion>

                </SortableContext>)}
                <DragOverlay></DragOverlay>
            </DndContext>

            {selectedItem && userId &&(
                <EditModal
                    show={showEditModal}
                    onClose={handleCloseModal}
                    item={{
                        userId: userId,
                        id: selectedItem.id,
                        type: selectedItem.type,
                        title: selectedItem.title || "",      // domyślny pusty string
                        content: selectedItem.content || "",  // domyślny pusty string
                        tagIds: selectedItem.tagIds || [],    // domyślnie pusta tablica
                    }}
                />
            )}

            <ConfirmDeleteModal
                show={showConfirm}
                onResolve={handleResolve}
            />
        </Container>

    );

};

export default Main;
