'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Heart,
  Car,
  LogOut,
  Loader2,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import {
  onAuthChange,
  logout,
  getUserProfile,
  updateUserProfile,
  getInterests,
  getTestDrives,
  type UserProfile,
  type Interest,
  type TestDrive,
} from '@/lib/firebase';
import { formatDate } from '@/utils/formatters';
import type { User as FirebaseUser } from 'firebase/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form state
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (!firebaseUser) {
        router.push('/auth/login?redirect=/dashboard');
        return;
      }
      setUser(firebaseUser);
      loadData();
    });

    return () => unsubscribe();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load profile
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
        setName(profileData.name || '');
        setCity(profileData.city || '');
      } catch (error) {
        console.log('Profile not found, using defaults');
      }

      // Load interests
      try {
        const interestsData = await getInterests();
        setInterests(interestsData);
      } catch (error) {
        console.log('No interests found');
      }

      // Load test drives
      try {
        const testDrivesData = await getTestDrives();
        setTestDrives(testDrivesData);
      } catch (error) {
        console.log('No test drives found');
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateSuccess(false);

    try {
      const updatedProfile = await updateUserProfile({ name, city });
      setProfile(updatedProfile);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 pt-24 pb-16">
        <div className="container-app">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              <p className="text-surface-500">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16">
      <div className="container-app">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 mb-1">
              Welcome{name ? `, ${name}` : ''}!
            </h1>
            <p className="text-surface-500">
              Manage your profile, interests, and test drives
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Sign Out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">
                {interests.length}
              </p>
              <p className="text-sm text-surface-500">Interests</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">
                {testDrives.length}
              </p>
              <p className="text-sm text-surface-500">Test Drives</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">
                {profile?.createdAt
                  ? formatDate(profile.createdAt, 'short')
                  : 'N/A'}
              </p>
              <p className="text-sm text-surface-500">Member Since</p>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="profile"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="profile" icon={<User className="w-4 h-4" />}>
              Profile
            </TabsTrigger>
            <TabsTrigger value="interests" icon={<Heart className="w-4 h-4" />}>
              Interests ({interests.length})
            </TabsTrigger>
            <TabsTrigger value="test-drives" icon={<Car className="w-4 h-4" />}>
              Test Drives ({testDrives.length})
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="max-w-2xl">
              <h2 className="text-xl font-semibold text-surface-900 mb-6">
                Profile Information
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <Input
                  label="Email"
                  value={user?.email || ''}
                  disabled
                  helperText="Email cannot be changed"
                />

                <Input
                  label="Full Name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Input
                  label="City"
                  placeholder="Enter your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  leftIcon={<MapPin className="w-5 h-5" />}
                />

                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={updating}
                  >
                    Save Changes
                  </Button>

                  {updateSuccess && (
                    <span className="text-green-600 text-sm">
                      Profile updated successfully!
                    </span>
                  )}
                </div>
              </form>
            </Card>
          </TabsContent>

          {/* Interests Tab */}
          <TabsContent value="interests">
            {interests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interests.map((interest) => (
                  <Card key={interest.id} className="group">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="yellow" className="mb-3">
                          Interest
                        </Badge>
                        <h3 className="font-semibold text-surface-900 mb-1">
                          Car ID: {interest.carId}
                        </h3>
                        <p className="text-sm text-surface-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(interest.createdAt)}
                        </p>
                      </div>
                      <Link href={`/cars/${interest.carId}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          rightIcon={<ExternalLink className="w-4 h-4" />}
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <Heart className="w-12 h-12 mx-auto mb-4 text-surface-300" />
                <h3 className="text-lg font-semibold text-surface-900 mb-2">
                  No interests yet
                </h3>
                <p className="text-surface-500 mb-6">
                  Browse our collection and express interest in cars you like
                </p>
                <Link href="/cars">
                  <Button variant="primary">Browse Cars</Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          {/* Test Drives Tab */}
          <TabsContent value="test-drives">
            {testDrives.length > 0 ? (
              <div className="space-y-4">
                {testDrives.map((testDrive) => (
                  <Card key={testDrive.id}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-surface-900">
                            Car ID: {testDrive.carId}
                          </h3>
                          <StatusBadge status={testDrive.status} />
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-surface-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Preferred: {formatDate(testDrive.preferredDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Booked: {formatDate(testDrive.createdAt)}
                          </span>
                        </div>
                      </div>
                      <Link href={`/cars/${testDrive.carId}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          rightIcon={<ExternalLink className="w-4 h-4" />}
                        >
                          View Car
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <Car className="w-12 h-12 mx-auto mb-4 text-surface-300" />
                <h3 className="text-lg font-semibold text-surface-900 mb-2">
                  No test drives booked
                </h3>
                <p className="text-surface-500 mb-6">
                  Schedule a test drive to experience your dream car
                </p>
                <Link href="/cars">
                  <Button variant="primary">Book Test Drive</Button>
                </Link>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

