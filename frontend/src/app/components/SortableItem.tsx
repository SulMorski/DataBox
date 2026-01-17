import React, {useEffect, useRef, useState} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {Accordion, AccordionItem, Card} from "react-bootstrap";
import { FaRegStar } from "react-icons/fa";
import {BsFillTrashFill, BsPencilFill} from "react-icons/bs";
import { CSS } from "@dnd-kit/utilities";
import MultiSelectTags from "@/app/components/MultiSelectTags";
import {type} from "node:os";



const SortableItem: React.FC<SortableItemProps> = ({id, type, title, content, imageData, tagIds, isFavorite, eventKey, Delete, toggleFavorite, Edit,}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

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

    return (
        <Card ref={setNodeRef} style={style} className="mb-2">
            <Accordion.Item eventKey={eventKey}>
                <Accordion.Header>
                    {/* cały wiersz flex */}
                    <div className="d-flex align-items-center w-100" >
                        {/* DRAG HANDLE */}
                        <span
                            {...attributes}
                            {...listeners}
                            style={{
                                cursor: "grab",
                                marginRight: "10px",
                                display: "flex",
                                alignItems: "center",
                                userSelect: "none",
                                fontSize: "1.2rem",
                            }}
                            onClick={(e) => e.stopPropagation()} // nie otwiera Accordion
                        >
                        ☰
                        </span>

                        {/* TITLE */}
                        <span style={{ flex: 1 , fontSize: "1.2rem"}}>{title || `Brak tytułu`}</span>
                        <div style={{ verticalAlign: "middle", position: "relative", top: "-4px",}}>
                        {/* GWIAZDKA */}
                            <FaRegStar
                                style={{cursor: "pointer", color: isFavorite ? "gold" : "gray", fontSize: "1.4rem",}}
                                onClick={(e) => {
                                    e.stopPropagation(); // nie otwiera Accordion
                                    toggleFavorite(id);   // zmiana isFavorite
                                }}
                            />


                            <BsPencilFill
                                style={{marginLeft: "15px", cursor: "pointer", fontSize: "1.2rem"}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    Edit({
                                        position: 0,
                                        id,
                                        type,
                                        title,
                                        content,
                                        imageData,
                                        tagIds,
                                        isFavorite
                                    });
                                }}
                            />

                            {/* DELETE ICON */}
                            <BsFillTrashFill
                                style={{ marginLeft: "15px",marginRight: "15px", cursor: "pointer", fontSize: "1.2rem" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    Delete(id);
                                }}
                            />
                        </div>
                    </div>
                </Accordion.Header>

                <Accordion.Body style={{fontSize: "1.1rem"}}>
                    {type == "link" ? <a href={content} target="_blank">{content}</a>:content}
                    <br />
                    <div className="text-center">
                        {type == "image" ? <img
                            src={`data:image;base64,${imageData}`}
                            alt={title}
                            className="img-fluid mt-2"
                            style={{ maxWidth: '80%',maxHeight:'600px'}}
                        />:null}
                    </div>
                    <MultiSelectTags options={allTags} selectedTags={tagIds} onChange={undefined} readOnly={true}>
                    </MultiSelectTags>
                </Accordion.Body>
            </Accordion.Item>
        </Card>
    );
};
export default SortableItem;