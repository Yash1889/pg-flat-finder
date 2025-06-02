# PG/Flat Finder 🏠

A full-stack web application that helps users find PGs, hostels, apartments, and other accommodations near any desired location using real-time OpenStreetMap data.

![PG/Flat Finder Screenshot](https://i.ibb.co/QDS7LmM/pg-flat-finder.png)

## 🌟 Features

- **Location-Based Search**: Find accommodations near any city, neighborhood, or landmark worldwide
- **Interactive Map**: View results on an interactive map with custom markers for different property types
- **Real-Time OpenStreetMap Data**: Uses real property data from OpenStreetMap, not hardcoded or mock data
- **Customizable Search**: Adjust search radius and filter by accommodation types
- **Responsive Design**: Works on desktop and mobile devices
- **Detailed Information**: View available property details, including contact information and amenities

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **APIs**: OpenStreetMap (Nominatim for geocoding, Overpass for accommodation data)
- **Database**: PostgreSQL with PostGIS extension (for future data storage)

### Frontend
- **Framework**: React.js
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **Map**: Leaflet.js with custom markers
- **API Client**: Axios

## 📋 Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- PostgreSQL with PostGIS (optional for future database features)

## 🚀 Installation and Setup

### Clone the Repository

```bash
git clone https://github.com/your-username/pg-flat-finder.git
cd pg-flat-finder
```

### Backend Setup

1. Create and activate a virtual environment:

```bash
cd backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

2. Install the required packages:

```bash
pip install -r requirements.txt
```

3. Set up environment variables (create a `.env` file in the backend directory):

```
DATABASE_URL=postgresql://user:password@localhost:5432/pgflatfinder
API_KEY=your_api_key_if_needed
```

4. Start the backend server:

```bash
uvicorn app:app --reload --port 8000
```

### Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. The application will be available at `http://localhost:5173`

## 🔍 How to Use

1. **Enter a Location**: Type any location name (city, neighborhood, landmark)
   - Examples: "Delhi", "Mumbai", "Koramangala Bangalore"

2. **Adjust Search Radius**: Use the slider to set how far from the location to search (0.5-10km)
   - For dense urban areas, a smaller radius (1-2km) works well
   - For suburban areas, try 3-5km

3. **Select Accommodation Types**: Check/uncheck the types of accommodations you want to find
   - For PGs specifically, select "Guest House" and "PG" options
   - For student housing, include "Dormitory" and "Hostel"

4. **Click Search**: The application will display results on both the map and in the list

## 📁 Project Structure

```
pg-flat-finder/
├── backend/
│   ├── app.py                  # Main FastAPI application
│   ├── config.py               # Configuration and environment variables
│   ├── routes/                 # API routes
│   │   ├── properties_improved.py  # Property endpoints with PostGIS
│   │   └── osm_data.py         # OpenStreetMap data endpoints
│   └── requirements.txt        # Python dependencies
│
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── RealDataSearch.jsx  # Main search component
│   │   │   ├── Layout.jsx      # Application layout
│   │   │   ├── HomePage.jsx    # Home page
│   │   │   └── AboutPage.jsx   # About page
│   │   ├── styles/             # CSS styles
│   │   └── main.jsx            # Application entry point
│   ├── index.html              # HTML template
│   └── package.json            # npm dependencies and scripts
│
└── README.md                   # Project documentation
```

## 🌐 API Endpoints

### OpenStreetMap Data API

- **GET /api/v1/osm/search**
  - Search for accommodations near a location
  - Query Parameters:
    - `query` (required): Location to search for
    - `radius_km` (optional): Search radius in kilometers (default: 2.0)
    - `accommodation_types` (optional): Types of accommodations to search for (default: hostel, dormitory, apartments, hotel, guest_house)
  - Response: JSON with location info and accommodation results

### Property API (Future Implementation)

- **GET /api/v1/properties/nearby**
  - Search for properties in the database near coordinates
  - Uses PostGIS spatial queries for accurate location-based search
  - Currently returns empty results until database is populated

## 📱 Responsive Design

The application is designed to work on:
- Desktop computers
- Tablets
- Mobile phones

The UI will automatically adjust based on the screen size.

## 🔧 Development Notes

### Adding New Features

To add new features to the PG/Flat Finder:

1. **Backend**: Add new endpoints in `/backend/routes/` directory
2. **Frontend**: Create new components in `/frontend/src/components/` directory
3. **Routing**: Update the router configuration in `main.jsx`

### Future Enhancements

- User authentication and saved searches
- Property reviews and ratings
- Direct messaging with property owners
- Advanced filtering (price, amenities, etc.)
- Image galleries for properties

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- Yashraj Gupta

## 🙏 Acknowledgments

- [OpenStreetMap](https://www.openstreetmap.org/) for providing the map and property data
- [Leaflet](https://leafletjs.com/) for the interactive mapping library
- [React](https://reactjs.org/) for the frontend framework
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
