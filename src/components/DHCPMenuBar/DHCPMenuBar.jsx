import React from 'react'
import './DHCPMenuBar.css'
import { VscChevronRight } from 'react-icons/vsc'

const DHCPMenuBar = ({  isConfigSectionOpen,
                        setIsConfigSectionOpen,
                        isNetConfigOpen,
                        setisNetConfigOpen,
                        isDhcpLogOpen,
                        setIsDhcpLogOpen
}) => {
  return (
    <div className='DHCPMenuBar-container'>
        <button className={`DHCPMenuBar-btn ${isNetConfigOpen ? 'open' : ''}`} onClick={() => {
          setIsConfigSectionOpen(true);
          setisNetConfigOpen(!isNetConfigOpen);
        }}><VscChevronRight className='chvr'/><span>Network setup</span></button>
        <button className='DHCPMenuBar-btn'><VscChevronRight className='chvr'/><span>Server management</span></button>
        <button className={`DHCPMenuBar-btn ${isDhcpLogOpen ? 'open' : ''}`} onClick={() => setIsDhcpLogOpen(!isDhcpLogOpen)}><VscChevronRight className='chvr'/><span>Logs</span></button>
    </div>
  )
}

export default DHCPMenuBar
