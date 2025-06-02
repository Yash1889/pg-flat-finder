from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
import enum

from models.database import Base

class PropertyType(str, enum.Enum):
    PG = "pg"
    HOSTEL = "hostel"
    FLAT = "flat"
    ROOM = "room"
    APARTMENT = "apartment"  # Changed order to prioritize student accommodations

# Room type options for PGs/hostels
class RoomType(str, enum.Enum):
    SINGLE = "single"
    DOUBLE = "double"
    TRIPLE = "triple"
    DORMITORY = "dormitory"

# Gender preferences for PGs/hostels
class GenderPreference(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    COED = "coed"

# Food facility types
class FoodFacility(str, enum.Enum):
    MESS = "mess"
    MEALS_PLAN = "mealsPlan"
    KITCHEN = "kitchen"

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    property_type = Column(Enum(PropertyType), nullable=False)
    address = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100))
    zipcode = Column(String(20))
    
    # Location coordinates stored as PostGIS POINT geometry
    location = Column(Geometry("POINT", srid=4326), nullable=False)
    
    # Property details
    price = Column(Float, nullable=False)
    price_type = Column(String(20), default="monthly")  # monthly, yearly, etc.
    area_sqft = Column(Float)
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    furnishing = Column(String(50))  # fully_furnished, semi_furnished, unfurnished
    
    # Student-focused details
    room_type = Column(Enum(RoomType), nullable=True)  # For PGs and hostels
    gender = Column(Enum(GenderPreference), nullable=True)  # Male/female/coed
    food_facility = Column(Enum(FoodFacility), nullable=True)  # mess, meals plan, kitchen
    college_name = Column(String(255), nullable=True)  # Name of nearby college/university
    college_distance_km = Column(Float, nullable=True)  # Distance to nearby college in km
    
    # Amenities
    has_wifi = Column(Boolean, default=False)
    has_ac = Column(Boolean, default=False)
    has_parking = Column(Boolean, default=False)
    has_tv = Column(Boolean, default=False)
    has_kitchen = Column(Boolean, default=False)
    has_washing_machine = Column(Boolean, default=False)
    has_gym = Column(Boolean, default=False)
    # Student-focused amenities
    has_study_room = Column(Boolean, default=False)
    has_mess = Column(Boolean, default=False)
    has_laundry = Column(Boolean, default=False)
    has_hot_water = Column(Boolean, default=False)
    
    # Contact information
    contact_name = Column(String(100))
    contact_phone = Column(String(20))
    contact_email = Column(String(100))
    
    # Media
    main_image_url = Column(String(255))
    
    # Owner information
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    # Status
    is_available = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="properties")
    reviews = relationship("Review", back_populates="property", cascade="all, delete-orphan")
    
    @property
    def average_rating(self):
        """Calculate average rating from reviews"""
        if not self.reviews:
            return None
        return sum(review.rating for review in self.reviews) / len(self.reviews)
    
    @property
    def longitude(self):
        """Get longitude from location point"""
        if self.location:
            # Extract longitude from WKB format
            point = self.location.data
            return point.x
        return None

    @property
    def latitude(self):
        """Get latitude from location point"""
        if self.location:
            # Extract latitude from WKB format
            point = self.location.data
            return point.y
        return None
