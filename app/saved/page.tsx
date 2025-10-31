'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/optimized-image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Pagination } from '@/components/pagination';
import { Header } from '@/components/header';

const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";

const savedCategories = [
  {
    id: 1,
    name: 'Hotels',
    slug: 'hotels',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 12
  },
  {
    id: 2,
    name: 'Restaurants',
    slug: 'restaurants',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 8
  },
  {
    id: 3,
    name: 'Villas',
    slug: 'villas',
    image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 5
  },
  {
    id: 4,
    name: 'Vehicles',
    slug: 'vehicles',
    image: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 15
  },
  {
    id: 5,
    name: 'Clothing',
    slug: 'clothing',
    image: 'https://images.pexels.com/photos/1549200/pexels-photo-1549200.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 23
  },
  {
    id: 6,
    name: 'Memes',
    slug: 'memes',
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 45
  }
];

export default function SavedPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const totalPages = Math.ceil(savedCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = savedCategories.slice(startIndex, endIndex);

  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  const fetchCategoryCounts = async () => {
    const { data, error } = await supabase
      .from('saved_items')
      .select('category')
      .eq('user_id', MOCK_USER_ID);

    if (!error && data) {
      const counts: Record<string, number> = {};
      data.forEach((item) => {
        counts[item.category] = (counts[item.category] || 0) + 1;
      });
      setCategoryCounts(counts);
    }
  };

  const handleUnsaveCategory = async (categorySlug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('user_id', MOCK_USER_ID)
      .eq('category', categorySlug);

    if (!error) {
      setCategoryCounts({ ...categoryCounts, [categorySlug]: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved</h1>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {currentCategories.map((category) => (
            <Link
              key={category.id}
              href={`/saved/${category.slug}`}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredCategory(category.slug)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-md hover:shadow-xl transition-shadow duration-300">
                <OptimizedImage
                  src={category.image}
                  alt={category.name}
                  width={400}
                  height={400}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute top-3 right-3">
                  {hoveredCategory === category.slug ? (
                    <button
                      onClick={(e) => handleUnsaveCategory(category.slug, e)}
                      className="bg-red-500 hover:bg-red-600 rounded-full p-2 transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  ) : (
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <Bookmark className="h-4 w-4 text-gray-700 fill-gray-700" />
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">
                  {categoryCounts[category.slug] ?? category.count} saved
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
