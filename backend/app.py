from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from config import settings
# Import routes modules
from routes import properties_improved as properties
from routes import osm_data as osm  # Import the new OSM data router

app = FastAPI(
    title=settings.APP_NAME,
    description="API for finding PGs and flats near specified locations",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.APP_NAME} API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Initialize routers
app.include_router(properties.router, prefix=settings.API_V1_PREFIX)
app.include_router(osm.router, prefix=settings.API_V1_PREFIX)  # Add OSM router

# Startup event
@app.on_event("startup")
async def startup_event():
    # Print startup message
    print("Server started successfully")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    # Close connections (will be implemented later)
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
