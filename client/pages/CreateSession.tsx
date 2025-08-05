import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  QrCode,
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreateSession() {
  const [title, setTitle] = useState("");
  const [courseName, setCourseName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState("50");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setGettingLocation(true);

    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        // Reverse geocoding would go here in a real app
        setAddress(
          `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`,
        );

        toast({
          title: "Location captured",
          description: "Current location has been set for this session",
        });
        setGettingLocation(false);
      },
      (error) => {
        toast({
          title: "Location error",
          description:
            "Could not get your current location. Please enter address manually.",
          variant: "destructive",
        });
        setGettingLocation(false);
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location) {
      toast({
        title: "Location required",
        description:
          "Please set the class location before creating the session",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          courseName,
          datetime,
          location: {
            ...location,
            address,
          },
          radius: parseInt(radius),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Session created",
          description: "Your class session has been created successfully",
        });
        navigate(`/session/${data.id}`);
      } else {
        const errorData = await response.json();
        toast({
          title: "Creation failed",
          description: errorData.message || "Failed to create session",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              Create New Session
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Class Session Details</CardTitle>
              <CardDescription>
                Fill in the information below to create a new attendance session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Basic Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Session Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Morning Lecture"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courseName">Course Name</Label>
                      <Input
                        id="courseName"
                        placeholder="e.g., Computer Science 101"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-green-600" />
                    Schedule
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="datetime">Date and Time</Label>
                    <Input
                      id="datetime"
                      type="datetime-local"
                      value={datetime}
                      onChange={(e) => setDatetime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-red-600" />
                    Location
                  </h3>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={getCurrentLocation}
                        disabled={gettingLocation}
                        className="whitespace-nowrap"
                      >
                        {gettingLocation
                          ? "Getting Location..."
                          : "Use Current Location"}
                      </Button>
                      {location && (
                        <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
                          <MapPin className="w-4 h-4 mr-1" />
                          Location Set
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address/Description</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter the classroom location or address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="radius">Attendance Radius (meters)</Label>
                      <Input
                        id="radius"
                        type="number"
                        placeholder="50"
                        value={radius}
                        onChange={(e) => setRadius(e.target.value)}
                        min="10"
                        max="500"
                        required
                      />
                      <p className="text-sm text-gray-600">
                        Students must be within this distance to mark attendance
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Link to="/dashboard">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading || !location}>
                    {loading ? "Creating..." : "Create Session"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
