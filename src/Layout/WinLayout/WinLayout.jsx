import React from 'react'
import './WinLayout.css'
import TitleBar from '../TitleBar/TitleBar'
import SideBar from '../SideBar/SideBar'

const WinLayout = () => {
  return (
    <div className='win-container'>
        <div className="titlebar-section">
            <TitleBar />
        </div>
        <div className="main-win">
            <div className="sidebar-section">
              <SideBar />
            </div>
            {/* <div className="menubar-section">

            </div>
            <div className="display-section">
                <div className="console-section">
                    
                </div>
            </div>
            <div className="config-section">
            </div> */}
        </div>
    </div>
  )
}

export default WinLayout
