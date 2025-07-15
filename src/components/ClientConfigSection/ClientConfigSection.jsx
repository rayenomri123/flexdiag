import React from 'react'
import './ClientConfigSection.css'
import { VscSaveAll, VscTrash } from 'react-icons/vsc'

const ClientConfigSection = () => {
  return (
    <div className='clientconfigsection-container'>
        <div className="title-config-section">Client Configuration</div>
        <div className="main-config-section">
            <div className="input-section">
                <div className="input-label">Logical Address</div>
                <input type="text" placeholder='0x545' className='input-field'/>
            </div>
        </div>
        <div className="action-config-section">
            <VscSaveAll className='save-btn'/>
            <VscTrash className='save-btn'/>
        </div>
    </div>
  )
}

export default ClientConfigSection
