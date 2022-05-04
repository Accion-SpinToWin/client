import React, { useEffect, useState } from 'react'
import { BusyIndicator } from '../components/BusyIndicator'
import { BASE_URL } from '../constants';
import { Reward } from '../components/Reward';
import { Col, Row } from 'react-bootstrap';

export const Dashboard = () => {
    // State variables
    const [isDashboardBusy, setIsDashboardBusy] = useState(false)
    const [rewards, setRewards] = useState([])
    // functions


    const fetchData = () => {
        setIsDashboardBusy(true)

        fetch(BASE_URL + '/rewards.json').then(r => r.json()).then(res => {
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
                        {rewardIdsList.map((rewardId, index, array) => {
                            return (<div>
                                {index === 0 && <div><Row>
                                    <Col></Col>
                                    <Col>Name </Col>
                                    <Col>Units Available  </Col>
                                    <Col>Cateory  </Col>
                                    <Col>Company Issued    </Col>
                                    <Col>Active  </Col>
                                    <Col>Added By  </Col>
                                    <Col></Col>
                                </Row></div>}
                                <Reward {...rewards[rewardId]}
                                    rewardId={rewardId+''}
                                    index={index}
                                    total={rewardIdsList.length}
                                    isReadOnly={true} />
                            </div>)
                        })}

                    </div>}</div></>

        )
    }

}
