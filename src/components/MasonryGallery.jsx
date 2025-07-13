import { useState, useEffect, useRef, useCallback } from 'react';

const mockImages = Array.from({ length: 30 }, (_, i) => ({
  src: `https://picsum.photos/1000/750?random=${i + 1}`
}));
const imageUrls = mockImages.map((image) => image.src);

const MasonryGallery = () => {
  const [columns, setColumns] = useState(3);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const galleryRef = useRef(null);
  const loadingRef = useRef(null);
  const topLoadingRef = useRef(null);

  // Calculate number of columns based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumns(1);
      } else if (width < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load more items
  const loadItems = useCallback((direction = 'down') => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newItems = [];
      const itemsPerLoad = 6;
      
      for (let i = 0; i < itemsPerLoad; i++) {
        const randomIndex = Math.floor(Math.random() * imageUrls.length);
        const height = 200 + Math.floor(Math.random() * 300); // Random height between 200-500px
        newItems.push({
          id: direction === 'down' 
            ? Date.now() + i 
            : -Date.now() - i, // Negative IDs for items loaded upwards
          src: imageUrls[randomIndex],
          height
        });
      }
      
      setItems(prev => direction === 'down' 
        ? [...prev, ...newItems] 
        : [...newItems, ...prev]);
      setPage(prev => direction === 'down' ? prev + 1 : prev - 1);
      setLoading(false);
    }, 10);
  }, []);

  // Initial load
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading) {
          loadItems('down');
        }
      },
      { threshold: 0.1 }
    );

    const topObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading) {
          loadItems('up');
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) observer.observe(loadingRef.current);
    if (topLoadingRef.current) topObserver.observe(topLoadingRef.current);

    return () => {
      if (loadingRef.current) observer.unobserve(loadingRef.current);
      if (topLoadingRef.current) topObserver.unobserve(topLoadingRef.current);
    };
  }, [loading, loadItems]);

  // Split items into columns for masonry layout
  const getColumnItems = () => {
    const columnItems = Array.from({ length: columns }, () => []);
    
    items.forEach((item, index) => {
      const columnIndex = index % columns;
      columnItems[columnIndex].push(item);
    });
    
    return columnItems;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Masonry Gallery</h1>
      <p className="text-center mb-8">Page: {page}</p>
      
      {/* Top loading indicator */}
      <div ref={topLoadingRef} className="text-center py-4">
        {loading && <p>Loading more items above...</p>}
      </div>

      {/* Masonry grid */}
      <div 
        ref={galleryRef}
        className="grid gap-4" 
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {getColumnItems().map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4">
            {column.map((item) => (
              <div 
                key={item.id} 
                className="overflow-hidden shadow-lg"
                style={{ height: `${item.height}px` }}
              >
                <img
                  src={item.src}
                  alt="Random"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom loading indicator */}
      <div ref={loadingRef} className="text-center py-4">
        {loading && <p>Loading more items...</p>}
      </div>
    </div>
  );
};

export default MasonryGallery;