
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_vegetarian: boolean;
  is_spicy: boolean;
  is_available: boolean;
  ingredients: string[];
  category_id: string;
  display_order: number;
  menu_categories?: {
    name: string;
  };
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  display_order: number;
}

export const useMenuItems = (searchTerm = '', selectedCategory = '', showVegetarianOnly = false, showSpicyOnly = false) => {
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['menu-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as MenuCategory[];
    },
  });

  const { data: allItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          menu_categories (
            name
          )
        `)
        .eq('is_available', true)
        .order('display_order');
      
      if (error) throw error;
      return data as MenuItem[];
    },
  });

  // Filter items based on search and filters
  const filteredItems = allItems.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ingredients?.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory = !selectedCategory || item.category_id === selectedCategory;
    const matchesVegetarian = !showVegetarianOnly || item.is_vegetarian;
    const matchesSpicy = !showSpicyOnly || item.is_spicy;

    return matchesSearch && matchesCategory && matchesVegetarian && matchesSpicy;
  });

  // Group items by category
  const itemsByCategory = categories.map(category => ({
    ...category,
    items: filteredItems.filter(item => item.category_id === category.id)
  })).filter(category => category.items.length > 0);

  return {
    categories,
    allItems,
    filteredItems,
    itemsByCategory,
    isLoading: categoriesLoading || itemsLoading,
  };
};
