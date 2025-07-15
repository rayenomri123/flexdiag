import React, { useEffect, useState } from 'react'
import './TitleBar.css'
import { VscClose, VscChromeMinimize, VscBell, VscCircleLargeFilled } from 'react-icons/vsc'
import { CiLight, CiDark, CiWifiOn, CiWifiOff } from 'react-icons/ci'
import logo from '../../assets/logo.png'

const POLL_INTERVAL = 2000; // Check ethernet connectivity every 2s

const TitleBar = () => {
  
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkEthernet = async () => {
      const connected = await window.networkAPI.isEthernetConnected();
      if (!cancelled) {
        setIsConnected(connected);
      }
    };

    // initial check
    checkEthernet();

    // then poll every POLL_INTERVAL
    const handle = setInterval(checkEthernet, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(handle);
    };
  }, []);

  return (
    <div className='titlebar-container'>
        <div className={`connectivity-indicator ${isConnected ? 'connected' : ''}`}>
          <VscCircleLargeFilled />
        </div>
        <div className="appmenu-section">
          <img src={logo} alt="Ampere logo" className='app-logo'/>
          <div className="app-name">FlexDiag</div>
        </div>
        <div className="optioncontrols-section">
          <button className="ooptioncontrols-btn">
            <CiWifiOn className='ooptioncontrols-icon' size={17}/>
          </button>
          <button className="ooptioncontrols-btn">
            <CiLight className='ooptioncontrols-icon' size={17}/>
          </button>
          <button className="ooptioncontrols-btn">
            <VscBell className='ooptioncontrols-icon'/>
          </button>
        </div>
        <div className="wincontrols-section" >
            <button className="wincontrols-btn" onClick={() => window.windowControlsAPI.minimize()}>
                <VscChromeMinimize />
            </button>
            <button className="wincontrols-btn close" onClick={() => window.windowControlsAPI.close()}>
                <VscClose />
            </button>
        </div>
    </div>
  )
}

export default TitleBar
