import React, { useState } from 'react'
import './WinLayout.css'
import TitleBar from '../TitleBar/TitleBar'
import SideBar from '../SideBar/SideBar'
import DHCPMenuBar from '../../components/DHCPMenuBar/DHCPMenuBar'
import ServerConfigSection from '../../components/SeverConfigSection/ServerConfigSection'

const WinLayout = () => {

  const [isSideBarBtnClicked, setIsSideBarBtnClicked] = useState(false);
  const [isDhcpBtnClicked, setIsDhcpBtnClicked] = useState(false);
  const [isConfigSectionOpen, setIsConfigSectionOpen] = useState(false);
  const [isDhcpConfigOpen, setIsDhcpConfigOpen] = useState(false);

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
                    isDhcpConfigOpen={isDhcpConfigOpen}
                    setIsDhcpConfigOpen={setIsDhcpConfigOpen}
                  />
                )}
              </div>
            )}
            {/* <div className="display-section">
                <div className="console-section">
                    
                </div>
            </div> */}
            {isConfigSectionOpen && (
              <div className="config-section">
                {isDhcpConfigOpen && (
                  <ServerConfigSection />
                )}
              </div>
            )}
        </div>
    </div>
  )
}

export default WinLayout
