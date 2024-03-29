import * as React from 'react';
import { useState } from 'react';
import Clock from 'react-live-clock';
import { ActiveSessionManager, ExcelManager } from '../Controller';
import { prefilledResponses } from '../Model';
import Utils from '../Utils';

const MainToolsView = (props) => {
  const [merchantHistory, updateMerchantHistory] = useState(
    props.userCallHistory
  );
  const [changeColor, updateClass] = useState('');
  const [displayFields, updateDisplay] = useState(
    Utils.generateNewDisplayFieldObject()
  );

  // MARK: If Call was populated from historical call history or is a new record after clearing. // TODO: <-----------------------------------------------
  const [toggleSubmitOrToggle, updateSubmitOrToggle] = useState(true);

  // MARK: Selected PreWritten Response
  const [selectedOption, updateSelectedOption] = useState('');

  // MARK: Radio Buttons State
  const [selected, setSelected] = useState('DBA Confirmed');

  // MARK: Create Output for Export of all Fields
  const exportOutput = (): string => {
    return `Caller Name: ${displayFields.callerName}\nTitle: ${displayFields.callerTitle}\nSecondary Verification: ${displayFields.sv}\nReason: ${displayFields.callerReason} - no FQA.`;
  };

  // MARK: Submit Handler after submitting the form.
  const submitHandler = (event) => {
    event.preventDefault();
    const output = exportOutput();

    navigator.clipboard.writeText(output);

    updateDisplay(Utils.generateNewDisplayFieldObject());

    if (displayFields.index > -1) {
      console.log('Already Exists in database');

      merchantHistory[displayFields.index] = displayFields;
      updateMerchantHistory([...merchantHistory]);
    } else {
      merchantHistory.push(displayFields);
      displayFields.index = merchantHistory.length - 1;
      updateMerchantHistory([...merchantHistory]);
    }

    props.updateExcelHandler(displayFields);

    setSelected('DBA Confirmed');
    updateSelectedOption('');

    ActiveSessionManager.getActiveSession().userCallHistory = [
      ...merchantHistory,
    ];

    ActiveSessionManager.updateActiveUserCallHistoryInLocalStore();
  };

  // MARK: Handles any input field changes.
  const handleChange = (event) => {
    const field: string = event.target.id;

    if (field === 'mid' && event.target.value.length >= 7) {
      updateClass('changeMIDColor');
    } else if (field === 'mid' && event.target.value.length < 7) {
      updateClass('');
    }

    const newObj = {
      ...displayFields,
    };

    if (field === 'sv') {
      setSelected(event.target.value);
    }

    newObj[field] = event.target.value;
    updateDisplay(newObj);
  };

  // MARK: Update Display Field with Prefilled Options
  const populateTextAreaWithPrefilledOptions = (event) => {
    let prefilledReason: string =
      prefilledResponses[event.target.value].filled_reason;

    if (+event.target.value >= prefilledResponses.length - 2) {
      prefilledReason += Utils.getTodaysDate();
    }

    updateSelectedOption(event.target.value);
    updateDisplay({
      ...displayFields,
      callerReason: prefilledReason,
    });
  };

  // MARK: Populate Input Fields with Historical Call Data
  const populateInputFieldsWithHistoricalData = (event) => {
    const field = event.target.value;
    updateDisplay(merchantHistory[field]);
    console.log(displayFields);
  };

  // MARK: Populate Options
  const options = prefilledResponses.map((value, index: number) => {
    return (
      <option key={index} value={index}>
        {value.option}
      </option>
    );
  });

  // MARK: Populate Historical Options
  const historyOptions = merchantHistory.map((merchant, index) => {
    return (
      <option key={index} value={index}>
        {merchant.mid + ' - ' + merchant.dba}
      </option>
    );
  });

  // MARK: Copy DBA to Clip Board
  const copyDBAToClipboard = () => {
    navigator.clipboard.writeText(displayFields.dba);
  };

  // MARK: Copy Reason to Clip Board
  const copyReasonToClipboard = () => {
    navigator.clipboard.writeText(displayFields.callerReason);
  };

  // MARK: Copy All Form Fields to the clip board
  const copyAllFormFieldsToClipboard = (): void => {
    navigator.clipboard.writeText(exportOutput());
  };

  // Copies MID to the Clip Board
  const copyMIDToClipBoard = () => {
    navigator.clipboard.writeText(displayFields.mid);
  };

  // MARK: Clears all Input Fields
  const clearFields = () => {
    updateDisplay(Utils.generateNewDisplayFieldObject());
  };

  // MARK: Clears Input MID Field
  const clearMID = () => {
    updateDisplay({
      ...displayFields,
      mid: '',
    });
  };

  // MARK: Gets the active session userName.
  let userName = ActiveSessionManager.getActiveSession().userName;

  // ==========================================================================
  // MARK: TEST NEW FEATURED FUNCTIONS HERE BELOW
  // ==========================================================================
  const testNewFeatures = (): void => {
    console.log('Testing new features button');

    console.log(merchantHistory);
  };

  return (
    <div>
      <div className="navigation">
        <div className="navigation-logo">User: {userName}</div>
        <button onClick={props.logOutOfToolsHandler}>Log Out</button>
      </div>
      <div className="top-display">
        <h1>Caller Info</h1>
        <h3>
          MID: <span className={changeColor}>{displayFields.mid}</span>
        </h3>
        <h3>Full Name: {displayFields.callerName}</h3>
        <h3>Title: {displayFields.callerTitle}</h3>
        <h3>DBA: {displayFields.dba}</h3>
        <h3>SV: {displayFields.sv}</h3>
        <h3>Reason for Call: {displayFields.callerReason}</h3>
        <div className="field-clock">
          <div className="field-clock-calls">
            Number of calls made: {merchantHistory.length}
          </div>
          <div>
            Time:{' '}
            <Clock
              format={'HH:mm:ss'}
              ticking={true}
              timezone={'US/Mountain'}
            />
          </div>
        </div>
      </div>
      <div className="controls-container">
        <form onSubmit={submitHandler}>
          <div className="control">
            <label htmlFor="caller-mid">Merchant Identifier (MID)</label>
            <input
              type="text"
              id="mid"
              onChange={handleChange}
              value={displayFields.mid}
            />
          </div>
          <div className="control">
            <label htmlFor="caller-full-name">Full Name </label>
            <input
              type="text"
              id="callerName"
              onChange={handleChange}
              value={displayFields.callerName}
            />
          </div>
          <div className="control">
            <label htmlFor="caller-title">Title </label>
            <input
              type="text"
              id="callerTitle"
              onChange={handleChange}
              value={displayFields.callerTitle}
            />
          </div>
          <div className="control">
            <label htmlFor="caller-dba">DBA</label>
            <input
              type="text"
              id="dba"
              onChange={handleChange}
              value={displayFields.dba}
            />
          </div>
          <div className="control-radio-btns">
            <input
              type="radio"
              value="Could Not Verify"
              id="sv"
              name="confirmation"
              onChange={handleChange}
              checked={selected === 'Could Not Verify'}
            />{' '}
            Could Not Verify
            <input
              type="radio"
              value="DBA Confirmed"
              id="sv"
              name="confirmation"
              onChange={handleChange}
              checked={selected === 'DBA Confirmed'}
            />{' '}
            DBA Confirmed
            <input
              type="radio"
              value="Bank Account"
              name="confirmation"
              id="sv"
              onChange={handleChange}
              checked={selected === 'Bank Account'}
            />{' '}
            Bank Account
            <input
              type="radio"
              value="SSN"
              id="sv"
              name="confirmation"
              onChange={handleChange}
              checked={selected === 'SSN'}
            />{' '}
            SSN
            <input
              type="radio"
              value="PSS ISO Confirmed"
              id="sv"
              name="confirmation"
              onChange={handleChange}
              checked={selected === 'PSS ISO Confirmed'}
            />{' '}
            ISO Confirmed
          </div>
          <div className="control">
            <label htmlFor="new-password">Reason for the Call </label>
            <textarea
              name="message"
              rows="10"
              cols="30"
              onChange={handleChange}
              id="callerReason"
              value={displayFields.callerReason}
            ></textarea>
          </div>
          <div className="control">
            <button>Submit</button>
          </div>
        </form>
        <div className="controls-options-container">
          <div className="controls-options">
            <select
              name="prefilled-options"
              id="prefilled_options"
              onChange={populateTextAreaWithPrefilledOptions}
              value={selectedOption}
            >
              {options}
            </select>
          </div>
          <div className="controls-options-history">
            {' '}
            <select
              size={15}
              name="history_options"
              id="history_options"
              onChange={populateInputFieldsWithHistoricalData}
            >
              {historyOptions}
            </select>
          </div>
          <div className="controls-links">
            <label>Sites: </label>
            <a
              href="https://merchantcenter.transit-pass.com/jsp/vt/jsp/index.jsp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button>Merchant Center</button>
            </a>
            <a
              href="https://www.mreports.com/sso/login?service=https%3A%2F%2Fwww.mreports.com%2Fportal%2Fstart%2Ftransfirst"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button>CBOSS</button>
            </a>
          </div>
        </div>
        <div className="btn-controls">
          <button onClick={copyMIDToClipBoard}>Copy MID</button>
          <button onClick={copyDBAToClipboard}>Copy DBA</button>
          <button onClick={copyReasonToClipboard}>Copy Reason</button>
          <button onClick={copyAllFormFieldsToClipboard}>
            Copy All Fields
          </button>
          <div className="btn-controls-divider"></div>
          <button onClick={clearMID}>Clear MID</button>
          <button onClick={clearFields}>Clear All Fields</button>
          <button onClick={testNewFeatures}>Testing</button>
        </div>
      </div>
      <section className="footer"></section>
    </div>
  );
};

export default MainToolsView;
