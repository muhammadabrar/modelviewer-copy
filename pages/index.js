import dynamic from "next/dynamic";
import Head from "next/head";

import { useEffect, useRef, useState } from "react";

const Model = dynamic(() => import("../components/Model"), { ssr: false });
const ModelForIphone = dynamic(() => import("../components/ModelForIphone"), { ssr: false });

import icon2 from "../public/icons/about-us.svg";
import icon1 from "../public/icons/cart.svg";
import icon3 from "../public/icons/mail.svg";
import { Result } from "antd";
const items = [icon1, icon2, icon3];
export default function Home(props) {
  const printRef = useRef();
  const [hostName, setHostName] = useState("");
  const [isIphone, setisIphone] = useState(false);
  const [IsIphone, setIsIphone] = useState(false);
  const [Iscopy, setIscopy] = useState(false);



   async function checkARCoreSupport() {
    if (typeof navigator === 'undefined' || !navigator.xr) {
      return false;
    }
  
    try {
      const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
      return isSupported;
    } catch (error) {
      console.error('Error checking ARCore support:', error);
      return false;
    }
  }
  useEffect(() => {
    if (window) {
      setHostName(window.location.host);
    }
    
    
  }, []);

if (checkARCoreSupport()) {
  return <>
  <Result
    status="404"
    title="AR not supported"
    subTitle="Sorry, this device not support AR core"
    // extra={<Button type="primary">Back Home</Button>}
  />
</>;
}


    return (
      <>
        <Head>
        

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
       
        <div className="app_container">
          <div className="left_box">
            {!IsIphone? <Model data={props.res.data} /> :
            <ModelForIphone data={props.res.data} />}
            
              <div className="icon">
                <p className="logoTEXT">LOGO</p>
              </div>
           
          </div>

     
          <>
                <a
                  className="purchaseBtn"
                  target="_blank"
                  
                >
                  
                    Purchase
                </a>
              </>
        </div>
      </>
    );
  }
