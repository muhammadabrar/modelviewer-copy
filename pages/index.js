import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { isMobile } from "react-device-detect";
import { getModelByQuery } from "../components/Api/Model";
// import { QRCode } from "react-qrcode-logo";
// import QRCode from 'qrcode.react';
import * as htmlToImage from "html-to-image";
import { useEffect, useRef, useState } from "react";

const Model = dynamic(() => import("../components/Model"), { ssr: false });
const ModelForIphone = dynamic(() => import("../components/ModelForIphone"), { ssr: false });


import QRcode from "../components/QRcode";
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


  // console.log("---->", props);
  const printDocument = async () => {
    const element = printRef.current;
    const dataUrl = await htmlToImage.toPng(element, { quality: 1});
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      // console.log("Image copied.");
      setIscopy(true);
      setTimeout(() => {
        setIscopy(false);
      }, 5000);
    } catch (err) {
      console.error(err.name, err.message);
    }
  };
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
    
    console.log(Boolean(checkARCoreSupport()));
    var isIphoneFacebook =
      /FBAN\/|FBAV\/|FB_IAB\/|FB4A\/|FB_IAB\/|FBAN\/|FB_IAB\/|FBAV\/|FB4A\/|FBSV\/|FB_IAB\/|FBDV\/|FB_IAB\/|FB_IAB\/|FB4A\/|FB_IAB\/|FBAN\/|FB_IAB\/|FBAV\/|FB4A\/|FBSV\/|FB_IAB\/|FBDV\/|FB_IAB\//.test(
        navigator.userAgent
      ) && /iPhone/.test(navigator.userAgent);

    if (isIphoneFacebook) {
      // alert("Please open this link in Safari or Chrome to view the AR content.");
      setisIphone(true);
    }
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (userAgent.includes('iphone') | userAgent.includes('ipad')) {
      setIsIphone(true);
    }
  }, []);
  function addHttpsIfNeeded(url) {
    if (!url?.startsWith("https://")) {
      url = "https://".concat(url.toLowerCase());
    }
    return url;
  }
if (!checkARCoreSupport()) {
  return <>
  <Result
    status="404"
    title="AR not supported"
    subTitle="Sorry, this device not support AR core"
    // extra={<Button type="primary">Back Home</Button>}
  />
</>;
}
  if (props.res.error != null) {
    return <>
    <Result
      status="404"
      title="Model not found"
      subTitle="Sorry, this model is not available"
      // extra={<Button type="primary">Back Home</Button>}
    />
  </>;
  } else {
    if (isIphone) {
      return (
        <>
          <h1>Sorry you are using Iphone Facebook</h1>
        </>
      );
    }
    return (
      <>
        <Head>
          <meta
            property="og:title"
            content={props?.res?.data?.result?.defaultName}
          />
          <meta
            name="twitter:title"
            content={props?.res?.data?.result?.defaultName}
          />

          <meta
            name="description"
            content={props?.res?.data?.result?.ProductURL}
          />
          <meta
            property="og:description"
            content={props?.res?.data?.result?.description}
          />
          <meta
            name="twitter:description"
            content={props?.res?.data?.result?.description}
          />
          {/* <meta property="og:url" content="https://example.com/path"> */}
          <meta property="og:type" content="website" />
          <meta property="fb:app_id" content=""></meta>
          <meta
            property="og:image"
            content={props?.res?.data?.result?.Thumbnail?.Location}
          />
          <meta property="og:image:width" content="1280" />
          <meta property="og:image:height" content="720 "></meta>
          <meta
            name="twitter:image"
            content={props?.res?.data?.result?.Thumbnail?.Location}
          />

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
        {Iscopy && (
          <div className="copyNotification">
            <p className="notifyIcon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clip-rule="evenodd"
                />
              </svg>
            </p>
            <p>QRCode is copy to clipboard</p>
          </div>
        )}
        <div className="app_container">
          <div className="left_box">
            {!IsIphone? <Model data={props.res.data} /> :
            <ModelForIphone data={props.res.data} />}
            {isMobile ? null : (
              <div className="icon">
                {props?.res?.data?.result?.owner?.profileImage?.Location? <Image
                width={100}
                height={100}
                  src={props?.res?.data?.result?.owner?.profileImage?.Location ||
                    "/logo.png"
                  }
                  alt={ props?.res?.data?.result?.owner?.logoAlt || "logo"}
                />:<p className="logoTEXT">LOGO</p>}
              </div>
            )}
          </div>

          <div className="right_box" id="divToPrint">
      

            <div className="qr" onClick={() => printDocument()}>
              <>
              <div className="qroverlay">Copy QRCode</div>
                <div ref={printRef}>
                  <QRcode
                    identifier={`${hostName}/?x=${props?.res?.data?.result?.identifier}`}
                    logo={props?.res?.data?.result?.owner?.profileImage?.Location
                    }
                  />
                </div>
              </>
            </div>
            {props?.res?.data?.result?.ProductURL && (
              <>
                <a
                  className="purchaseBtn"
                  target="_blank"
                  href={addHttpsIfNeeded(props?.res?.data?.result?.ProductURL)}
                  style={
                    props?.res?.data?.result?.ProductButtonColor
                      ? {
                          backgroundColor:
                            props?.res?.data?.result?.ProductButtonColor,
                        }
                      : {}
                  }
                >
                  <Image
                    src={
                      items[props?.res?.data?.result?.ProductButtonIcon]
                    }
                    className="btnicon"
                    width={24}
                    height={24}
                  />{" "}
                  {props?.res?.data?.result?.ProductButtonText ||
                    "Purchase"}{" "}
                </a>
              </>
            )}
          </div>
          <a
            className="purchaseBtn sm"
            target="_blank"
            href={addHttpsIfNeeded(props?.res?.data?.result?.ProductURL)}
            style={
              props?.res?.data?.result?.ProductButtonColor
                ? {
                    backgroundColor:
                      props?.res?.data?.result?.ProductButtonColor,
                  }
                : {}
            }
          >
            {/* {items[props?.res?.data?.result?.ProductButtonIcon|| 0]} */}
            <Image
              src={items[props?.res?.data?.result?.ProductButtonIcon]}
              className="btnicon"
              width={24}
              height={24}
            />{" "}
            {props?.res?.data?.result?.ProductButtonText || "Purchase"}{" "}
          </a>
        </div>
      </>
    );
  }
}

export async function getServerSideProps(context) {
  // console.log("---------->" , context)
  const QueryId = context?.query?.x;
  const res = await getModelByQuery(QueryId);
  return {
    props: {
      res,
    },
  };
}
