import React from 'react'
import './SideBar.css'
import { VscGitMerge } from 'react-icons/vsc'

const SideBar = ({  isSideBarBtnClicked, 
                    setIsSideBarBtnClicked,
                    isDhcpBtnClicked,
                    setIsDhcpBtnClicked
}) => {

  

  return (
    <div className='sidebar-container'>
      <button className={`sidebar-btn ${isSideBarBtnClicked ? 'clicked' : ''}`} onClick={() => {
          setIsSideBarBtnClicked(!isSideBarBtnClicked);
          setIsDhcpBtnClicked(!isDhcpBtnClicked);
        }}>
        <VscGitMerge />
      </button>
    </div>
  )
}

export default SideBar