
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const BookTable = () => {
  const [reservationData, setReservationData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "",
    date: undefined as Date | undefined,
    time: "",
    specialRequests: ""
  });

  const timeSlots = [
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM",
    "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reservation submitted:", reservationData);
    toast.success("Table reservation requested! We'll confirm your booking shortly.");
    
    // Reset form
    setReservationData({
      name: "",
      email: "",
      phone: "",
      guests: "",
      date: undefined,
      time: "",
      specialRequests: ""
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Reserve a Table</h1>
          <p className="text-xl text-gray-600">Book your authentic Ethiopian dining experience</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Table Reservation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={reservationData.name}
                      onChange={(e) => setReservationData({...reservationData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={reservationData.email}
                      onChange={(e) => setReservationData({...reservationData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={reservationData.phone}
                      onChange={(e) => setReservationData({...reservationData, phone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Select value={reservationData.guests} onValueChange={(value) => setReservationData({...reservationData, guests: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Guest' : 'Guests'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Preferred Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {reservationData.date ? format(reservationData.date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={reservationData.date}
                          onSelect={(date) => setReservationData({...reservationData, date})}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label>Preferred Time</Label>
                    <Select value={reservationData.time} onValueChange={(value) => setReservationData({...reservationData, time: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="requests">Special Requests (Optional)</Label>
                  <Textarea
                    id="requests"
                    value={reservationData.specialRequests}
                    onChange={(e) => setReservationData({...reservationData, specialRequests: e.target.value})}
                    placeholder="Any special occasions, dietary restrictions, or seating preferences?"
                  />
                </div>

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Request Reservation
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Restaurant Info */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Reservation Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-gray-600">
                <p>• Reservations are subject to availability and will be confirmed by phone or email</p>
                <p>• Please arrive within 15 minutes of your reservation time</p>
                <p>• For parties of 8 or more, please call us directly at (555) 123-4567</p>
                <p>• We offer traditional Ethiopian coffee ceremony - please mention if interested</p>
                <p>• Vegetarian and vegan options available upon request</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookTable;
