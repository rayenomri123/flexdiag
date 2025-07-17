import React from 'react'
import './Console.css'
import { VscChromeClose, VscChromeMaximize, VscDebugConsole } from 'react-icons/vsc'

const Console = ({ 
    consoleOpen, 
    setConsoleOpen ,
    consoleFull,
    setConsoleFull,
    dhcpOpen,
    setDhcpOpen
}) => {
  return (
    <div className='console-container'>
      <div className="console-container-controls">
        <VscChromeMaximize className={`console-container-controls-icon ${consoleFull ? 'act' : ''}`} onClick={() => setConsoleFull(!consoleFull)}/>
        <VscChromeClose className='console-container-controls-icon' onClick={() => {
            setConsoleOpen(false);
            setConsoleFull(false);
        }}/> 
      </div>
      {dhcpOpen ? (
        <div className="console-container-output">

        </div>
      ):(
        <div className="console-container-init">
          <VscDebugConsole className='console-container-init-icon'/>
          <div className="console-container-init-title">Debug Console</div>
        </div>        
      )}

    </div>
  )
}

export default Console
