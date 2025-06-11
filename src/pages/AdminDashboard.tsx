
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigate } from "react-router-dom";
import { LogOut, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("adminLoggedIn") === "true");
  
  // Mock data - in a real app, this would come from a database
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Doro Wot", price: 18.99, category: "Traditional Mains", available: true },
    { id: 2, name: "Vegetarian Combo", price: 15.99, category: "Vegetarian", available: true },
    { id: 3, name: "Ethiopian Coffee", price: 4.99, category: "Beverages", available: true }
  ]);

  const [orders, setOrders] = useState([
    { id: 1, customer: "John Doe", items: "Doro Wot x2", total: 37.98, status: "pending", date: "2024-01-15" },
    { id: 2, customer: "Jane Smith", items: "Vegetarian Combo", total: 15.99, status: "completed", date: "2024-01-15" }
  ]);

  const [reservations, setReservations] = useState([
    { id: 1, name: "Mike Johnson", date: "2024-01-16", time: "7:00 PM", guests: 4, status: "confirmed" },
    { id: 2, name: "Sarah Wilson", date: "2024-01-17", time: "6:30 PM", guests: 2, status: "pending" }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, name: "Alice Brown", email: "alice@email.com", subject: "Great food!", message: "Loved the experience!", status: "unread" },
    { id: 2, name: "Bob Davis", email: "bob@email.com", subject: "Question about catering", message: "Do you offer catering services?", status: "read" }
  ]);

  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    available: true
  });

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
  };

  const addMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.price || !newMenuItem.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const item = {
      id: Date.now(),
      name: newMenuItem.name,
      price: parseFloat(newMenuItem.price),
      category: newMenuItem.category,
      available: newMenuItem.available
    };

    setMenuItems([...menuItems, item]);
    setNewMenuItem({ name: "", price: "", category: "", description: "", available: true });
    toast.success("Menu item added successfully");
  };

  const deleteMenuItem = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast.success("Menu item deleted");
  };

  const updateOrderStatus = (id: number, status: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status } : order
    ));
    toast.success(`Order status updated to ${status}`);
  };

  const deleteOrder = (id: number) => {
    setOrders(orders.filter(order => order.id !== id));
    toast.success("Order deleted");
  };

  const updateReservationStatus = (id: number, status: string) => {
    setReservations(reservations.map(reservation => 
      reservation.id === id ? { ...reservation, status } : reservation
    ));
    toast.success(`Reservation status updated to ${status}`);
  };

  const deleteReservation = (id: number) => {
    setReservations(reservations.filter(reservation => reservation.id !== id));
    toast.success("Reservation deleted");
  };

  const updateMessageStatus = (id: number, status: string) => {
    setMessages(messages.map(message => 
      message.id === id ? { ...message, status } : message
    ));
    toast.success(`Message marked as ${status}`);
  };

  const deleteMessage = (id: number) => {
    setMessages(messages.filter(message => message.id !== id));
    toast.success("Message deleted");
  };

  if (!isLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
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
                    <Select value={newMenuItem.category} onValueChange={(value) => setNewMenuItem({...newMenuItem, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Traditional Mains">Traditional Mains</SelectItem>
                        <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="Beverages">Beverages</SelectItem>
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
                  <div className="space-y-4">
                    {menuItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-gray-600">{item.category}</p>
                          <p className="text-orange-600 font-bold">${item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={item.available ? "default" : "secondary"}>
                            {item.available ? "Available" : "Unavailable"}
                          </Badge>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteMenuItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p className="text-gray-600">Customer: {order.customer}</p>
                        <p className="text-gray-600">Items: {order.items}</p>
                        <p className="text-orange-600 font-bold">${order.total}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                          {order.status}
                        </Badge>
                        <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="preparing">Preparing</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteOrder(order.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <div key={reservation.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{reservation.name}</h3>
                        <p className="text-gray-600">Date: {reservation.date}</p>
                        <p className="text-gray-600">Time: {reservation.time}</p>
                        <p className="text-gray-600">Guests: {reservation.guests}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={reservation.status === "confirmed" ? "default" : "secondary"}>
                          {reservation.status}
                        </Badge>
                        <Select value={reservation.status} onValueChange={(value) => updateReservationStatus(reservation.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="seated">Seated</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteReservation(reservation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
                          <p className="font-medium">{message.subject}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={message.status === "read" ? "default" : "secondary"}>
                            {message.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateMessageStatus(message.id, message.status === "read" ? "unread" : "read")}
                          >
                            {message.status === "read" ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteMessage(message.id)}
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
