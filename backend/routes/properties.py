from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel, Field
import enum
from datetime import datetime
from .properties_utils import enhance_property_details

# Enum definitions (simplified)
class PropertyType(str, enum.Enum):
    PG = "pg"
    FLAT = "flat"

class RoomType(str, enum.Enum):
    SINGLE = "single"
    SHARED = "shared"
    DORMITORY = "dormitory"

class GenderPreference(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    ANY = "any"

class FoodFacility(str, enum.Enum):
    NONE = "none"
    MESS = "mess"
    KITCHEN = "kitchen"
    BOTH = "both"

router = APIRouter(
    prefix="/properties",
    tags=["properties"],
    responses={404: {"description": "Not found"}},
)

# Mock database for demonstration
MOCK_PROPERTIES = [
    {
        "id": 1,
        "title": "Modern PG near KIET College",
        "description": "Fully furnished PG with all amenities for students",
        "property_type": PropertyType.PG,
        "address": "123, Delhi-Meerut Road",
        "city": "Ghaziabad",
        "state": "Uttar Pradesh",
        "zipcode": "201206",
        "latitude": 28.7526,
        "longitude": 77.4934,
        "price": 8500,
        "price_type": "monthly",
        "room_type": RoomType.SINGLE,
        "gender": GenderPreference.MALE,
        "food_facility": FoodFacility.MESS,
        "college_name": "KIET Group of Institutions",
        "college_distance_km": 0.3,
        "has_wifi": True,
        "has_ac": True,
        "has_parking": True,
        "has_tv": True,
        "has_kitchen": False,
        "has_washing_machine": True,
        "has_gym": False,
        "has_study_room": True,
        "has_mess": True,
        "has_laundry": True,
        "has_hot_water": True,
        "contact_name": "Rajesh Kumar",
        "contact_phone": "9876543210",
        "contact_email": "rajesh@example.com",
        "main_image_url": "https://images.unsplash.com/photo-1540518614846-7eded433c457",
        "is_available": True,
        "is_verified": True,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "owner_id": 1,
        "average_rating": 4.5
    },
    {
        "id": 2,
        "title": "KIET Student Hostel",
        "description": "Affordable shared accommodation for college students",
        "property_type": PropertyType.PG,
        "address": "Near KIET College, Delhi-Meerut Road",
        "city": "Ghaziabad",
        "state": "Uttar Pradesh",
        "zipcode": "201206",
        "latitude": 28.7550,
        "longitude": 77.4960,
        "price": 6000,
        "price_type": "monthly",
        "room_type": RoomType.SHARED,
        "gender": GenderPreference.ANY,
        "food_facility": FoodFacility.BOTH,
        "college_name": "KIET Group of Institutions",
        "college_distance_km": 0.1,
        "has_wifi": True,
        "has_ac": False,
        "has_parking": True,
        "has_tv": True,
        "has_kitchen": True,
        "has_washing_machine": False,
        "has_gym": False,
        "has_study_room": True,
        "has_mess": True,
        "has_laundry": False,
        "has_hot_water": True,
        "contact_name": "Hostel Manager",
        "contact_phone": "9876543211",
        "contact_email": "hostel@kiet.edu",
        "main_image_url": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
        "is_available": True,
        "is_verified": True,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "owner_id": 2,
        "average_rating": 4.0
    },
    {
        "id": 3,
        "title": "Luxury Apartment near KIET",
        "description": "Spacious 2BHK apartment, ideal for faculty or working professionals",
        "property_type": PropertyType.FLAT,
        "address": "Green Valley Society, Muradnagar",
        "city": "Ghaziabad",
        "state": "Uttar Pradesh",
        "zipcode": "201206",
        "latitude": 28.7580,
        "longitude": 77.5000,
        "price": 22000,
        "price_type": "monthly",
        "bedrooms": 2,
        "bathrooms": 2,
        "area_sqft": 1200,
        "furnishing": "fully_furnished",
        "gender": GenderPreference.ANY,
        "food_facility": FoodFacility.KITCHEN,
        "college_name": "KIET Group of Institutions",
        "college_distance_km": 1.5,
        "has_wifi": True,
        "has_ac": True,
        "has_parking": True,
        "has_tv": True,
        "has_kitchen": True,
        "has_washing_machine": True,
        "has_gym": True,
        "has_study_room": False,
        "has_mess": False,
        "has_laundry": False,
        "has_hot_water": True,
        "contact_name": "Amit Sharma",
        "contact_phone": "9876543212",
        "contact_email": "amit@example.com",
        "main_image_url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
        "is_available": True,
        "is_verified": True,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "owner_id": 3,
        "average_rating": 4.8
    }
]

# Schemas
class PropertyBase(BaseModel):
    title: str
    description: str
    property_type: PropertyType
    address: str
    city: str
    state: Optional[str] = None
    zipcode: Optional[str] = None
    price: float
    price_type: Optional[str] = "monthly"  # monthly, yearly, etc.
    area_sqft: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    furnishing: Optional[str] = None
    
    # Student-focused details
    room_type: Optional[RoomType] = None  # For PGs and hostels
    gender: Optional[GenderPreference] = None  # Male/female/coed
    food_facility: Optional[FoodFacility] = None  # Mess, meals plan, kitchen
    college_name: Optional[str] = None  # Name of nearby college/university
    college_distance_km: Optional[float] = None  # Distance to nearby college in km
    
    # Amenities
    has_wifi: bool = False
    has_ac: bool = False
    has_parking: bool = False
    has_tv: bool = False
    has_kitchen: bool = False
    has_washing_machine: bool = False
    has_gym: bool = False
    # Student-focused amenities
    has_study_room: bool = False
    has_mess: bool = False
    has_laundry: bool = False
    has_hot_water: bool = False
    
    # Contact information
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    main_image_url: Optional[str] = None

class PropertyCreate(PropertyBase):
    latitude: float
    longitude: float

class PropertyUpdate(PropertyBase):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_available: Optional[bool] = None

class PropertyResponse(PropertyBase):
    id: int
    latitude: float
    longitude: float
    is_available: bool
    is_verified: bool
    created_at: str
    updated_at: Optional[str] = None
    owner_id: int
    average_rating: Optional[float] = None
    
    class Config:
        from_attributes = True

# Routes
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_property(property_in: PropertyCreate):
    """
    Create a new property listing (mock implementation)
    """
    # Find the highest ID in the mock database to assign a new ID
    new_id = max([p["id"] for p in MOCK_PROPERTIES]) + 1
    
    # Create new property data from the input
    new_property = {
        "id": new_id,
        "title": property_in.title,
        "description": property_in.description,
        "property_type": property_in.property_type,
        "address": property_in.address,
        "city": property_in.city,
        "state": property_in.state,
        "zipcode": property_in.zipcode,
        "latitude": property_in.latitude,
        "longitude": property_in.longitude,
        "price": property_in.price,
        "price_type": property_in.price_type,
        "area_sqft": property_in.area_sqft,
        "bedrooms": property_in.bedrooms,
        "bathrooms": property_in.bathrooms,
        "furnishing": property_in.furnishing,
        # Student-focused details
        "room_type": property_in.room_type,
        "gender": property_in.gender,
        "food_facility": property_in.food_facility,
        "college_name": property_in.college_name,
        "college_distance_km": property_in.college_distance_km,
        # Basic amenities
        "has_wifi": property_in.has_wifi,
        "has_ac": property_in.has_ac,
        "has_parking": property_in.has_parking,
        "has_tv": property_in.has_tv,
        "has_kitchen": property_in.has_kitchen,
        "has_washing_machine": property_in.has_washing_machine,
        "has_gym": property_in.has_gym,
        # Student-focused amenities
        "has_study_room": property_in.has_study_room,
        "has_mess": property_in.has_mess,
        "has_laundry": property_in.has_laundry,
        "has_hot_water": property_in.has_hot_water,
        # Contact and other details
        "contact_name": property_in.contact_name,
        "contact_phone": property_in.contact_phone,
        "contact_email": property_in.contact_email,
        "main_image_url": property_in.main_image_url or "",
        "owner_id": 1,  # Mock owner ID
        "is_available": True,
        "is_verified": False
    }
    
    # Add to mock database
    MOCK_PROPERTIES.append(new_property)
    
    return new_property

@router.get("/")
async def get_properties(
    skip: int = 0,
    limit: int = 100,
    property_type: Optional[PropertyType] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bedrooms: Optional[int] = None,
    bathrooms: Optional[int] = None,
    location: Optional[str] = None,  # General location parameter
    city: Optional[str] = None,
    state: Optional[str] = None,
    zipcode: Optional[str] = None,
    is_available: bool = True,
    # Student-focused filters
    room_type: Optional[RoomType] = None,
    gender: Optional[GenderPreference] = None,
    food_facility: Optional[FoodFacility] = None,
    college_name: Optional[str] = None,
    max_college_distance: Optional[float] = None,
    # Amenities
    has_wifi: Optional[bool] = None,
    has_ac: Optional[bool] = None,
    has_parking: Optional[bool] = None,
    has_tv: Optional[bool] = None,
    has_kitchen: Optional[bool] = None,
    has_washing_machine: Optional[bool] = None,
    has_gym: Optional[bool] = None,
    has_study_room: Optional[bool] = None,
    has_mess: Optional[bool] = None,
    has_laundry: Optional[bool] = None,
    has_hot_water: Optional[bool] = None,
):
    """
    Get all properties with optional filters
    """
    # Start with all properties
    filtered_properties = MOCK_PROPERTIES.copy()
    
    # Apply basic filters
    if property_type:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("property_type") == property_type]
    
    if min_price is not None:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("price", 0) >= min_price]
    
    if max_price is not None:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("price", 0) <= max_price]
    
    if bedrooms is not None:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("bedrooms", 0) >= bedrooms]
                              
    if bathrooms is not None:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("bathrooms", 0) >= bathrooms]
    
    # Location-based filters - any of these can match
    if location:
        location_lower = location.lower()
        filtered_properties = [p for p in filtered_properties 
                              if (location_lower in p.get("address", "").lower() or
                                 location_lower in p.get("city", "").lower() or
                                 location_lower in p.get("state", "").lower() or
                                 location_lower in p.get("zipcode", "").lower() or
                                 location_lower in p.get("college_name", "").lower())]
    
    if city:
        filtered_properties = [p for p in filtered_properties 
                              if city.lower() in p.get("city", "").lower()]
    
    if state:
        filtered_properties = [p for p in filtered_properties 
                              if state.lower() in p.get("state", "").lower()]
                              
    if zipcode:
        filtered_properties = [p for p in filtered_properties 
                              if zipcode in p.get("zipcode", "")]
    
    if is_available is not None:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("is_available", False) == is_available]
    
    # Apply student-focused filters
    if room_type:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("room_type") == room_type]
    
    if gender:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("gender") == gender or p.get("gender") == GenderPreference.ANY]
    
    if food_facility:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("food_facility") == food_facility]
    
    if college_name:
        filtered_properties = [p for p in filtered_properties 
                              if college_name.lower() in p.get("college_name", "").lower()]
    
    if max_college_distance is not None:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("college_distance_km", float('inf')) <= max_college_distance]
    
    # All amenity filters
    if has_wifi:
        filtered_properties = [p for p in filtered_properties if p.get("has_wifi", False)]
        
    if has_ac:
        filtered_properties = [p for p in filtered_properties if p.get("has_ac", False)]
        
    if has_parking:
        filtered_properties = [p for p in filtered_properties if p.get("has_parking", False)]
        
    if has_tv:
        filtered_properties = [p for p in filtered_properties if p.get("has_tv", False)]
        
    if has_kitchen:
        filtered_properties = [p for p in filtered_properties if p.get("has_kitchen", False)]
        
    if has_washing_machine:
        filtered_properties = [p for p in filtered_properties if p.get("has_washing_machine", False)]
        
    if has_gym:
        filtered_properties = [p for p in filtered_properties if p.get("has_gym", False)]
    
    if has_study_room:
        filtered_properties = [p for p in filtered_properties if p.get("has_study_room", False)]
    
    if has_mess:
        filtered_properties = [p for p in filtered_properties if p.get("has_mess", False)]
    
    if has_laundry:
        filtered_properties = [p for p in filtered_properties if p.get("has_laundry", False)]
    
    if has_hot_water:
        filtered_properties = [p for p in filtered_properties if p.get("has_hot_water", False)]
    
    # Apply pagination
    start = skip
    end = skip + limit if skip + limit < len(filtered_properties) else len(filtered_properties)
    
    return {
        "total": len(filtered_properties),
        "properties": filtered_properties[start:end],
        "has_more": end < len(filtered_properties)
    }

