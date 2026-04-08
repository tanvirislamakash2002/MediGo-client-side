export interface RouteItem {
    title: string;
    url: string;
    icon?: React.ElementType;
}

export interface RouteGroup {
    title: string;
    items: RouteItem[];
}