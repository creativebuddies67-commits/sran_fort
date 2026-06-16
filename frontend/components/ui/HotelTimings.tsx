import { HOTEL_INFO } from '@/lib/constants';

interface HotelTimingsProps {
  className?: string;
  checkIn?: string;
  checkOut?: string;
}

export default function HotelTimings({
  className = '',
  checkIn = HOTEL_INFO.checkIn,
  checkOut = HOTEL_INFO.checkOut,
}: HotelTimingsProps) {
  return (
    <ul className={`space-y-2 text-gray-400 text-sm ${className}`}>
      <li>Check-in: {checkIn}</li>
      <li>Check-out: {checkOut}</li>
      <li>Minimum age: {HOTEL_INFO.minAge} years</li>
      <li>{HOTEL_INFO.parking}</li>
    </ul>
  );
}
