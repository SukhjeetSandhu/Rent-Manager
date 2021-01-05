import React, { useEffect, useState } from 'react'
import RentTable from './renttable/RentTable'
import TenantForm from './tenantform/TenantForm'
import { ipcRenderer } from 'electron'
import enums from './config/Enums'
import { Dialog, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';

const App = () => {

	const [tenantsData, setTenantsData] = useState()
	const [selectedTenant, setSelectedTenant] = useState({})
	const [totalBalance, setTotalBalance] = useState(0)
	const [dbError, setDbError] = useState('')

	const [mode, setMode] = useState(enums.mode.NORMAL)

	const updateMode = (updatedMode = enums.mode.NORMAL, shouldClearSelectedTenant = false) => {
		setMode(updatedMode)
		if (shouldClearSelectedTenant) {
			setSelectedTenant({})
		}
	}

	const onCreateTenant = (data) => {
		ipcRenderer.send('tenants:add', data)
		updateMode(enums.mode.NORMAL)
	}

	const onUpdateTenant = (data) => {
		const { _id, ...restData } = data;
		ipcRenderer.send('tenants:update', _id, restData)
		updateMode(enums.mode.NORMAL)
	}

	const onSelectTenant = (data) => {
		setSelectedTenant(data)
		setMode(enums.mode.EDIT)
	}
	
	useEffect(() => {
		ipcRenderer.send('tenants:load')

		ipcRenderer.on('tenants:get', (_, tenants) => {
			const tenantsData = JSON.parse(tenants) || []
			let total = 0
			tenantsData.forEach(({ balance = 0 } = {}) => {
				total = total + balance
			});
			setTotalBalance(total)
			setTenantsData(tenantsData)
		})
	}, [JSON.stringify(tenantsData)])

	ipcRenderer.on('tenants:err', (_, err) => {
		setDbError(err)
		if (!tenantsData) {
			setTenantsData([])
		}
	})

	return (
		<div className='app'>
			{
				mode != enums.mode.NORMAL
				? <TenantForm mode={mode} onCreateTenant={onCreateTenant}tenantData={selectedTenant}
				   	onUpdateTenant={onUpdateTenant} updateMode={updateMode} />
				: <RentTable tenantsData={tenantsData} updateMode={updateMode} totalBalance={totalBalance}
					onSelectTenant={onSelectTenant} />
			}
			<Dialog open={!!dbError} onClose={() => setDbError('')} >
				<DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
        		<DialogContent>
          			<DialogContentText id="alert-dialog-description">
						  {dbError}
          			</DialogContentText>
        		</DialogContent>
			</Dialog>
		</div>
	)
}

export default App
