import React from 'react';
import style from '../styles/joinUs.module.css';
import Link from 'next/link';
const JoinUsModal = ({close}) => {
      return (
            <div className={style.joinUsPopUp}>
                  <div className={style.wrap}>
                        <h1>Are you enjoying our service</h1>
                        <div className={style.Actions}>
                              <button onClick={close} style={{background: "gray"}}>No</button>
                             <a href={process.env.NEXT_PUBLIC_JoinUs}> <button>Yes, Join free trial</button> </a>

                               </div>
                  </div>
            </div>
      );
}

export default JoinUsModal;
