
import React, { useState } from 'react'
import { Button, Col, FloatingLabel, Form, Row } from 'react-bootstrap'
import { BusyIndicator } from '../components/BusyIndicator';
import { v4 as uuidv4 } from 'uuid';
import { BASE_URL, DOMAIN_URL } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
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
      navigator?.clipboard?.writeText(`${DOMAIN_URL}/winner/${uniqueCodeGenerated}`)
      // IE 11 - (backward browsers)
      window?.clipboardData?.setData(`${DOMAIN_URL}/winner/${uniqueCodeGenerated}`)
      setCopyOpMessage("Copied !")
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
      <div>
        <Row>
          <Col xs={3}></Col>
          <Col xs={6}> <Row>
            <Form className='mt-2'>
              <h5>Generate unique url to be share with associate in this screen and share with associate</h5>
              <FloatingLabel className="mb-2" controlId="formEmpName" label="Employee Name">
                <Form.Control type="text" placeholder="Enter employee name" value={empName} onChange={(e) => setempName(e.target.value)} />
              </FloatingLabel>
              <FloatingLabel className="mb-2" controlId="formEmpId" label="Employee Id">
                <Form.Control type="text" placeholder="0000" value={empId} onChange={(e) => setempId(e.target.value)} />
              </FloatingLabel>
              <FloatingLabel className="mb-2" controlId="formComments" label="Comments" >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  style={{ height: '100px' }}
                  value={comments} onChange={e => setcomments(e.target.value)}
                />
              </FloatingLabel>
              <Button variant="primary" className='m-2'
                onClick={onGenerateCode}
                disabled={!empName && !empId && !comments}
              >
                Generate unique url
              </Button>
              {uniqueCodeGenerated && <Button
                disabled={!winnerRewardInHRView}
                variant='outline-secondary' className='m-2' onClick={() => {
                  navigate("home", { state: { isHR: true, uniqueCodeGenerated: uniqueCodeGenerated, winnerRewardInHRView: winnerRewardInHRView } })
                }} >See winner's spin!</Button>}
            </Form>
            {<div className='mb-3'>
              {uniqueCodeGenerated && <div>
                Please share this url to assocaiate :

                <div>
                  {`${DOMAIN_URL}/winner/${uniqueCodeGenerated}`}
                  <span style={{ padding: '10px', cursor: 'pointer' }} onClick={onCopyUrlClick}>
                    <FontAwesomeIcon icon={faCopy} /></span>
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
          </Row></Col>
          <Col xs={3}></Col>

        </Row>
      </div>)
  }
}
