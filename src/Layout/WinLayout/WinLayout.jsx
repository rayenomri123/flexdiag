import React, { useState } from 'react'
import './WinLayout.css'
import TitleBar from '../TitleBar/TitleBar'
import SideBar from '../SideBar/SideBar'
import DHCPMenuBar from '../../components/DHCPMenuBar/DHCPMenuBar'
import NetConfigSection from '../../components/NetConfigSection/NetConfigSection'
import ConfigSection from '../../components/ConfigSection/ConfigSection'
import DHCPLogs from '../../components/DHCPLogs/DHCPLogs'

const WinLayout = () => {

  const [isSideBarBtnClicked, setIsSideBarBtnClicked] = useState(false);
  const [isDhcpBtnClicked, setIsDhcpBtnClicked] = useState(false);
  const [isConfigSectionOpen, setIsConfigSectionOpen] = useState(true);
  const [isNetConfigOpen, setisNetConfigOpen] = useState(false);
  const [isDhcpLogOpen, setIsDhcpLogOpen] = useState(false);

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
                    isNetConfigOpen={isNetConfigOpen}
                    setisNetConfigOpen={setisNetConfigOpen}
                    isDhcpLogOpen={isDhcpLogOpen}
                    setIsDhcpLogOpen={setIsDhcpLogOpen}
                  />
                )}
              </div>
            )}
            <div className="display-section">
              {isDhcpLogOpen && (
                <DHCPLogs />
              )}
                {/* <div className="console-section">
                    
                </div> */}
            </div>
            {isConfigSectionOpen && (
              <div className="config-section">
                {isNetConfigOpen ? (
                  <NetConfigSection />
                ):(
                  <ConfigSection /> 
                )}
              </div>
            )}
        </div>
    </div>
  )
}

export default WinLayout