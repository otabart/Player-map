interface AtomData {
    id: number;
    label: string;
    type: string;
    data: string | null;
    emoji: string | null;
    image: string | null;
    creator_id: string;
    creator: {
        id: string;
        label: string;
    };
    value: {
        id: number;
    } | null;
    block_number: number;
    block_timestamp: string;
    transaction_hash: string;
}
interface AtomResponse {
    atom: AtomData;
}
export declare const fetchAtomById: (id: number) => Promise<AtomResponse>;
export declare const fetchAtomByLabel: (label: string) => Promise<{
    atoms: AtomData[];
}>;
export declare const useAtomById: (id: number) => {
    data: AtomResponse | null;
    loading: boolean;
    error: string | null;
};
export declare const useAtomByLabel: (label: string) => {
    data: AtomData | null;
    loading: boolean;
    error: string | null;
};
export {};
