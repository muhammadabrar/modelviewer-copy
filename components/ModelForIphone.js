import '@google/model-viewer';
import axios from "axios";
import Image from 'next/image';

import { useEffect, useRef, useState } from 'react';

const Model = () => {
  
  const modelViewerRef = useRef(null);





  // console.log("================>", props);
  return (
    <model-viewer
      ref={modelViewerRef}
   
      src={"/Battery2.glb"}
      shadow-intensity="1"
      touch-action="pan-y"
      // ar-modes="webxr "
      // ar-modes=" quick-look"
      camera-controls
      auto-rotate
      ar
    >
      <button slot="ar-button" className='view_model_btn'>
        <Image width={120} height={120} className="vr_custom_logo" src={ "/logo.png"}/> <div className='ar_btn_text'> Activate <b>AR</b> </div>
      </button>
    </model-viewer>
  )
}

export default Model;