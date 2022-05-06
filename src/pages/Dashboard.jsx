import React, { useEffect, useState } from 'react'
import { BusyIndicator } from '../components/BusyIndicator'
import { BASE_URL } from '../constants';
import { Reward } from '../components/Reward';
import { Card, Col, Row, Table } from 'react-bootstrap';
export const RewardCards = ({ data }) => {
    let uniqueCategories = [...new Set(Object.keys(data).map(x => data[x].category.toLowerCase()))];
    return (<Row style={{ padding: '10px', margin: '10px' }}>
        {uniqueCategories.map((categoryName, index) => {
            return (<Col xs={3}>
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
    const [rewards, setRewards] = useState([])
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
        })
    }

    // Hooks
    useEffect(() => {
        fetchData()
    }, [])
    if (isDashboardBusy) {
        return (<BusyIndicator />)
    } else {
        let rewardIdsList = rewards ? Object.keys(rewards) : []
        return (
            <>
                <div>{rewardIdsList.length
                    === 0 && <div>
                        No rewards found. Contact Admin to add rewards in inventory
                    </div>}
                    {rewardIdsList.length > 0 && <div>
                        {
                            <RewardCards data={rewards} />
                        }
                        <center><h5>Table view</h5>
                        </center>
                        {rewardIdsList.map((rewardId, index, array) => {
                            return (<div>
                                {index === 0 && <div><Row>
                                    <Col></Col>
                                    <Col>Name </Col>
                                    <Col>Units Available  </Col>
                                    <Col>Category  </Col>
                                    <Col>Company Issued    </Col>
                                    <Col>Active  </Col>
                                    <Col>Added By  </Col>
                                    <Col></Col>
                                </Row></div>}
                                <Reward {...rewards[rewardId]}
                                    rewardId={rewardId + ''}
                                    index={index}
                                    total={rewardIdsList.length}
                                    isReadOnly={true} />

                            </div>)
                        })}


                    </div>}</div></>

        )
    }

}
