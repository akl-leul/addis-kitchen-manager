
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter } from 'lucide-react';

interface MenuSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  showVegetarianOnly: boolean;
  onVegetarianChange: (checked: boolean) => void;
  showSpicyOnly: boolean;
  onSpicyChange: (checked: boolean) => void;
  categories: Array<{ id: string; name: string }>;
}

const MenuSearch: React.FC<MenuSearchProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  showVegetarianOnly,
  onVegetarianChange,
  showSpicyOnly,
  onSpicyChange,
  categories,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-semibold">Search & Filter</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="vegetarian"
            checked={showVegetarianOnly}
            onCheckedChange={onVegetarianChange}
          />
          <label htmlFor="vegetarian" className="text-sm font-medium">
            Vegetarian Only
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="spicy"
            checked={showSpicyOnly}
            onCheckedChange={onSpicyChange}
          />
          <label htmlFor="spicy" className="text-sm font-medium">
            Spicy Only
          </label>
        </div>
      </div>
      
      {(searchTerm || selectedCategory || showVegetarianOnly || showSpicyOnly) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onSearchChange('');
            onCategoryChange('');
            onVegetarianChange(false);
            onSpicyChange(false);
          }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default MenuSearch;
