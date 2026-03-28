"use server";

import { orderService } from "@/services/order.service";
import { updateTag } from "next/cache";

// Place a new order
export const placeOrder = async (orderData: any) => {
    const result = await orderService.placeOrder(orderData);
    if (!result.error) {
        updateTag("cart");
    }
    return result;
};

// Get selected cart items for checkout
export const getSelectedCartItems = async (itemIds: string[]) => {
    return await orderService.getSelectedCartItems(itemIds);
};

// Get customer orders
export const getMyOrders = async (params?: {
    status?: string;
    statuses?: string[];
    search?: string;
    fromDate?: string;
    toDate?: string;
    minAmount?: number;
    maxAmount?: number;
    sort?: string;
    page?: number;
    limit?: number;
}) => {
    return await orderService.getMyOrders(params);
};

// Get order by ID
export const getOrderById = async (orderId: string) => {
    return await orderService.getOrderById(orderId);
};

// Cancel order
export const cancelOrder = async (orderId: string) => {
    const result = await orderService.cancelOrder(orderId);
    if (!result.error) {
        updateTag("orders");
    }
    return result;
};

// Get seller orders
export const getSellerOrders = async (params?: {
    status?: string;
    search?: string;
    sort?: string;
    page?: number;
    fromDate?: string;
    toDate?: string;
}) => {
    return await orderService.getSellerOrders(params);
};

// Update order status 
export const updateOrderStatus = async (orderId: string, status: string) => {
    const result = await orderService.updateOrderStatus(orderId, status);
    if (!result.error) {
        updateTag("orders");
        updateTag("seller-orders");
    }
    return result;
};

// Get all orders 
export const getAllOrders = async (params?: {
    status?: string;
    search?: string;
    sort?: string;
    page?: number;
    fromDate?: string;
    toDate?: string;
}) => {
    return await orderService.getAllOrders(params);
};

// Update order status 
export const adminUpdateOrderStatus = async (orderId: string, status: string, reason?: string) => {
    const result = await orderService.adminUpdateOrderStatus(orderId, status, reason);
    if (!result.error) {
        updateTag("orders");
        updateTag("seller-orders");
        updateTag("admin-orders");
    }
    return result;
};

// Cancel order 
export const adminCancelOrder = async (orderId: string, reason?: string) => {
    const result = await orderService.adminCancelOrder(orderId, reason);
    if (!result.error) {
        updateTag("orders");
        updateTag("seller-orders");
        updateTag("admin-orders");
    }
    return result;
};