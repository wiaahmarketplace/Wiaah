'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Heart, Share2, Star, ThumbsUp, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useCart } from '@/lib/cart-context';
import { toast } from 'sonner';
import { ShareDialog } from '@/components/share-dialog';
import { useWishlist } from '@/hooks/use-wishlist';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Header } from '@/components/header';

interface Product {
  id: string;
  product_id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  original_price: number;
  currency: string;
  stock: number;
  status: string;
  image_url: string;
  images: string[];
  sizes: string[];
  colors: string[];
  discount_percentage: number;
  rating: number;
  review_count: number;
  features: string[];
  brand_name: string;
  brand_logo: string;
  shipping_restricted: boolean;
  user_id: string;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

const relatedProducts = [
  {
    id: '2',
    name: 'Beige Cardigan Set',
    image: 'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 13.25,
  },
  {
    id: '3',
    name: 'Floral Skirt Outfit',
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 13.25,
  },
  {
    id: '4',
    name: 'Black Casual Top',
    image: 'https://images.pexels.com/photos/1194412/pexels-photo-1194412.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 13.25,
  },
  {
    id: '5',
    name: 'Yellow Sweater Set',
    image: 'https://images.pexels.com/photos/3926114/pexels-photo-3926114.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 13.25,
  },
  {
    id: '6',
    name: 'Denim Casual Wear',
    image: 'https://images.pexels.com/photos/2007391/pexels-photo-2007391.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 13.25,
  },
  {
    id: '7',
    name: 'Floral Summer Dress',
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 13.25,
  },
  {
    id: '8',
    name: 'Elegant Blue Gown',
    image: 'https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 13.25,
  },
  {
    id: '9',
    name: 'Casual White Dress',
    image: 'https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 13.25,
  },
];

const mockReviews = [
  {
    id: '1',
    name: 'Sophia Carter',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    date: '2 months ago',
    comment: 'Absolutely stunning dress! The fit is perfect, and the material feels luxurious. I wore it to a gala, and received compliments all night. Highly recommend!',
    likes: 25,
    replies: 2,
  },
  {
    id: '2',
    name: 'Isabella Rossi',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 4,
    date: '3 months ago',
    comment: 'The dress is beautiful and well-made, but the sizing runs a bit small. I had to exchange for a larger size, but the process was smooth. Overall, a great purchase.',
    likes: 18,
    replies: 3,
  },
  {
    id: '3',
    name: 'Ava Chen',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    date: '4 months ago',
    comment: 'This dress exceeded my expectations! The design is elegant, and the quality is top-notch. It\'s a timeless piece that I\'ll cherish for years to come.',
    likes: 30,
    replies: 1,
  },
];

const ratingDistribution = [
  { stars: 5, percentage: 40 },
  { stars: 4, percentage: 30 },
  { stars: 3, percentage: 15 },
  { stars: 2, percentage: 10 },
  { stars: 1, percentage: 5 },
];

const colorClasses: Record<string, string> = {
  black: 'bg-black',
  white: 'bg-white border-2 border-gray-300',
  red: 'bg-red-500',
  green: 'bg-emerald-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-400',
  pink: 'bg-pink-500',
};

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [reviewLikes, setReviewLikes] = useState<Record<string, number>>(
    mockReviews.reduce((acc, review) => ({ ...acc, [review.id]: review.likes }), {})
  );

