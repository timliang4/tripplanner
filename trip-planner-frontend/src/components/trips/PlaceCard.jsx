import React, { useState } from 'react';
import PlaceSearch from '../map/PlaceSearch';

const PlaceCard = ({ 
  place, 
  index, 
  isSelected, 
  onClick, 
  onRemove, 
  onUpdateNotes,
  onAddPlaceAfter,
  onAddPlaceBefore,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  tripId
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(place.notes || '');
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [isAddingBefore, setIsAddingBefore] = useState(false);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [expandedActivities, setExpandedActivities] = useState({});
  const [isHoveringNotes, setIsHoveringNotes] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [editingActivityNotes, setEditingActivityNotes] = useState(null);
  const [activityNotes, setActivityNotes] = useState('');

  const handleNotesSubmit = () => {
    onUpdateNotes(notes);
    setIsEditingNotes(false);
  };

  const handleCardClick = (e) => {
    // Don't trigger card click when clicking on buttons or inputs
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'TEXTAREA' || isEditingNotes) return;
    onClick();
  };

  const handleMinimizeToggle = (e) => {
    e.stopPropagation(); // Prevent card click
    setIsMinimized(!isMinimized);
  };

  const toggleActivityExpansion = (activityIndex) => {
    setExpandedActivities(prev => ({
      ...prev,
      [activityIndex]: !prev[activityIndex]
    }));
  };

  const handleAddActivity = async (activityData) => {
    await onAddActivity(tripId, index, activityData);
    setIsAddingActivity(false);
  };

  const handleUpdateActivityNotes = async (activityIndex, newNotes) => {
    const updatedActivity = {
      ...place.activities[activityIndex],
      notes: newNotes
    };
    await onUpdateActivity(tripId, index, activityIndex, updatedActivity);
  };

  return (
    <div className="place-card-wrapper">
      {isAddingBefore ? (
        <div className="add-place-form before">
          <h5>Add place before {place.name}</h5>
          <PlaceSearch 
            onPlaceSelected={(newPlace) => {
              onAddPlaceBefore(newPlace);
              setIsAddingBefore(false);
            }}
          />
          <button className="cancel-button" onClick={() => setIsAddingBefore(false)}>Cancel</button>
        </div>
      ) : (
        <div className="add-place-button before" onClick={() => setIsAddingBefore(true)}>
          <div className="add-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <span>Add Place</span>
        </div>
      )}

      <div className={`place-card ${isSelected ? 'selected' : ''} ${isMinimized ? 'minimized' : ''}`} onClick={handleCardClick}>
        <div className="place-index">{index + 1}</div>
        
        <button className="minimize-toggle" onClick={handleMinimizeToggle}>
          {isMinimized ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          )}
        </button>
        
        <h4 className="place-name">{place.name}</h4>
        
        <div className={`place-card-content ${isMinimized ? 'hidden' : ''}`}>
          <p className="place-address">{place.address}</p>
          
          {isEditingNotes ? (
            <div className="notes-editor">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this place..."
                autoFocus
                className="styled-textarea"
              />
              <div className="notes-actions">
                <button className="notes-button save-button" onClick={handleNotesSubmit}>Save</button>
                <button className="notes-button cancel-button" onClick={() => setIsEditingNotes(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              {place.notes ? (
                <div 
                  className="place-notes"
                  onMouseEnter={() => setIsHoveringNotes(true)}
                  onMouseLeave={() => setIsHoveringNotes(false)}
                >
                  {isHoveringNotes && (
                    <div className="edit-icon" onClick={() => setIsEditingNotes(true)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </div>
                  )}
                  <p>{place.notes}</p>
                </div>
              ) : (
                <button className="add-notes-button" onClick={() => setIsEditingNotes(true)}>Add Notes</button>
              )}
            </>
          )}

          {/* Activities Section */}
          <div className="activities-section">
            <div className="activities-header">
              <h5>Activities</h5>
              <button className="add-activity-button" onClick={() => setIsAddingActivity(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Activity
              </button>
            </div>

            {isAddingActivity && (
              <div className="add-activity-form">
                <PlaceSearch 
                  onPlaceSelected={handleAddActivity}
                  isActivity={true}
                />
                <button className="cancel-button" onClick={() => setIsAddingActivity(false)}>Cancel</button>
              </div>
            )}

            <div className="activities-list">
              {place.activities?.map((activity, activityIndex) => (
                <div key={activity.activityId || `activity_${activity.placeId}_${activityIndex}`} className="activity-item">
                  <div className="activity-header" onClick={() => toggleActivityExpansion(activityIndex)}>
                    <div className="activity-name">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          transform: expandedActivities[activityIndex] ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                      <span>{activity.name}</span>
                    </div>
                    <div className="activity-actions">
                      <button onClick={(e) => {
                        e.stopPropagation();
                        onDeleteActivity(tripId, index, activityIndex);
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {expandedActivities[activityIndex] && (
                    <div className="activity-details">
                      <p className="activity-address">{activity.address}</p>
                      {editingActivityNotes === activityIndex ? (
                        <div className="notes-editor">
                          <textarea
                            value={activityNotes}
                            onChange={(e) => setActivityNotes(e.target.value)}
                            placeholder="Add notes about this activity..."
                            autoFocus
                            className="styled-textarea"
                          />
                          <div className="notes-actions">
                            <button 
                              className="notes-button save-button" 
                              onClick={() => {
                                handleUpdateActivityNotes(activityIndex, activityNotes);
                                setEditingActivityNotes(null);
                              }}
                            >
                              Save
                            </button>
                            <button 
                              className="notes-button cancel-button" 
                              onClick={() => {
                                setEditingActivityNotes(null);
                                setActivityNotes('');
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="activity-notes">
                          {activity.notes ? (
                            <>
                              <p>{activity.notes}</p>
                              <button onClick={() => {
                                setActivityNotes(activity.notes);
                                setEditingActivityNotes(activityIndex);
                              }}>Edit Notes</button>
                            </>
                          ) : (
                            <button onClick={() => {
                              setActivityNotes('');
                              setEditingActivityNotes(activityIndex);
                            }}>Add Notes</button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="place-actions">
            <button onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}>Remove</button>
          </div>
        </div>
      </div>

      {isAddingPlace ? (
        <div className="add-place-form after">
          <h5>Add place after {place.name}</h5>
          <PlaceSearch 
            onPlaceSelected={(newPlace) => {
              onAddPlaceAfter(newPlace);
              setIsAddingPlace(false);
            }}
          />
          <button className="cancel-button" onClick={() => setIsAddingPlace(false)}>Cancel</button>
        </div>
      ) : (
        <div className="add-place-button after" onClick={() => setIsAddingPlace(true)}>
          <div className="add-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <span>Add Place</span>
        </div>
      )}
    </div>
  );
};

export default PlaceCard;
