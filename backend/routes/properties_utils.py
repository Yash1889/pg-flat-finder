"""
Utility functions for property data handling
"""
from typing import Dict, List, Any

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
                
        enhanced_properties.append(enhanced_prop)
    
    return enhanced_properties
