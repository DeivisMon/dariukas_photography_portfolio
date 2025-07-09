import { useState, useEffect, useRef, useCallback } from 'react';
import Images from "../data/images.json";
import AnimatedText from '../utils/AnimatedText';

const DraggableGallery = () => {

    const mockImages = Array.from({ length: 30 }, (_, i) => ({
    src: `https://picsum.photos/1000/750?random=${i + 1}`
  }));

  const imageUrls = mockImages.map((image) => image.src);
//   const imageUrls = Images.map((image) => image.src);
  const imageProjectTypes = Images.map((image) => image.projectType);


  const [panelVisible, setPanelVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItemData, setActiveItemData] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  const [settings, setSettings] = useState({
    baseWidth: 400,
    smallHeight: 330,
    largeHeight: 500,
    itemGap: 65,
    hoverScale: 1.05,
    expandedScale: 0.4,
    dragEase: 0.075,
    momentumFactor: 200,
    bufferZone: 3,
    borderRadius: 0,
    vignetteSize: 0,
    vignetteStrength: 0.7,
    pageVignetteSize: 200,
    overlayOpacity: 0.9,
    overlayEaseDuration: 0.8,
    zoomDuration: 0.6
  });

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    velocityX: 0,
    velocityY: 0,
    lastTime: 0,
    mouseHasMoved: false
  });
  const currentVisibleItemIds = useRef(new Set());
  const expandedItemRef = useRef(null);
  const originalClickedItemRect = useRef(null);

  const columns = 4;
  const itemSizes = [
    { width: settings.baseWidth, height: settings.smallHeight },
    { width: settings.baseWidth, height: settings.largeHeight }
  ];
  const cellWidth = settings.baseWidth + settings.itemGap;
  const cellHeight = Math.max(settings.smallHeight, settings.largeHeight) + settings.itemGap;

  const getItemId = (col, row) => `${col},${row}`;
  const getItemSize = (row, col) => {
    const hash = ((row * columns + col) % itemSizes.length + itemSizes.length) % itemSizes.length;
    return itemSizes[hash];
  };
  const getItemContent = (row, col) => {
    const itemNum = ((row * columns + col) % imageUrls.length + imageUrls.length) % imageUrls.length;
    return {
      title: imageProjectTypes[itemNum % imageProjectTypes.length],
      image: imageUrls[itemNum % imageUrls.length],
      number: itemNum + 1
    };
  };

  console.log(getItemContent(0, 0));
  const getItemPosition = (col, row) => ({
    x: col * cellWidth,
    y: row * cellHeight
  });

  const updateVisibleItems = useCallback(() => {
    const buffer = settings.bufferZone;
    const viewWidth = window.innerWidth * (1 + buffer);
    const viewHeight = window.innerHeight * (1 + buffer);

    const { x: currentX, y: currentY } = positionRef.current;

    const startCol = Math.floor((-currentX - viewWidth / 2) / cellWidth);
    const endCol = Math.ceil((-currentX + viewWidth / 2) / cellWidth);
    const startRow = Math.floor((-currentY - viewHeight / 2) / cellHeight);
    const endRow = Math.ceil((-currentY + viewHeight / 2) / cellHeight);

    const nextVisibleItemIds = new Set();
    const canvas = canvasRef.current;
    if (!canvas) return;

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

        if (!itemElement) {
          itemElement = document.createElement('div');
          itemElement.id = itemId;
          itemElement.className = 'absolute bg-black cursor-pointer overflow-hidden transition-opacity duration-300 z-101 gallery-item';
          
          // --- CRITICAL CHANGE: Conditionally set onclick for items ---
          // Item should only be clickable if not expanded.
          // When expanded, the overlay and expanded item handle clicks.
          if (!isExpanded) {
            itemElement.onclick = () => {
              // No need for stopPropagation here as the overlay will block events
              // if an item is expanded. This only fires when !isExpanded.
              handleItemClick(itemData);
            };
            itemElement.style.pointerEvents = 'auto'; // Ensure it's clickable
          } else {
            itemElement.onclick = null; // Remove handler
            itemElement.style.pointerEvents = 'none'; // Make it not clickable
          }
          // --- END CRITICAL CHANGE ---

          const itemSize = itemData.size;
          const position = itemData.position;
          const content = itemData.content;

          itemElement.style.width = `${itemSize.width}px`;
          itemElement.style.height = `${itemSize.height}px`;
          itemElement.style.left = `${position.x}px`;
          itemElement.style.top = `${position.y}px`;
          itemElement.style.borderRadius = `${settings.borderRadius}px`;
          itemElement.style.opacity = isExpanded && activeItemData?.id !== itemId ? 0 : 1;

console.log(content)

          itemElement.innerHTML = `
            <div class="group w-full h-full overflow-hidden relative">
              <img
                src="${content.image}"
                alt="Image ${content.number}"
                class="w-full h-full grayscale group-hover:grayscale-80 transition duration-500 group-hover:scale-105  object-cover pointer-events-none transition-transform duration-300"
                style="
                  transform: scale(${settings.hoverScale});
                  box-shadow: inset 0 0 ${settings.vignetteSize}px rgba(0, 0, 0, 0.5);
                "
              />
              <div class="opacity-0 group-hover:opacity-100 absolute bg-gray-900/50 transition-opacity duration-300  bottom-0 left-0 w-full p-2.5 z-10">
                <div class="text-white text-xs font-medium uppercase tracking-tight mb-0.5 overflow-hidden h-4">
                  ${content.title}
                </div>
                <div class="text-gray-400 text-xs font-mono overflow-hidden h-3.5">
                  #${content.number.toString().padStart(5, '0')}
                </div>
              </div>
            </div>
          `;
          canvas.appendChild(itemElement);
        } else {
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

          // --- CRITICAL CHANGE: Update onclick for existing items ---
          if (!isExpanded) {
            itemElement.onclick = () => handleItemClick(itemData);
            itemElement.style.pointerEvents = 'auto';
          } else {
            itemElement.onclick = null;
            itemElement.style.pointerEvents = 'none';
          }
          // --- END CRITICAL CHANGE ---
        }
      }
    }

    currentVisibleItemIds.current.forEach(itemId => {
      if (!nextVisibleItemIds.has(itemId)) {
        const itemToRemove = document.getElementById(itemId);
        if (itemToRemove && itemToRemove.parentNode === canvas) {
          canvas.removeChild(itemToRemove);
        }
      }
    });

    currentVisibleItemIds.current = nextVisibleItemIds;

  }, [settings.bufferZone, cellWidth, cellHeight, settings.borderRadius, settings.hoverScale, settings.vignetteSize, isExpanded, activeItemData]); // isExpanded is now a dependency here!

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

  // handleItemClick will now only be called when !isExpanded, so simplified
  const handleItemClick = (item) => {
    if (dragRef.current.mouseHasMoved) return;
    expandItem(item);
  };

  const expandItem = useCallback((item) => {
    setProjectTitle(item.content.title);
    setOverlayOpacity(settings.overlayOpacity);

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
    setIsExpanded(true); // This re-renders and triggers updateVisibleItems and the useEffect for animation

  }, [settings.overlayOpacity, settings.overlayEaseDuration]);

  useEffect(() => {
    if (isExpanded && activeItemData && expandedItemRef.current && originalClickedItemRect.current) {
        const expandedEl = expandedItemRef.current;
        const rect = originalClickedItemRect.current;

        expandedEl.style.width = `${rect.width}px`;
        expandedEl.style.height = `${rect.height}px`;
        expandedEl.style.left = `${rect.left}px`;
        expandedEl.style.top = `${rect.top}px`;
        expandedEl.style.transform = `translate(0, 0)`;
        expandedEl.style.opacity = 1;
        expandedEl.style.transition = 'none';

        expandedEl.offsetWidth;

        const viewportWidth = window.innerWidth;
        const targetWidth = viewportWidth * settings.expandedScale;
        const aspectRatio = activeItemData.size.height / activeItemData.size.width;
        const targetHeight = targetWidth * aspectRatio;

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

  const closeExpandedItem = useCallback((immediate = false, nextItem = null) => {
    const expandedEl = expandedItemRef.current;

    // Reset drag state immediately, regardless of animation
    dragRef.current.isDragging = false;
    dragRef.current.mouseHasMoved = false;

    if (immediate && expandedEl) {
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
        // Update item visibility/clickability right away
        updateVisibleItems(); // Re-run to re-enable clicks on items
        if (nextItem) {
            expandItem(nextItem);
        }
        return;
    }

    if (expandedEl && originalClickedItemRect.current) {
        const rect = originalClickedItemRect.current;

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
            // Update item visibility/clickability after animation
            updateVisibleItems(); // Re-run to re-enable clicks on items

            if (nextItem) {
                expandItem(nextItem);
            }
        }, settings.zoomDuration * 1000);
    } else {
        setIsExpanded(false);
        setActiveItemData(null);
        setProjectTitle('');
        setOverlayOpacity(0);
        originalClickedItemRect.current = null;
        updateVisibleItems(); // Re-run to re-enable clicks on items

        if (nextItem) {
            expandItem(nextItem);
        }
    }
  }, [activeItemData, expandItem, settings.zoomDuration, settings.overlayEaseDuration, updateVisibleItems]); // Added updateVisibleItems to dependencies

  const handleMouseDown = (e) => {
    // If expanded, the container should not initiate drag.
    // The overlay/document listener handles closing.
    if (isExpanded) {
        return;
    }
    dragRef.current.isDragging = true;
    dragRef.current.mouseHasMoved = false;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.lastTime = Date.now();
  };

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

  const handleMouseUp = useCallback(() => {
    if (!dragRef.current.isDragging) return;

    dragRef.current.isDragging = false;

    const momentumFactor = settings.momentumFactor;
    positionRef.current.targetX += dragRef.current.velocityX * momentumFactor;
    positionRef.current.targetY += dragRef.current.velocityY * momentumFactor;
  }, [settings.momentumFactor]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'h' || e.key === 'H') {
      setPanelVisible(prev => !prev);
    }
    if (e.key === 'Escape' && isExpanded) {
      closeExpandedItem();
    }
  }, [isExpanded, closeExpandedItem]);

  const handleDocumentMouseDown = useCallback((e) => {
    if (!isExpanded) return;

    // Check if the click target is the expanded item or its children
    if (expandedItemRef.current && expandedItemRef.current.contains(e.target)) {
      // Click was on the expanded image itself, let its onClick handler manage it.
      return;
    }
    // If the click was not on the expanded item, then close it.
    closeExpandedItem();

  }, [isExpanded, closeExpandedItem]);


  useEffect(() => {
    if (!isExpanded) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    window.addEventListener('keydown', handleKeyDown);

    if (isExpanded) {
      document.addEventListener('mousedown', handleDocumentMouseDown);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleDocumentMouseDown);
    };
  }, [isExpanded, handleMouseMove, handleMouseUp, handleKeyDown, handleDocumentMouseDown]);

  useEffect(() => {
    const centerX = -window.innerWidth / 2;
    const centerY = -window.innerHeight / 2;
    positionRef.current.x = centerX;
    positionRef.current.y = centerY;
    positionRef.current.targetX = centerX;
    positionRef.current.targetY = centerY;
    updateVisibleItems();
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, updateVisibleItems]);

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden font-sans select-none z-101">

      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden z-101"
        style={{ cursor: isExpanded ? 'auto' : dragRef.current.isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
      >
        <div ref={canvasRef} className="absolute will-change-transform">
          {/* Items are managed directly by updateVisibleItems */}
        </div>

        {/* Overlay - Z-index adjusted, now the primary click-catcher when expanded */}
        <div
          className={`fixed inset-0 bg-black pointer-events-none transition-opacity duration-800 z-[9998] ${
            isExpanded ? 'pointer-events-auto' : ''
          }`}
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {isExpanded && activeItemData && (
        <div
          ref={expandedItemRef}
          className="fixed z-[9999] bg-black overflow-hidden cursor-pointer"
          style={{
            borderRadius: `${settings.borderRadius}px`,
          }}
          onClick={closeExpandedItem} // Clicking the image itself still closes it
        >
          <img
            src={activeItemData.content.image}
            alt={activeItemData.content.title}
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
      )}

      {projectTitle && (
        <div className="fixed backdrop-blur-sm bg-black/50 bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-[10000]">
          <div className="text-white text-4xl font-bold uppercase tracking-tight">
            <AnimatedText text={projectTitle} duration={0.1} />
          </div>
          <div className="text-white text-2xl font-bold uppercase tracking-tight">
            <AnimatedText text={`#${activeItemData.content.number.toString().padStart(5, '0')}`} duration={0.2} />
          </div>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none z-20">
        <div
          className="absolute inset-0"
          style={{
            boxShadow: `inset 0 0 ${settings.pageVignetteSize * 1.5}px rgba(0,0,0,${settings.vignetteStrength * 0.7})`
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            boxShadow: `inset 0 0 ${settings.pageVignetteSize * 0.75}px rgba(0,0,0,${settings.vignetteStrength * 0.85})`
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            boxShadow: `inset 0 0 ${settings.pageVignetteSize * 0.4}px rgba(0,0,0,${settings.vignetteStrength})`
          }}
        />
      </div>
    </div>
  );
};

export default DraggableGallery;