"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home, ShoppingBag } from 'lucide-react';

const ShopError = ({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) => {
    useEffect(() => {
        // Log error to error reporting service
        console.error('Application error:', error);
        
        // You can also send to your error tracking service
        // fetch('/api/log-error', { method: 'POST', body: JSON.stringify({ error: error.message }) });
    }, [error]);

    // Determine if it's a network error
    const isNetworkError = error.message?.includes('fetch') || 
                          error.message?.includes('network') ||
                          error.message?.includes('Failed to fetch');

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                {/* Error Icon */}
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                </div>

                {/* Error Message */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Something went wrong!</h1>
                    <p className="text-muted-foreground">
                        {isNetworkError 
                            ? "Unable to connect to the server. Please check your internet connection."
                            : "An unexpected error occurred. Our team has been notified."
                        }
                    </p>
                    {error.digest && (
                        <p className="text-xs text-muted-foreground mt-2">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button 
                        onClick={reset}
                        variant="default"
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                    
                    <Button 
                        onClick={() => window.location.href = '/'}
                        variant="outline"
                        className="gap-2"
                    >
                        <Home className="h-4 w-4" />
                        Go Home
                    </Button>
                    
                    <Button 
                        onClick={() => window.location.href = '/shop'}
                        variant="ghost"
                        className="gap-2"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        Continue Shopping
                    </Button>
                </div>

                {/* Help Text */}
                <p className="text-sm text-muted-foreground pt-4">
                    If the problem persists, please contact our support team.
                </p>
            </div>
        </div>
    );
};

export default ShopError;