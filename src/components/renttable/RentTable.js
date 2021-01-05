import React from 'react'
import Card from 'react-bootstrap/Card'
import rentTableStyleSheet from './RentTableStyleSheet'
import Button from 'react-bootstrap/Button'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import enums from '../config/Enums'
import { CircularProgress } from '@material-ui/core';

const RentTable = ({ updateMode, totalBalance, tenantsData, onSelectTenant }) => {

    let serialNumber = 0;

    return (
        <div className="d-flex flex-column" style={rentTableStyleSheet.container}>
        <Card className="m-3 h-100">
            <div className="d-flex flex-row p-3 align-items-center justify-content-between w-100" style={rentTableStyleSheet.header}>
                <div className="d-flex flex-row align-items-center">
                    <div className="mr-3 font-weight-bold">Create Tenant</div>
                    <Button onClick={() => updateMode(enums.mode.CREATE, true)} >+</Button>
                </div>
                <div className="font-weight-bold">Total Balance:  {totalBalance}</div>
            </div>
            {
                !tenantsData
                ? <div className="d-flex h-100 align-items-center justify-content-center"><CircularProgress /></div>
                : (
                    <div style={rentTableStyleSheet.overflowAuto}>
                        <Table className="pt-2">
                            <TableHead>
                                <TableRow>
                                    <TableCell variant="head">Id</TableCell>
                                    <TableCell variant="head">First Name</TableCell>
                                    <TableCell variant="head">Last Name</TableCell>
                                    <TableCell variant="head">Balance</TableCell>
                                    <TableCell variant="head">Move in date</TableCell>
                                    <TableCell variant="head">Due Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    tenantsData.map((data = {}) => {
                                        const { _id, firstName = '', lastName = '', balance = 0, moveInDate, dueDate, rent = 0 } = data
                                        if (_id) {
                                            serialNumber += 1
                                        }
                                        const moveInDateString = moveInDate ? String(moveInDate.split('T')[0]) : ''
                                        const dueDateString = dueDate ? String(dueDate.split('T')[0]) : ''

                                        const notPaid = balance > rent

                                        return (
                                            <TableRow key={_id} hover
                                                style={{ ...rentTableStyleSheet.row, ...notPaid && { ...rentTableStyleSheet.red } }}
                                                onClick={() => onSelectTenant(
                                                    { ...data, moveInDate: moveInDateString, dueDate: dueDateString }
                                                )}>
                                                <TableCell>{serialNumber}</TableCell>
                                                <TableCell>{firstName}</TableCell>
                                                <TableCell>{lastName}</TableCell>
                                                <TableCell>{balance}</TableCell>
                                                <TableCell>{moveInDateString}</TableCell>
                                                <TableCell>{dueDateString}</TableCell>
                                            </TableRow>
                                            )
                                        }
                                    )
                                }
                            </TableBody>
                        </Table>
                    </div>
                )
            }
        </Card>
        </div>
    )
}

RentTable.propTypes = {
    updateMode: PropTypes.func.isRequired,
    totalBalance: PropTypes.number,
    tenantsData: PropTypes.array,
    onSelectTenant: PropTypes.func.isRequired
}

RentTable.defaultProps = {
    totalBalance: 0,
}

export default RentTable;