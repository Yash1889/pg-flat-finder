"""
Improved Property Routes with comprehensive filtering and detailed responses
"""
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel, Field
import enum
from datetime import datetime
from sqlalchemy.orm import Session
from models.database import get_db

# Enum definitions
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
        "gender": GenderPreference.ANY,
        "food_facility": FoodFacility.KITCHEN,
        "has_wifi": True,
        "has_ac": True,
        "has_parking": True,
        "has_tv": True,
        "has_kitchen": True,
        "has_washing_machine": True,
        "has_gym": False,
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
    price_type: Optional[str] = "monthly"
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    # Student-focused fields
    room_type: Optional[RoomType] = None
    gender: Optional[GenderPreference] = None
    food_facility: Optional[FoodFacility] = None
    college_name: Optional[str] = None
    college_distance_km: Optional[float] = None
    # Amenities
    has_wifi: bool = False
    has_ac: bool = False
    has_parking: bool = False
    has_tv: bool = False
    has_kitchen: bool = False
    has_washing_machine: bool = False
    has_gym: bool = False
    has_study_room: bool = False
    has_mess: bool = False
    has_laundry: bool = False
    has_hot_water: bool = False
    # Contact information
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    # Image
    main_image_url: Optional[str] = None

class PropertyCreate(PropertyBase):
    latitude: float
    longitude: float

class PropertyUpdate(BaseModel):
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

