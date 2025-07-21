import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const OwnerDashboard = () => {
  const [profileComplete, setProfileComplete] = useState(false);
  const [hasEatery, setHasEatery] = useState(false);

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex flex-col items-center justify-center">
      <Card className="w-full max-w-4xl shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Owner Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!profileComplete ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Complete Your Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="john@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="9876543210" />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="City, State" />
                </div>
              </div>
              <Button
                onClick={() => setProfileComplete(true)}
                className="w-full"
              >
                Submit Profile
              </Button>
            </div>
          ) : hasEatery ? (
            <Tabs defaultValue="dashboard">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dashboard">Eatery Dashboard</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <h2 className="text-xl font-semibold">Eatery Overview</h2>
                <p className="text-muted-foreground mt-2">
                  Track orders, update menu, manage reviews.
                </p>
              </TabsContent>
              <TabsContent value="profile">
                <h2 className="text-xl font-semibold">Owner Info</h2>
                <p className="text-muted-foreground mt-2">
                  You can update your profile details here.
                </p>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Register Your Business</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eateryName">Eatery Name</Label>
                  <Input id="eateryName" placeholder="Spicy Bites" />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St" />
                </div>
                <div>
                  <Label htmlFor="cuisine">Cuisine Type</Label>
                  <Input id="cuisine" placeholder="Indian, Chinese" />
                </div>
                <div>
                  <Label htmlFor="timings">Timings</Label>
                  <Input id="timings" placeholder="10:00 AM - 10:00 PM" />
                </div>
              </div>
              <Button onClick={() => setHasEatery(true)} className="w-full">
                Register Eatery
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerDashboard;