@router.get("/{property_id}")
async def get_property(property_id: int):
    """
    Get a specific property by ID
    """
    # Find property in mock database
    for property in MOCK_PROPERTIES:
        if property["id"] == property_id:
            return property
    
    # If property not found, raise 404 error
    raise HTTPException(status_code=404, detail="Property not found")


@router.put("/{property_id}")
async def update_property(property_id: int, property_in: PropertyUpdate):
    """
    Update a property (mock implementation)
    """
    # Find property in mock database
    for i, property in enumerate(MOCK_PROPERTIES):
        if property["id"] == property_id:
            # Update only the fields that are present in the update
            update_data = {k: v for k, v in property_in.dict(exclude_unset=True).items() if v is not None}
            MOCK_PROPERTIES[i].update(update_data)
            MOCK_PROPERTIES[i]["updated_at"] = datetime.now().isoformat()
            return MOCK_PROPERTIES[i]
    
    # If property not found, raise 404 error
    raise HTTPException(status_code=404, detail="Property not found")

@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property(property_id: int):
    """
    Delete a property (mock implementation)
    """
    # Find property in mock database
    for i, property in enumerate(MOCK_PROPERTIES):
        if property["id"] == property_id:
            # For demonstration, we just mark it as unavailable instead of actually deleting
            MOCK_PROPERTIES[i]["is_available"] = False
            MOCK_PROPERTIES[i]["updated_at"] = datetime.now().isoformat()
            return None
    
    # If property not found, raise 404 error
    raise HTTPException(status_code=404, detail="Property not found")

