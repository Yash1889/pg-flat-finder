from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from geoalchemy2.functions import ST_DWithin, ST_Distance, ST_Point
from pydantic import BaseModel

from models.database import get_db
from models.property import Property, PropertyType, RoomType, GenderPreference, FoodFacility
from routes.properties import PropertyResponse

router = APIRouter(
    prefix="/search",
    tags=["search"],
    responses={404: {"description": "Not found"}},
)

# Schemas
class LocationSearchResponse(PropertyResponse):
    distance_km: float = None

# Routes
@router.get("/nearby", response_model=List[LocationSearchResponse])
async def search_nearby_properties(
    latitude: float,
    longitude: float,
    radius_km: float = 5.0,
    property_type: Optional[PropertyType] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bedrooms: Optional[int] = None,
    # Student-focused filters
    room_type: Optional[RoomType] = None,
    gender: Optional[GenderPreference] = None,
    food_facility: Optional[FoodFacility] = None,
    max_college_distance: Optional[float] = None,
    has_study_room: Optional[bool] = None,
    has_mess: Optional[bool] = None,
    has_laundry: Optional[bool] = None,
    has_hot_water: Optional[bool] = None,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Search for properties within a specified radius of a location
    """
    # Convert radius to meters
    radius_meters = radius_km * 1000
    
    # Create a point from the provided coordinates
    point = func.ST_SetSRID(func.ST_MakePoint(longitude, latitude), 4326)
    
    # Build query with proximity search
    query = (
        db.query(
            Property,
            func.ST_Distance(Property.location, point).label("distance_meters")
        )
        .filter(
            func.ST_DWithin(
                Property.location,
                point,
                radius_meters
            )
        )
        .filter(Property.is_available == True)
    )
    
    # Apply basic filters
    if property_type:
        query = query.filter(Property.property_type == property_type)
    
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Property.price <= max_price)
    
    if bedrooms is not None:
        query = query.filter(Property.bedrooms >= bedrooms)
        
    # Apply student-focused filters
    if room_type:
        query = query.filter(Property.room_type == room_type)
    
    if gender:
        query = query.filter(Property.gender == gender)
    
    if food_facility:
        query = query.filter(Property.food_facility == food_facility)
    
    if max_college_distance is not None:
        query = query.filter(Property.college_distance_km <= max_college_distance)
    
    # Filter by student-focused amenities
    if has_study_room is not None:
        query = query.filter(Property.has_study_room == has_study_room)
    
    if has_mess is not None:
        query = query.filter(Property.has_mess == has_mess)
    
    if has_laundry is not None:
        query = query.filter(Property.has_laundry == has_laundry)
    
    if has_hot_water is not None:
        query = query.filter(Property.has_hot_water == has_hot_water)
    
    # Order by distance (closest first)
    query = query.order_by("distance_meters")
    
    # Limit results
    query = query.limit(limit)
    
    # Execute query
    results = query.all()
    
    # Process results
    response = []
    for property_obj, distance_meters in results:
        # Convert property to dict
        property_dict = {
            **{c.name: getattr(property_obj, c.name) for c in property_obj.__table__.columns},
            "latitude": property_obj.latitude,
            "longitude": property_obj.longitude,
            "average_rating": property_obj.average_rating,
            "distance_km": distance_meters / 1000  # Convert meters to kilometers
        }
        response.append(property_dict)
    
    return response

@router.get("/by-address", response_model=List[LocationSearchResponse])
async def search_properties_by_address(
    address: str,
    city: Optional[str] = None,
    radius_km: float = 5.0,
    property_type: Optional[PropertyType] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bedrooms: Optional[int] = None,
    # Student-focused filters
    room_type: Optional[RoomType] = None,
    gender: Optional[GenderPreference] = None,
    food_facility: Optional[FoodFacility] = None,
    max_college_distance: Optional[float] = None,
    has_study_room: Optional[bool] = None,
    has_mess: Optional[bool] = None,
    has_laundry: Optional[bool] = None,
    has_hot_water: Optional[bool] = None,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Search for properties by address or city
    Note: This endpoint requires geocoding the address first,
    which will be implemented in the service layer using the geocoding API
    """
    # Build base query
    query = db.query(Property)
    
    # Apply basic filters
    if property_type:
        query = query.filter(Property.property_type == property_type)
    
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Property.price <= max_price)
    
    if bedrooms is not None:
        query = query.filter(Property.bedrooms >= bedrooms)
        
    # Apply student-focused filters
    if room_type:
        query = query.filter(Property.room_type == room_type)
    
    if gender:
        query = query.filter(Property.gender == gender)
    
    if food_facility:
        query = query.filter(Property.food_facility == food_facility)
    
    if max_college_distance is not None:
        query = query.filter(Property.college_distance_km <= max_college_distance)
    
    # Filter by student-focused amenities
    if has_study_room is not None:
        query = query.filter(Property.has_study_room == has_study_room)
    
    if has_mess is not None:
        query = query.filter(Property.has_mess == has_mess)
    
    if has_laundry is not None:
        query = query.filter(Property.has_laundry == has_laundry)
    
    if has_hot_water is not None:
        query = query.filter(Property.has_hot_water == has_hot_water)
    
    # Filter by address or city
    if city:
        query = query.filter(Property.city.ilike(f"%{city}%"))
    
    if address:
        query = query.filter(
            Property.address.ilike(f"%{address}%") | 
            Property.city.ilike(f"%{address}%") |
            Property.state.ilike(f"%{address}%") |
            Property.zipcode.ilike(f"%{address}%")
        )
    
    # Ensure only available properties
    query = query.filter(Property.is_available == True)
    
    # Limit results
    query = query.limit(limit)
    
    # Execute query
    properties = query.all()
    
    # Process results
    response = []
    for property_obj in properties:
        # Convert property to dict
        property_dict = {
            **{c.name: getattr(property_obj, c.name) for c in property_obj.__table__.columns},
            "latitude": property_obj.latitude,
            "longitude": property_obj.longitude,
            "average_rating": property_obj.average_rating,
            "distance_km": None  # No distance calculation for address search
        }
        response.append(property_dict)
    
    return response
