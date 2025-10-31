'use client';

import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
}

interface CartPopupProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClose?: () => void;
}

export function CartPopup({ items, onUpdateQuantity, onRemoveItem, onClose }: CartPopupProps) {
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    router.push('/checkout');
    onClose?.();
  };

  if (items.length === 0) {
    return (
      <div className="w-96 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Shopping Cart</h3>
          <span className="text-sm text-gray-500">0 items</span>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-center mb-2">Your cart is empty</p>
          <p className="text-gray-400 text-sm text-center mb-6">
            Add items to get started
          </p>
          <Button
            onClick={() => {
              router.push('/shop');
              onClose?.();
            }}
            className="bg-black hover:bg-gray-800"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Shopping Cart</h3>
          <span className="text-sm text-gray-500">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 truncate mb-1">
                  {item.name}
                </h4>
                {(item.color || item.size) && (
                  <p className="text-xs text-gray-500 mb-2">
                    {item.color && <span className="capitalize">{item.color}</span>}
                    {item.color && item.size && ' • '}
                    {item.size && <span>{item.size}</span>}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded"
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        {subtotal < 50 && subtotal > 0 && (
          <p className="text-xs text-gray-500">
            Add ${(50 - subtotal).toFixed(2)} more for free shipping
          </p>
        )}
        <div className="flex justify-between text-base font-semibold pt-3 border-t">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Button
          className="w-full bg-black hover:bg-gray-800 h-11 text-base font-semibold"
          onClick={handleCheckout}
        >
          Checkout
        </Button>
        <Button
          variant="outline"
          className="w-full h-10"
          onClick={() => {
            router.push('/shop');
            onClose?.();
          }}
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
