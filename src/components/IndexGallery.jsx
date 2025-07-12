import { useState, useEffect, useRef, useCallback } from 'react';
import Images from "../data/images.json";
import { gallerySettings as defaultSettings } from '../data/GalleryConfig.js';

const DraggableGallery = () => {

  // Mocks image data for development purposes.
  const mockImages = Array.from({ length: 30 }, (_, i) => ({
    src: `https://picsum.photos/1000/750?random=${i + 1}`
  }));

  const imageUrls = mockImages.map((image) => image.src);
  // const imageUrls = Images.map((image) => image.src); 
  const imageProjectTypes = Images.map((image) => image.projectType);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItemData, setActiveItemData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [projectTitle, setProjectTitle] = useState('');
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [settings, setSettings] = useState(defaultSettings);

  // Recalculate settings on window resize for responsiveness.
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 768) { // Mobile breakpoint
        setSettings(prev => ({ ...prev, columns: 1, itemGap: 30, baseWidth: screenWidth - 60 }));
      } else if (screenWidth < 1024) { // Tablet breakpoint
        setSettings(prev => ({ ...prev, columns: 2, itemGap: 45, baseWidth: (screenWidth / 2) - 90 }));
      } else { // Desktop
        setSettings(prev => ({ ...prev, ...defaultSettings }));
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Refs for direct DOM access and for storing values that don't trigger re-renders.
  const canvasRef = useRef(null); // Ref for the element that contains all gallery items.
  const containerRef = useRef(null); // Ref for the main gallery container.
  const animationRef = useRef(null); // Ref to store the requestAnimationFrame ID.
  const positionRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 }); // Ref for the gallery's position and target position.
  const dragRef = useRef({ // Ref to store dragging state.
    isDragging: false,
    startX: 0,
    startY: 0,
    velocityX: 0,
    velocityY: 0,
    lastTime: 0,
    mouseHasMoved: false
  });
  const currentVisibleItemIds = useRef(new Set()); // A Set to track IDs of items currently in the DOM.
  const expandedItemRef = useRef(null); // Ref for the DOM element of the expanded item.
  const originalClickedItemRect = useRef(null); // Ref to store the bounding box of an item before it expands.

  // Grid layout settings.
  const { columns } = settings;
  const itemSizes = [
    // { width: settings.baseWidth, height: settings.smallHeight },
    { width: settings.baseWidth, height: settings.largeHeight }
  ];
  const cellWidth = settings.baseWidth + settings.itemGap;
  const cellHeight = Math.max(settings.smallHeight, settings.largeHeight) + settings.itemGap;

  /**
   * Generates a unique ID for a gallery item based on its column and row.
   * @param {number} col - The column index.
   * @param {number} row - The row index.
   * @returns {string} The unique item ID.
   */
  const getItemId = (col, row) => `${col},${row}`;

  /**
   * Determines the size of an item based on its row and column.
   * @param {number} row - The row index.
   * @param {number} col - The column index.
   * @returns {{width: number, height: number}} The size of the item.
   */
  const getItemSize = (row, col) => {
    const hash = ((row * columns + col) % itemSizes.length + itemSizes.length) % itemSizes.length;
    return itemSizes[hash];
  };

