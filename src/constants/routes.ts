import { Roles } from "./roles";

export const routeConfig = {
    admin: {
        dashboard: "/admin",
        profile: "/admin/profile",
    },
    seller: {
        dashboard: "/seller",
        profile: "/seller/profile",
    },
    customer: {
        profile: "/profile",
    },
};

export const getDashboardRoute = (role: string): string => {
    if (role === Roles.admin) {
        return routeConfig.admin.dashboard;
    } else if (role === Roles.seller) {
        return routeConfig.seller.dashboard;
    } else {
        return '/'
    }
};
export const getProfileRoute = (role: string): string => {
    if (role === Roles.admin) {
        return routeConfig.admin.profile;
    } else if (role === Roles.seller) {
        return routeConfig.seller.profile;
    } else if (role === Roles.customer) {
        return routeConfig.customer.profile;
    } else {
        return '/'
    }
};

export const isActiveRoute = (pathname: string, routeUrl: string): boolean => {
    if (routeUrl === "/") return pathname === routeUrl;

    // Get the base path 
    const basePath = `/${pathname.split('/')[1]}`;

    if (routeUrl === basePath) {
        return pathname === routeUrl;
    }

    return pathname.startsWith(routeUrl);
};