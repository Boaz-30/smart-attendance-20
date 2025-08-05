import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, MapPin, Users, Shield, Clock, Download } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SmartAttend
            </h1>
          </div>
          <div className="flex space-x-3">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Smart Attendance Record System
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Revolutionize attendance tracking with QR codes and GPS verification. 
            Ensure students are physically present in class with our secure, 
            location-based attendance system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="px-8 py-3 text-lg">
                Start Teaching
              </Button>
            </Link>
            <Link to="/attend">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                Mark Attendance
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose SmartAttend?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>QR Code Generation</CardTitle>
              <CardDescription>
                Instantly generate unique QR codes for each class session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Lecturers can quickly create and share QR codes that students can scan 
                to mark their attendance with ease.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>GPS Verification</CardTitle>
              <CardDescription>
                Ensure students are physically present in the classroom
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Advanced GPS technology verifies student location to prevent 
                fraudulent attendance marking from remote locations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Real-time Tracking</CardTitle>
              <CardDescription>
                Monitor attendance as it happens in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                View live attendance updates and get instant insights into 
                class participation rates and student presence.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription>
                Protected with robust security measures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Secure login system ensures only authorized lecturers can 
                create sessions and view attendance data.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Time Management</CardTitle>
              <CardDescription>
                Set time windows for attendance collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Configure specific time frames when students can mark attendance, 
                preventing late or early submissions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-cyan-600" />
              </div>
              <CardTitle>Export Reports</CardTitle>
              <CardDescription>
                Download attendance data in multiple formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Export attendance records as CSV or Excel files for easy 
                integration with existing systems and record keeping.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-600">For Lecturers</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Register & Login</h4>
                    <p className="text-gray-600">Create your account and log into the system</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Create Class Session</h4>
                    <p className="text-gray-600">Set up your class with location and time details</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Generate QR Code</h4>
                    <p className="text-gray-600">Get a unique QR code and link to share with students</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Monitor & Export</h4>
                    <p className="text-gray-600">View real-time attendance and download reports</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-green-600">For Students</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Scan QR Code</h4>
                    <p className="text-gray-600">Use your phone to scan the attendance QR code</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Enter Details</h4>
                    <p className="text-gray-600">Provide your name and student index number</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Allow GPS</h4>
                    <p className="text-gray-600">Grant location permission for verification</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Mark Attendance</h4>
                    <p className="text-gray-600">Confirm your presence if within the class location</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">SmartAttend</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Smart Attendance Record System with Geolocation and QR Code Technology
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 SmartAttend. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