@router.get("/user/my-properties")
async def get_user_properties():
    """
    Get all properties owned by the current user (mock implementation)
    """
    # For demo purposes, we'll return the first property as if it belongs to the current user
    user_properties = [p for p in MOCK_PROPERTIES if p["owner_id"] == 1]
    
    return {
        "total": len(user_properties),
        "properties": user_properties,
        "has_more": False
    }

@router.get("/nearby")
async def get_nearby_properties(
    latitude: float,
    longitude: float,
    radius_km: float = 5.0,
    skip: int = 0,
    limit: int = 100,
    property_type: Optional[PropertyType] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    room_type: Optional[RoomType] = None,
    gender: Optional[GenderPreference] = None,
    food_facility: Optional[FoodFacility] = None,
    has_study_room: Optional[bool] = None,
    has_mess: Optional[bool] = None,
    has_laundry: Optional[bool] = None,
    has_wifi: Optional[bool] = None,
):
    """
    Get properties near a specific location within a radius
    """
    from math import radians, cos, sin, asin, sqrt
    
    # Haversine formula to calculate distance between two points
    def haversine(lat1, lon1, lat2, lon2):
        # Convert decimal degrees to radians
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
        
        # Haversine formula
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        r = 6371  # Radius of earth in kilometers
        return c * r
    
    # Filter properties within radius
    nearby_properties = []
    for prop in MOCK_PROPERTIES:
        distance = haversine(latitude, longitude, prop["latitude"], prop["longitude"])
        if distance <= radius_km:
            # Add distance to property for frontend use
            prop_copy = prop.copy()
            prop_copy["distance_km"] = round(distance, 2)
            nearby_properties.append(prop_copy)
    
    # Apply other filters
    filtered_properties = nearby_properties
    
    if property_type:
        filtered_properties = [p for p in filtered_properties 
                              if p["property_type"] == property_type]
    
    if min_price is not None:
        filtered_properties = [p for p in filtered_properties 
                              if p["price"] >= min_price]
    
    if max_price is not None:
        filtered_properties = [p for p in filtered_properties 
                              if p["price"] <= max_price]
    
    if room_type:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("room_type") == room_type]
    
    if gender:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("gender") == gender or p.get("gender") == GenderPreference.ANY]
    
    if food_facility:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("food_facility") == food_facility]
    
    # Amenity filters
    if has_study_room:
        filtered_properties = [p for p in filtered_properties if p.get("has_study_room", False)]
    
    if has_mess:
        filtered_properties = [p for p in filtered_properties if p.get("has_mess", False)]
    
    if has_laundry:
        filtered_properties = [p for p in filtered_properties if p.get("has_laundry", False)]
    
    if has_wifi:
        filtered_properties = [p for p in filtered_properties if p.get("has_wifi", False)]
    
    # Sort by distance
    filtered_properties.sort(key=lambda x: x["distance_km"])
    
    # Apply pagination
    start = skip
    end = skip + limit if skip + limit < len(filtered_properties) else len(filtered_properties)
    
    return {
        "total": len(filtered_properties),
        "properties": filtered_properties[start:end],
        "has_more": end < len(filtered_properties)
    }
