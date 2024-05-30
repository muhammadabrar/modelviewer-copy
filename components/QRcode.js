import React from "react";
import { QRCode } from "react-qrcode-logo";
import Image from "next/image";

const QRcode = (props) => {
  return (
    <div>
      <QRCode
        size={200}
        ecLevel="H"
        value={props?.identifier}
      />

      {props?.logo? <Image
        src={
          props?.logo || "/logo.png"
        }
        width="50"
        height={50}
        className="qrLogo"
        priority
        alt=""
      />: <p className="qrLogo">Logo</p>}
    </div>
  );
};

export default QRcode;
