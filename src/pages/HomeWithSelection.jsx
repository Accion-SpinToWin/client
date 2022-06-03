import React, { useState } from 'react'
import { Dropdown, Row } from 'react-bootstrap'
import { BusyIndicator } from '../components/BusyIndicator'
import { BASE_URL } from '../constants'
import './Home.css'
import { useEffectOnce } from '../utilities/Common'
import WheelHRSelection from '../components/WheelHRSelection'

export const HomeWithSelection = () => {
    const [isBusy, setIsBusy] = useState(true);
    const [rewards, setRewards] = useState(null);
    const [empCodeMapping, setEmpCodeMapping] = useState(null)
    const [selected, setSelected] = useState(null);
    const [rewardWon, setRewardWon] = useState(null)

    //functions
    const fetchData = () => {
        setIsBusy(true);
        fetch(BASE_URL + `/rewards.json`).then(res => res.json()).then(r => {
            r = JSON.parse(JSON.stringify(r));
            Object.keys(r).map(x => {
                r[x].rewardId = x;
            }
            )
            setRewards(JSON.parse(JSON.stringify(r)));
        }).catch(error => {
            console.log("Exception fetching rewards", error);
            setIsBusy(false)
        })
        fetch(BASE_URL + `/emp-code-mapping.json`).then(res => res.json()).then(r => {
            r = JSON.parse(JSON.stringify(r));
            Object.keys(r).map(x => {
                r[x].rewardId = x;
            }
            )
            setEmpCodeMapping(JSON.parse(JSON.stringify(r)));
            setIsBusy(false)
        }).catch(error => {
            console.log("Exception fetching emp-code-mapping", error);
            setIsBusy(false)
        })
    }
    const onSelect = (params) => {
        console.log(params);
        setSelected(params);
        setRewardWon(null)
        fetch(BASE_URL + `/emp-code-mapping/${params}.json`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res === null) {
                    throw Error("No reward found!")
                } else {
                    fetch(BASE_URL + `/uniquecode-reward-mapping.json`).then(res1 => res1.json()).then(res1 => {
                        let recordOfUniqueCode = Object.keys(res1).filter(x => res1[x].winnerUniqueCode === res.uniqueCode);
                        if (rewards[res1[recordOfUniqueCode[0]]?.rewardId]) {
                            console.log(rewards[res1[recordOfUniqueCode[0]].rewardId]);
                            setRewardWon(rewards[res1[recordOfUniqueCode[0]].rewardId])
                        } else {
                            console.log("No Reward found");
                        }

                    })
                }
            }).catch(e => {
                console.log("Error " + `/emp-code-mapping/${params}.json `, e);
            })
    }

    //hooks
    useEffectOnce(() => {
        fetchData()
    }, [])
    return (
        <div> {isBusy && <BusyIndicator />}
            {!isBusy &&
                <Row id="row-for-dropdown"><div id={"drodown-label"} style={{  display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
                    <div>
                        <label>Select Assocaite Name :</label>
                    </div>
                    <div id={"dropdown-control-div"}>
                        <Dropdown onSelect={onSelect} id="d" style={{ marginLeft: '10px', zIndex: '11' }} >
                            <Dropdown.Toggle variant='primary'>
                                {empCodeMapping && empCodeMapping[selected] &&
                                    <>
                                        Emp : {empCodeMapping[selected]?.empName}
                                        || Code : {empCodeMapping[selected]?.uniqueCode}
                                    </>
                                }
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {empCodeMapping && Object.keys(empCodeMapping).map(userkey => {
                                    return (<Dropdown.Item eventKey={userkey} key={userkey}>
                                        <>Emp : {empCodeMapping[userkey].empName} || Code : {empCodeMapping[userkey].uniqueCode}
                                        </>
                                    </Dropdown.Item>)
                                }
                                )}
                            </Dropdown.Menu>
                        </Dropdown></div>
                </div>
                    <div className='home'>

                        <div className='mt-2'>
                            {rewardWon && <WheelHRSelection
                                items={Object.keys(rewards)
                                    .map(x => {
                                        return { ...rewards[x], rewardId: x }
                                    })}
                                selectedItem={rewardWon}
                                isWinner={false} />
                            }
                        </div>
                    </div>
                </Row>

            }
        </div>
    )
}