  const productId = params?.id as string;
  const isFavorite = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);

      const mockProducts = [
        {
          id: '1',
          product_id: '1',
          name: 'Eulalia Ankunding-Leannon',
          description: 'A beautiful and stylish product perfect for any occasion. Made with premium materials and exceptional craftsmanship.',
          category: 'Fashion',
          price: 50,
          original_price: 71,
          currency: '$',
          stock: 150,
          status: 'active',
          image_url: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=600',
          images: [
            'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=600',
            'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600',
            'https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=600',
          ],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['blue', 'green', 'red', 'black'],
          discount_percentage: 30,
          rating: 4.5,
          review_count: 100,
          features: [
            'Premium quality materials',
            'Comfortable fit',
            'Available in multiple colors',
            'Machine washable',
            'Durable construction',
          ],
          brand_name: 'Fashion Store',
          brand_logo: '',
          shipping_restricted: false,
          user_id: '1',
          profiles: {
            username: 'fashion_store',
            avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
          },
        },
        {
          id: '2',
          product_id: '2',
          name: 'Beige Cardigan Set',
          description: 'Elegant beige cardigan set perfect for casual and formal occasions. Soft fabric with comfortable fit.',
          category: 'Fashion',
          price: 13.25,
          original_price: 20,
          currency: '$',
          stock: 85,
          status: 'active',
          image_url: 'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=400',
          images: [
            'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=600',
          ],
          sizes: ['S', 'M', 'L'],
          colors: ['white', 'black'],
          discount_percentage: 34,
          rating: 4.7,
          review_count: 89,
          features: ['Soft fabric', 'Comfortable fit', 'Versatile style'],
          brand_name: 'Trendy Boutique',
          brand_logo: '',
          shipping_restricted: false,
          user_id: '2',
          profiles: {
            username: 'trendy_boutique',
            avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
          },
        },
        {
          id: '3',
          product_id: '3',
          name: 'Floral Skirt Outfit',
          description: 'Beautiful floral pattern skirt outfit. Perfect for spring and summer occasions.',
          category: 'Fashion',
          price: 13.25,
          original_price: 25,
          currency: '$',
          stock: 65,
          status: 'active',
          image_url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
          images: [
            'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
          ],
          sizes: ['S', 'M', 'L'],
          colors: ['yellow', 'pink'],
          discount_percentage: 47,
          rating: 4.6,
          review_count: 72,
          features: ['Floral pattern', 'Lightweight', 'Summer ready'],
          brand_name: 'Style Hub',
          brand_logo: '',
          shipping_restricted: false,
          user_id: '3',
          profiles: {
            username: 'style_hub',
            avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
          },
        },
        {
          id: '4',
          product_id: '4',
          name: 'Black Casual Top',
          description: 'Classic black casual top. Essential wardrobe piece for everyday wear.',
          category: 'Fashion',
          price: 13.25,
          original_price: 22,
          currency: '$',
          stock: 120,
          status: 'active',
          image_url: 'https://images.pexels.com/photos/1194412/pexels-photo-1194412.jpeg?auto=compress&cs=tinysrgb&w=400',
          images: [
            'https://images.pexels.com/photos/1194412/pexels-photo-1194412.jpeg?auto=compress&cs=tinysrgb&w=400',
          ],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['black'],
          discount_percentage: 40,
          rating: 4.8,
          review_count: 156,
          features: ['Classic design', 'Comfortable', 'Easy to style'],
          brand_name: 'Chic Closet',
          brand_logo: '',
          shipping_restricted: false,
          user_id: '4',
          profiles: {
            username: 'chic_closet',
            avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
          },
        },
        {
          id: '5',
          product_id: '5',
          name: 'Yellow Sweater Set',
          description: 'Bright yellow sweater set. Stand out with vibrant color and cozy comfort.',
          category: 'Fashion',
          price: 13.25,
          original_price: 28,
          currency: '$',
          stock: 45,
          status: 'active',
          image_url: 'https://images.pexels.com/photos/3926114/pexels-photo-3926114.jpeg?auto=compress&cs=tinysrgb&w=400',
          images: [
            'https://images.pexels.com/photos/3926114/pexels-photo-3926114.jpeg?auto=compress&cs=tinysrgb&w=400',
          ],
          sizes: ['M', 'L', 'XL'],
          colors: ['yellow'],
          discount_percentage: 53,
          rating: 4.5,
          review_count: 63,
          features: ['Bright color', 'Warm', 'Trendy'],
          brand_name: 'Urban Fashion',
          brand_logo: '',
          shipping_restricted: false,
          user_id: '5',
          profiles: {
            username: 'urban_fashion',
            avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
          },
        },
        {
          id: '6',
          product_id: '6',
          name: 'Denim Casual Wear',
          description: 'Comfortable denim casual wear. Perfect for everyday style.',
          category: 'Fashion',
          price: 13.25,
          original_price: 24,
          currency: '$',
          stock: 95,
          status: 'active',
          image_url: 'https://images.pexels.com/photos/2007391/pexels-photo-2007391.jpeg?auto=compress&cs=tinysrgb&w=400',
          images: [
            'https://images.pexels.com/photos/2007391/pexels-photo-2007391.jpeg?auto=compress&cs=tinysrgb&w=400',
          ],
          sizes: ['S', 'M', 'L'],
          colors: ['blue'],
          discount_percentage: 45,
          rating: 4.6,
          review_count: 88,
          features: ['Denim fabric', 'Durable', 'Casual style'],
          brand_name: 'Casual Trends',
          brand_logo: '',
          shipping_restricted: false,
          user_id: '6',
          profiles: {
            username: 'casual_trends',
            avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
          },
        },
        {
          id: '7',
          product_id: '7',
          name: 'Floral Summer Dress',
          description: 'Light and breezy floral summer dress. Perfect for warm weather.',
          category: 'Fashion',
          price: 13.25,
          original_price: 26,
          currency: '$',
          stock: 78,
          status: 'active',
          image_url: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
          images: [
            'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
          ],
          sizes: ['S', 'M', 'L'],
          colors: ['pink', 'white'],
          discount_percentage: 49,
          rating: 4.9,
          review_count: 124,
          features: ['Lightweight', 'Breathable', 'Floral pattern'],
          brand_name: 'Summer Vibes',
          brand_logo: '',
          shipping_restricted: false,
          user_id: '7',
          profiles: {
            username: 'summer_vibes',
            avatar_url: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100',
          },
        },
        {
          id: '8',
          product_id: '8',
          name: 'Elegant Blue Gown',
          description: 'Stunning blue elegant gown. Perfect for special occasions and events.',
          category: 'Fashion',
          price: 13.25,
          original_price: 30,
          currency: '$',
          stock: 35,
          status: 'active',
          image_url: 'https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=400',
          images: [
            'https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=400',
          ],
          sizes: ['S', 'M', 'L'],
          colors: ['blue'],
          discount_percentage: 56,
          rating: 4.8,
          review_count: 95,
          features: ['Elegant design', 'Premium fabric', 'Event ready'],
          brand_name: 'Elegant Collection',
          brand_logo: '',
          shipping_restricted: false,
          user_id: '8',
          profiles: {
            username: 'elegant_collection',
            avatar_url: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100',
          },
        },
        {
          id: '9',
          product_id: '9',
          name: 'Casual White Dress',
          description: 'Simple and elegant white casual dress. Versatile for any occasion.',
          category: 'Fashion',
          price: 13.25,
          original_price: 23,
          currency: '$',
          stock: 110,
          status: 'active',
          image_url: 'https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=400',
          images: [
            'https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=400',
          ],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['white'],
          discount_percentage: 42,
          rating: 4.7,
          review_count: 142,
          features: ['Versatile', 'Clean design', 'Comfortable'],
          brand_name: 'Minimalist Style',
          brand_logo: '',
          shipping_restricted: false,
          user_id: '9',
          profiles: {
            username: 'minimalist_style',
            avatar_url: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100',
          },
        },
      ];

      const foundProduct = mockProducts.find(p => p.id === productId);

      if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.colors && foundProduct.colors.length > 0) {
          setSelectedColor(foundProduct.colors[0]);
        }
        if (foundProduct.sizes && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }
      } else {
        toast.error('Product not found');
        router.push('/shop');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('related-products-scroll');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || product.image_url,
      color: selectedColor,
      size: selectedSize,
    });
    toast.success('Added to cart!', {
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleLikeReview = (reviewId: string) => {
    const isLiked = likedReviews[reviewId];
    setLikedReviews(prev => ({ ...prev, [reviewId]: !isLiked }));
    setReviewLikes(prev => ({
      ...prev,
      [reviewId]: isLiked ? prev[reviewId] - 1 : prev[reviewId] + 1
    }));
  };

  const handleToggleWishlist = async () => {
    if (!product) return;

    if (isFavorite) {
      const success = await removeFromWishlist(product.id);
      if (success) {
        toast.success('Removed from wishlist');
      } else {
        toast.error('Failed to remove from wishlist');
      }
    } else {
      const productImage = (product.images && product.images.length > 0)
        ? product.images[0]
        : product.image_url;

      const success = await addToWishlist(
        product.id,
        product.name,
        product.price,
        productImage
      );
      if (success) {
        toast.success('Added to wishlist', {
          description: 'This item will be saved for 24 hours',
        });
      } else {
        toast.error('Failed to add to wishlist');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image_url];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-6 mr-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex gap-3">
            <div className="flex flex-col gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-12 h-16 rounded overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-black' : 'border-gray-300'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="flex-1 relative bg-gray-100 rounded overflow-hidden aspect-[3/4]">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleToggleWishlist}
                className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              {product.profiles && (
                <button
                  onClick={() => router.push(`/profile/${product.profiles?.username}`)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={product.profiles.avatar_url || ''} />
                    <AvatarFallback>{product.profiles.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-sm text-gray-900">@{product.profiles.username}</span>
                </button>
              )}
              <button
                className="ml-auto hover:bg-gray-100 rounded-full p-2 transition-colors"
                onClick={() => setIsShareDialogOpen(true)}
              >
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <h1 className="text-base font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            <p className="text-[10px] text-gray-600 mb-3">
              #{product.stock} pieces in stock
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-bold text-gray-900">
                {product.currency}{product.price}
              </span>
              {product.original_price > 0 && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    {product.currency}{product.original_price}
                  </span>
                  <span className="text-red-500 font-semibold text-xs">
                    Save {product.discount_percentage}%
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-3 h-3 ${
                      index < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-none text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-gray-900 text-xs">{product.rating}</span>
              <span className="text-gray-600 text-xs">({product.review_count})</span>
            </div>

            <div className="mb-4">
              {product.colors && product.colors.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full ${colorClasses[color] || 'bg-gray-300'} ${
                        selectedColor === color ? 'ring-2 ring-offset-2 ring-black' : ''
                      }`}
                    />
                  ))}
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-8 h-8 rounded border font-semibold text-xs transition-all ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {product.shipping_restricted && (
              <p className="text-red-500 text-[10px] mb-3">
                Sorry, this product can't be shipped to your country
              </p>
            )}

            <Button
              onClick={handleAddToCart}
              className="w-full bg-black hover:bg-gray-800 text-white h-9 text-xs font-semibold rounded mb-6"
            >
              Add to cart
            </Button>

            <Accordion type="single" collapsible defaultValue="description" className="border-t border-gray-200">
              <AccordionItem value="description" className="border-gray-200">
                <AccordionTrigger className="text-xs font-semibold text-gray-900 hover:text-gray-700">
                  Description
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700 mb-2 text-xs leading-relaxed">{product.description}</p>
                  {product.features && product.features.length > 0 && (
                    <ul className="space-y-1.5">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700 text-xs">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="delivery" className="border-gray-200">
                <AccordionTrigger className="text-xs font-semibold text-gray-900 hover:text-gray-700">
                  Delivery
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700 text-xs">Standard delivery in 5-7 business days. Express shipping available at checkout.</p>
                </AccordionContent>
              </AccordionItem>

              {product.brand_name && (
                <AccordionItem value="about" className="border-gray-200">
                  <AccordionTrigger className="text-xs font-semibold text-gray-900 hover:text-gray-700">
                    About {product.brand_name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 text-xs">{product.brand_name} is a leading brand known for quality and style.</p>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-base font-bold mb-4 text-gray-900">More Products</h2>
          <div className="relative group">
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div
              id="related-products-scroll"
              className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            >
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  className="flex-shrink-0 w-32 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => router.push(`/product/${relProduct.id}`)}
                >
                  <div className="bg-gray-100 rounded overflow-hidden mb-2 h-40">
                    <img
                      src={relProduct.image}
                      alt={relProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-xs">{relProduct.name}</h3>
                  <p className="text-sm font-bold text-gray-900">${relProduct.price}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-base font-bold mb-4 text-gray-900">Rating and reviews</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{product.rating}</div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-600 text-xs">{product.review_count}+ reviews</p>
            </div>

            <div className="lg:col-span-2">
              {product.review_count > 0 ? ratingDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-2 mb-2">
                  <span className="w-3 text-gray-700 font-medium text-xs">{dist.stars}</span>
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-gray-600 text-xs">
                    {dist.percentage}%
                  </span>
                </div>
              )) : (
                <p className="text-gray-600 text-xs">No reviews yet</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {mockReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={review.avatar} />
                    <AvatarFallback>{review.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-xs">{review.name}</span>
                    </div>
                    <p className="text-[10px] text-gray-600 mb-1">{review.date}</p>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`w-2.5 h-2.5 ${
                            index < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-none text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-2 text-xs">{review.comment}</p>
                    <div className="flex items-center gap-4 text-[10px]">
                      <button
                        onClick={() => handleLikeReview(review.id)}
                        className={`flex items-center gap-1 transition-colors ${
                          likedReviews[review.id]
                            ? 'text-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <ThumbsUp
                          className={`w-2.5 h-2.5 ${
                            likedReviews[review.id] ? 'fill-blue-600' : ''
                          }`}
                        />
                        {reviewLikes[review.id]}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/product/${product.id}`}
        title={`Share ${product.name}`}
      />
    </div>
  );
}
