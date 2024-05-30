import React, { useEffect, useState } from 'react';

import { Result, Spin } from 'antd';
import AWS from 'aws-sdk';
import { AES, enc } from 'crypto-js';
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
// Configure AWS SDK
AWS.config.update({
  region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
  },
});
// Create an S3 instance
const s3 = new AWS.S3();
const ArView = () => {
  const router = useRouter();
  const { x } = router.query;

  const token = Cookies.get('token');
  const [err, seterr] = useState();
  const [linkExprie, setlinkExprie] = useState(false);
  const handleCookies = (isDesktop) => {
    const objectToEncrypt = {
      isDesktop: isDesktop,
    };

    // Convert the object to a JSON string
    const objectString = JSON.stringify(objectToEncrypt);

    // Encrypt the JSON string
    const encryptedData = AES.encrypt(objectString, process.env.NEXT_PUBLIC_TOKEN_SECRETKEY).toString();
    Cookies.set('token', encryptedData, { expires: 7 });
  }
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    let isMobile = true
    if (token) {
      // Decrypt the encrypted data
      const decryptedData = AES.decrypt(token, process.env.NEXT_PUBLIC_TOKEN_SECRETKEY).toString(enc.Utf8);

      // Parse the decrypted JSON string back to an object
      const decryptedObject = JSON.parse(decryptedData);
      if (decryptedObject.isDesktop) {
        isMobile = false
      }
    }
    if (isMobile) {
      if (userAgent.includes('android')) {
        handleCookies(false)
        if (x) {

          // Decrypt the encrypted data
          const decryptedData = AES.decrypt(x, process.env.NEXT_PUBLIC_TOKEN_SECRETKEY).toString(enc.Utf8);

          // Parse the decrypted JSON string back to an object
          const decryptedObject = JSON.parse(decryptedData);

          const link = decryptedObject.link
          const Model = decryptedObject.Model
          const currentTime = decryptedObject.currentTime; // Get the stored current time
          const tenMinutesInMilliseconds = 10 * 60 * 1000; // 10 minutes in milliseconds

          const now = new Date().getTime(); // Get the current time again

          // Check if the time is less than 10 minutes from the stored time
          if (now - currentTime > tenMinutesInMilliseconds) {
            // Time is less than 10 minutes ago
            setloading(false)
            setlinkExprie(true)
            return
          }
          const params = {
            Bucket: decryptedObject?.Bucket,
            Key: decryptedObject?.Key,
            Expires: 10 * 60,
          };

          s3.getSignedUrl('getObject', params, (err, data) => {
            if (err) {
              console.error('Error fetching file:', err);
            } else {

              const websiteUrl = `https://${window.location.host}/?x=${decryptedObject?.identifier}`;

              const intentLink = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(data)}&disable_occlusion=false&mode=ar_only&link=${encodeURIComponent(link)}&title=${encodeURIComponent(Model)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end`;
              // window.open(intentLink);
              // Create a new <a> element
              const linkElement = document.createElement('a');
              linkElement.href = intentLink; // Open in a new tab/window


              // Trigger a click on the <a> element to open the link
              linkElement.click();

            }
          });
        } else {
          seterr('model not found')

        }
      } else {
        handleCookies(true)
        setloading(false)
        seterr('not an android device')
      }
    }

    // Removing data from localStorage
    // localStorage.removeItem('token');


  }, [x, token]);
  return (

    <div style={{ width: '100vw', height: '100vh', display: 'grid', placeItems: "center" }}>
      {loading ? <Spin tip="Loading" size="large" style={{ textAlign: 'center' }}>
        {/* <div className="content" /> */}
      </Spin> : linkExprie? <>
        <Result
           status="403"
          title={'link expired'}
          subTitle="Sorry, this link is no more working."
        />
      </>:<>
        <Result
          status="warning"
          title={'AR not supported'}
          subTitle="Sorry, this device does not support AR."
        />
      </>}



    </div>
  );
}

export default ArView;

