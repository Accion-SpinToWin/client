import React, { useEffect, useState } from 'react'
import { BusyIndicator } from '../components/BusyIndicator'
import { BASE_URL } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Reward } from '../components/Reward';
import { Col, Row } from 'react-bootstrap';

export const Admin = () => {
    // State variables
    const [isDashboardBusy, setIsDashboardBusy] = useState(false)
    const [rewards, setRewards] = useState([])
    const [editingRewardId, setEditingRewardId] = useState(null)
    const [isNewAddition, setIsNewAddition] = useState(false);
    // functions
    const onAddReward = () => {
        let randomId = Math.ceil(Math.random() * 10000)
        setRewards({
            ...rewards, [`${randomId}+''`]: {
                name: '',
                units: '',
                category: '',
                companyIssued: '',
                active: null,
                addedBy: ''
            }
        })
        setEditingRewardId(`${randomId}+''`)
        setIsNewAddition(true)
    }
    const onTick = (newReward) => {
        setIsDashboardBusy(true)
        isNewAddition && delete newReward.rewardId;;
        isNewAddition && fetch(BASE_URL + `/rewards.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(newReward)
        }).then(res => res.json()).then(res => {
            fetchData();
            setEditingRewardId(null)
            setIsDashboardBusy(false)
            setIsNewAddition(false)

        }).catch(e => {
            setIsDashboardBusy(false)

            console.log("Exception at creating new reward ", e);
        })
        if (!isNewAddition) {
            fetch(BASE_URL + `/rewards/${editingRewardId}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newReward)
            }).then(res => res.json()).then(res => {
                fetchData();
                setEditingRewardId(null)
                setIsDashboardBusy(false)
                setIsNewAddition(false)

            }).catch(e => {
                setIsDashboardBusy(false)

                console.log("Exception at updating new reward ", e);
            })
        }
    }
    const onTickAbort = () => {
        if (isNewAddition) {
            delete rewards[`${editingRewardId}`];
            setRewards({ ...rewards })

        } else {
            fetchData();

        }
        setEditingRewardId(null)
        setIsNewAddition(false)

    }
    const onRemoveReward = (rewardId) => {
        setIsDashboardBusy(true)

        fetch(BASE_URL + `/rewards/${rewardId}.json`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then(res => {
            fetchData();
            setEditingRewardId(null)
            setIsDashboardBusy(false)

        }).catch(e => {
            setIsDashboardBusy(false)

            console.log("Exception at creating new reward ", e);
        })
    }
    const fetchData = () => {
        setIsDashboardBusy(true)

        fetch(BASE_URL + '/rewards.json').then(r => r.json()).then(res => {
            res=JSON.parse(JSON.stringify(res))
            Object.keys(res).map(x => {
                res[x].rewardId = x;
                //return x;
            }
            )
            setRewards(JSON.parse(JSON.stringify(res)));
            setEditingRewardId(null) // refresh state
            setIsDashboardBusy(false);
        }).catch(error => {
            console.log("Exception fetching rewards ", error);
            setIsDashboardBusy(false)
        })
    }
    const onEdit = (editingRewardId) => {
        setEditingRewardId(editingRewardId)
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
                        No rewards found. Start adding rewards by clicking plus. <FontAwesomeIcon icon={faPlus} onClick={onAddReward} />
                    </div>}
                    {rewardIdsList.length > 0 && <div>
                        {rewardIdsList.map((rewardId, index, array) => {
                            return (<div>
                                {index === 0 && <div style={{ fontWeight: '800' }}><Row>
                                    <Col></Col>
                                   
                                    <Col xs={3}>Name </Col>
                                    <Col>Units Available  </Col>
                                    <Col>Category  </Col>
                                    <Col>Company Issued    </Col>
                                    <Col>Active  </Col>
                                    <Col>Added By  </Col>
                                    <Col></Col>
                                </Row></div>}
                                <Reward {...rewards[rewardId]}
                                isAdminView={true}
                                    rewardId={rewardId + ''}
                                    index={index}
                                    total={rewardIdsList.length}
                                    editingRewardId={editingRewardId}
                                    onAdd={onAddReward}
                                    onTick={onTick}
                                    onTickAbort={onTickAbort}
                                    onEdit={() => onEdit(rewardId)}
                                    onRemove={() => onRemoveReward(rewardId)} />
                            </div>)
                        })}
                    </div>}</div></>

        )
    }


}
