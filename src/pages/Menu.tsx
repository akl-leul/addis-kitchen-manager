
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart } from "lucide-react";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useCart } from "@/hooks/useCart";
import MenuSearch from "@/components/MenuSearch";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);
  const [showSpicyOnly, setShowSpicyOnly] = useState(false);

  const { categories, itemsByCategory, isLoading } = useMenuItems(
    searchTerm, 
    selectedCategory, 
    showVegetarianOnly, 
    showSpicyOnly
  );

  const { addToCart, itemCount } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url
    });
    toast.success(`${item.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-xl text-gray-600">Authentic Ethiopian cuisine made with love and tradition</p>
        </div>

        <MenuSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showVegetarianOnly={showVegetarianOnly}
          onVegetarianChange={setShowVegetarianOnly}
          showSpicyOnly={showSpicyOnly}
          onSpicyChange={setShowSpicyOnly}
          categories={categories}
        />

        {itemsByCategory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No items found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setShowVegetarianOnly(false);
                setShowSpicyOnly(false);
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          itemsByCategory.map((category) => (
            <div key={category.id} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{category.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span>{item.name}</span>
                        <div className="flex flex-col gap-1">
                          {item.is_spicy && <Badge variant="destructive">Spicy</Badge>}
                          {item.is_vegetarian && <Badge variant="secondary">Vegetarian</Badge>}
                        </div>
                      </CardTitle>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      {item.ingredients && item.ingredients.length > 0 && (
                        <div className="text-xs text-gray-500">
                          <strong>Ingredients:</strong> {item.ingredients.join(', ')}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-orange-600">${item.price}</span>
                        <Button 
                          onClick={() => handleAddToCart(item)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}

        {itemCount > 0 && (
          <div className="fixed bottom-6 right-6">
            <Link to="/order">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({itemCount})
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
