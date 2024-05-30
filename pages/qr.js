import * as htmlToImage from "html-to-image";
import { useEffect, useRef, useState } from "react";
import QRcode from "../components/QRcode";
import { useRouter } from "next/router";
export default function Home(props) {
  const printRef = useRef();
  // console.log("---->", props);
  const router = useRouter();
  const { value, logo, lang, server } = router.query;
  const [CopyText, setCopyText] = useState("Copy QRCode");

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
      console.log("Image copied.");
      setCopyText(lang == "en" ? "Copied QR Code" : "Kopierter QR-Code");

      setTimeout(() => {
        setCopyText(lang == "en" ? "Copy QR Code" : "QR-Code kopieren");
      }, 5000);
    } catch (err) {
      console.error(err.name, err.message);
    }
  };

  useEffect(() => {
    setCopyText(lang == "en" ? "Copy QR Code" : "QR-Code kopieren");
    console.log({ value, logo, lang, server });
  }, [lang]);

  return (
    <>
      <div
        className="qr"
        style={{ width: "220px", height: "220px", overflow: "hidden" }}
        onClick={() => printDocument()}
      >
        <>
          <div className="qroverlay">{CopyText}</div>
          <div ref={printRef}>
            <QRcode
              identifier={value}
              logo={
                logo == "null"
                  ? undefined
                  : logo
              }
            />
          </div>
        </>
      </div>
    </>
  );
}
