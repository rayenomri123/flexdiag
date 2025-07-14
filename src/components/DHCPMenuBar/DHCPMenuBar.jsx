import React from 'react'
import './DHCPMenuBar.css'
import { VscChevronRight } from 'react-icons/vsc'

const DHCPMenuBar = ({  isConfigSectionOpen,
                        setIsConfigSectionOpen,
                        isDhcpServerConfigOpen,
                        setisDhcpServerConfigOpen,
                        isDhcpClientConfigOpen,
                        setisDhcpClientConfigOpen
}) => {
  return (
    <div className='DHCPMenuBar-container'>
        <button className={`DHCPMenuBar-btn ${isDhcpServerConfigOpen ? 'open' : ''}`} onClick={() => {
          setIsConfigSectionOpen(true);
          setisDhcpServerConfigOpen(!isDhcpServerConfigOpen);
          setisDhcpClientConfigOpen(false);
        }}><VscChevronRight className='chvr'/><span>Server configuration</span></button>
        <button className={`DHCPMenuBar-btn ${isDhcpClientConfigOpen ? 'open' : ''}`} onClick={() => {
          setIsConfigSectionOpen(true);
          setisDhcpServerConfigOpen(false);
          setisDhcpClientConfigOpen(!isDhcpClientConfigOpen);
        }}><VscChevronRight className='chvr'/><span>Client configuration</span></button>
        <button className="DHCPMenuBar-btn"><VscChevronRight className='chvr'/><span>Logs</span></button>
    </div>
  )
}

export default DHCPMenuBar
