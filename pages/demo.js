import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { isMobile } from "react-device-detect";
import { GetDemoModel } from "../components/Api/Model";
// import { QRCode } from "react-qrcode-logo";
// import QRCode from 'qrcode.react';
import * as htmlToImage from "html-to-image";
import { useEffect, useRef, useState } from "react";

const DemoModel = dynamic(() => import("../components/demoModel"), {
  ssr: false,
});

import QRcode from "../components/QRcode";
import icon2 from "../public/icons/about-us.svg";
import icon1 from "../public/icons/cart.svg";
import icon3 from "../public/icons/mail.svg";
const items = [icon1, icon2, icon3];
export default function Home(props) {
  const printRef = useRef();
  const [hostName, setHostName] = useState("");
  const [isIphone, setisIphone] = useState(false);
  const [Iscopy, setIscopy] = useState(false);
  const [model, setmodel] = useState();
  console.log(props);
  // console.log("---->", props);
  const printDocument = async () => {
    const element = printRef.current;
    const dataUrl = await htmlToImage.toPng(element, { quality: 1 });
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

  useEffect(() => {
    if (window) {
      setHostName(window.location.host);
    }
    var isIphoneFacebook =
      /FBAN\/|FBAV\/|FB_IAB\/|FB4A\/|FB_IAB\/|FBAN\/|FB_IAB\/|FBAV\/|FB4A\/|FBSV\/|FB_IAB\/|FBDV\/|FB_IAB\/|FB_IAB\/|FB4A\/|FB_IAB\/|FBAN\/|FB_IAB\/|FBAV\/|FB4A\/|FBSV\/|FB_IAB\/|FBDV\/|FB_IAB\//.test(
        navigator.userAgent
      ) && /iPhone/.test(navigator.userAgent);

    if (isIphoneFacebook) {
      // alert("Please open this link in Safari or Chrome to view the AR content.");
      setisIphone(true);
    }
  }, []);

  if (props.res.error != null) {
    return <>No Model</>;
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
            <DemoModel model={props.server == 'mako'? process.env.NEXT_PUBLIC_MAKO_USER_CLOUDFRONT + props.id:props.server == '3dx'? process.env.NEXT_PUBLIC_3DX_USER_CLOUDFRONT + props.id: process.env.NEXT_PUBLIC_USER_CLOUDFRONT + props.id} />
            {isMobile ? null : (
              <div className="icon">
                <p className="logoTEXT">LOGO</p>
              </div>
            )}
          </div>

          <div className="right_box" id="divToPrint">
            <div className="qr" onClick={() => printDocument()}>
              <>
                <div className="qroverlay">Copy QRCode</div>
                <div ref={printRef}>
                  <QRcode identifier={`${hostName}/demo?x=${props.id}`} />
                </div>
              </>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export async function getServerSideProps(context) {
  // console.log("---------->" , context)
  const QueryId = context?.query?.x;
  const server = context?.query?.s;

  const res = await GetDemoModel(QueryId);
  return {
    props: {
      res, id: QueryId, server
    },
  };
}
