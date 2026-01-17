type Order = {
    id: string;
    position: number;
};

type AccordionItem = {
    id: number,
    type: string,
    title?: string,
    content?: string,
    imageData?: string,
    position: number,
    isFavorite: boolean,
    tagIds?: number[],

};

type SortableItemProps = AccordionItem & {
    eventKey: string;
    Delete: (id: number) => void;
    toggleFavorite: (id: number) => void;
    Edit: (item: AccordionItem) => void;
};