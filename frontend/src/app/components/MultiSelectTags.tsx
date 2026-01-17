'use client'

import { useState } from "react";
import { Form, Badge } from "react-bootstrap";

type MultiSelectTagsProps = {
    options: { id: number; name: string }[]; // dostępne tagi
    selectedTags?: number[];                  // tablica ID
    onChange?: (ids: number[]) => void;
    readOnly?: boolean;
};

const MultiSelectTags: React.FC<MultiSelectTagsProps> = ({ options, selectedTags = [], onChange, readOnly }) => {
    const [selected, setSelected] = useState<number[]>(selectedTags);

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        if (value && !selected.includes(value)) {
            const newTags = [...selected, value];
            setSelected(newTags);
            onChange?.(newTags);
        }
    };

    const removeTag = (id: number) => {
        const newTags = selected.filter((v) => v !== id);
        setSelected(newTags);
        onChange?.(newTags);
    };

    return (
        <div>
            {!readOnly && (
                <Form.Select onChange={handleSelect} value="" style={{ marginTop: "20px" }}>
                    <option value="">Tagi</option>
                    {options.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                </Form.Select>
            )}

            {/* Wybrane tagi */}
            <div className="mt-2 d-flex flex-wrap gap-2">
                {selected.map((id) => {
                    const tag = options.find(opt => opt.id === id);
                    if (!tag) return null;
                    return (
                        <Badge
                            bg="primary"
                            key={id}
                            style={{ cursor: "pointer" }}
                            onClick={!readOnly ? () => removeTag(id) : undefined}
                        >
                            {tag.name}
                            {!readOnly && " ×"}
                        </Badge>
                    );
                })}
            </div>
        </div>
    );
};

export default MultiSelectTags;