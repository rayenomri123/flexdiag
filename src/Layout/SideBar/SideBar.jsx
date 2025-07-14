import React from 'react'
import './SideBar.css'
import { VscGitMerge } from 'react-icons/vsc'

const SideBar = () => {
  return (
    <div className='sidebar-container'>
      <button className="sidebar-btn">
        <VscGitMerge />
      </button>
    </div>
  )
}

export default SideBar
