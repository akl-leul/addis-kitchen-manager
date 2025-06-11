import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Navigate } from "react-router-dom";
import { LogOut, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const { user, signOut, loading } = useAuth();
  const queryClient = useQueryClient();
  
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    price: "",
    category_id: "",
    description: "",
    image_url: "",
    is_vegetarian: false,
    is_spicy: false,
    is_available: true,
    ingredients: "",
    display_order: 0
  });

  const [editingItem, setEditingItem] = useState<any>(null);

  console.log("AdminDashboard - user:", user);
  console.log("AdminDashboard - loading:", loading);

  // Fetch menu categories
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      console.log("Fetching categories...");
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('display_order');
      
      console.log("Categories data:", data);
      console.log("Categories error:", error);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user, // Only fetch when user is authenticated
  });

  // Fetch menu items
  const { data: menuItems = [], isLoading: menuItemsLoading, error: menuItemsError } = useQuery({
    queryKey: ['admin-menu-items'],
    queryFn: async () => {
      console.log("Fetching menu items...");
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          menu_categories (name)
        `)
        .order('display_order');
      
      console.log("Menu items data:", data);
      console.log("Menu items error:", error);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch orders
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      console.log("Fetching orders...");
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (name)
          )
        `)
        .order('created_at', { ascending: false });
      
      console.log("Orders data:", data);
      console.log("Orders error:", error);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch reservations
  const { data: reservations = [], isLoading: reservationsLoading, error: reservationsError } = useQuery({
    queryKey: ['admin-reservations'],
    queryFn: async () => {
      console.log("Fetching reservations...");
      const { data, error } = await supabase
        .from('table_reservations')
        .select('*')
        .order('reservation_date', { ascending: false });
      
      console.log("Reservations data:", data);
      console.log("Reservations error:", error);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch messages
  const { data: messages = [], isLoading: messagesLoading, error: messagesError } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      console.log("Fetching messages...");
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log("Messages data:", data);
      console.log("Messages error:", error);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Log any errors
  if (categoriesError) console.error("Categories error:", categoriesError);
  if (menuItemsError) console.error("Menu items error:", menuItemsError);
  if (ordersError) console.error("Orders error:", ordersError);
  if (reservationsError) console.error("Reservations error:", reservationsError);
  if (messagesError) console.error("Messages error:", messagesError);

  // Menu item mutations
  const addMenuItemMutation = useMutation({
    mutationFn: async (item: any) => {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([{
          ...item,
          price: parseFloat(item.price),
          ingredients: item.ingredients ? item.ingredients.split(',').map((s: string) => s.trim()) : null
        }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      setNewMenuItem({
        name: "",
        price: "",
        category_id: "",
        description: "",
        image_url: "",
        is_vegetarian: false,
        is_spicy: false,
        is_available: true,
        ingredients: "",
        display_order: 0
      });
      toast.success("Menu item added successfully");
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: async ({ id, ...item }: any) => {
      const { data, error } = await supabase
        .from('menu_items')
        .update({
          ...item,
          price: parseFloat(item.price),
          ingredients: item.ingredients ? item.ingredients.split(',').map((s: string) => s.trim()) : null
        })
        .eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      setEditingItem(null);
      toast.success("Menu item updated successfully");
    },
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      toast.success("Menu item deleted successfully");
    },
  });

  // Order mutations
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled" }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success("Order status updated");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success("Order deleted");
    },
  });

  // Reservation mutations
  const updateReservationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('table_reservations')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      toast.success("Reservation status updated");
    },
  });

  const deleteReservationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('table_reservations')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      toast.success("Reservation deleted");
    },
  });

  // Message mutations
  const updateMessageMutation = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      toast.success("Message status updated");
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      toast.success("Message deleted");
    },
  });

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const addMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.price || !newMenuItem.category_id) {
      toast.error("Please fill in all required fields");
      return;
    }
    addMenuItemMutation.mutate(newMenuItem);
  };

  const saveEditingItem = () => {
    if (editingItem) {
      updateMenuItemMutation.mutate(editingItem);
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  const isDataLoading = categoriesLoading || menuItemsLoading || ordersLoading || reservationsLoading || messagesLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {user.email}</p>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {isDataLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        )}

        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="menu">Menu Management ({menuItems.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="reservations">Reservations ({reservations.length})</TabsTrigger>
            <TabsTrigger value="messages">Messages ({messages.filter(m => !m.is_read).length} unread)</TabsTrigger>
          </TabsList>

          {/* Menu Management */}
          <TabsContent value="menu">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add New Item */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Menu Item</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      value={newMenuItem.name}
                      onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newMenuItem.price}
                      onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newMenuItem.category_id} onValueChange={(value) => setNewMenuItem({...newMenuItem, category_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newMenuItem.description}
                      onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={newMenuItem.image_url}
                      onChange={(e) => setNewMenuItem({...newMenuItem, image_url: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                    <Input
                      id="ingredients"
                      value={newMenuItem.ingredients}
                      onChange={(e) => setNewMenuItem({...newMenuItem, ingredients: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vegetarian"
                        checked={newMenuItem.is_vegetarian}
                        onCheckedChange={(checked) => setNewMenuItem({...newMenuItem, is_vegetarian: checked as boolean})}
                      />
                      <Label htmlFor="vegetarian">Vegetarian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="spicy"
                        checked={newMenuItem.is_spicy}
                        onCheckedChange={(checked) => setNewMenuItem({...newMenuItem, is_spicy: checked as boolean})}
                      />
                      <Label htmlFor="spicy">Spicy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="available"
                        checked={newMenuItem.is_available}
                        onCheckedChange={(checked) => setNewMenuItem({...newMenuItem, is_available: checked as boolean})}
                      />
                      <Label htmlFor="available">Available</Label>
                    </div>
                  </div>
                  <Button onClick={addMenuItem} className="w-full bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </CardContent>
              </Card>

              {/* Current Menu Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {menuItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        {editingItem?.id === item.id ? (
                          <div className="space-y-3">
                            <Input
                              value={editingItem.name}
                              onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                            />
                            <Input
                              type="number"
                              step="0.01"
                              value={editingItem.price}
                              onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                            />
                            <Textarea
                              value={editingItem.description || ''}
                              onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                            />
                            <div className="flex justify-end space-x-2">
                              <Button size="sm" onClick={saveEditingItem}>Save</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-gray-600">{item.menu_categories?.name}</p>
                              <p className="text-orange-600 font-bold">${item.price}</p>
                              <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex flex-col gap-1">
                                {item.is_spicy && <Badge variant="destructive" className="text-xs">Spicy</Badge>}
                                {item.is_vegetarian && <Badge variant="secondary" className="text-xs">Vegetarian</Badge>}
                                <Badge variant={item.is_available ? "default" : "secondary"} className="text-xs">
                                  {item.is_available ? "Available" : "Unavailable"}
                                </Badge>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingItem({
                                  ...item,
                                  ingredients: item.ingredients?.join(', ') || ''
                                })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteMenuItemMutation.mutate(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.id.slice(-8)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-sm text-gray-500">{order.customer_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.order_items?.map((item: any) => (
                            <div key={item.id} className="text-sm">
                              {item.menu_items?.name} x{item.quantity}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="font-bold">${order.total_amount}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Select 
                              value={order.status} 
                              onValueChange={(value: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled") => updateOrderMutation.mutate({ id: order.id, status: value })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="preparing">Preparing</SelectItem>
                                <SelectItem value="ready">Ready</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteOrderMutation.mutate(order.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations */}
          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>Reservation Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest Name</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Party Size</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">{reservation.guest_name}</TableCell>
                        <TableCell>
                          <div>
                            <p>{new Date(reservation.reservation_date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500">{reservation.reservation_time}</p>
                          </div>
                        </TableCell>
                        <TableCell>{reservation.party_size} guests</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{reservation.guest_email}</p>
                            {reservation.guest_phone && (
                              <p className="text-sm text-gray-500">{reservation.guest_phone}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={reservation.status === "confirmed" ? "default" : "secondary"}>
                            {reservation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Select 
                              value={reservation.status || "pending"} 
                              onValueChange={(value) => updateReservationMutation.mutate({ id: reservation.id, status: value })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="seated">Seated</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteReservationMutation.mutate(reservation.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Customer Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{message.name}</h3>
                          <p className="text-gray-600 text-sm">{message.email}</p>
                          {message.subject && <p className="font-medium">{message.subject}</p>}
                          <p className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={message.is_read ? "default" : "secondary"}>
                            {message.is_read ? "Read" : "Unread"}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateMessageMutation.mutate({ 
                              id: message.id, 
                              is_read: !message.is_read 
                            })}
                          >
                            {message.is_read ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteMessageMutation.mutate(message.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700">{message.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
