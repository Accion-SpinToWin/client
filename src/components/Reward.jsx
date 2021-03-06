import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faCheck, faEdit, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'

export const Reward = ({ rewardId, name, units, category, companyIssued, active, addedBy,
    onAdd, onRemove, onTick, onTickAbort, onEdit,
    index, total, editingRewardId, isReadOnly, isAdminView
}) => {
    let [newReward, setnewReward] = useState({
        rewardId: rewardId,
        name: name, units: units,
        category: category, companyIssued: companyIssued, active: active,
        addedBy: addedBy
    })

    return (
        <div>{
            (rewardId !== editingRewardId) && (<Row>
                <Col style={{ textAlign: 'right' }}>{!isReadOnly && <FontAwesomeIcon icon={faTrashCan} onClick={onRemove} />}</Col>
                {!isAdminView && <Col xs={3}>{rewardId}</Col>}
                <Col xs={3}>  {name}  </Col>
                <Col>{units}  </Col>
                <Col>{category}  </Col>
                <Col>{companyIssued}  </Col>
                <Col>{active ? 'Y' : 'N'}  </Col>
                <Col>{addedBy}  </Col>
                <Col>
                    {!isReadOnly && !editingRewardId && <FontAwesomeIcon icon={faEdit} style={{ paddingRight: '5px' }} onClick={onEdit} />}
                    {(!isReadOnly && (index === total - 1) && !editingRewardId) && <FontAwesomeIcon icon={faPlus} onClick={onAdd} />}
                    {/* {rewardId === editingRewardId && <FontAwesomeIcon icon={faCheck} onClick={onAdd} />} */}
                </Col>
            </Row>)}
            {rewardId === editingRewardId && (
                <Row>
                    <Col style={{ textAlign: 'right' }}><FontAwesomeIcon icon={faTimes} onClick={onTickAbort} /></Col>
                    <Col xs={3}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Control type="text" placeholder="reward name" size="sm"
                                value={newReward.name}
                                onChange={(e) => setnewReward({ ...newReward, name: e.target.value })} />
                        </Form.Group></Col>
                    <Col> <Form.Group className="mb-3" controlId="number">
                        <Form.Control type="number" placeholder="10" size="sm" value={newReward.units}
                            onChange={(e) => setnewReward({ ...newReward, units: e.target.value })} />
                    </Form.Group>  </Col>
                    <Col><Form.Group className="mb-3" controlId="category">
                        <Form.Control type="text" placeholder="tickets" size="sm" value={newReward.category}
                            onChange={(e) => setnewReward({ ...newReward, category: e.target.value })} />
                    </Form.Group>   </Col>
                    <Col><Form.Group className="mb-3" controlId="companyIssued">
                        <Form.Control type="text" placeholder="Accion" size="sm" value={newReward.companyIssued}
                            onChange={(e) => setnewReward({ ...newReward, companyIssued: e.target.value })} />
                    </Form.Group>  </Col>
                    <Col>  <Form.Check
                        type={'checkbox'}
                        id={`active`}
                        // label={`active`}
                        checked={newReward.active}
                        onChange={(e) => setnewReward({ ...newReward, active: e.target.checked })}
                    /> </Col>
                    <Col><Form.Group className="mb-3" controlId="addedBy">
                        <Form.Control type="text" placeholder="Admin" size="sm" value={newReward.addedBy}
                            onChange={(e) => setnewReward({ ...newReward, addedBy: e.target.value })} />
                    </Form.Group>  </Col>
                    <Col>
                        {(!isReadOnly && (rewardId === editingRewardId)) && <FontAwesomeIcon icon={faCheck} onClick={() => onTick(newReward)} />}
                    </Col>
                </Row>
            )}
            <div style={{ margin: '0px 75px', borderBottom: '1px solid grey' }}></div>
        </div>
    )
}
