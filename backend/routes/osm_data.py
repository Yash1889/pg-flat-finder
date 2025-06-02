"""
Real-data API endpoint using OpenStreetMap for PG/Flat Finder
"""
from fastapi import APIRouter, Query, HTTPException
import requests
import logging
from typing import List, Optional, Dict, Any
import time

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/osm",
    tags=["osm"],
    responses={404: {"description": "Not found"}},
)

@router.get("/search")
async def search_accommodation(
    query: str = Query(..., description="Location to search around"),
    radius_km: float = Query(2.0, description="Search radius in kilometers"),
    accommodation_types: Optional[List[str]] = Query(
        ["hostel", "dormitory", "apartments", "hotel", "guest_house"],
        description="Types of accommodation to search for"
    )
):
    """
    Search for real accommodation data around a location using OpenStreetMap.
    
    This endpoint uses:
    1. Nominatim API to convert location text to coordinates
    2. Overpass API to find accommodations near those coordinates
    """
    try:
        # Custom user agent as required by OSM API usage policy
        headers = {"User-Agent": "PG-Flat-Finder/1.0"}
        
        # Step 1: Get coordinates from location query using Nominatim
        logger.info(f"Geocoding location: {query}")
        geo_response = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={
                "q": query,
                "format": "json",
                "limit": 1,
                "addressdetails": 1
            },
            headers=headers
        )
        
        # Ensure we don't hit rate limits
        time.sleep(1)
        
        if geo_response.status_code != 200:
            logger.error(f"Nominatim API error: {geo_response.status_code}")
            raise HTTPException(status_code=502, detail="Geocoding service unavailable")
            
        geo_data = geo_response.json()
        
        if not geo_data:
            return {
                "success": False,
                "message": f"Location '{query}' not found",
                "results": []
            }
            
        # Extract location data
        location = geo_data[0]
        lat = float(location["lat"])
        lon = float(location["lon"])
        display_name = location["display_name"]
        address = location.get("address", {})
        
        # Calculate radius in meters
        radius = int(radius_km * 1000)
        
        # Step 2: Build Overpass query for accommodations
        # Create a search for each accommodation type
        query_parts = []
        
        # Map our accommodation types to OSM tags
        tag_mapping = {
            "hostel": ["tourism=hostel"],
            "dormitory": ["amenity=dormitory", "building=dormitory"],
            "apartments": ["building=apartments"],
            "flat": ["building=residential", "residential=apartment"],
            "pg": ["leisure=lodging", "amenity=lodging", "tourism=guest_house"],
            "hotel": ["tourism=hotel"],
            "guest_house": ["tourism=guest_house"]
        }
        
        # Build query parts for each selected accommodation type
        for acc_type in accommodation_types:
            if acc_type in tag_mapping:
                for tag in tag_mapping[acc_type]:
                    key, value = tag.split("=")
                    query_parts.append(f'node["{key}"="{value}"](around:{radius},{lat},{lon});')
                    query_parts.append(f'way["{key}"="{value}"](around:{radius},{lat},{lon});')
                    query_parts.append(f'relation["{key}"="{value}"](around:{radius},{lat},{lon});')
        
        # Combine all query parts
        overpass_query = f"""
        [out:json][timeout:25];
        (
            {' '.join(query_parts)}
        );
        out body;
        out center;
        """
        
        logger.info(f"Querying Overpass API around coordinates: {lat}, {lon}")
        
        # Step 3: Query Overpass API for accommodations
        overpass_response = requests.post(
            "https://overpass-api.de/api/interpreter",
            data={"data": overpass_query}
        )
        
        if overpass_response.status_code != 200:
            logger.error(f"Overpass API error: {overpass_response.status_code}")
            raise HTTPException(status_code=502, detail="Accommodation search service unavailable")
            
        overpass_data = overpass_response.json()
        
        # Step 4: Process and enrich the results
        results = []
        for element in overpass_data.get("elements", []):
            element_type = element.get("type")
            tags = element.get("tags", {})
            
            # Get coordinates based on element type
            if element_type == "node":
                element_lat = element.get("lat")
                element_lon = element.get("lon")
            else:
                # For ways and relations, use the center point
                center = element.get("center", {})
                element_lat = center.get("lat")
                element_lon = center.get("lon")
                
            # Skip elements without coordinates
            if not element_lat or not element_lon:
                continue
                
            # Determine accommodation type
            acc_type = None
            if tags.get("tourism") in ["hostel", "hotel", "guest_house"]:
                acc_type = tags.get("tourism")
            elif tags.get("amenity") in ["dormitory", "lodging"]:
                acc_type = tags.get("amenity")
            elif tags.get("building") in ["apartments", "dormitory", "residential"]:
                acc_type = tags.get("building")
            elif tags.get("residential") == "apartment":
                acc_type = "flat"
            else:
                acc_type = "accommodation"
                
            # Create result object with all available details
            result = {
                "id": element.get("id"),
                "name": tags.get("name", f"Unnamed {acc_type.title()}"),
                "type": acc_type,
                "latitude": element_lat,
                "longitude": element_lon,
                "address": {
                    "street": tags.get("addr:street"),
                    "housenumber": tags.get("addr:housenumber"),
                    "city": tags.get("addr:city"),
                    "state": tags.get("addr:state"),
                    "postcode": tags.get("addr:postcode"),
                    "country": tags.get("addr:country")
                },
                "contact": {
                    "phone": tags.get("phone"),
                    "website": tags.get("website"),
                    "email": tags.get("email")
                },
                "amenities": {
                    "internet": tags.get("internet") == "yes" or tags.get("wifi") == "yes",
                    "wheelchair": tags.get("wheelchair") == "yes",
                    "parking": tags.get("parking") == "yes"
                },
                "details": {
                    "rooms": tags.get("rooms"),
                    "stars": tags.get("stars"),
                    "description": tags.get("description")
                },
                "original_tags": tags  # Include all original tags for reference
            }
            
            results.append(result)
            
        # Step 5: Return the results
        return {
            "success": True,
            "location": {
                "display_name": display_name,
                "latitude": lat,
                "longitude": lon,
                "address": address
            },
            "search_radius_km": radius_km,
            "total_results": len(results),
            "results": results
        }
        
    except Exception as e:
        logger.error(f"Error in search_accommodation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
