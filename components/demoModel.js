import React, { useRef, useState, useEffect } from 'react';
import '@google/model-viewer';
const ModelViewer =  ({model}) => {
  const modelViewerRef = useRef(null);
  const [showDimensions, setShowDimensions] = useState(true);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;


    const drawLine = (svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) => {
      if (dotHotspot1 && dotHotspot2) {
        svgLine.setAttribute('x1', dotHotspot1.canvasPosition.x);
        svgLine.setAttribute('y1', dotHotspot1.canvasPosition.y);
        svgLine.setAttribute('x2', dotHotspot2.canvasPosition.x);
        svgLine.setAttribute('y2', dotHotspot2.canvasPosition.y);

        if (dimensionHotspot && !dimensionHotspot.facingCamera) {
          svgLine.classList.add('hide');
        } else {
          svgLine.classList.remove('hide');
        }
      }
    };

    const renderSVG = () => {
      const dimLines = modelViewer.querySelectorAll('line');

      drawLine(dimLines[0], modelViewer.queryHotspot('hotspot-dot+X-Y+Z'), modelViewer.queryHotspot('hotspot-dot+X-Y-Z'), modelViewer.queryHotspot('hotspot-dim+X-Y'));
      drawLine(dimLines[1], modelViewer.queryHotspot('hotspot-dot+X-Y-Z'), modelViewer.queryHotspot('hotspot-dot+X+Y-Z'), modelViewer.queryHotspot('hotspot-dim+X-Z'));
      drawLine(dimLines[2], modelViewer.queryHotspot('hotspot-dot+X+Y-Z'), modelViewer.queryHotspot('hotspot-dot-X+Y-Z'));
      drawLine(dimLines[3], modelViewer.queryHotspot('hotspot-dot-X+Y-Z'), modelViewer.queryHotspot('hotspot-dot-X-Y-Z'), modelViewer.queryHotspot('hotspot-dim-X-Z'));
      drawLine(dimLines[4], modelViewer.queryHotspot('hotspot-dot-X-Y-Z'), modelViewer.queryHotspot('hotspot-dot-X-Y+Z'), modelViewer.queryHotspot('hotspot-dim-X-Y'));
    };


    modelViewer.addEventListener('camera-change', renderSVG);

    modelViewer.addEventListener('load', () => {
      const center = modelViewer.getBoundingBoxCenter();
      const size = modelViewer.getDimensions();
      const x2 = size.x / 2;
      const y2 = size.y / 2;
      const z2 = size.z / 2;
      modelViewer.updateHotspot({
        name: 'hotspot-dot+X-Y+Z',
        position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`
      });
  
      modelViewer.updateHotspot({
        name: 'hotspot-dim+X-Y',
        position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
      });
      modelViewer.querySelector('button[slot="hotspot-dim+X-Y"]').textContent =
          `${(size.z * 100).toFixed(0)} cm`;
  
      modelViewer.updateHotspot({
        name: 'hotspot-dot+X-Y-Z',
        position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`
      });
  
      modelViewer.updateHotspot({
        name: 'hotspot-dim+X-Z',
        position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
      });
      modelViewer.querySelector('button[slot="hotspot-dim+X-Z"]').textContent =
          `${(size.y * 100).toFixed(0)} cm`;
  
      modelViewer.updateHotspot({
        name: 'hotspot-dot+X+Y-Z',
        position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`
      });
  
      modelViewer.updateHotspot({
        name: 'hotspot-dim+Y-Z',
        position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`
      });
      modelViewer.querySelector('button[slot="hotspot-dim+Y-Z"]').textContent =
          `${(size.x * 100).toFixed(0)} cm`;
  
      modelViewer.updateHotspot({
        name: 'hotspot-dot-X+Y-Z',
        position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`
      });
  
      modelViewer.updateHotspot({
        name: 'hotspot-dim-X-Z',
        position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
      });
      modelViewer.querySelector('button[slot="hotspot-dim-X-Z"]').textContent =
          `${(size.y * 100).toFixed(0)} cm`;
  
      modelViewer.updateHotspot({
        name: 'hotspot-dot-X-Y-Z',
        position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`
      });
  
      modelViewer.updateHotspot({
        name: 'hotspot-dim-X-Y',
        position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
      });
      modelViewer.querySelector('button[slot="hotspot-dim-X-Y"]').textContent =
          `${(size.z * 100).toFixed(0)} cm`;
  
      modelViewer.updateHotspot({
        name: 'hotspot-dot-X-Y+Z',
        position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`
      });

      renderSVG();
    });

    return () => {
      modelViewer.removeEventListener('camera-change', renderSVG);
    };
  }, [showDimensions]);

  return (
    <>
      <model-viewer
        id="dimension-demo"
        ar
        ar-modes="webxr"
        ar-scale="fixed"
        camera-orbit="-30deg auto auto"
        max-camera-orbit="auto 100deg auto"
        shadow-intensity="1"
        camera-controls
        touch-action="pan-y"
        // src={"/Battery2.glb"}
        src={model + ".glb" || "/Battery2.glb"}

        alt="A 3D model of an armchair."
        ref={modelViewerRef}
      >
        {/* ... */}
    
      <button slot="ar-button" className='view_model_btn'>
        <img className="vr_custom_logo" src={"/logo.png"} /> <div className='ar_btn_text'> Activate <b>AR</b> </div>
      </button>
      <button slot="hotspot-dot+X-Y+Z" class="dot" data-position="1 -1 1" data-normal="1 0 0"></button>
  <button slot="hotspot-dim+X-Y" class="dim" data-position="1 -1 0" data-normal="1 0 0"></button>
  <button slot="hotspot-dot+X-Y-Z" class="dot" data-position="1 -1 -1" data-normal="1 0 0"></button>
  <button slot="hotspot-dim+X-Z" class="dim" data-position="1 0 -1" data-normal="1 0 0"></button>
  <button slot="hotspot-dot+X+Y-Z" class="dot" data-position="1 1 -1" data-normal="0 1 0"></button>
  <button slot="hotspot-dim+Y-Z" class="dim" data-position="0 -1 -1" data-normal="0 1 0"></button>
  <button slot="hotspot-dot-X+Y-Z" class="dot" data-position="-1 1 -1" data-normal="0 1 0"></button>
  <button slot="hotspot-dim-X-Z" class="dim" data-position="-1 0 -1" data-normal="-1 0 0"></button>
  <button slot="hotspot-dot-X-Y-Z" class="dot" data-position="-1 -1 -1" data-normal="-1 0 0"></button>
  <button slot="hotspot-dim-X-Y" class="dim" data-position="-1 -1 0" data-normal="-1 0 0"></button>
  <button slot="hotspot-dot-X-Y+Z" class="dot" data-position="-1 -1 1" data-normal="-1 0 0"></button>
  <svg id="dimLines" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="dimensionLineContainer">
    <line class="dimensionLine"></line>
    <line class="dimensionLine"></line>
    <line class="dimensionLine"></line>
    <line class="dimensionLine"></line>
    <line class="dimensionLine"></line>
  </svg>
      </model-viewer>

  

      {/* Replace inline SVG with JSX representation */}
   

      <style>
        {/* ... Copy the CSS styles from the original code */}
      </style>
    </>
  );
};

export default ModelViewer;
