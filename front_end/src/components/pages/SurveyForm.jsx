import React from 'react';

const SurveyForm = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Survey Form</h1>
      <p>This is the survey form page component.</p>
      <form style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>How satisfied are you with our service?</label>
          <select style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <option value="">Please select an option</option>
            <option value="very-satisfied">Very Satisfied</option>
            <option value="satisfied">Satisfied</option>
            <option value="neutral">Neutral</option>
            <option value="dissatisfied">Dissatisfied</option>
            <option value="very-dissatisfied">Very Dissatisfied</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>What features would you like to see improved?</label>
          <div style={{ marginBottom: '5px' }}>
            <input type="checkbox" id="feature1" />
            <label htmlFor="feature1" style={{ marginLeft: '5px' }}>User Interface</label>
          </div>
          <div style={{ marginBottom: '5px' }}>
            <input type="checkbox" id="feature2" />
            <label htmlFor="feature2" style={{ marginLeft: '5px' }}>Performance</label>
          </div>
          <div style={{ marginBottom: '5px' }}>
            <input type="checkbox" id="feature3" />
            <label htmlFor="feature3" style={{ marginLeft: '5px' }}>Customer Support</label>
          </div>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Additional Comments:</label>
          <textarea 
            placeholder="Please share any additional feedback..."
            rows="4"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        
        <button 
          type="submit" 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit Survey
        </button>
      </form>
    </div>
  );
};

export default SurveyForm;
