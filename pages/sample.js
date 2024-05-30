import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { isMobile } from "react-device-detect";
import { GetSampleModel } from "../components/Api/Model";
// import { QRCode } from "react-qrcode-logo";
// import QRCode from 'qrcode.react';
import * as htmlToImage from "html-to-image";
import { useEffect, useRef, useState } from "react";
const SampleModel = dynamic(() => import("../components/sampleModel"), {
  ssr: false,
});

import QRcode from "../components/QRcode";
import icon2 from "../public/icons/about-us.svg";
import icon1 from "../public/icons/cart.svg";
import icon3 from "../public/icons/mail.svg";
import JoinUsModal from "../components/joinUsModal";
import { Button, Result, Modal, notification, Space } from "antd";
import { useRouter } from "next/router";

export default function Home(props) {
  const [api, contextHolder] = notification.useNotification();
  const printRef = useRef();
  const router = useRouter();
  const [hostName, setHostName] = useState("");
  const [isIphone, setisIphone] = useState(false);
  const [Iscopy, setIscopy] = useState(false);
  const [model, setmodel] = useState();
  const [RunOnce, setRunOnce] = useState(false);

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
  const [IsPopUp, setIsPopUp] = useState(false);
  function JoinUsNotification() {
    const btn = (
      <Space>
        <Button type="link" onClick={() => api.destroy()}>
          Contact Us
        </Button>
        <a href={props?.res?.data?.model?.Bucket == process.env.NEXT_PUBLIC_ADMIN_BUCKETNAME? process.env.NEXT_PUBLIC_JOIN_US_URL: props?.res?.data?.model?.Bucket == process.env.NEXT_PUBLIC_MAKO_ADMIN_BUCKETNAME? process.env.NEXT_PUBLIC_MAKO_JOIN_US_URL: process.env.NEXT_PUBLIC_3DX_JOIN_US_URL} target="_blank">
          {" "}
          <Button type="primary" onClick={() => api.destroy()}>
            Join Now
          </Button>
        </a>
      </Space>
    );
    api.open({
      message: `Enjoying 3D view of the model? Click on the "Activate AR" button above to see the model in your own space via your mobile camera.`,
      description: (
        <>
        
          If you have any questions please reach out to our sales representative
          in your own region by clicking on "Contact US" and if you want to have
          a free trial with us then Click on the "Join now" button.
        </>
      ),
      btn,
      style: {
        width: 580,
      },
      duration: 0,
      placement: "bottomRight",
    });
  }
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
    if (!RunOnce) {
      setTimeout(() => {
        // setIsPopUp(true);
        JoinUsNotification();
        setRunOnce(true);
      }, 15000);
    }
  }, []);

  if (props.res.error != null) {
    return (
      <>
        <Result
          status="404"
          title="Model not found"
          subTitle="Sorry, this model is not available"
          // extra={<Button type="primary">Back Home</Button>}
        />
      </>
    );
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
        {contextHolder}
        <Head>
          <meta property="og:title" content={props?.res?.data?.defaultName} />
          <meta name="twitter:title" content={props?.res?.data?.defaultName} />

          <title>{props?.res?.data?.defaultName} || AR-4U</title>
          <meta
            property="og:description"
            content={props?.res?.data?.description}
          />
          <meta
            name="twitter:description"
            content={props?.res?.data?.description}
          />
          {/* <meta property="og:url" content="https://example.com/path"> */}
          <meta property="og:type" content="website" />
          <meta property="fb:app_id" content=""></meta>
          <meta
            property="og:image"
            content={props?.res?.data?.Thumbnail?.Location}
          />
          <meta property="og:image:width" content="1280" />
          <meta property="og:image:height" content="720 "></meta>
          <meta
            name="twitter:image"
            content={props?.res?.data?.Thumbnail?.Location}
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
        <Modal
          title="Join Free Trail"
          open={IsPopUp}
          onCancel={() => setIsPopUp(false)}
          okText="Join Us"
          onOk={() => router.push(props?.res?.data?.model?.Bucket == process.env.NEXT_PUBLIC_ADMIN_BUCKETNAME? process.env.NEXT_PUBLIC_JOIN_US_URL: props?.res?.data?.model?.Bucket == process.env.NEXT_PUBLIC_MAKO_ADMIN_BUCKETNAME? process.env.NEXT_PUBLIC_MAKO_JOIN_US_URL: process.env.NEXT_PUBLIC_3DX_JOIN_US_URL)}
        >
          <p>If you are enjoying our service. please join free trail</p>
        </Modal>

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
            <SampleModel model={props?.res?.data?.model?.key} id={props.id} />
            {isMobile ? null : (
              <div className="icon">
                <Image width={100} height={100} src={"/logo.png"} />
              </div>
            )}
          </div>

          <div className="right_box" id="divToPrint">
            <div className="qr" onClick={() => printDocument()}>
              <>
                <div className="qroverlay">Copy QRCode</div>
                <div ref={printRef}>
                  <QRcode
                    identifier={`${hostName}/sample?x=${props.id}`}
                    logo="/logo.png"
                  />
                </div>
              </>
            </div>
            <>
              <a href={props?.res?.data?.model?.Bucket == process.env.NEXT_PUBLIC_ADMIN_BUCKETNAME? process.env.NEXT_PUBLIC_JOIN_US_URL: props?.res?.data?.model?.Bucket == process.env.NEXT_PUBLIC_MAKO_ADMIN_BUCKETNAME? process.env.NEXT_PUBLIC_MAKO_JOIN_US_URL: process.env.NEXT_PUBLIC_3DX_JOIN_US_URL} target="_blank">
                <Button size="large">Join free trail</Button>
              </a>
            </>
          </div>
          <>
            <a
              className="purchaseBtn sm"
              href={props?.res?.data?.model?.Bucket == process.env.NEXT_PUBLIC_ADMIN_BUCKETNAME? process.env.NEXT_PUBLIC_JOIN_US_URL: props?.res?.data?.model?.Bucket == process.env.NEXT_PUBLIC_MAKO_ADMIN_BUCKETNAME? process.env.NEXT_PUBLIC_MAKO_JOIN_US_URL: process.env.NEXT_PUBLIC_3DX_JOIN_US_URL}
              target="_blank"
            >
              <>Join free trail</>
            </a>
          </>
        </div>
      </>
    );
  }
}

export async function getServerSideProps(context) {
  // console.log("---------->" , context)
  const QueryId = context?.query?.x;
  const res = await GetSampleModel(QueryId);
  return {
    props: {
      res,
      id: QueryId,
    },
  };
}
