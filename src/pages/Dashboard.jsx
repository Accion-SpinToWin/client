import React, { useEffect, useState } from 'react'
import { BusyIndicator } from '../components/BusyIndicator'
import { BASE_URL } from '../constants';
import { Reward } from '../components/Reward';
import { Alert, Card, Col, Row, Table } from 'react-bootstrap';
export const RewardCards = ({ data }) => {
    let uniqueCategories = [...new Set(Object.keys(data).map(x => data[x].category.toLowerCase()))];
    return (<Row style={{ padding: '10px', margin: '10px' }}>
        {uniqueCategories.map((categoryName, index) => {
            return (<Col xs={6}>
                <Card style={{ margin: '5px' }} >
                    <Card.Img variant="top" src={`https://source.unsplash.com/random/300x200?sig=${Math.random() * 1000}`} />
                    <Card.Body>
                        <Card.Title>Category : {categoryName}</Card.Title>
                        <Card.Text>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Units</th>
                                        <th>Company Issued</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(data).map(x => data[x]).filter(x => x.category.toLowerCase().split(' ').join('') === categoryName.toLowerCase().split(' ').join('')).map(item => {
                                        return (<tr key={item.rewardId}>
                                            <td>{item.name}</td>
                                            <td>{item.units}</td>
                                            <td>{item.companyIssued}</td>
                                        </tr>)
                                    })}

                                </tbody>
                            </Table>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>)
        })}
    </Row>)
}
export const Dashboard = () => {
    // State variables
    const [isDashboardBusy, setIsDashboardBusy] = useState(false)
    const [rewards, setRewards] = useState([]);
    const [empCodeMapping, setEmpCodeMapping] = useState(null);
    const [uniqueCodeRewardMapping, setUniqueCodeRewardMapping] = useState(null)
    // functions


    const fetchData = () => {
        setIsDashboardBusy(true)

        fetch(BASE_URL + '/rewards.json').then(r => r.json()).then(res => {
            res = JSON.parse(JSON.stringify(res));
            Object.keys(res).map(x => {
                res[x].rewardId = x;
                //return x;
            }
            )
            setRewards(JSON.parse(JSON.stringify(res)));
            setIsDashboardBusy(false)
        }).catch(error => {
            console.log("Exception fetching rewards ", error);
            setIsDashboardBusy(false)
        });
        fetch(BASE_URL + '/emp-code-mapping.json').then(r => r.json()).then(res => {
            res = JSON.parse(JSON.stringify(res));
            setEmpCodeMapping(JSON.parse(JSON.stringify(res)));
        }).catch(error => {
            console.log("Exception fetching rewards ", error);
        })
        fetch(BASE_URL + '/uniquecode-reward-mapping.json').then(r => r.json()).then(res => {
            res = JSON.parse(JSON.stringify(res));
            setUniqueCodeRewardMapping(JSON.parse(JSON.stringify(res)));
        }).catch(error => {
            console.log("Exception fetching rewards ", error);
        })
    }

    // Hooks
    useEffect(() => {
        fetchData()
    }, [])
    if (isDashboardBusy) {
        return (<BusyIndicator />)
    } else {
        let rewardIdsList = rewards ? Object.keys(rewards) : [];
        let empCodeMappingIdsList = empCodeMapping ? Object.keys(empCodeMapping) : [];
        let uniqueCodeRewardMappingIdsList = uniqueCodeRewardMapping ? Object.keys(uniqueCodeRewardMapping) : [];
        return (
            <>
              <div>
              <div>{rewardIdsList.length
                    === 0 && <Alert>
                        No rewards found. Contact Admin to add rewards in inventory
                    </Alert>}
                    {rewardIdsList.length > 0 && <div>
                        {
                            <RewardCards data={rewards} />
                        }
                        <center><h4>Table view for available reward</h4>
                        </center>
                        {rewardIdsList.map((rewardId, index, array) => {
                            return (<div>
                                {index === 0 && <div><h5>
                                    <Row>
                                        <Col></Col>
                                        <Col xs={3}>Reward Id</Col>
                                        <Col xs={3}>Name </Col>
                                        <Col>Units Available  </Col>
                                        <Col>Category  </Col>
                                        <Col>Company Issued    </Col>
                                        <Col>Active  </Col>
                                        <Col>Added By  </Col>
                                        <Col></Col>
                                    </Row></h5></div>}
                                <Reward {...rewards[rewardId]}
                                    rewardId={rewardId + ''}
                                    index={index}
                                    total={rewardIdsList.length}
                                    isReadOnly={true} />

                            </div>)
                        })}


                    </div>}</div>

                <div style={{ margin: '50px', padding: '20px' }}>
                    {empCodeMappingIdsList.length === 0 && <Alert>No emp-code mapping found. Generate unique code URL and share it with Associate</Alert>}
                    {empCodeMappingIdsList?.length > 0 && <div>
                        <center><h4>Table view for emp-code mapping</h4></center>
                        {empCodeMappingIdsList.map((item, index) => {
                            if (index === 0) {
                                return (
                                    <div>
                                        <h5>
                                            <Row >
                                                <Col>Employee Name</Col>
                                                <Col>Employee Id</Col>
                                                <Col xs={3}>Unique Code</Col>
                                                <Col>Comments</Col>
                                                <Col>Inserted At</Col>
                                            </Row>
                                        </h5>
                                        <Row style={{ borderBottom: '1px solid grey' }}>
                                            <Col>{empCodeMapping[item].empName}</Col>
                                            <Col>{empCodeMapping[item].empId}</Col>
                                            <Col xs={3}>{empCodeMapping[item].uniqueCode}</Col>
                                            <Col>{empCodeMapping[item].comments}</Col>
                                            <Col>{empCodeMapping[item].insertedAt}</Col>
                                        </Row>
                                    </div>
                                )
                            } else {
                                return (
                                    <div>
                                        <Row style={{ borderBottom: '1px solid grey' }}>
                                            <Col>{empCodeMapping[item].empName}</Col>
                                            <Col>{empCodeMapping[item].empId}</Col>
                                            <Col xs={3}>{empCodeMapping[item].uniqueCode}</Col>
                                            <Col>{empCodeMapping[item].comments}</Col>
                                            <Col>{empCodeMapping[item].insertedAt}</Col>
                                        </Row>
                                    </div>
                                )
                            }
                        })}
                    </div>}
                </div>



                <div style={{ margin: '50px', padding: '20px' }}>
                    {uniqueCodeRewardMappingIdsList.length === 0 && <Alert>No emp-code mapping found. Generate unique code URL and share it with Associate</Alert>}
                    {uniqueCodeRewardMappingIdsList?.length > 0 && <div>
                        <center><h4>Table view for uniquecode-reward mapping</h4></center>
                        {uniqueCodeRewardMappingIdsList.map((item, index) => {
                            if (index === 0) {
                                return (
                                    <div>
                                        <h5>
                                            <Row >
                                                <Col xs={4}>Winner unique Code</Col>
                                                <Col xs={4}>Reward Id</Col>
                                                <Col >Inserted At</Col>
                                            </Row>
                                        </h5>
                                        <Row style={{ borderBottom: '1px solid grey' }}>
                                            <Col xs={4}>{uniqueCodeRewardMapping[item].winnerUniqueCode}</Col>
                                            <Col xs={4}>{uniqueCodeRewardMapping[item].rewardId}</Col>
                                            <Col>{uniqueCodeRewardMapping[item].insertedAt}</Col>
                                        </Row>
                                    </div>
                                )
                            } else {
                                return (
                                    <div>
                                        <Row style={{ borderBottom: '1px solid grey' }}>
                                            <Col xs={4}>{uniqueCodeRewardMapping[item].winnerUniqueCode}</Col>
                                            <Col xs={4}>{uniqueCodeRewardMapping[item].rewardId}</Col>
                                            <Col>{uniqueCodeRewardMapping[item].insertedAt}</Col>
                                        </Row>
                                    </div>
                                )
                            }
                        })}
                    </div>}
                </div>
              </div>
            </>

        )
    }

}
