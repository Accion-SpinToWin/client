import React, { useEffect, useState } from 'react'
import { Row } from 'react-bootstrap'
import { useLocation, useParams } from 'react-router-dom'
import { BusyIndicator } from '../components/BusyIndicator'
import Confetti from '../components/Confetti'
import Wheel from '../components/Wheel'
import { BASE_URL } from '../constants'
import './Home.css'

export const Home = () => {
    let params = useParams();
    const { state } = useLocation();
    let isWinner = false;
    if (params.uniqueCode) {
        isWinner = true;
    }
    let { uniqueCode: winnerUniqueCode } = params;
    let codeOfWinnerToMonitorByHR = state?.uniqueCodeGenerated;
    console.log(winnerUniqueCode);
    console.log("Is Winner ", isWinner);
    console.log(codeOfWinnerToMonitorByHR);

    const [isBusy, setIsBusy] = useState(true);
    const [rewards, setRewards] = useState([])
    const [selected, setSelected] = useState(null);
    const [isWinnerWheelOnSpin, setIsWinnerWheelOnSpin] = useState(false)
    // Functions
    const fetchData = () => {
        setIsBusy(true)
        fetch(BASE_URL + '/rewards.json').then(r => r.json()).then(res => {
            Object.keys(res).map(x => {
                res[x].rewardId = x;
                //return x;
            }
            )
            setRewards(JSON.parse(JSON.stringify(res)));
            setIsBusy(false)
        }).catch(error => {
            console.log("Exception fetching rewards ", error);
            setIsBusy(false)
        })
    }
    const onSelectItem = (selected) => {
        if (isWinner) {
            console.log("Selected reward : ", selected);


            // Update inventory by subtracting available units - onceItem is Selected
            // Add a record which says what uniqueCode won what price , uniquecode-reward-mapping
            let promisesArray = [fetch(BASE_URL + `/uniquecode-reward-mapping.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    winnerUniqueCode: winnerUniqueCode,
                    rewardId: selected.rewardId,
                    insertedAt: new Date()
                })
            }), fetch(BASE_URL + `/rewards/${selected.rewardId}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    units: (+selected.units) - 1
                })
            })]
            Promise.all(promisesArray).then(res => {
                console.log(res);
                setTimeout(() => setSelected(selected), 4000);
            }).catch(e => {
                console.log('Exception encountered while saving uniqueCode-reard mapping');
            })
        }



    }
    // Hooks
    useEffect(() => {
        fetchData()
    }, [])
    const fetchSelectedRewardLive = () => {
        fetch(BASE_URL + `/uniquecode-reward-mapping.json`)
            .then(res => res.json()).then(res => {
                // console.log("uniquecode-reward-mapping" + res);
                let winnersRewardRecord = Object.keys(res).filter(x => res[x].winnerUniqueCode === codeOfWinnerToMonitorByHR).map(x => res[x]);
                winnersRewardRecord = winnersRewardRecord && winnersRewardRecord.splice(-1);
                console.log(winnersRewardRecord);
                // setIsWinnerWheelOnSpin(true);
                // setTimeout(() => {
                //     setIsWinnerWheelOnSpin(false)
                // }, 10000)

            }).catch(e => {
                console.log("Exception at fetching selected reward by winner!", e);
            })
    }
    useEffect(() => {
        if (!isWinner) {
            fetchSelectedRewardLive()
        }
    }, [])

    return (
        <div className='home'>
            {isBusy && <BusyIndicator />} {!isBusy && <div><Row>
                <div>
                    Please click on wheel and wait to see what you won!
                </div>
            </Row>
                {isWinner && <div><Wheel
                    items={Object.keys(rewards).
                        // filter(x => rewards[x].units !== 0).
                        map(x => {
                            return { ...rewards[x], rewardId: x }
                        })}
                    onSelectItem={onSelectItem}
                    selectedItem={selected}
                    isWinnerWheelOnSpin={isWinnerWheelOnSpin} />
                    {selected && <div className='selected'>
                        <Confetti />
                        <h4>You Won : {selected.name}</h4></div>}
                </div>}
                {!isWinner && <div>
                    <Wheel
                        items={Object.keys(rewards)
                            // .filter(x => rewards[x].units !== 0)
                            .map(x => {
                                return { ...rewards[x], rewardId: x }
                            })}
                        onSelectItem={onSelectItem}
                        selectedItem={state.winnerRewardInHRView}
                        isWinnerWheelOnSpin={isWinnerWheelOnSpin} />
                    <div className='selected'>
                        {state?.winnerRewardInHRView?.rewardId && <>
                            <Confetti />
                            <h4>Reward Won : {Object.keys(rewards).filter(x => rewards[x].rewardId === state?.winnerRewardInHRView?.rewardId).map(x => rewards[x])[0].name}</h4>
                        </>}</div>

                </div>}


            </div>}
        </div>
    )
}
