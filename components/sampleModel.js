import "@google/model-viewer";

import axios from "axios";

import { useEffect, useRef, useState } from "react";
const SampleModel = ({ model, id }) => {
  // console.log("================>", props);
  const modelViewerRef = useRef(null);
  useEffect(() => {
    const viewer = modelViewerRef.current;
    viewer.addEventListener("load", handleModelProgress);
  }, []);

  async function handleModelProgress(event) {
    console.log("================Loaded=================");
    // updateModelByQuery(ModelDetails?.identifier)
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_backend}model/query/sampleModelClickCount/${id}`
      )
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }
  return (
    <model-viewer
      ref={modelViewerRef}
      src={process.env.NEXT_PUBLIC_ADMIN_CLOUDFRONT + model || "/Battery2.glb"}
      shadow-intensity="1"
      camera-controls
      auto-rotate
      ar
    >
      <button slot="ar-button" className="view_model_btn">
        <img className="vr_custom_logo" src={"/logo.png"} />{" "}
        <div className="ar_btn_text">
          {" "}
          Activate <b>AR</b>{" "}
        </div>
      </button>
    </model-viewer>
  );
};

export default SampleModel;
