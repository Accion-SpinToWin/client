import React, { useEffect, useState } from 'react'
import { Row } from 'react-bootstrap'
import { useLocation, useParams } from 'react-router-dom'
import { BusyIndicator } from '../components/BusyIndicator'
import Confetti from '../components/Confetti'
import Wheel from '../components/Wheel'
import { BASE_URL } from '../constants'
import useSound from 'use-sound';
import winSound from '../utilities/mixkit-video-game-win-2016.wav'
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
    const [winnersRewardRecord, setWinnersRewardRecord] = useState(null);
    const [play] = useSound(winSound,{volume:isWinner ? 0.3 :0.05});
    state?.winnerRewardInHRView?.rewardId && setTimeout(()=>play(),0);
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
                setTimeout(() => { play() }, 5000)
                setTimeout(() => { setSelected(selected) }, 5000);
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
        setIsWinnerWheelOnSpin(true);
        fetch(BASE_URL + `/uniquecode-reward-mapping.json`)
            .then(res => res.json()).then(res => {
                // console.log("uniquecode-reward-mapping" + res);
                let winnersRewardRecord = Object.keys(res).filter(x => res[x].winnerUniqueCode === codeOfWinnerToMonitorByHR).map(x => res[x]);
                winnersRewardRecord = winnersRewardRecord && winnersRewardRecord.splice(-1)[0];
                console.log(winnersRewardRecord);
                setWinnersRewardRecord(winnersRewardRecord)
                // state.winnerRewardInHRView = winnersRewardRecord;
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
                {isWinner && <div style={{ textAlign: 'center' }}>
                    Please click on wheel and wait to see what you won!
                </div>
                }{!isWinner && <div style={{ textAlign: 'center' }}> Winner's reward
                </div>}
            </Row>
                {isWinner && <div><Wheel
                    items={Object.keys(rewards).
                        // filter(x => rewards[x].units !== 0).
                        map(x => {
                            return { ...rewards[x], rewardId: x }
                        })}
                    onSelectItem={onSelectItem}
                    selectedItem={selected}
                    isWinnerWheelOnSpin={isWinnerWheelOnSpin}
                    isWinner={true} />
                    {selected && <div className='selected' >
                        <Confetti />
                        <h4>You Won : {selected?.name}</h4></div>}
                </div>}
                {!isWinner && <div>
                    
                    <Wheel
                        items={Object.keys(rewards)
                            // .filter(x => rewards[x].units !== 0)
                            .map(x => {
                                return { ...rewards[x], rewardId: x }
                            })}
                        onSelectItem={onSelectItem}
                        selectedItem={state?.winnerRewardInHRView}
                        isWinnerWheelOnSpin={isWinnerWheelOnSpin}
                        isWinner={false} />
                    <div className='selected'>
                        {state?.winnerRewardInHRView?.rewardId && <>
                            <Confetti />
                            <h4>Reward Won : {Object.keys(rewards).filter(x => rewards[x].rewardId === state?.winnerRewardInHRView?.rewardId).map(x => rewards[x])[0].name}</h4>
                        </>}
                        {false && winnersRewardRecord?.rewardId && <>
                            <Confetti />
                            <h4>Reward Won : {Object.keys(rewards).filter(x => rewards[x].rewardId === winnersRewardRecord.rewardId).map(x => rewards[x])[0].name}</h4>
                        </>}</div>

                </div>}


            </div>}
        </div>
    )
}
