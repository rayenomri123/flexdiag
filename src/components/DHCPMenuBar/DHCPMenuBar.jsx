import React from 'react'
import './DHCPMenuBar.css'
import { VscChevronRight } from 'react-icons/vsc'

const DHCPMenuBar = ({  isConfigSectionOpen,
                        setIsConfigSectionOpen,
                        isDhcpConfigOpen,
                        setIsDhcpConfigOpen
}) => {
  return (
    <div className='DHCPMenuBar-container'>
        <button className={`DHCPMenuBar-btn ${isDhcpConfigOpen ? 'open' : ''}`} onClick={() => {
          setIsConfigSectionOpen(!isConfigSectionOpen);
          setIsDhcpConfigOpen(!isDhcpConfigOpen);
          console.log(isDhcpConfigOpen);
        }}><VscChevronRight className='chvr'/><span>Server configuration</span></button>
        <button className="DHCPMenuBar-btn"><VscChevronRight className='chvr'/><span>Client configuration</span></button>
        <button className="DHCPMenuBar-btn"><VscChevronRight className='chvr'/><span>Logs</span></button>
    </div>
  )
}

export default DHCPMenuBar
