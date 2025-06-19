import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { prisma } from '@/lib/client/prisma';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from "sonner"; 
import { Container } from '@/components/ui/container';
import { ShoppingCart } from '@/types/store/shopping-cart';
import { redis } from '@/redis/cart/cart-db';
import CheckoutWizard from '@/components/store/components/check-out/check-out-wizard';



async function getCheckoutData(userId: string) {
  try {
    // Fetch user's addresses
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Fetch cart from Redis
    const cart: ShoppingCart | null = await redis.get(`cart-${userId}`);

    return {
      addresses,
      cart,
      user: { id: userId }
    };
  } catch (error) {
    console.error('Error fetching checkout data:', error);
    return {
      addresses: [],
      cart: null,
      user: { id: userId }
    };
  }
}

function CheckoutSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="ml-3 hidden sm:block">
                <Skeleton className="h-4 w-20" />
              </div>
              {i < 4 && <Skeleton className="flex-1 h-0.5 mx-4" />}
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

const CheckoutRoutePage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect('/api/auth/login?post_login_redirect_url=/checkout');
  }

  const checkoutData = await getCheckoutData(user.id);

  // Redirect to cart if no items
  if (!checkoutData.cart || checkoutData.cart.items.length === 0) {
    redirect('/account/cart');
  }
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-2">
        <Suspense fallback={<CheckoutSkeleton />}>
       <CheckoutWizard
          initialAddresses={checkoutData.addresses.map(addr => ({
            ...addr,
            streetAddress2: addr.streetAddress2 === null ? undefined : addr.streetAddress2 || undefined,
            
          }))}
          
          initialCartItems={checkoutData.cart.items}
         
        />
      </Suspense>
   
      <Toaster  />
    </Container>
  )
}

export default CheckoutRoutePage