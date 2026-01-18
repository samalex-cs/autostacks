'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import CarDetails from '@/components/CarDetails';
import { fetchCarByUid, fetchCarBySlug, fetchCarVariants, type CarEntry, type CarVariant } from '@/lib/contentstack';
import { postInterest, postTestDrive, getCurrentUser } from '@/lib/firebase';
import { formatDateForInput } from '@/utils/formatters';
import { isValidEmail, isFutureDate } from '@/utils/validators';

// Sample car data for development
const sampleCars: CarEntry[] = [
  {
    uid: '1',
    slug: 'tata-nexon-xz-plus-diesel-2024',
    title: 'Tata Nexon XZ+ Diesel',
    brand: 'Tata',
    model: 'Nexon XZ+ Diesel',
    year: 2024,
    price: 1245000,
    ex_showroom_price: 1345000,
    fuel_type: 'Diesel',
    transmission: 'Manual',
    body_type: 'SUV',
    seating_capacity: 5,
    mileage: '21.5 km/l',
    engine_capacity: '1497 cc',
    max_power: '118 bhp',
    max_torque: '260 Nm',
    description: 'The Tata Nexon is a subcompact SUV that offers a perfect blend of style, performance, and safety.',
    short_description: 'Bold design meets powerful performance in this 5-star safety rated SUV.',
    images: [
      { uid: '1', url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', title: 'Front View', filename: 'front.jpg' },
    ],
    features: ['Ventilated Front Seats', 'Wireless Phone Charger', 'Touchscreen Infotainment', 'JBL Premium Sound'],
    safety_features: ['6 Airbags', 'ABS with EBD', 'Electronic Stability Program'],
    colors: ['Royal Blue', 'Flame Red', 'Foliage Green'],
    is_new: true,
    is_featured: true,
    car_type: 'new',
    city: 'Mumbai',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '2',
    slug: 'hyundai-creta-sx-petrol-2024',
    title: 'Hyundai Creta SX Petrol',
    brand: 'Hyundai',
    model: 'Creta SX',
    year: 2024,
    price: 1650000,
    ex_showroom_price: 1650000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    body_type: 'SUV',
    seating_capacity: 5,
    mileage: '17.0 km/l',
    engine_capacity: '1497 cc',
    max_power: '115 bhp',
    max_torque: '144 Nm',
    description: 'The Hyundai Creta SX is a premium mid-size SUV known for its refined driving experience.',
    short_description: 'Premium mid-size SUV with refined driving and feature-rich cabin.',
    images: [
      { uid: '1', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', title: 'Front View', filename: 'front.jpg' },
    ],
    features: ['10.25-inch Touchscreen', 'Panoramic Sunroof', 'Bose Premium Sound', 'Ventilated Seats'],
    safety_features: ['6 Airbags', 'ABS with EBD', 'Vehicle Stability Control'],
    colors: ['Phantom Black', 'Polar White', 'Titan Grey'],
    is_new: true,
    is_featured: true,
    car_type: 'new',
    city: 'Delhi',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '3',
    slug: 'maruti-swift-zxi-2024',
    title: 'Maruti Swift ZXi',
    brand: 'Maruti Suzuki',
    model: 'Swift ZXi',
    year: 2024,
    price: 845000,
    ex_showroom_price: 845000,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    body_type: 'Hatchback',
    seating_capacity: 5,
    mileage: '22.56 km/l',
    engine_capacity: '1197 cc',
    max_power: '89 bhp',
    max_torque: '113 Nm',
    description: 'The all-new Maruti Swift ZXi brings a fresh design language with improved features.',
    short_description: "India's favorite hatchback with new design and excellent mileage.",
    images: [
      { uid: '1', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', title: 'Front View', filename: 'front.jpg' },
    ],
    features: ['9-inch SmartPlay Pro+', 'Cruise Control', 'Auto Headlamps', 'Push Start/Stop'],
    safety_features: ['6 Airbags', 'ABS with EBD', 'ESP', 'Hill Hold'],
    colors: ['Solid Fire Red', 'Pearl Arctic White', 'Metallic Magma Grey'],
    is_new: true,
    is_featured: true,
    car_type: 'new',
    city: 'Bangalore',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '4',
    slug: 'mahindra-xuv700-ax7-2022-used',
    title: 'Mahindra XUV700 AX7 (Pre-owned)',
    brand: 'Mahindra',
    model: 'XUV700 AX7',
    year: 2022,
    price: 1850000,
    fuel_type: 'Diesel',
    transmission: 'Automatic',
    body_type: 'SUV',
    seating_capacity: 7,
    mileage: '15.5 km/l',
    engine_capacity: '2198 cc',
    max_power: '185 bhp',
    max_torque: '420 Nm',
    description: 'Well-maintained Mahindra XUV700 AX7 with full service history. Single owner, accident-free.',
    short_description: 'Premium 7-seater SUV with ADAS and powerful diesel engine.',
    images: [
      { uid: '1', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800', title: 'Front View', filename: 'front.jpg' },
    ],
    features: ['Dual 10.25-inch Screens', 'ADAS Level 2', 'Alexa Built-in', 'Sony 3D Sound'],
    safety_features: ['7 Airbags', 'ABS with EBD', 'ESP', 'Lane Keep Assist'],
    colors: ['Everest White'],
    is_new: false,
    is_featured: true,
    car_type: 'used',
    city: 'Chennai',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '5',
    slug: 'kia-seltos-htx-2021-used',
    title: 'Kia Seltos HTX (Pre-owned)',
    brand: 'Kia',
    model: 'Seltos HTX',
    year: 2021,
    price: 1120000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    body_type: 'SUV',
    seating_capacity: 5,
    mileage: '16.0 km/l',
    engine_capacity: '1497 cc',
    max_power: '115 bhp',
    max_torque: '144 Nm',
    description: 'Well-maintained Kia Seltos HTX with excellent condition and low mileage.',
    short_description: 'Stylish mid-size SUV with connected car tech and bold design.',
    images: [
      { uid: '1', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800', title: 'Front View', filename: 'front.jpg' },
    ],
    features: ['10.25-inch Touchscreen', 'Bose Premium Audio', 'UVO Connect', 'Ventilated Seats'],
    safety_features: ['6 Airbags', 'ABS with EBD', 'ESC', 'Hill Assist'],
    colors: ['Aurora Black Pearl'],
    is_new: false,
    is_featured: false,
    car_type: 'used',
    city: 'Pune',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
  {
    uid: '6',
    slug: 'honda-city-v-2024',
    title: 'Honda City V',
    brand: 'Honda',
    model: 'City V',
    year: 2024,
    price: 1245000,
    ex_showroom_price: 1245000,
    fuel_type: 'Petrol',
    transmission: 'CVT',
    body_type: 'Sedan',
    seating_capacity: 5,
    mileage: '18.4 km/l',
    engine_capacity: '1498 cc',
    max_power: '121 bhp',
    max_torque: '145 Nm',
    description: 'The Honda City continues to be the benchmark in the premium sedan segment.',
    short_description: 'Premium sedan with refined CVT and class-leading features.',
    images: [
      { uid: '1', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800', title: 'Front View', filename: 'front.jpg' },
    ],
    features: ['8-inch Touchscreen', 'LaneWatch Camera', 'Sunroof', 'Leather Seats'],
    safety_features: ['6 Airbags', 'ABS with EBD', 'VSA', 'Hill Start Assist'],
    colors: ['Platinum White Pearl', 'Radiant Red', 'Golden Brown'],
    is_new: true,
    is_featured: true,
    car_type: 'new',
    city: 'Hyderabad',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en',
  },
];

// Helper to find sample car by slug or uid
const findSampleCar = (identifier: string): CarEntry | null => {
  return sampleCars.find(car => car.slug === identifier || car.uid === identifier) || null;
};

// Sample variants for each car (keyed by car uid)
// Used cars don't have variants as they are specific vehicles
const sampleVariantsMap: Record<string, CarVariant[]> = {
  // Tata Nexon variants
  '1': [
    {
      uid: 'v1-1',
      title: 'XM Petrol',
      variant_name: 'XM Petrol',
      price: 999000,
      fuel_type: 'Petrol',
      transmission: 'Manual',
      engine_capacity: '1199 cc',
      max_power: '118 bhp',
      max_torque: '170 Nm',
      mileage: '17.5 km/l',
      features: ['Dual Airbags', 'ABS', 'Rear Parking Sensors'],
      car_reference: [{ uid: '1' }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      locale: 'en',
    },
    {
      uid: 'v1-2',
      title: 'XZ Petrol',
      variant_name: 'XZ Petrol',
      price: 1145000,
      fuel_type: 'Petrol',
      transmission: 'Manual',
      engine_capacity: '1199 cc',
      max_power: '118 bhp',
      max_torque: '170 Nm',
      mileage: '17.0 km/l',
      features: ['6 Airbags', 'ABS with EBD', 'Touchscreen'],
      car_reference: [{ uid: '1' }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      locale: 'en',
    },
    {
      uid: 'v1-3',
      title: 'XZ+ Diesel',
      variant_name: 'XZ+ Diesel',
      price: 1245000,
      fuel_type: 'Diesel',
      transmission: 'Manual',
      engine_capacity: '1497 cc',
      max_power: '118 bhp',
      max_torque: '260 Nm',
      mileage: '21.5 km/l',
      features: ['6 Airbags', 'Sunroof', 'JBL Audio', 'Connected Car'],
      car_reference: [{ uid: '1' }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      locale: 'en',
    },
  ],
  // Hyundai Creta variants
  '2': [
    {
      uid: 'v2-1',
      title: 'E Petrol',
      variant_name: 'E Petrol',
      price: 1099000,
      fuel_type: 'Petrol',
      transmission: 'Manual',
      engine_capacity: '1497 cc',
      max_power: '115 bhp',
      max_torque: '144 Nm',
      mileage: '17.4 km/l',
      features: ['Dual Airbags', 'ABS', 'Manual AC'],
      car_reference: [{ uid: '2' }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      locale: 'en',
    },
    {
      uid: 'v2-2',
      title: 'SX Petrol',
      variant_name: 'SX Petrol',
      price: 1450000,
      fuel_type: 'Petrol',
      transmission: 'Manual',
      engine_capacity: '1497 cc',
      max_power: '115 bhp',
      max_torque: '144 Nm',
      mileage: '17.0 km/l',
      features: ['6 Airbags', 'Sunroof', 'Touchscreen', 'Wireless Charging'],
      car_reference: [{ uid: '2' }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      locale: 'en',
    },
    {
      uid: 'v2-3',
      title: 'SX(O) Turbo DCT',
      variant_name: 'SX(O) Turbo DCT',
      price: 1850000,
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      engine_capacity: '1482 cc',
      max_power: '160 bhp',
      max_torque: '253 Nm',
      mileage: '18.4 km/l',
      features: ['6 Airbags', 'Panoramic Sunroof', 'Bose Audio', 'ADAS'],
      car_reference: [{ uid: '2' }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      locale: 'en',
    },
  ],
  // Maruti Swift variants
  '3': [
    {
      uid: 'v3-1',
      title: 'LXi',
      variant_name: 'LXi',
      price: 649000,
      fuel_type: 'Petrol',
      transmission: 'Manual',
      engine_capacity: '1197 cc',
      max_power: '89 bhp',
      max_torque: '113 Nm',
      mileage: '23.2 km/l',
      features: ['Dual Airbags', 'ABS', 'Power Windows (Front)'],
      car_reference: [{ uid: '3' }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      locale: 'en',
    },
    {
      uid: 'v3-2',
      title: 'VXi',
      variant_name: 'VXi',
      price: 749000,
      fuel_type: 'Petrol',
      transmission: 'Manual',
      engine_capacity: '1197 cc',
      max_power: '89 bhp',
      max_torque: '113 Nm',
      mileage: '22.56 km/l',
      features: ['Dual Airbags', 'ABS', 'Touchscreen', 'Push Start'],
      car_reference: [{ uid: '3' }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      locale: 'en',
    },
    {
      uid: 'v3-3',
      title: 'ZXi AMT',
      variant_name: 'ZXi AMT',
      price: 895000,
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      engine_capacity: '1197 cc',
      max_power: '89 bhp',
      max_torque: '113 Nm',
      mileage: '22.38 km/l',
      features: ['6 Airbags', 'Cruise Control', 'LED DRLs', 'SmartPlay Pro+'],
      car_reference: [{ uid: '3' }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      locale: 'en',
    },
  ],
  // Honda City variants
  '6': [
    {
      uid: 'v6-1',
      title: 'V MT',
      variant_name: 'V MT',
      price: 1199000,
      fuel_type: 'Petrol',
      transmission: 'Manual',
      engine_capacity: '1498 cc',
      max_power: '121 bhp',
      max_torque: '145 Nm',
      mileage: '18.4 km/l',
      features: ['Dual Airbags', 'Lane Watch', 'LED Headlamps'],
      car_reference: [{ uid: '6' }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      locale: 'en',
    },
    {
      uid: 'v6-2',
      title: 'V CVT',
      variant_name: 'V CVT',
      price: 1245000,
      fuel_type: 'Petrol',
      transmission: 'CVT',
      engine_capacity: '1498 cc',
      max_power: '121 bhp',
      max_torque: '145 Nm',
      mileage: '18.4 km/l',
      features: ['6 Airbags', 'Sunroof', 'Honda Connect'],
      car_reference: [{ uid: '6' }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      locale: 'en',
    },
    {
      uid: 'v6-3',
      title: 'ZX CVT',
      variant_name: 'ZX CVT',
      price: 1450000,
      fuel_type: 'Petrol',
      transmission: 'CVT',
      engine_capacity: '1498 cc',
      max_power: '121 bhp',
      max_torque: '145 Nm',
      mileage: '18.4 km/l',
      features: ['6 Airbags', 'Sunroof', 'Leather Seats', 'Wireless Charging', 'ADAS'],
      car_reference: [{ uid: '6' }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      locale: 'en',
    },
  ],
  // Used cars (4, 5) don't have variants - they are specific vehicles
};

// Helper to find sample variants for a car
const findSampleVariants = (carUid: string): CarVariant[] => {
  return sampleVariantsMap[carUid] || [];
};

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params.carId as string;

  const [car, setCar] = useState<CarEntry | null>(null);
  const [variants, setVariants] = useState<CarVariant[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form states
  const [interestEmail, setInterestEmail] = useState('');
  const [testDriveDate, setTestDriveDate] = useState('');

  useEffect(() => {
    loadCarDetails();
  }, [carId]);

  const loadCarDetails = async () => {
    setLoading(true);
    try {
      // Try fetching by slug first (URL-friendly), then by UID
      let carData = await fetchCarBySlug(carId);
      if (!carData) {
        carData = await fetchCarByUid(carId);
      }
      
      const variantsData = carData ? await fetchCarVariants(carData.uid) : [];

      if (carData) {
        setCar(carData);
        setVariants(variantsData);
      } else {
        // Use sample data for development - find matching car by slug/uid
        const sampleCar = findSampleCar(carId);
        if (sampleCar) {
          setCar(sampleCar);
          // Get variants specific to this car (used cars don't have variants)
          setVariants(findSampleVariants(sampleCar.uid));
        } else {
          // No matching car found
          setCar(null);
          setVariants([]);
        }
      }
    } catch (error) {
      console.error('Error loading car details:', error);
      // Use sample data as fallback - find matching car by slug/uid
      const sampleCar = findSampleCar(carId);
      if (sampleCar) {
        setCar(sampleCar);
        // Get variants specific to this car (used cars don't have variants)
        setVariants(findSampleVariants(sampleCar.uid));
      } else {
        setCar(null);
        setVariants([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInterestSubmit = async () => {
    if (!car) return;

    const user = getCurrentUser();
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/cars/${carId}`));
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      await postInterest({
        carId: car.uid,
        carOwner: car.dealer_name || 'autostack',
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowInterestModal(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to submit interest. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestDriveSubmit = async () => {
    if (!car) return;

    if (!testDriveDate || !isFutureDate(testDriveDate)) {
      setSubmitError('Please select a valid future date');
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/cars/${carId}`));
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      await postTestDrive({
        carId: car.uid,
        carOwner: car.dealer_name || 'autostack',
        dealerId: car.dealer_name || 'autostack',
        preferredDate: new Date(testDriveDate).toISOString(),
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowTestDriveModal(false);
        setSubmitSuccess(false);
        setTestDriveDate('');
      }, 2000);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to book test drive. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const openInterestModal = () => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/cars/${carId}`));
      return;
    }
    setShowInterestModal(true);
    setSubmitError('');
    setSubmitSuccess(false);
  };

  const openTestDriveModal = () => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/cars/${carId}`));
      return;
    }
    setShowTestDriveModal(true);
    setSubmitError('');
    setSubmitSuccess(false);
  };

  // Get tomorrow's date for min date picker
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = formatDateForInput(tomorrow);

  // Get max date (30 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = formatDateForInput(maxDate);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 pt-24 pb-16">
        <div className="container-app">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              <p className="text-surface-500">Loading car details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-surface-50 pt-24 pb-16">
        <div className="container-app text-center py-20">
          <h1 className="text-2xl font-bold text-surface-900 mb-4">Car Not Found</h1>
          <p className="text-surface-500 mb-6">
            The car you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/cars">
            <Button variant="primary">Browse All Cars</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16">
      <div className="container-app">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-surface-500 hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Cars
          </Link>
        </div>

        {/* Car Details Component */}
        <CarDetails
          car={car}
          variants={variants}
          onInterest={openInterestModal}
          onTestDrive={openTestDriveModal}
        />

        {/* Interest Modal */}
        <Modal
          isOpen={showInterestModal}
          onClose={() => setShowInterestModal(false)}
          title="Express Interest"
          description={`Let us know you're interested in the ${car.brand} ${car.model}`}
        >
          {submitSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">
                Interest Submitted!
              </h3>
              <p className="text-surface-500">
                Our team will contact you shortly.
              </p>
            </div>
          ) : (
            <>
              <p className="text-surface-600 mb-4">
                Click confirm to express your interest. Our team will reach out to you
                with more details about this car.
              </p>

              {submitError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-4">
                  {submitError}
                </div>
              )}

              <ModalFooter>
                <Button
                  variant="ghost"
                  onClick={() => setShowInterestModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleInterestSubmit}
                  isLoading={submitting}
                >
                  Confirm Interest
                </Button>
              </ModalFooter>
            </>
          )}
        </Modal>

        {/* Test Drive Modal */}
        <Modal
          isOpen={showTestDriveModal}
          onClose={() => setShowTestDriveModal(false)}
          title="Book Test Drive"
          description={`Schedule a test drive for the ${car.brand} ${car.model}`}
        >
          {submitSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">
                Test Drive Booked!
              </h3>
              <p className="text-surface-500">
                We&apos;ll confirm the timing shortly.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <Input
                  type="date"
                  label="Preferred Date"
                  value={testDriveDate}
                  onChange={(e) => setTestDriveDate(e.target.value)}
                  min={minDate}
                  max={maxDateStr}
                  helperText="Select a date within the next 30 days"
                />

                {submitError && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    {submitError}
                  </div>
                )}
              </div>

              <ModalFooter>
                <Button
                  variant="ghost"
                  onClick={() => setShowTestDriveModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleTestDriveSubmit}
                  isLoading={submitting}
                  disabled={!testDriveDate}
                >
                  Book Test Drive
                </Button>
              </ModalFooter>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}

