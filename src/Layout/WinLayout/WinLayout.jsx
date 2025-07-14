import React, { useState } from 'react'
import './WinLayout.css'
import TitleBar from '../TitleBar/TitleBar'
import SideBar from '../SideBar/SideBar'
import DHCPMenuBar from '../../components/DHCPMenuBar/DHCPMenuBar'
import ServerConfigSection from '../../components/SeverConfigSection/ServerConfigSection'
import ClientConfigSection from '../../components/ClientConfigSection/ClientConfigSection'

const WinLayout = () => {

  const [isSideBarBtnClicked, setIsSideBarBtnClicked] = useState(false);
  const [isDhcpBtnClicked, setIsDhcpBtnClicked] = useState(false);
  const [isConfigSectionOpen, setIsConfigSectionOpen] = useState(false);
  const [isDhcpServerConfigOpen, setisDhcpServerConfigOpen] = useState(false);
  const [isDhcpClientConfigOpen, setisDhcpClientConfigOpen] = useState(false);

  return (
    <div className='win-container'>
        <div className="titlebar-section">
            <TitleBar />
        </div>
        <div className="main-win">
            <div className="sidebar-section">
              <SideBar 
                isSideBarBtnClicked={isSideBarBtnClicked}
                setIsSideBarBtnClicked={setIsSideBarBtnClicked} 
                isDhcpBtnClicked={isDhcpBtnClicked}
                setIsDhcpBtnClicked={setIsDhcpBtnClicked}
              />
            </div>
            {isSideBarBtnClicked && (
              <div className="menubar-section">
                {isDhcpBtnClicked && (
                  <DHCPMenuBar 
                    isConfigSectionOpen={isConfigSectionOpen}
                    setIsConfigSectionOpen={setIsConfigSectionOpen}
                    isDhcpServerConfigOpen={isDhcpServerConfigOpen}
                    setisDhcpServerConfigOpen={setisDhcpServerConfigOpen}
                    isDhcpClientConfigOpen={isDhcpClientConfigOpen}
                    setisDhcpClientConfigOpen={setisDhcpClientConfigOpen}
                  />
                )}
              </div>
            )}
            {/* <div className="display-section">
                <div className="console-section">
                    
                </div>
            </div> */}
            {isConfigSectionOpen && (isDhcpClientConfigOpen || isDhcpServerConfigOpen)  && (
              <div className="config-section">
                {isDhcpServerConfigOpen && (
                  <ServerConfigSection />
                )}
                {isDhcpClientConfigOpen && (
                  <ClientConfigSection />
                )}
              </div>
            )}
        </div>
    </div>
  )
}

export default WinLayout