//   const getItemSize = () => {
//   return { width: 450, height: 500 }; // fixed size for all items
// };

  /**
   * Gets the content (image, title, etc.) for an item based on its row and column.
   * @param {number} row - The row index.
   * @param {number} col - The column index.
   * @returns {{title: string, image: string, number: number}} The content for the item.
   */
  const getItemContent = (row, col) => {
    const itemNum = ((row * columns + col) % imageUrls.length + imageUrls.length) % imageUrls.length;
    return {
      title: imageProjectTypes[itemNum % imageProjectTypes.length],
      image: imageUrls[itemNum % imageUrls.length],
      number: itemNum + 1
    };
  };

  /**
   * Calculates the top-left position of an item in the grid.
   * @param {number} col - The column index.
   * @param {number} row - The row index.
   * @returns {{x: number, y: number}} The position of the item.
   */
  const getItemPosition = (col, row) => ({
    x: col * cellWidth,
    y: row * cellHeight
  });

  /**
   * This is the core virtualization function. It calculates which items should be visible
   * in the viewport and creates/updates/removes DOM elements accordingly.
   */
  const updateVisibleItems = useCallback(() => {
    const buffer = settings.bufferZone;
    const viewWidth = window.innerWidth * (1 + buffer);
    const viewHeight = window.innerHeight * (1 + buffer);

    const { x: currentX, y: currentY } = positionRef.current;

    // Calculate the range of visible columns and rows.
    const startCol = Math.floor((-currentX - viewWidth / 2) / cellWidth);
    const endCol = Math.ceil((-currentX + viewWidth / 2) / cellWidth);
    const startRow = Math.floor((-currentY - viewHeight / 2) / cellHeight);
    const endRow = Math.ceil((-currentY + viewHeight / 2) / cellHeight);

    const nextVisibleItemIds = new Set();
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Loop through the visible grid cells.
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const itemId = getItemId(col, row);
        nextVisibleItemIds.add(itemId);

        let itemElement = document.getElementById(itemId);

        const itemData = {
          id: itemId,
          col,
          row,
          size: getItemSize(row, col),
          position: getItemPosition(col, row),
          content: getItemContent(row, col)
        };

        // If the item element doesn't exist, create it.
        if (!itemElement) {
          itemElement = document.createElement('div');
          itemElement.id = itemId;
          itemElement.className = 'absolute bg-black cursor-pointer overflow-hidden transition-opacity duration-300 z-101 gallery-item';
          
          // Items are only clickable when not in an expanded state.
          if (!isExpanded) {
            itemElement.onclick = () => handleItemClick(itemData);
            itemElement.style.pointerEvents = 'auto';
          } else {
            itemElement.onclick = null;
            itemElement.style.pointerEvents = 'none';
          }

          const itemSize = itemData.size;
          const position = itemData.position;
          const content = itemData.content;

          // Set the style and content of the new item.
          itemElement.style.width = `${itemSize.width}px`;
          itemElement.style.height = `${itemSize.height}px`;
          itemElement.style.left = `${position.x}px`;
          itemElement.style.top = `${position.y}px`;
          itemElement.style.borderRadius = `${settings.borderRadius}px`;
          itemElement.style.opacity = isExpanded && activeItemData?.id !== itemId ? 0 : 1;

          itemElement.innerHTML = `
            <div class="group w-full h-full overflow-hidden relative">
              <img
                src="${content.image}"
                alt="Image ${content.number}"
                class="w-full h-full grayscale group-hover:grayscale-70 transition duration-500 group-hover:scale-105  object-cover pointer-events-none transition-transform duration-300"
                style="box-shadow: inset 0 0 ${settings.vignetteSize}px rgba(0, 0, 0, 0.5);"
              />
              <div class="opacity-0 group-hover:opacity-100 absolute bg-gray-900/50 transition-opacity duration-300  bottom-0 left-0 w-full p-4 z-10">
                <div class="text-white text-xs font-medium uppercase tracking-tight overflow-hidden h-4">
                  ${content.title}
                </div>
                <div class="text-gray-400 text-xs font-mono overflow-hidden h-3.5">
                  #${content.number.toString().padStart(3, '0')}
                </div>
              </div>
            </div>
          `;
          canvas.appendChild(itemElement);
        } else {
          // If the item already exists, update its properties.
          const opacity = isExpanded && activeItemData?.id !== itemId ? 0 : 1;
          if (parseFloat(itemElement.style.opacity) !== opacity) {
              itemElement.style.opacity = opacity;
              itemElement.style.transition = `opacity ${settings.overlayEaseDuration}s ease-in-out`;
          }
          itemElement.style.borderRadius = `${settings.borderRadius}px`;
          const img = itemElement.querySelector('img');
          if (img) {
              img.style.transform = `scale(${settings.hoverScale})`;
              img.style.boxShadow = `inset 0 0 ${settings.vignetteSize}px rgba(0, 0, 0, 0.5)`;
          }

          // Update click handlers based on the expanded state.
          if (!isExpanded) {
            itemElement.onclick = () => handleItemClick(itemData);
            itemElement.style.pointerEvents = 'auto';
          } else {
            itemElement.onclick = null;
            itemElement.style.pointerEvents = 'none';
          }
        }
      }
    }

    // Remove items that are no longer visible.
    currentVisibleItemIds.current.forEach(itemId => {
      if (!nextVisibleItemIds.has(itemId)) {
        const itemToRemove = document.getElementById(itemId);
        if (itemToRemove && itemToRemove.parentNode === canvas) {
          canvas.removeChild(itemToRemove);
        }
      }
    });

    currentVisibleItemIds.current = nextVisibleItemIds;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.bufferZone, cellWidth, cellHeight, settings.borderRadius, settings.hoverScale, settings.vignetteSize, isExpanded, activeItemData]);

  /**
   * The main animation loop, powered by requestAnimationFrame.
   * It smoothly interpolates the gallery's position towards its target position.
   */
  const animate = useCallback(() => {
    if (!isExpanded) {
      const ease = settings.dragEase;
      const pos = positionRef.current;

      pos.x += (pos.targetX - pos.x) * ease;
      pos.y += (pos.targetY - pos.y) * ease;

      if (canvasRef.current) {
        canvasRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }

      updateVisibleItems();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isExpanded, settings.dragEase, updateVisibleItems]);

  /**
   * Handles the click event on a gallery item.
   * @param {object} item - The data of the clicked item.
   */
  const handleItemClick = (item) => {
    if (dragRef.current.mouseHasMoved) return; // Prevent click if the mouse was dragged.
    expandItem(item);
  };

  /**
   * Expands a gallery item to the center of the screen.
   * @param {object} item - The data of the item to expand.
   */
  const expandItem = useCallback((item) => {
    setProjectTitle(item.content.title);
    setOverlayOpacity(settings.overlayOpacity);

    // Fade out all other items.
    currentVisibleItemIds.current.forEach(itemId => {
      if (itemId !== item.id) {
        const otherItem = document.getElementById(itemId);
        if (otherItem) {
          otherItem.style.opacity = 0;
          otherItem.style.transition = `opacity ${settings.overlayEaseDuration}s ease-in-out`;
        }
      }
    });

    const clickedElement = document.getElementById(item.id);
    if (clickedElement) {
        originalClickedItemRect.current = clickedElement.getBoundingClientRect();
        clickedElement.style.opacity = 0;
        clickedElement.style.transition = 'none';
    } else {
        console.warn("Clicked element not found for expansion.");
        return;
    }

    setActiveItemData(item);
    setIsExpanded(true);

  }, [settings.overlayOpacity, settings.overlayEaseDuration]);

  // This effect runs the zoom-in animation when an item is expanded.
  useEffect(() => {
    if (isExpanded && activeItemData && expandedItemRef.current && originalClickedItemRect.current) {
        const expandedEl = expandedItemRef.current;
        const rect = originalClickedItemRect.current;

        // Start the expanded item at the original item's position and size.
        expandedEl.style.width = `${rect.width}px`;
        expandedEl.style.height = `${rect.height}px`;
        expandedEl.style.left = `${rect.left}px`;
        expandedEl.style.top = `${rect.top}px`;
        expandedEl.style.transform = `translate(0, 0)`;
        expandedEl.style.opacity = 1;
        expandedEl.style.transition = 'none';

        // Force a reflow to apply the initial styles before animating.
        expandedEl.offsetWidth;

        // Calculate the target size and position for the expanded item.
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 100; // Px padding from viewport edges

        const maxW = viewportWidth - padding * 2;
        const maxH = viewportHeight - padding * 2;

        const imgAspectRatio = activeItemData.size.width / activeItemData.size.height;

        let targetWidth = maxW;
        let targetHeight = targetWidth / imgAspectRatio;

        if (targetHeight > maxH) {
            targetHeight = maxH;
            targetWidth = targetHeight * imgAspectRatio;
        }

        // Apply the transition and animate to the target state.
        expandedEl.style.transition = `
            width ${settings.zoomDuration}s ease-in-out,
            height ${settings.zoomDuration}s ease-in-out,
            left ${settings.zoomDuration}s ease-in-out,
            top ${settings.zoomDuration}s ease-in-out,
            transform ${settings.zoomDuration}s ease-in-out,
            opacity ${settings.zoomDuration}s ease-in-out
        `;
        expandedEl.style.width = `${targetWidth}px`;
        expandedEl.style.height = `${targetHeight}px`;
        expandedEl.style.left = `50%`;
        expandedEl.style.top = `50%`;
        expandedEl.style.transform = `translate(-50%, -50%)`;
    }
  }, [isExpanded, activeItemData, settings.expandedScale, settings.zoomDuration, settings.overlayEaseDuration]);

  /**
   * Closes the currently expanded item, animating it back to its grid position.
   * @param {boolean} immediate - If true, closes the item instantly without animation.
   * @param {object|null} nextItem - If provided, expands this item after closing the current one.
   */
  const closeExpandedItem = useCallback((immediate = false, nextItem = null) => {
    const expandedEl = expandedItemRef.current;

    dragRef.current.isDragging = false;
    dragRef.current.mouseHasMoved = false;

    if (immediate && expandedEl) {
        // Immediate close without animation.
        expandedEl.style.transition = 'none';
        expandedEl.style.opacity = 0;
        setIsExpanded(false);
        setActiveItemData(null);
        setProjectTitle('');
        setOverlayOpacity(0);
        originalClickedItemRect.current = null;

        const originalItem = document.getElementById(activeItemData?.id);
        if (originalItem) {
            originalItem.style.opacity = 1;
            originalItem.style.transition = 'none';
        }
        updateVisibleItems();
        if (nextItem) {
            expandItem(nextItem);
        }
        return;
    }

    if (expandedEl && originalClickedItemRect.current) {
        const rect = originalClickedItemRect.current;

        // Animate the item back to its original position.
        expandedEl.style.transition = `
            width ${settings.zoomDuration}s ease-in-out,
            height ${settings.zoomDuration}s ease-in-out,
            left ${settings.zoomDuration}s ease-in-out,
            top ${settings.zoomDuration}s ease-in-out,
            transform ${settings.zoomDuration}s ease-in-out,
            opacity ${settings.zoomDuration}s ease-in-out
        `;
        expandedEl.style.width = `${rect.width}px`;
        expandedEl.style.height = `${rect.height}px`;
        expandedEl.style.left = `${rect.left}px`;
        expandedEl.style.top = `${rect.top}px`;
        expandedEl.style.transform = `translate(0, 0)`;
        expandedEl.style.opacity = 0;

        // After the animation, reset the state.
        setTimeout(() => {
            setIsExpanded(false);
            setActiveItemData(null);
            setProjectTitle('');
            setOverlayOpacity(0);
            originalClickedItemRect.current = null;

            const originalItem = document.getElementById(activeItemData?.id);
            if (originalItem) {
                originalItem.style.opacity = 1;
                originalItem.style.transition = `opacity ${settings.overlayEaseDuration}s ease-in-out`;
            }
            updateVisibleItems();

            if (nextItem) {
                expandItem(nextItem);
            }
        }, settings.zoomDuration * 1000);
    } else {
        // If for some reason the refs are not available, just reset state.
        setIsExpanded(false);
        setActiveItemData(null);
        setProjectTitle('');
        setOverlayOpacity(0);
        originalClickedItemRect.current = null;
        updateVisibleItems();

        if (nextItem) {
            expandItem(nextItem);
        }
    }
  }, [activeItemData, expandItem, settings.zoomDuration, settings.overlayEaseDuration, updateVisibleItems]);

  /**
   * Handles the mouse down event to initiate dragging.
   * @param {MouseEvent} e - The mouse event.
   */
  const handleMouseDown = (e) => {
    if (isExpanded) return; // Don't drag when an item is expanded.
    dragRef.current.isDragging = true;
    dragRef.current.mouseHasMoved = false;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.lastTime = Date.now();
  };

  /**
   * Handles the mouse move event to update the gallery's target position.
   * @param {MouseEvent} e - The mouse event.
   */
  const handleMouseMove = useCallback((e) => {
    if (!dragRef.current.isDragging) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragRef.current.mouseHasMoved = true;
    }

    const now = Date.now();
    const dt = Math.max(10, now - dragRef.current.lastTime);
    dragRef.current.lastTime = now;
    dragRef.current.velocityX = dx / dt;
    dragRef.current.velocityY = dy / dt;
    positionRef.current.targetX += dx;
    positionRef.current.targetY += dy;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
  }, []);

  /**
   * Handles the mouse up event to end dragging and apply momentum.
   */
