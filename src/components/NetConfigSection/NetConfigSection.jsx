import React, { useState, useEffect } from 'react';
import './NetConfigSection.css';
import { VscSaveAll, VscChevronDown, VscSync } from 'react-icons/vsc';

const ServerConfigSection = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedInterface, setSelectedInterface] = useState('');
  const [interfaces, setInterfaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch network interfaces on component mount
  useEffect(() => {
    const fetchInterfaces = async () => {
      setIsLoading(true);
      try {
        const interfacesObj = await window.networkAPI.getNetworkInterfaces();
        const interfaceNames = Object.keys(interfacesObj);
        setInterfaces(interfaceNames);
        if (interfaceNames.length > 0) {
          setSelectedInterface(interfaceNames[0]);
        }
      } catch (error) {
        console.error('Failed to fetch network interfaces:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterfaces();
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  // Select an interface and close dropdown
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
    <div className='configsection-container'>
      <div className="title-config-section">Network Setup</div>

      <div className="main-config-section">
        <div className="input-section">
          <div className="input-label">Network Interface</div>
          <div className="interface-dropdown">
            <button
              className={`dropdown-btn ${isDropdownOpen ? 'rotated' : ''}`}
              onClick={toggleDropdown}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : selectedInterface || 'Select interface'}
              <VscChevronDown className={`chevron-icon ${isDropdownOpen ? 'rotated' : ''}`} />
            </button>
            {isDropdownOpen && !isLoading && (
              <ul className="dropdown-list">
                {interfaces.map(iface => (
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
          <input type="text" placeholder='192.168.2.1' className='input-field' />
        </div>

        <div className="input-section">
          <div className="input-label">Subnet Mask</div>
          <input type="text" placeholder='255.255.255.0' className='input-field' />
        </div>

        <div className="input-section">
          <div className="input-label">Pool Range</div>
          <div className="two-inputs">
            <input type="text" placeholder='192.168.2.2' className='input-field-pool-range' />
            <input type="text" placeholder='192.168.2.254' className='input-field-pool-range' />
          </div>
        </div>
      </div>

      <div className="action-config-section">
        <VscSync className='save-btn' />
        <VscSaveAll className='save-btn' />
      </div>
    </div>
  );
};

export default ServerConfigSection;