# Utility functions
def enhance_property_details(properties: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Ensures all properties have complete information for display
    """
    enhanced_properties = []
    
    for prop in properties:
        # Create a copy to avoid modifying the original
        enhanced_prop = prop.copy()
        
        # Ensure location information is complete
        if "latitude" not in enhanced_prop or enhanced_prop["latitude"] is None:
            enhanced_prop["latitude"] = 0.0
        if "longitude" not in enhanced_prop or enhanced_prop["longitude"] is None:
            enhanced_prop["longitude"] = 0.0
            
        # Ensure all boolean fields exist with defaults
        boolean_fields = [
            "has_wifi", "has_ac", "has_parking", "has_tv", "has_kitchen", 
            "has_washing_machine", "has_gym", "has_study_room", 
            "has_mess", "has_laundry", "has_hot_water", "is_available"
        ]
        for field in boolean_fields:
            if field not in enhanced_prop or enhanced_prop[field] is None:
                enhanced_prop[field] = False
                
        # Ensure all string fields have values
        string_fields = [
            "title", "description", "address", "city", "state", "zipcode",
            "contact_name", "contact_phone", "contact_email", "main_image_url"
        ]
        for field in string_fields:
            if field not in enhanced_prop or enhanced_prop[field] is None:
                enhanced_prop[field] = ""
                
        # Ensure numeric fields have defaults
        if "price" not in enhanced_prop or enhanced_prop["price"] is None:
            enhanced_prop["price"] = 0
        if "bedrooms" not in enhanced_prop and "room_type" not in enhanced_prop:
            enhanced_prop["bedrooms"] = 1
        if "bathrooms" not in enhanced_prop:
            enhanced_prop["bathrooms"] = 1
            
        # Convert any date fields to string format
        date_fields = ["created_at", "updated_at", "available_from"]
        for field in date_fields:
            if field in enhanced_prop and not isinstance(enhanced_prop[field], str):
                try:
                    enhanced_prop[field] = enhanced_prop[field].isoformat()
                except AttributeError:
                    enhanced_prop[field] = str(enhanced_prop[field])
        
        enhanced_properties.append(enhanced_prop)
    
    return enhanced_properties

# Routes
@router.post("/", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
async def create_property(property_in: PropertyCreate):
    """
    Create a new property listing (mock implementation)
    """
    # For mock implementation, we'll just add the property to our list
    # with a new ID and some default values
    new_property = property_in.dict()
    
    # Set a new ID (one more than the highest existing ID)
    max_id = max([p["id"] for p in MOCK_PROPERTIES]) if MOCK_PROPERTIES else 0
    new_property["id"] = max_id + 1
    
    # Set other fields
    new_property["is_available"] = True
    new_property["is_verified"] = True
    new_property["created_at"] = datetime.now().isoformat()
    new_property["updated_at"] = datetime.now().isoformat()
    new_property["owner_id"] = 1  # Mock user ID
    new_property["average_rating"] = None  # No ratings yet
    
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
    # Amenity filters
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
    
    # Apply all filters in sequence
    if property_type:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("property_type") == property_type]
    
    if min_price is not None:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("price", 0) >= min_price]
    
    if max_price is not None:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("price", float('inf')) <= max_price]
    
    if bedrooms is not None:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("bedrooms") == bedrooms]
        
    if bathrooms is not None:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("bathrooms") == bathrooms]
    
    # Generic location search (checks all location fields)
    if location:
        location_lower = location.lower()
        filtered_properties = [p for p in filtered_properties 
                              if (location_lower in p.get("address", "").lower() or
                                 location_lower in p.get("city", "").lower() or
                                 location_lower in p.get("state", "").lower() or
                                 location_lower in p.get("zipcode", "").lower() or
                                 location_lower in p.get("college_name", "").lower())]
    
    if city:
        city_lower = city.lower()
        filtered_properties = [p for p in filtered_properties 
                              if city_lower in p.get("city", "").lower()]
    
    if state:
        state_lower = state.lower()
        filtered_properties = [p for p in filtered_properties 
                              if state_lower in p.get("state", "").lower()]
    
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
        college_name_lower = college_name.lower()
        filtered_properties = [p for p in filtered_properties 
                              if college_name_lower in p.get("college_name", "").lower()]
    
    if max_college_distance is not None:
        filtered_properties = [p for p in filtered_properties 
                              if p.get("college_distance_km", float('inf')) <= max_college_distance]
    
    # Apply amenity filters
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
    
    # Sort properties by price (lowest first) by default
    filtered_properties = sorted(filtered_properties, key=lambda x: x.get("price", float('inf')))
    
    # Enhance property details for complete information
    enhanced_properties = enhance_property_details(filtered_properties)
    
    # Apply pagination
    start = skip
    end = skip + limit if skip + limit < len(enhanced_properties) else len(enhanced_properties)
    
    # Return enhanced response with filter counts
    return {
        "total": len(MOCK_PROPERTIES),  # Total before filtering
        "filtered_count": len(enhanced_properties),  # Count after filters applied
        "properties": enhanced_properties[start:end],  # Paginated results
        "has_more": end < len(enhanced_properties)  # Pagination info
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
    db: Session = Depends(get_db)
):
    """
    Get properties near a specific location within a radius using PostGIS
    """
    from sqlalchemy import text, func, and_, or_
    from geoalchemy2.functions import ST_DWithin, ST_Distance, ST_SetSRID, ST_MakePoint
    from models.property import Property

    try:
        # Create a point geometry from the provided coordinates
        user_point = func.ST_SetSRID(func.ST_MakePoint(longitude, latitude), 4326)
        
        # Base query to find properties within the radius
        # ST_DWithin uses meters, so we convert radius_km to meters (radius_km * 1000)
        query = db.query(
            Property, 
            func.ST_Distance(
                Property.location, 
                user_point
            ).label('distance_meters')
        ).filter(
            func.ST_DWithin(
                Property.location,
                user_point,
                radius_km * 1000  # Convert km to meters
            )
        )
        
        # Apply filters
        if property_type:
            query = query.filter(Property.property_type == property_type)
            
        if min_price is not None:
            query = query.filter(Property.price >= min_price)
            
        if max_price is not None:
            query = query.filter(Property.price <= max_price)
            
        if room_type:
            query = query.filter(Property.room_type == room_type)
            
        if gender:
            query = query.filter(or_(
                Property.gender == gender,
                Property.gender == GenderPreference.ANY
            ))
            
        if food_facility:
            query = query.filter(Property.food_facility == food_facility)
        
        # Amenity filters
        if has_study_room:
            query = query.filter(Property.has_study_room == True)
        
        if has_mess:
            query = query.filter(Property.has_mess == True)
        
        if has_laundry:
            query = query.filter(Property.has_laundry == True)
        
        if has_wifi:
            query = query.filter(Property.has_wifi == True)
        
        # Order by distance
        query = query.order_by('distance_meters')
        
        # Get total count before pagination
        total_count = query.count()
        
        # Apply pagination
        query = query.offset(skip).limit(limit)
        
        # Execute query
        results = query.all()
        
        # Format the results
        properties = []
        for prop, distance_meters in results:
            property_dict = {
                "id": prop.id,
                "title": prop.title,
                "description": prop.description,
                "property_type": prop.property_type,
                "address": prop.address,
                "city": prop.city,
                "state": prop.state,
                "zipcode": prop.zipcode,
                "latitude": prop.latitude,
                "longitude": prop.longitude,
                "price": prop.price,
                "price_type": prop.price_type,
                "room_type": prop.room_type,
                "gender": prop.gender,
                "food_facility": prop.food_facility,
                "college_name": prop.college_name,
                "college_distance_km": prop.college_distance_km,
                "has_wifi": prop.has_wifi,
                "has_ac": prop.has_ac,
                "has_parking": prop.has_parking,
                "has_tv": prop.has_tv,
                "has_kitchen": prop.has_kitchen,
                "has_washing_machine": prop.has_washing_machine,
                "has_gym": prop.has_gym,
                "has_study_room": prop.has_study_room,
                "has_mess": prop.has_mess,
                "has_laundry": prop.has_laundry,
                "has_hot_water": prop.has_hot_water,
                "contact_name": prop.contact_name,
                "contact_phone": prop.contact_phone,
                "contact_email": prop.contact_email,
                "main_image_url": prop.main_image_url,
                "is_available": prop.is_available,
                "is_verified": prop.is_verified,
                "created_at": prop.created_at.isoformat() if prop.created_at else None,
                "updated_at": prop.updated_at.isoformat() if prop.updated_at else None,
                "owner_id": prop.owner_id,
                "average_rating": prop.average_rating,
                "distance_km": round(distance_meters / 1000, 2)  # Convert meters to km and round to 2 decimal places
            }
            properties.append(property_dict)
        
        return {
            "total": total_count,
            "properties": properties,
            "has_more": total_count > (skip + limit)
        }
    except Exception as e:
        # Fallback to mock data if database query fails
        print(f"Error querying database: {e}")
        
        # For now, return mock data but with proper error handling for production
        from math import radians, cos, sin, asin, sqrt
        
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
        filtered_properties.sort(key=lambda x: x.get("distance_km", float('inf')))
        
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
    for property in MOCK_PROPERTIES:
        if property["id"] == property_id:
            # Enhance the property details
            enhanced_property = enhance_property_details([property])[0]
            return enhanced_property
    
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
            return
    
    # If property not found, raise 404 error
    raise HTTPException(status_code=404, detail="Property not found")

@router.get("/user/my-properties")
async def get_user_properties():
    """
    Get all properties owned by the current user (mock implementation)
    """
    # For demo purposes, we'll return the first property as if it belongs to the current user
    user_properties = [p for p in MOCK_PROPERTIES if p["owner_id"] == 1]
    
    # Enhance property details
    enhanced_properties = enhance_property_details(user_properties)
    
    return {
        "total": len(enhanced_properties),
        "properties": enhanced_properties,
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
    db = Depends(get_db)
):
    """
    Get properties near a specific location within a radius using PostGIS
    """
    from sqlalchemy import text, func, and_, or_
    from geoalchemy2.functions import ST_DWithin, ST_Distance, ST_SetSRID, ST_MakePoint
    from models.property import Property

    try:
        # Create a point geometry from the provided coordinates
        user_point = func.ST_SetSRID(func.ST_MakePoint(longitude, latitude), 4326)
        
        # Base query to find properties within the radius
        # ST_DWithin uses meters, so we convert radius_km to meters (radius_km * 1000)
        query = db.query(
            Property, 
            func.ST_Distance(
                Property.location, 
                user_point
            ).label('distance_meters')
        ).filter(
            func.ST_DWithin(
                Property.location,
                user_point,
                radius_km * 1000  # Convert km to meters
            )
        )
        
        # Apply filters
        if property_type:
            query = query.filter(Property.property_type == property_type)
            
        if min_price is not None:
            query = query.filter(Property.price >= min_price)
            
        if max_price is not None:
            query = query.filter(Property.price <= max_price)
            
        if room_type:
            query = query.filter(Property.room_type == room_type)
            
        if gender:
            query = query.filter(or_(
                Property.gender == gender,
                Property.gender == GenderPreference.ANY
            ))
            
        if food_facility:
            query = query.filter(Property.food_facility == food_facility)
        
        # Amenity filters
        if has_study_room:
            query = query.filter(Property.has_study_room == True)
        
        if has_mess:
            query = query.filter(Property.has_mess == True)
        
        if has_laundry:
            query = query.filter(Property.has_laundry == True)
        
        if has_wifi:
            query = query.filter(Property.has_wifi == True)
        
        # Order by distance
        query = query.order_by('distance_meters')
        
        # Get total count before pagination
        total_count = query.count()
        
        # Apply pagination
        query = query.offset(skip).limit(limit)
        
        # Execute query
        results = query.all()
        
        # Format the results
        properties = []
        for prop, distance_meters in results:
            property_dict = {
                "id": prop.id,
                "title": prop.title,
                "description": prop.description,
                "property_type": prop.property_type,
                "address": prop.address,
                "city": prop.city,
                "state": prop.state,
                "zipcode": prop.zipcode,
                "latitude": prop.latitude,
                "longitude": prop.longitude,
                "price": prop.price,
                "price_type": prop.price_type,
                "room_type": prop.room_type,
                "gender": prop.gender,
                "food_facility": prop.food_facility,
                "college_name": prop.college_name,
                "college_distance_km": prop.college_distance_km,
                "has_wifi": prop.has_wifi,
                "has_ac": prop.has_ac,
                "has_parking": prop.has_parking,
                "has_tv": prop.has_tv,
                "has_kitchen": prop.has_kitchen,
                "has_washing_machine": prop.has_washing_machine,
                "has_gym": prop.has_gym,
                "has_study_room": prop.has_study_room,
                "has_mess": prop.has_mess,
                "has_laundry": prop.has_laundry,
                "has_hot_water": prop.has_hot_water,
                "contact_name": prop.contact_name,
                "contact_phone": prop.contact_phone,
                "contact_email": prop.contact_email,
                "main_image_url": prop.main_image_url,
                "is_available": prop.is_available,
                "is_verified": prop.is_verified,
                "created_at": prop.created_at.isoformat() if prop.created_at else None,
                "updated_at": prop.updated_at.isoformat() if prop.updated_at else None,
                "owner_id": prop.owner_id,
                "average_rating": prop.average_rating,
                "distance_km": round(distance_meters / 1000, 2)  # Convert meters to km and round to 2 decimal places
            }
            properties.append(property_dict)
        
        return {
            "total": total_count,
            "properties": properties,
            "has_more": total_count > (skip + limit)
        }
    except Exception as e:
        # Fallback to mock data if database query fails
        print(f"Error querying database: {e}")
        
        # For now, return mock data but with proper error handling for production
        from math import radians, cos, sin, asin, sqrt
        
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
        filtered_properties.sort(key=lambda x: x.get("distance_km", float('inf')))
        
        # Apply pagination
        start = skip
        end = skip + limit if skip + limit < len(filtered_properties) else len(filtered_properties)
        
        return {
            "total": len(filtered_properties),
            "properties": filtered_properties[start:end],
            "has_more": end < len(filtered_properties)
        }
