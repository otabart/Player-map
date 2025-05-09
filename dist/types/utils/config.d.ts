export interface IPlayerMapConfig {
    apiUrl: string;
}
export declare const getConfig: () => Readonly<IPlayerMapConfig>;
export declare const initConfig: (config: {
    apiUrl: string;
}) => void;
