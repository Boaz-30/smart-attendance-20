import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { QrCode, ArrowLeft, Copy, Share, Calendar, MapPin, Users, Download, StopCircle } from "lucide-react";
import { ClassSession } from "@shared/types";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";

export default function SessionDetails() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<ClassSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceCount, setAttendanceCount] = useState(0);

  useEffect(() => {
    if (sessionId) {
      fetchSession();
      fetchAttendanceCount();
    }
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/sessions/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSession(data);
      } else {
        toast({
          title: "Error",
          description: "Session not found",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/sessions/${sessionId}/attendance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAttendanceCount(data.length);
      }
    } catch (error) {
      console.error("Failed to fetch attendance count:", error);
    }
  };

  const getAttendanceUrl = () => {
    return `${window.location.origin}/attend/${session?.sessionCode}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareLink = async () => {
    const url = getAttendanceUrl();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${session?.title} - Attendance`,
          text: `Mark your attendance for ${session?.courseName}`,
          url,
        });
      } catch (error) {
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const toggleSessionStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/sessions/${sessionId}/toggle`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedSession = await response.json();
        setSession(updatedSession);
        toast({
          title: "Status updated",
          description: `Session is now ${updatedSession.isActive ? "active" : "inactive"}`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update session status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Session not found</h2>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
              <div>
                <h1 className="text-xl font-bold text-gray-800">{session.title}</h1>
                <p className="text-sm text-gray-600">{session.courseName}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={session.isActive ? "default" : "secondary"}>
              {session.isActive ? "Active" : "Inactive"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSessionStatus}
            >
              {session.isActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* QR Code and Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="w-5 h-5 mr-2" />
                Attendance QR Code
              </CardTitle>
              <CardDescription>
                Students can scan this QR code to mark attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-white p-6 rounded-lg border inline-block">
                <QRCodeSVG
                  value={getAttendanceUrl()}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Session Code:</p>
                <div className="bg-gray-100 px-4 py-2 rounded-md font-mono text-lg">
                  {session.sessionCode}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(getAttendanceUrl())}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button
                  onClick={shareLink}
                  className="flex-1"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                <p className="font-medium mb-1">Instructions for Students:</p>
                <p>1. Scan the QR code or visit the shared link</p>
                <p>2. Enter your name and student index</p>
                <p>3. Allow location access when prompted</p>
                <p>4. Confirm attendance if within {session.radius}m of class</p>
              </div>
            </CardContent>
          </Card>

          {/* Session Information */}
          <div className="space-y-6">
            {/* Session Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Session Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{attendanceCount}</div>
                    <div className="text-sm text-gray-600">Present</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {session.isActive ? "Active" : "Closed"}
                    </div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Details */}
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-gray-600">{new Date(session.datetime).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">{session.location.address}</p>
                    <p className="text-sm text-gray-500">
                      Radius: {session.radius} meters
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to={`/session/${sessionId}/attendance`} className="w-full">
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    View Attendance List
                  </Button>
                </Link>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Attendance
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
