import { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { login } from '../utils/auth'

import { Container, Card, Form, Alert } from 'react-bootstrap'
import OrangeButton from '../components/OrangeButton'

import styled from 'styled-components'

const CenteredContainer = styled(Container)`
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
`
const StyledCard = styled(Card)`
	min-width: 325px;
`

const LoginCard = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(false)
	const handleChangeUser = (event) => {
		setUsername(event.target.value)
	}
	const handleChangePass = (event) => {
		setPassword(event.target.value)
	}
	const handleSubmit = async (event) => {
		event.preventDefault()
		const url = `${process.env.API_URL}/api/login`
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			})
			if (response.ok) {
				const token = await response.json()
				login(token)
			} else {
				console.log('Login failed.')
				let error = new Error(response.statusText)
				console.log(error)
				setError(true)
			}
		} catch (error) {
			console.error(
				'You have an error in your code or there are Network issues.',
				error
			)
			throw new Error(error)
		}
	}
	const closeAlert = () => {
		setError(false)
	}

	return (
		<StyledCard>
			<Card.Header>
				<div className='text-center font-weight-bold'>
					OTOG - One Tambon One Grader
				</div>
			</Card.Header>
			<Card.Body>
				{error && (
					<Alert variant='danger' dismissible onClose={closeAlert}>
						<strong>Login Failed !</strong>
						<br />
						Username หรือ Password
						<br />
						ไม่ถูกต้อง
					</Alert>
				)}
				<Form onSubmit={handleSubmit}>
					<Form.Control
						type='username'
						name='username'
						value={username}
						onChange={handleChangeUser}
						placeholder='Username'
						required
					/>
					<br />
					<Form.Control
						type='password'
						name='password'
						value={password}
						onChange={handleChangePass}
						placeholder='Password'
						required
					/>
					<br />
					<br />
					<OrangeButton size='lg' type='submit' block>
						Sign in
					</OrangeButton>
					<OrangeButton size='lg' href='/register' block>
						Register
					</OrangeButton>
				</Form>
			</Card.Body>
		</StyledCard>
	)
}

const Login = () => (
	<CenteredContainer>
		<LoginCard />
	</CenteredContainer>
)

export default Login
