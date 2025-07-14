import React, { useState, useEffect } from 'react'
import './ServerConfigSection.css'
import { VscSave, VscChevronDown } from 'react-icons/vsc'

const mockInterfaces = [
  'eth0',
  'wlan0',
  'lo',
];

const ServerConfigSection = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedInterface, setSelectedInterface] = useState(mockInterfaces[0]);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
  const selectInterface = (iface) => {
    setSelectedInterface(iface);
    setIsDropdownOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.interface-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className='serverconfigsection-container'>
      <div className="title-config-section">Server Configuration</div>

      <div className="main-config-section">
        <div className="input-section">
          <div className="input-label">Network Interface</div>
          <div className="interface-dropdown">
            <button className={`dropdown-btn ${isDropdownOpen ? 'rotated' : ''}`} onClick={toggleDropdown}>
              {selectedInterface}
              <VscChevronDown className={`chevron-icon ${isDropdownOpen ? 'rotated' : ''}`} />
            </button>
            {isDropdownOpen && (
              <ul className="dropdown-list">
                {mockInterfaces.map(iface => (
                  <li key={iface} onClick={() => selectInterface(iface)}>
                    {iface}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="input-section">
          <div className="input-label">Host IP / Gateway IP</div>
          <input type="text" placeholder='192.168.2.1' className='input-field'/>
        </div>

        <div className="input-section">
          <div className="input-label">Subnet Mask</div>
          <input type="text" placeholder='255.255.255.0' className='input-field'/>
        </div>

        <div className="input-section">
          <div className="input-label">Pool Range</div>
          <div className="two-inputs">
            <input type="text" placeholder='192.168.2.2' className='input-field-pool-range'/>
            <input type="text" placeholder='192.168.2.254' className='input-field-pool-range'/>
          </div>
        </div>
      </div>
      <div className="action-config-section">
            <VscSave className='save-btn'/>
      </div>
    </div>
  )
}

export default ServerConfigSection;
