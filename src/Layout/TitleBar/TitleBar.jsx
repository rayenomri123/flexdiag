import React, { useEffect, useState } from 'react'
import './TitleBar.css'
import { VscClose, VscChromeMinimize, VscBell, VscCircleLargeFilled, VscColorMode, VscGitMerge } from 'react-icons/vsc'
import logo from '../../assets/logo.png'

const POLL_INTERVAL = 2000; // Check ethernet connectivity every 2s

const TitleBar = ({ dhcpOpen, setDhcpOpen}) => {
  
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

  const handleToggleDhcp = async () => {
    try {
      setDhcpOpen(!dhcpOpen);
      if (!dhcpOpen) {
        await window.dhcpAPI.start();
        console.log('DHCP started');
      } else {
        await window.dhcpAPI.stop();
        console.log('DHCP stopped');
      }
    } catch (err) {
      console.error('Error toggling DHCP:', err);
      alert('Failed to toggle DHCP. Check console for details.');
    }
  }

  const onDhcpClick = async () => {
    const connected = await window.networkAPI.isEthernetConnected();
    if (connected) {
      await handleToggleDhcp();
    }
  };

  return (
    <div className='titlebar-container'>
        <div className={`connectivity-indicator ${isConnected ? 'connected' : ''}`}>
          <VscCircleLargeFilled className='connectivity-indicator-icon'/>
        </div>
        <div className="appmenu-section">
          <img src={logo} alt="Ampere logo" className='app-logo'/>
          <div className="app-name">FlexDiag</div>
        </div>
        <div className="optioncontrols-section">
          <button className={`optioncontrols-btn ${dhcpOpen ? 'on' : 'off'}`} onClick={() => onDhcpClick()}>
              <VscGitMerge className='optioncontrols-icon1'/>
          </button>
          <button className="optioncontrols-btn">
            <VscColorMode className='optioncontrols-icon'/>
          </button>
          <button className="optioncontrols-btn">
            <VscBell className='optioncontrols-icon'/>
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
