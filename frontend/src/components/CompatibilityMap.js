import React, { useState } from 'react';
import '../styles/CompatibilityMap.css';

const CompatibilityMap = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const compatibility = {
    'O-': { give: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], receive: ['O-'] },
    'O+': { give: ['O+', 'A+', 'B+', 'AB+'], receive: ['O-', 'O+'] },
    'A-': { give: ['A-', 'A+', 'AB-', 'AB+'], receive: ['O-', 'A-'] },
    'A+': { give: ['A+', 'AB+'], receive: ['O-', 'O+', 'A-', 'A+'] },
    'B-': { give: ['B-', 'B+', 'AB-', 'AB+'], receive: ['O-', 'B-'] },
    'B+': { give: ['B+', 'AB+'], receive: ['O-', 'O+', 'B-', 'B+'] },
    'AB-': { give: ['AB-', 'AB+'], receive: ['O-', 'A-', 'B-', 'AB-'] },
    'AB+': { give: ['AB+'], receive: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] },
  };

  const handleGroupClick = (group) => {
    setSelectedGroup(selectedGroup === group ? null : group);
  };

  return (
    <div className="compatibility-container">
      <div className="map-header">
        <h2>🧬 Interactive Compatibility Map</h2>
        <p>Select your blood group to see who you can save and who can save you.</p>
      </div>

      <div className="map-visual-wrapper">
        <div className="blood-groups-grid">
          {bloodGroups.map((group) => {
            const isSelected = selectedGroup === group;
            const canGive = selectedGroup && compatibility[selectedGroup].give.includes(group);
            const canReceive = selectedGroup && compatibility[selectedGroup].receive.includes(group);

            let statusClass = '';
            if (isSelected) statusClass = 'selected';
            else if (canGive && canReceive) statusClass = 'both';
            else if (canGive) statusClass = 'can-give';
            else if (canReceive) statusClass = 'can-receive';

            return (
              <div
                key={group}
                className={`blood-node ${statusClass}`}
                onClick={() => handleGroupClick(group)}
              >
                <div className="node-content">
                  <span className="group-name">{group}</span>
                  {isSelected && <div className="pulse-ring"></div>}
                </div>
                <div className="node-label">
                  {isSelected ? 'YOU' : canGive ? 'RECIPIENT' : canReceive ? 'DONOR' : ''}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Legend */}
        <div className="map-legend">
          <div className="legend-item">
            <span className="dot you"></span> Selected Group
          </div>
          <div className="legend-item">
            <span className="dot give"></span> Who You Can Give To
          </div>
          <div className="legend-item">
            <span className="dot receive"></span> Who You Can Receive From
          </div>
        </div>
      </div>

      {selectedGroup && (
        <div className="compatibility-details animate-in">
          <div className="detail-box give">
            <h4>🩸 You Can Give To:</h4>
            <div className="detail-groups">
              {compatibility[selectedGroup].give.map(g => <span key={g} className="badge">{g}</span>)}
            </div>
          </div>
          <div className="detail-box receive">
            <h4>💉 You Can Receive From:</h4>
            <div className="detail-groups">
              {compatibility[selectedGroup].receive.map(g => <span key={g} className="badge">{g}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompatibilityMap;
