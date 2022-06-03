
import React, { useState } from 'react'
import { Button, Col, FloatingLabel, Form, Row } from 'react-bootstrap'
import { BusyIndicator } from '../components/BusyIndicator';
import { v4 as uuidv4 } from 'uuid';
import { BASE_URL } from '../constants';
import { DOMAIN_URL } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Main.css';

export const Main = () => {
  const navigate = useNavigate();
  const [isBusy, setisBusy] = useState(false)
  const [empName, setempName] = useState(null);
  const [empId, setempId] = useState(null);
  const [comments, setcomments] = useState(null);
  const [uniqueCodeGenerated, setuniqueCodeGenerated] = useState(null);
  const [copyOpMessage, setCopyOpMessage] = useState('');
  const [winnerRewardInHRView, setWinnerRewardInHRView] = useState(null)


  const onGenerateCode = () => {
    // Save emp name, id , comments and unique code to db and then display in UI which can be shared.
    setisBusy(true);
    // let currentDate = new Date();
    let uniqueCode = uuidv4();
    //let genTime = currentDate.getFullYear() + '/' + currentDate.getMonth() + '/' + currentDate.getDate() + ' ' + currentDate.getHours() + 'hr:' + currentDate.getMinutes() + 'm:' + currentDate.getSeconds() + 's';
    fetch(BASE_URL + `/emp-code-mapping.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        empId: empId,
        uniqueCode: uniqueCode,
        empName: empName,
        comments: comments,
        insertedAt: new Date()
      })
    }).then(res => res.json()).then(res => {
      // res['name'] will have id of record in firebase
      setuniqueCodeGenerated(uniqueCode)
      setisBusy(false);
      ifWinnerSelectedReward(uniqueCode)

    }).catch(e => {
      setisBusy(false)
      console.log("Exception at creating emp and unique code generation ", e);
    })
  }
  const onCopyUrlClick = () => {
    try {
      navigator?.clipboard?.writeText(`${DOMAIN_URL}winner/${uniqueCodeGenerated}`)
      // IE 11 - (backward browsers)
      window?.clipboardData?.setData(`${DOMAIN_URL}winner/${uniqueCodeGenerated}`)
      setCopyOpMessage("The above URL has been copied!")
      setTimeout(() => { setCopyOpMessage('') }, 4000)
    } catch {
      console.log('Not able to copy.');
      setCopyOpMessage("Not copied")
      setTimeout(() => { setCopyOpMessage('') }, 4000)
    }

  }
  const ifWinnerSelectedReward = (uniqueCode) => {
    fetch(BASE_URL + `/uniquecode-reward-mapping.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json()).then(res => {
      let recordKeys = res && Object.keys(res);
      let selectedRewardRecordId = recordKeys?.filter(x => res[x].winnerUniqueCode === uniqueCode);
      if (selectedRewardRecordId?.length > 0) {
        selectedRewardRecordId = selectedRewardRecordId.slice(-1);
        setWinnerRewardInHRView(res[selectedRewardRecordId]);
      } else {
        setTimeout(() => ifWinnerSelectedReward(uniqueCode), 3000);
      }
    }).catch(e => {
      console.log("Not able to fetch Winners reward data");
    })
  }
  if (isBusy) {
    return <BusyIndicator />
  } else {
    return (
      <div className='sectionWrapper'>
        <div style={{ margin: '40px' }}>
          <img src="spin.png" alt="Spin to Win!" width="635" height="390" />
          {uniqueCodeGenerated && <div style={{ display: "flex", justifyContent: 'center' }}>
            <Button
              disabled={!winnerRewardInHRView}
              variant='outline-secondary' className='m-2' onClick={() => {
                navigate("home", { state: { isHR: true, uniqueCodeGenerated: uniqueCodeGenerated, winnerRewardInHRView: winnerRewardInHRView } })
              }} >See winner's spin!</Button></div>}
        </div>
        <div style={{ maxWidth: '430px', margin: '40px' }}>
          <Form>
            <span className='generateUnqiueURL'>Generate unique url to be share with associate in this screen and share with associate</span>
            <FloatingLabel className='mt-3' controlId="formEmpName" label="Employee Name">
              <Form.Control type="text" placeholder="Enter employee name" value={empName} onChange={(e) => setempName(e.target.value)} />
            </FloatingLabel>
            <FloatingLabel className='mt-3' controlId="formEmpId" label="Employee Id">
              <Form.Control type="text" placeholder="0000" value={empId} onChange={(e) => setempId(e.target.value)} />
            </FloatingLabel>
            <FloatingLabel className='mt-3' controlId="formComments" label="Comments" >
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: '100px' }}
                value={comments} onChange={e => setcomments(e.target.value)}
              />
            </FloatingLabel>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}> <Button variant="warning" style={{ margin: '20px 0' }}
              onClick={onGenerateCode}
              disabled={!empName && !empId && !comments}
            >
              Generate unique url
            </Button></div>

          </Form>
          {<div className='mb-3'>
            {uniqueCodeGenerated && <div>
              <span style={{ fontSize: '12px' }}>Please share this url to assocaiate</span>

              <div>
                <Row style={{display:'flex'}}>
                  <Col xs={8} style={{
                    backgroundColor: 'rgb(227 208 164)',
                    borderRadius: '15px', padding: '10px'
                  }}>
                    <span style={{ fontSize: '14px',wordBreak:"break-all" }}> {`${DOMAIN_URL}winner/${uniqueCodeGenerated}`}
                    </span>
                  </Col>
                  <Col xs={4}>
                    <Button variant="outline-warning"> <span style={{ padding: '10px', cursor: 'pointer' }} onClick={onCopyUrlClick}>
                      <FontAwesomeIcon icon={faCopy} />&nbsp;Copy</span></Button>
                  </Col>
                </Row>
                {copyOpMessage && <span style={{
                  fontWeight: '500',
                  fontStyle: 'italic',
                  backgroundColor: copyOpMessage === 'Copied !' ? 'green' : 'red',
                  color: 'white', padding: '5px', borderRadius: '5px'
                }}>
                  {copyOpMessage}
                </span>}
              </div>
            </div>}

          </div>
          }
        </div>
      </div>)
  }
}
