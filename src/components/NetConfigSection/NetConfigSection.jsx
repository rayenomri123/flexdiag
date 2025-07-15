import React, { useState, useEffect } from 'react';
import './NetConfigSection.css';
import { VscSaveAll, VscChevronDown, VscSync } from 'react-icons/vsc';

const ServerConfigSection = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [interfaces, setInterfaces] = useState([]);
  const [selectedInterface, setSelectedInterface] = useState('');
  const [networkSetup, setNetworkSetup] = useState({});
  
  // form fields
  const [ipHost, setIpHost] = useState('');
  const [subnet, setSubnet] = useState('');
  const [poolVal1, setPoolVal1] = useState('');
  const [poolVal2, setPoolVal2] = useState('');

  // action logs: only hold one at a time
  const [log, setLog] = useState(null); // { message, valid }
  
  // add a log entry that auto-clears after 2s
  const addLog = (message, valid) => {
    setLog({ message, valid });
    setTimeout(() => setLog(null), 2000);
  };
  
  // load interfaces
  useEffect(() => {
    (async () => {
      try {
        const ifs = await window.networkAPI.getNetworkInterfaces();
        const names = Object.keys(ifs);
        setInterfaces(names);
        if (names.length > 0) setSelectedInterface(names[0]);
      } catch (e) {
        console.error('Failed fetching interfaces:', e);
        addLog('Failed fetching interfaces', false);
      }
    })();
  }, []);
  
  // load saved network_setup
  const fetchSetups = async () => {
    try {
      const rows = await window.dbAPI.fetchNetworkSetup();
      const lookup = {};
      rows.forEach(r => {
        lookup[r.interface] = {
          ip_host: r.ip_host,
          subnet: r.subnet,
          pool_val1: r.pool_val1,
          pool_val2: r.pool_val2,
        };
      });
      setNetworkSetup(lookup);
    } catch (e) {
      console.error('Failed fetching network_setup:', e);
      setNetworkSetup({});
      addLog('Failed fetching saved setups', false);
    }
  };
  useEffect(() => { fetchSetups(); }, []);
  
  // populate fields when interface or setup changes
  useEffect(() => {
    const cfg = networkSetup[selectedInterface];
    if (cfg) {
      setIpHost(cfg.ip_host);
      setSubnet(cfg.subnet);
      setPoolVal1(cfg.pool_val1);
      setPoolVal2(cfg.pool_val2);
    } else {
      setIpHost('');
      setSubnet('');
      setPoolVal1('');
      setPoolVal2('');
    }
  }, [selectedInterface, networkSetup]);
  
  // dropdown handlers
  const toggleDropdown = () => setIsDropdownOpen(o => !o);
  const selectInterface = iface => {
    setSelectedInterface(iface);
    setIsDropdownOpen(false);
  };
  useEffect(() => {
    const handler = e => {
      if (!e.target.closest('.interface-dropdown')) setIsDropdownOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);
  
  // save current form
  const handleSave = async () => {
    if (!selectedInterface) return;
    try {
      await window.dbAPI.saveNetworkSetup({
        interface: selectedInterface,
        ip_host: ipHost,
        subnet,
        pool_val1: poolVal1,
        pool_val2: poolVal2,
      });
      await fetchSetups();
      addLog(`Saved settings for "${selectedInterface}"`, true);
    } catch (e) {
      console.error('Save failed:', e);
      addLog(`Save failed for "${selectedInterface}": ${e.message || e}`, false);
    }
  };
  
  // clear all setups
  const handleClear = async () => {
    try {
      await window.dbAPI.clearNetworkSetup();
      await fetchSetups();
      addLog('Cleared all saved setups', true);
    } catch (e) {
      console.error('Clear failed:', e);
      addLog(`Clear failed: ${e.message || e}`, false);
    }
  };
  
  return (
    <div className='configsection-container'>
      <div className="title-config-section">Network Setup</div>

      <div className="main-config-section">
        {/* Interface selector */}
        <div className="input-section">
          <div className="input-label">Network Interface</div>
          <div className="interface-dropdown">
            <button
              className={`dropdown-btn ${isDropdownOpen ? 'rotated' : ''}`}
              onClick={toggleDropdown}
              disabled={!interfaces.length}
            >
              {selectedInterface || 'Select interface'}
              <VscChevronDown className={`chevron-icon ${isDropdownOpen ? 'rotated' : ''}`} />
            </button>
            {isDropdownOpen && (
              <ul className="dropdown-list">
                {interfaces.map(iface => (
                  <li key={iface} onClick={() => selectInterface(iface)}>{iface}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* IP Host / Gateway */}
        <div className="input-section">
          <div className="input-label">Host IP / Gateway IP</div>
          <input
            type="text"
            className='input-field'
            value={ipHost}
            onChange={e => setIpHost(e.target.value)}
            placeholder='192.168.2.1'
          />
        </div>

        {/* Subnet Mask */}
        <div className="input-section">
          <div className="input-label">Subnet Mask</div>
          <input
            type="text"
            className='input-field'
            value={subnet}
            onChange={e => setSubnet(e.target.value)}
            placeholder='255.255.255.0'
          />
        </div>

        {/* Pool Range */}
        <div className="input-section">
          <div className="input-label">Pool Range</div>
          <div className="two-inputs">
            <input
              type="text"
              className='input-field-pool-range'
              value={poolVal1}
              onChange={e => setPoolVal1(e.target.value)}
              placeholder='192.168.2.2'
            />
            <input
              type="text"
              className='input-field-pool-range'
              value={poolVal2}
              onChange={e => setPoolVal2(e.target.value)}
              placeholder='192.168.2.254'
            />
          </div>
        </div>
      </div>

      <div className="action-config-section">
        <div className="action-logs">
          {log && (
            <div className={`log ${log.valid ? 'valid' : 'invalid'}`}>{log.message}</div>
          )}
        </div>
        <VscSaveAll className='action-btn' onClick={handleSave} title="Save" />
        <VscSync    className='action-btn' onClick={handleClear} title="Clear All" />
      </div>
    </div>
  );
};

export default ServerConfigSection;