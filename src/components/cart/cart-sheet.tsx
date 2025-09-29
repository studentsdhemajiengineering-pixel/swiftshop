
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

export function CartSheet({ children }: { children: ReactNode }) {
  const { state, dispatch } = useCart();
  const { cart } = state;

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>My Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cart.length > 0 ? (
          <>
            <ScrollArea className="flex-grow my-4">
              <div className="flex flex-col gap-6">
                {cart.map((item) => {
                  const image = PlaceHolderImages.find((p) => p.id === item.imageId);
                  return (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        {image && (
                          <Image
                            src={image.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => dispatch({ type: 'DECREMENT_QUANTITY', payload: { id: item.id } })}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-6 text-center">{item.quantity}</span>
                             <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => dispatch({ type: 'INCREMENT_QUANTITY', payload: { id: item.id } })}
                              disabled={item.quantity >= item.inventory}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="mt-4">
                <div className="w-full space-y-4">
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                     <SheetClose asChild>
                       <Link href="/checkout" className='w-full'>
                         <Button className="w-full" size="lg">
                            Proceed to Checkout
                        </Button>
                       </Link>
                    </SheetClose>
                </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <ShoppingCart className="h-20 w-20 text-muted-foreground/50" />
            <h3 className="mt-4 text-xl font-semibold">Your cart is empty</h3>
            <p className="mt-2 text-muted-foreground">Add some items to get started.</p>
            <SheetClose asChild>
                <Button className="mt-6">Start Shopping</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
