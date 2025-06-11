
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Menu = () => {
  const [cart, setCart] = useState<any[]>([]);

  const menuCategories = [
    {
      name: "Traditional Mains",
      items: [
        {
          id: 1,
          name: "Doro Wot",
          description: "Ethiopia's national dish - slow-cooked chicken stew with berbere spice and hard-boiled eggs",
          price: 18.99,
          image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=500&q=80",
          spicy: true,
          vegetarian: false
        },
        {
          id: 2,
          name: "Kitfo",
          description: "Ethiopian-style steak tartare seasoned with mitmita spice and served with injera",
          price: 22.99,
          image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80",
          spicy: true,
          vegetarian: false
        },
        {
          id: 3,
          name: "Tibs",
          description: "Sautéed beef or lamb with onions, tomatoes, and Ethiopian spices",
          price: 19.99,
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80",
          spicy: false,
          vegetarian: false
        }
      ]
    },
    {
      name: "Vegetarian Delights",
      items: [
        {
          id: 4,
          name: "Vegetarian Combo",
          description: "Assorted vegetarian dishes including shiro, gomen, misir wot, and cabbage",
          price: 15.99,
          image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=500&q=80",
          spicy: false,
          vegetarian: true
        },
        {
          id: 5,
          name: "Shiro",
          description: "Ground chickpea stew with garlic, onions, and berbere spice",
          price: 12.99,
          image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=500&q=80",
          spicy: true,
          vegetarian: true
        },
        {
          id: 6,
          name: "Gomen",
          description: "Collard greens sautéed with garlic, ginger, and turmeric",
          price: 10.99,
          image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
          spicy: false,
          vegetarian: true
        }
      ]
    },
    {
      name: "Beverages",
      items: [
        {
          id: 7,
          name: "Ethiopian Coffee",
          description: "Traditionally roasted and brewed coffee served with the ceremony",
          price: 4.99,
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80",
          spicy: false,
          vegetarian: true
        },
        {
          id: 8,
          name: "Tej (Honey Wine)",
          description: "Traditional Ethiopian honey wine with a sweet, floral taste",
          price: 8.99,
          image: "https://images.unsplash.com/photo-1510896478-d4f83e786fb7?auto=format&fit=crop&w=500&q=80",
          spicy: false,
          vegetarian: true
        }
      ]
    }
  ];

  const addToCart = (item: any) => {
    setCart([...cart, item]);
    console.log("Added to cart:", item.name);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-xl text-gray-600">Authentic Ethiopian cuisine made with love and tradition</p>
        </div>

        {menuCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{category.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>{item.name}</span>
                      <div className="flex flex-col gap-1">
                        {item.spicy && <Badge variant="destructive">Spicy</Badge>}
                        {item.vegetarian && <Badge variant="secondary">Vegetarian</Badge>}
                      </div>
                    </CardTitle>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-orange-600">${item.price}</span>
                      <Button 
                        onClick={() => addToCart(item)}
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
        ))}

        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg">
              Cart ({cart.length})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