const handleMouseUp = useCallback(() => {
  if (!dragRef.current.isDragging) return;

  dragRef.current.isDragging = false;

  const pos = positionRef.current;
  const velocityX = dragRef.current.velocityX;
  const momentum = 250; // You can tweak this value for stronger fling effect
  const padding = -30; // Optional: how much space you want between the column's start and the center

  // Apply momentum to the target position
  pos.targetX += velocityX * momentum;

  // Snap after momentum by calculating nearest column start to center + padding
  const columnIndex = Math.round((-pos.targetX + (window.innerWidth / 2) - padding) / cellWidth);

  // Final snapping position: aligns column's **start** to screen center minus padding
  const targetX = -columnIndex * cellWidth + (window.innerWidth / 2) - padding;

  pos.targetX = targetX;

}, [cellWidth]);

  /**
   * Handles the mouse wheel event to scroll the gallery.
   * @param {WheelEvent} e - The wheel event.
   */
  const handleWheel = useCallback((e) => {
    if (isExpanded) return;
    positionRef.current.targetX -= e.deltaX * settings.scrollFactor;
    positionRef.current.targetY -= e.deltaY * settings.scrollFactor;
  }, [isExpanded, settings.scrollFactor]);

  /**
   * Handles clicks on the document, used to close the expanded item when clicking outside of it.
   * @param {MouseEvent} e - The mouse event.
   */
  const handleDocumentMouseDown = useCallback((e) => {
    if (!isExpanded) return;

    // If the click is on the expanded item itself, do nothing.
    if (expandedItemRef.current && expandedItemRef.current.contains(e.target)) {
      return;
    }
    // Otherwise, close the item.
    closeExpandedItem();

  }, [isExpanded, closeExpandedItem]);


  // Effect to set up and tear down global event listeners.
  useEffect(() => {
    if (!isExpanded) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleDocumentMouseDown);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleDocumentMouseDown);
    };
  }, [isExpanded, handleMouseMove, handleMouseUp, handleDocumentMouseDown]);

  // Effect to initialize the gallery position and start the animation loop on mount.
  useEffect(() => {
    const galleryContentWidth = settings.columns * settings.baseWidth + (settings.columns - 1) * settings.itemGap;
    const initialX = (window.innerWidth - galleryContentWidth) / 2;
    const initialY = -window.innerHeight / 2; // Keep vertical centering as is

    positionRef.current.x = initialX;
    positionRef.current.y = initialY;
    positionRef.current.targetX = initialX;
    positionRef.current.targetY = initialY;
    updateVisibleItems();
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, updateVisibleItems, settings.columns, settings.baseWidth, settings.itemGap]);

  return (
    <div className="fixed inset-0 text-white overflow-hidden font-sans select-none z-100">

      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden z-101"
        style={{ cursor: isExpanded ? 'auto' : dragRef.current.isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        <div ref={canvasRef} className="absolute will-change-transform">
          {/* Gallery items are dynamically inserted here by the updateVisibleItems function */}
        </div>

        {/* Background overlay, shown when an item is expanded */}
        <div
          className={`fixed inset-0 bg-black pointer-events-none transition-opacity duration-800 z-[9998] ${
            isExpanded ? 'pointer-events-auto' : ''
          }`}
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* The expanded item itself */}
      {isExpanded && activeItemData && (
        <div
          ref={expandedItemRef}
          className="fixed z-[9999] bg-black overflow-hidden cursor-pointer"
          style={{
            borderRadius: `${settings.borderRadius}px`,
          }}
          onClick={closeExpandedItem} // Clicking the image closes it
        >
          <img
            src={activeItemData.content.image}
            alt={activeItemData.content.title}
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
      )}
    </div>
  );
};

export default DraggableGallery;