import { useState, useEffect } from 'react'
import {
	Card,
	Accordion,
	Form,
	ButtonToolbar,
	ButtonGroup,
	Table,
	Badge,
	useAccordionToggle,
} from 'react-bootstrap'
import ViewCodeButton from './ViewCodeButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'

const Icon = styled(FontAwesomeIcon)`
	user-select: none;
	cursor: pointer;
`
const MiniSubmission = (props) => {
	const { idContest, idProb, parentCallback } = props
	const userData = useAuthContext()
	const [best, setBest] = useState([])
	const [lastest, setLastest] = useState([])
	const [SC, setSC] = useState('test')

	var waitingData = 0
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/contest/${idContest}/submission?idProb=${idProb}`
			const response = await fetch(url, {
				headers: {
					authorization: userData ? userData.id : '',
				},
			})
			const json = await response.json()
			setBest(json.best_submit)
			setLastest(json.lastest_submit)
			sendData(json.lastest_submit, json.best_submit)
			if (json.lastest_submit[0] !== undefined)
				if (json.lastest_submit[0].status == 0) {
					waitingData = setInterval(fetchNewData, 1000)
				}
		}
		fetchData()
		return function cleanup() {
			clearInterval(waitingData)
		}
	}, [])
	const sendData = (lastest, best) => {
		if (lastest[0] !== undefined)
			parentCallback(lastest[0].score, best[0].idResult)
	}
	/*
    const HideSc = event => {
        this.setState({showSc : event})
    }
    const ShowBest = () => {
        this.setState({showSc : true, SC : this.state.best[0].scode})
    }
    const ShowLast = () => {
        this.setState({showSc : true, SC : this.state.lastest[0].scode })
    }*/
	const fetchNewData = async () => {
		const url = `${process.env.API_URL}/api/contest/${idContest}/submission?idProb=${idProb}`
		const response = await fetch(url, {
			headers: {
				authorization: userData ? userData.id : '',
			},
		})
		const json = await response.json()
		setBest(json.best_submit)
		setLastest(json.lastest_submit)
		sendData(json.lastest_submit, json.best_submit)
		if (json.lastest_submit[0].status == 1) clearInterval(waitingData)
	}

	return (
		<Table size='sm' bordered hover>
			<thead>
				<tr>
					<th>#</th>
					<th>Result</th>
					<th>Score</th>
					<th>Code</th>
				</tr>
			</thead>
			<tbody>
				{lastest.length != 0 ? (
					lastest.map((prob, index) => {
						return (
							<tr key={index}>
								<td>Latest</td>
								<td>{prob.result}</td>
								<td>{prob.score}</td>
								<td>
									<ViewCodeButton mini='true' idResult={prob.idResult} />
								</td>
							</tr>
						)
					})
				) : (
					<tr key={999}>
						<td>Latest</td>
						<td style={{ textAlign: 'center' }}>-</td>
						<td style={{ textAlign: 'center' }}>-</td>
						<td style={{ textAlign: 'center' }}>❌</td>
					</tr>
				)}
				{best.length != 0 ? (
					best.map((prob, index) => {
						return (
							<tr key={index}>
								<td>Best</td>
								<td>{prob.result}</td>
								<td>{prob.score}</td>
								<td>
									<ViewCodeButton mini='true' idResult={prob.idResult} />
								</td>
							</tr>
						)
					})
				) : (
					<tr key={998}>
						<td>Best</td>
						<td style={{ textAlign: 'center' }}>-</td>
						<td style={{ textAlign: 'center' }}>-</td>
						<td style={{ textAlign: 'center' }}>❌</td>
					</tr>
				)}
			</tbody>
		</Table>
	)
}

export default (props) => {
	const { idContest, id_Prob, index, name, whopass, sname } = props
	const userData = useAuthContext()
	const [selectedFile, setSelectedFile] = useState(undefined)
	const [fileName, setFileName] = useState('')
	const [fileLang, setFileLang] = useState('C++')
	const [solved, setSolved] = useState(false)
	const [idBest, setIdBest] = useState(-1)
	const [passed, setPassed] = useState(whopass)

	const CustomToggle = (props) => {
		const [isHidden, setIsHidden] = useState(false)
		const handleClick = useAccordionToggle(props.eventKey, () => {
			setIsHidden(!isHidden)
		})
		return (
			<Accordion.Toggle
				{...props}
				as={Icon}
				className='float-right'
				icon={isHidden ? faChevronDown : faChevronUp}
				onClick={handleClick}
			/>
		)
	}
	const selectFile = (event) => {
		if (event.target.files[0] !== undefined) {
			setSelectedFile(event.target.files[0])
			setFileName(event.target.files[0].name)
		} else {
			setSelectedFile(undefined)
			setFileName('')
		}
	}
	const uploadFile = async (e) => {
		e.preventDefault()
		if (selectedFile === undefined) return false
		const data = new FormData()
		data.append('file', selectedFile)
		data.append('fileLang', fileLang)
		const url = `${process.env.API_URL}/api/upload/${id_Prob}?contest=${idContest}`
		const respone = await fetch(url, {
			method: 'POST',
			headers: {
				authorization: userData ? userData.id : '',
			},
			body: data,
		})
		if (respone.ok) window.location.reload(false)
	}
	const quickResend = async () => {
		if (idBest != -1) {
			const url = `${process.env.API_URL}/api/contest/quickresend`
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id: idBest }),
			})
			if (response.ok) window.location.reload(false)
		}
	}
	const callbackFunc = (ChildData, id) => {
		if (ChildData == 100) setSolved(true)
		setIdBest(id)
	}

	return (
		<Accordion
			as={Card}
			defaultActiveKey='0'
			className='mb-4'
			border={solved && 'success'}
		>
			<Accordion.Toggle as={Card.Header} eventKey='0'>
				<h5>
					<Row xs={1}>
						<Col md>
							Problem {index} : {name}
						</Col>
						<Col xs='auto' className='ml-auto'>
							{solved && <Badge variant='success'>Solved</Badge>}
						</Col>
					</Row>
					ผ่านแล้ว : {passed}
				</h5>
			</Accordion.Toggle>

			<Accordion.Collapse eventKey='0'>
				<Card.Body as={Row}>
					<Col>
						<MiniSubmission
							idContest={idContest}
							idProb={id_Prob}
							parentCallback={callbackFunc}
						/>
					</Col>
					<Col xs={0} lg={1} />
					<Col style={{ maxWidth: '350px' }} className='mx-auto'>
						<Form.File
							as={Col}
							className='mb-4'
							label={fileName || 'Choose file'}
							accept='.c,.cpp'
							onChange={selectFile}
							custom
						/>
						<ButtonToolbar as={Row}>
							<ButtonGroup className='ml-auto mr-4'>
								<a
									className='btn btn-secondary'
									target='_blank'
									href={`${process.env.API_URL}/api/docs/${sname}`}
								>
									View PDF
								</a>
							</ButtonGroup>
							<ButtonGroup className='mr-auto'>
								<OrangeButton type='submit' onClick={uploadFile}>
									Submit
								</OrangeButton>
							</ButtonGroup>
						</ButtonToolbar>
					</Col>
				</Card.Body>
			</Accordion.Collapse>
		</Accordion>
	)
}