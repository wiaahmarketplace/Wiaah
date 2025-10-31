'use client';

import { useState, useEffect } from 'react';

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  expiresAt: string;
  createdAt: string;
}

const WISHLIST_KEY = 'wishlist_items';

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) {
        const items: WishlistItem[] = JSON.parse(stored);
        const validItems = items.filter(item => new Date(item.expiresAt) > new Date());
        setWishlistItems(validItems);
        if (validItems.length !== items.length) {
          localStorage.setItem(WISHLIST_KEY, JSON.stringify(validItems));
        }
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (
    productId: string,
    productName: string,
    productPrice: number,
    productImage: string
  ) => {
    try {
      const newItem: WishlistItem = {
        id: `wishlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId,
        productName,
        productPrice,
        productImage,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      };

      const updatedItems = [newItem, ...wishlistItems];
      setWishlistItems(updatedItems);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedItems));
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const updatedItems = wishlistItems.filter((item) => item.productId !== productId);
      setWishlistItems(updatedItems);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedItems));
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const cleanupExpired = () => {
    try {
      const validItems = wishlistItems.filter(item => new Date(item.expiresAt) > new Date());
      setWishlistItems(validItems);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(validItems));
    } catch (error) {
      console.error('Error cleaning up expired items:', error);
    }
  };

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist: loadWishlist,
    cleanupExpired,
  };
}
