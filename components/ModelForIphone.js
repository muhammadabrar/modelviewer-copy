import '@google/model-viewer';
import axios from "axios";
import Image from 'next/image';

import { useEffect, useRef, useState } from 'react';

const Model = (props) => {
  let ModelDetails = props.data.result
  const Bucket = ModelDetails?.glbModel?.Bucket
  const LogoBucket = ModelDetails?.owner?.profileImage?.Bucket

  const Key = ModelDetails?.glbModel?.Key
  const modelViewerRef = useRef(null);
  const [glbModel, setglbModel] = useState();

  useEffect(() => {
    const viewer = modelViewerRef.current;
    viewer.addEventListener('load', handleModelProgress);


  }, []);


  async function handleModelProgress(event) {
    console.log("================Loaded=================");
    // updateModelByQuery(ModelDetails?.identifier)
    if (ModelDetails?.type != 3) {


      await axios.put(`${process.env.NEXT_PUBLIC_backend}model/query/${ModelDetails?.identifier}`)
        .then(function (response) {
          // handle success
          console.log(response);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
  }
  // console.log("================>", props);
  return (
    <model-viewer
      ref={modelViewerRef}
      src={Bucket == process.env.NEXT_PUBLIC_ADMIN_BUCKETNAME ? process.env.NEXT_PUBLIC_ADMIN_CLOUDFRONT + Key : Bucket == process.env.NEXT_PUBLIC_3DX_ADMIN_BUCKETNAME ? process.env.NEXT_PUBLIC_3DX_ADMIN_CLOUDFRONT + Key : Bucket == process.env.NEXT_PUBLIC_MAKO_ADMIN_BUCKETNAME ? process.env.NEXT_PUBLIC_MAKO_ADMIN_CLOUDFRONT + Key : ModelDetails?.glbModel?.Location}

      // ios-src={ModelDetails?.glbModel?.Location || "/Battery2.glb"}
      alt={ModelDetails.Alt}
      shadow-intensity="1"
      touch-action="pan-y"
      camera-controls
      auto-rotate
      ar
    >
      <button slot="ar-button" className='view_model_btn'>
        <Image width={120} height={120} className="vr_custom_logo" src={ ModelDetails?.owner?.profileImage?.Location || "/logo.png"}/> <div className='ar_btn_text'> Activate <b>AR</b> </div>
      </button>
    </model-viewer>
  )
}

export default Model;