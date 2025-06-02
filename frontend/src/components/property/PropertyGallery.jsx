import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PropertyGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullGallery, setShowFullGallery] = useState(false);

  // Default image if none provided
  const defaultImage = 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';

  // Ensure we have at least one image
  const galleryImages = images && images.length > 0 
    ? images 
    : [defaultImage];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  const toggleFullGallery = () => {
    setShowFullGallery(!showFullGallery);
  };

  return (
    <div className="relative">
      {/* Main Image Carousel */}
      <div className="relative overflow-hidden rounded-lg aspect-video bg-gray-200">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentIndex}
            src={galleryImages[currentIndex]}
            alt={`Property image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button 
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          onClick={goToNext}
          aria-label="Next image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Image counter */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 text-sm rounded">
          {currentIndex + 1} / {galleryImages.length}
        </div>

        {/* View all button (only if more than 1 image) */}
        {galleryImages.length > 1 && (
          <button 
            className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 text-sm rounded flex items-center gap-2 hover:bg-opacity-70 transition-all"
            onClick={toggleFullGallery}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            View All Photos
          </button>
        )}
      </div>

      {/* Thumbnail Strip */}
      {galleryImages.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden transition-all ${
                index === currentIndex ? 'ring-2 ring-primary-600' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img 
                src={image} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Full Gallery Modal */}
      {showFullGallery && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
          {/* Modal header */}
          <div className="p-4 flex justify-between items-center">
            <span className="text-white">
              {currentIndex + 1} / {galleryImages.length}
            </span>
            <button 
              className="text-white hover:text-gray-300"
              onClick={toggleFullGallery}
              aria-label="Close gallery"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main image */}
          <div className="flex-grow flex items-center justify-center p-4">
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={currentIndex}
                src={galleryImages[currentIndex]}
                alt={`Property image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>

          {/* Navigation controls */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <button 
              className="bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30 transition-all"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <button 
              className="bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30 transition-all"
              onClick={goToNext}
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Thumbnails */}
          <div className="p-4">
            <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden transition-all ${
                    index === currentIndex ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
