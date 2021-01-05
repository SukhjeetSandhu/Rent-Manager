import React, { useState, useMemo } from 'react'
import tenantFormStyleSheet from './TenantFormStyleSheet'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types';
import enums from '../config/Enums'
import { Divider, TextField, Checkbox } from '@material-ui/core';
import moment from 'moment';

const TenantForm = ({ mode, tenantData, onCreateTenant, onUpdateTenant, updateMode }) => {

    const getInitialValues = () => {
        const today = new Date()
        const moveInDate = moment(today).format('YYYY-MM-DD')
        let dueDateMonth = today.getMonth()
        let dueDateyear = today.getFullYear()
        if (dueDateMonth === 11) {
            dueDateMonth = 0
            dueDateyear += 1
        } else {
            dueDateMonth += 1
        }
        const dueDate = moment(new Date(dueDateyear, dueDateMonth, 1)).format('YYYY-MM-DD')
        return { moveInDate, dueDate }
    }

    const [initialState] = useState(() => ({...getInitialValues(), ...tenantData}))
    const [state, setState] = useState(initialState)
    const [amountPaying, setAmountPaying] = useState(0)
    const [footerButtonName, setFooterButtonName] = useState('')
    const [shouldProrate, setProrateState] = useState(false)

    const { balance = 0, firstName = '', lastName = '', period = 'Month', rent = '',
            moveInDate = '', dueDate = '', emailId = '', contactNumber = '' } = state;

    const isValid = useMemo(() => {
        if (JSON.stringify(state) !== JSON.stringify(initialState) && firstName && lastName && rent
            && moveInDate && dueDate) {
            return true
        };
        return false;
    }, [JSON.stringify(state)])

    const name = useMemo(() => {
        if (mode === enums.mode.CREATE) {
            setFooterButtonName('Create')
            return 'Create Tenant'
        }
        setFooterButtonName('Save')
        return `${firstName} ${lastName}`
    }, [firstName, lastName, mode])

    const getProratedRent = (value) => {
        const moveInDateDetails = moveInDate.split('-')
        const moveInDay = moveInDateDetails[2]
        let updatedBalance = Number(value)
        if (moveInDay !== 1) {
            const numberOfDays = new Date(Number(moveInDateDetails[0]), Number(moveInDateDetails[1]), 0).getDate()
            const dailyRate = updatedBalance / numberOfDays
            updatedBalance = dailyRate * (numberOfDays - Number(moveInDay) + 1)
        }
        return updatedBalance
    }

    const onChange = (field, value) => {
        let updatedState = {...state, [field]: value}
        if (field === 'rent' && mode === enums.mode.CREATE) {
            let updatedBalance = value
            if (shouldProrate) {
                updatedBalance = getProratedRent(value)
            } 
            updatedState = {...updatedState, balance: updatedBalance, [field]: Number(value)}
        }
        setState(updatedState)
    }

    const onPay = (value) => { setState({ ...state, balance: balance - value }) }

    const onsubmit = () => {
        if (mode === enums.mode.CREATE) {
            onCreateTenant(state)
        } else {
            onUpdateTenant(state)
        }
    }

    const onProrateStateChange = (prorateStateValue) => {
        if (balance) {
            let updatedState = { ...state }
            if (prorateStateValue) {
                updatedState = { ...updatedState, balance: getProratedRent(rent) }
            } else {
                updatedState = { ...updatedState, balance: rent }
            }
            setState(updatedState)
        }
        setProrateState(prorateStateValue)
    }

    return (
        <div style={tenantFormStyleSheet.container}>
            <Card className="m-3 h-100">
                <div className="d-flex flex-column flex-grow-1 flex-shrink-1 flex-basis-0 w-100 justify-content-between">
                    <div className="d-flex flex-row p-3 align-items-center justify-content-between w-100" style={tenantFormStyleSheet.header}>
                        <div className="mr-5 font-weight-bold">{name}</div>
                        <div className="font-weight-bold">Owes:  {balance}</div>  
                    </div>
                    <div className="d-flex flex-grow-1 flex-shrink-1 flex-basis-0 w-100">
                        <div className="d-flex flex-column col-7 mr-2">
                            <div className="d-flex flex-row">
                                <div className="mr-1 col-6">
                                    <TextField
                                        className="w-100"
                                        label="First Name"
                                        required
                                        value={firstName}
                                        onChange={(event) => onChange('firstName', event.target.value)}
                                    />
                                </div>
                                <div className="ml-1 col-6">
                                    <TextField
                                        className="w-100"
                                        label="Last Name"
                                        value={lastName}
                                        required
                                        onChange={(event) => onChange('lastName', event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-row mt-5">
                                <div className="mr-1 col-6">
                                    <TextField
                                        className="w-100"
                                        label="Email id"
                                        value={emailId}
                                        onChange={(event) => onChange('emailId', event.target.value)}
                                    />
                                </div>
                                <div className="ml-1 col-6">
                                    <TextField
                                        className="w-100"
                                        label="Contact Number"
                                        value={contactNumber}
                                        type="number"
                                        onChange={(event) => onChange('contactNumber', event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-row mt-5">
                                <div className="mr-1 col-6">
                                    <TextField
                                        className="w-100"
                                        label="Move in date"
                                        value={moveInDate}
                                        required
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(event) => onChange('moveInDate', event.target.value)}
                                    />
                                </div>
                                <div className="ml-1 col-6">
                                    <TextField
                                        className="w-100"
                                        label="Due Date"
                                        disabled
                                        value={dueDate}
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-end mt-5">
                                <div className="d-flex flex-row align-items-center mr-1 col-6">
                                    <div style={tenantFormStyleSheet.boldText}>Period:</div>&ensp;
                                    <div>{period}</div>
                                </div>
                                <div className="ml-1 col-6">
                                    <TextField
                                        className="w-100"
                                        label="Rent"
                                        required
                                        value={rent}
                                        type="number"
                                        onChange={(event) => onChange('rent', event.target.value)}
                                    />
                                </div>
                            </div>
                            {
                                mode === enums.mode.CREATE
                                && (
                                    <div className="d-flex flex-row mt-5 align-items-center">
                                        <div>Should Prorate</div>
                                        <Checkbox
                                            className="ml-1"
                                            value={shouldProrate}
                                            disabled={mode !== enums.mode.CREATE}
                                            onChange={(event) => onProrateStateChange(event.target.checked)}
                                        />
                                    </div>
                                )
                            }
                        </div>
                        <Divider orientation="vertical" />
                        <div className="d-flex flex-column col-5">
                            {
                                mode === enums.mode.EDIT
                                && (
                                    <Card className="m-3 p-3">
                                        <div className="d-flex flex-column h-100 w-100 justify-content-between">
                                            <div className="mr-5 font-weight-bold">Payment</div>
                                            <div className="w-100 mt-3 d-flex justify-content-center">
                                                <TextField
                                                    className="w-50"
                                                    label="Amount"
                                                    type="number"
                                                    value={amountPaying}
                                                    onChange={(event) => setAmountPaying(event.target.value)}
                                                />
                                            </div>
                                            <div className="d-flex justify-content-end mt-3">
                                                <Button className="px-3 py-1" disabled={!amountPaying} onClick={() => onPay(amountPaying)}>Pay</Button>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-end p-3">
                    <Button className="px-3 py-1 mr-3"
                        onClick={() => updateMode(enums.mode.NORMAL, true)} >Cancel</Button>
                    <Button disabled={!isValid} className="px-3 py-1" onClick={() => onsubmit()} >{footerButtonName}</Button>
                </div>
            </Card>
        </div>
    )
};

TenantForm.propTypes = {
    mode: PropTypes.string,
    tenantData: PropTypes.object,
    onCreateTenant: PropTypes.func.isRequired,
    onUpdateTenant: PropTypes.func.isRequired,
    updateMode: PropTypes.func.isRequired
}

TenantForm.defaultProps = {
    mode: enums.mode.CREATE,
    tenantData: {}
}

export default TenantForm;
