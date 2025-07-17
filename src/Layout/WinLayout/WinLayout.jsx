import React, { useState } from 'react'
import './WinLayout.css'
import TitleBar from '../TitleBar/TitleBar'
import SideBar from '../SideBar/SideBar'
import DHCPMenuBar from '../../components/DHCPMenuBar/DHCPMenuBar'
import NetConfigSection from '../../components/NetConfigSection/NetConfigSection'
import ConfigSection from '../../components/ConfigSection/ConfigSection'
import DHCPLogs from '../../components/DHCPLogs/DHCPLogs'
import Console from '../../components/Console/Console'

const WinLayout = () => {

  const [isSideBarBtnClicked, setIsSideBarBtnClicked] = useState(true);
  const [isDhcpBtnClicked, setIsDhcpBtnClicked] = useState(true);
  const [isConfigSectionOpen, setIsConfigSectionOpen] = useState(true);
  const [isNetConfigOpen, setisNetConfigOpen] = useState(false);
  const [isDhcpLogOpen, setIsDhcpLogOpen] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [consoleFull, setConsoleFull] = useState(false);
  const [dhcpOpen, setDhcpOpen] = useState(false);

  return (
    <div className='win-container'>
        <div className="titlebar-section">
            <TitleBar dhcpOpen={dhcpOpen} setDhcpOpen={setDhcpOpen} />
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
              {!consoleFull && (
                <div className="display-container">
                  {isDhcpLogOpen && (
                    <DHCPLogs />
                  )}
                </div>
              )}
              {consoleOpen && (
                <div className={`console-section ${consoleFull ? 'full' : ''}`}>
                  <Console 
                    consoleOpen={consoleOpen} 
                    setConsoleOpen={setConsoleOpen}
                    consoleFull={consoleFull} 
                    setConsoleFull={setConsoleFull}
                    dhcpOpen={dhcpOpen}
                    setDhcpOpen={setDhcpOpen}
                  />
                </div>
              )}

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