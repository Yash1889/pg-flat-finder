import React from 'react';

const PropertyAmenities = ({ property }) => {
  // Amenity list with icons and labels - enhanced for student focus
  const amenities = [
    {
      id: 'wifi',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      ),
      label: 'WiFi',
      available: property?.has_wifi,
    },
    {
      id: 'ac',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2a.75.75 0 01.75.75v.25h1.5a.75.75 0 010 1.5h-1.5v3h1.5a.75.75 0 010 1.5h-1.5v.25a.75.75 0 01-1.5 0V9h-3v.25a.75.75 0 01-1.5 0V9H4.75a.75.75 0 010-1.5h1.5v-3H4.75a.75.75 0 010-1.5h1.5V2.75A.75.75 0 017 2h3z" />
          <path d="M3.5 7.25a.75.75 0 01.75-.75h11.5a.75.75 0 010 1.5H4.25a.75.75 0 01-.75-.75z" />
        </svg>
      ),
      label: 'Air Conditioning',
      available: property?.has_ac,
    },
    {
      id: 'study_room',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      ),
      label: 'Study Room',
      available: property?.has_study_room,
    },
    {
      id: 'mess',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M6 3V2h8v1h1a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1h1zm0 8v6h8v-6H6z" />
          <path fillRule="evenodd" d="M1 9h18v2H1V9z" />
        </svg>
      ),
      label: 'Mess Facility',
      available: property?.has_mess,
    },
    {
      id: 'parking',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.038A2.968 2.968 0 0014 9.5v2.046a2.5 2.5 0 014.9 0h1.05a1 1 0 001-1v-6a1 1 0 00-1-1h-1.5A3 3 0 0016 3H6a3 3 0 00-2.45 1.25L3 4z" />
        </svg>
      ),
      label: 'Parking',
      available: property?.has_parking,
    },
    {
      id: 'tv',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-3l1 1v1H7v-1l1-1H5a2 2 0 01-2-2V5zm2-1h10a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      ),
      label: 'TV',
      available: property?.has_tv,
    },
    {
      id: 'kitchen',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 3a1 1 0 100 2h12a1 1 0 100-2H4zm0 4a1 1 0 100 2h12a1 1 0 100-2H4z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Kitchen',
      available: property?.has_kitchen,
    },
    {
      id: 'washing_machine',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H5zm4.5 4a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2 1.5a1 1 0 11-2 0 1 1 0 012 0zm1 3.5a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Washing Machine',
      available: property?.has_washing_machine,
    },
    {
      id: 'laundry',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H5zm4.5 4a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2 1.5a1 1 0 11-2 0 1 1 0 012 0zm1 3.5a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Laundry Service',
      available: property?.has_laundry,
    },
    {
      id: 'hot_water',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Hot Water',
      available: property?.has_hot_water,
    },
    {
      id: 'gym',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm2.5 4a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm4.5 4a4 4 0 10-8 0 4 4 0 008 0zm-4-2a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Gym',
      available: property?.has_gym,
    },
    {
      id: 'furnished',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2zm2-1h10a1 1 0 011 1v1H4V5a1 1 0 011-1zm0 3h10v7a1 1 0 01-1 1H5a1 1 0 01-1-1V7z" />
        </svg>
      ),
      label: 'Fully Furnished',
      available: property?.furnishing === 'fully_furnished',
    },
    {
      id: 'semi_furnished',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2zm2-1h10a1 1 0 011 1v1H4V5a1 1 0 011-1zm0 3h10v7a1 1 0 01-1 1H5a1 1 0 01-1-1V7z" />
        </svg>
      ),
      label: 'Semi Furnished',
      available: property?.furnishing === 'semi_furnished',
    },
  ];

  // Filter out amenities that are not available
  const availableAmenities = amenities.filter(amenity => amenity.available);
  const unavailableAmenities = amenities.filter(amenity => !amenity.available);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Amenities & Features</h3>
      
      {availableAmenities.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableAmenities.map(amenity => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <div className="text-primary-600">
                {amenity.icon}
              </div>
              <span className="text-gray-800">{amenity.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No amenities listed for this property.</p>
      )}
      
      {unavailableAmenities.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium mb-3 text-gray-600">Not Available</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {unavailableAmenities.map(amenity => (
              <div key={amenity.id} className="flex items-center space-x-2 text-gray-400">
                <div>
                  {amenity.icon}
                </div>
                <span>{amenity.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyAmenities;
