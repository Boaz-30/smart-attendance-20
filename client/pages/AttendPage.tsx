import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  QrCode,
  MapPin,
  User,
  Hash,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { ClassSession } from "@shared/types";
import { useToast } from "@/hooks/use-toast";

export default function AttendPage() {
  const { sessionCode } = useParams();
  const { toast } = useToast();
  const [session, setSession] = useState<ClassSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    if (sessionCode) {
      fetchSession();
    }
  }, [sessionCode]);

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/attend/${sessionCode}`);

      if (response.ok) {
        const data = await response.json();
        setSession(data);

        if (!data.isActive) {
          toast({
            title: "Session Closed",
            description: "This attendance session is no longer active",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Session not found",
          description: "The attendance link is invalid or expired",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attendance session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setGettingLocation(false);
        toast({
          title: "Location captured",
          description: "Your location has been recorded",
        });
      },
      (error) => {
        let message = "Could not get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message =
              "Location access was denied. Please allow location access and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        setLocationError(message);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location) {
      toast({
        title: "Location required",
        description: "Please allow location access to mark attendance",
        variant: "destructive",
      });
      return;
    }

    if (!session) return;

    // Check if student is within the required radius
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      session.location.latitude,
      session.location.longitude,
    );

    if (distance > session.radius) {
      toast({
        title: "Not in class location",
        description: `You must be within ${session.radius}m of the classroom. You are ${Math.round(distance)}m away.`,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionCode,
          studentName,
          indexNumber,
          location,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast({
          title: "Attendance marked",
          description: "Your attendance has been recorded successfully",
        });
      } else {
        toast({
          title: "Attendance failed",
          description: data.message || "Failed to mark attendance",
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
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading attendance session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Session Not Found
            </h2>
            <p className="text-gray-600">
              The attendance link is invalid or the session has expired.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Attendance Recorded
            </h2>
            <p className="text-gray-600 mb-4">
              Your attendance for <strong>{session.title}</strong> has been
              successfully recorded.
            </p>
            <div className="bg-green-50 p-4 rounded-lg text-sm text-green-800">
              <p>
                <strong>Course:</strong> {session.courseName}
              </p>
              <p>
                <strong>Time:</strong> {new Date().toLocaleString()}
              </p>
              <p>
                <strong>Student:</strong> {studentName} ({indexNumber})
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <QrCode className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Mark Attendance
          </h1>
          <p className="text-gray-600">{session.title}</p>
          <p className="text-sm text-gray-500">{session.courseName}</p>
        </div>

        {/* Session Status */}
        {!session.isActive && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <Clock className="h-4 w-4" />
            <AlertDescription className="text-orange-800">
              This session is currently inactive. You may not be able to mark
              attendance.
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>
              Enter your details and allow location access to mark attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="studentName"
                    type="text"
                    placeholder="Enter your full name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="indexNumber">Student Index Number</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="indexNumber"
                    type="text"
                    placeholder="Enter your index number"
                    value={indexNumber}
                    onChange={(e) => setIndexNumber(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Location Verification</Label>

                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  className="w-full"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {gettingLocation
                    ? "Getting Location..."
                    : location
                      ? "Location Captured ✓"
                      : "Allow Location Access"}
                </Button>

                {locationError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">
                      {locationError}
                    </AlertDescription>
                  </Alert>
                )}

                {location && (
                  <div className="bg-green-50 p-3 rounded-md text-sm text-green-800">
                    <p className="font-medium mb-1">Location Requirements:</p>
                    <p>
                      • You must be within {session.radius} meters of the
                      classroom
                    </p>
                    <p>• Location: {session.location.address}</p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting || !location || !session.isActive}
              >
                {submitting ? "Marking Attendance..." : "Mark Attendance"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Powered by SmartAttend</p>
        </div>
      </div>
    </div>
  );
}
