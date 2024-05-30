import '@google/model-viewer';
import axios from "axios";
import { AES } from 'crypto-js';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const Model = (props) => {
  let ModelDetails = props.data.result
  const Bucket = ModelDetails?.glbModel?.Bucket
  const LogoBucket = ModelDetails?.owner?.profileImage?.Bucket

  const Key = ModelDetails?.glbModel?.Key

  const modelViewerRef = useRef(null);

  const [IsAndroid, setIsAndroid] = useState(false);
  useEffect(() => {
    const viewer = modelViewerRef.current;
    viewer.addEventListener('load', handleModelProgress);
    // handleModel()
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (userAgent.includes('android')) {
      setIsAndroid(true);
    }


  }, []);


  async function handleModelProgress(event) {
    console.log("================Loaded=================");
    if (ModelDetails.type != 3) {
      
    
    // updateModelByQuery(ModelDetails?.identifier)
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
  const handleArView = () => {
    const secretKey = process.env.NEXT_PUBLIC_TOKEN_SECRETKEY;
    const objectToEncrypt = {
      Bucket: ModelDetails?.glbModel?.Bucket,
      Key: ModelDetails?.glbModel?.Key,
      identifier: ModelDetails?.identifier,
      link: ModelDetails?.ProductURL.toLowerCase(),
      Model: ModelDetails?.defaultName,
      currentTime: new Date().getTime(),
    };

    // Convert the object to a JSON string
    const objectString = JSON.stringify(objectToEncrypt);

    // Encrypt the JSON string
    const encryptedData = AES.encrypt(objectString, secretKey).toString();

    window.open(`/ar-view/${encodeURIComponent(encryptedData)}`, '_blank');


  }


  // console.log("================>", props);
  return (
    <model-viewer
      ref={modelViewerRef}
      src={Bucket == process.env.NEXT_PUBLIC_ADMIN_BUCKETNAME ? process.env.NEXT_PUBLIC_ADMIN_CLOUDFRONT + Key : Bucket == process.env.NEXT_PUBLIC_3DX_ADMIN_BUCKETNAME ? process.env.NEXT_PUBLIC_3DX_ADMIN_CLOUDFRONT + Key :Bucket == process.env.NEXT_PUBLIC_MAKO_ADMIN_BUCKETNAME ? process.env.NEXT_PUBLIC_MAKO_ADMIN_CLOUDFRONT + Key : ModelDetails?.glbModel?.Location}
      // ios-src={ModelDetails?.glbModel?.Location || "/Battery2.glb"}
      alt={ModelDetails.Alt}
      shadow-intensity="1"
      camera-controls
      auto-rotate
    >
      {IsAndroid && <button className='view_model_btn' onClick={handleArView}>
        <Image width={120} height={120} className="vr_custom_logo" src={ModelDetails?.owner?.profileImage?.Location || "/logo.png"} /> <div className='ar_btn_text'> Activate <b>AR</b> </div>
      </button>}

    </model-viewer>
  )
}

export default Model;