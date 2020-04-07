import vars from '../styles/vars'
import styled from 'styled-components'
import { darken } from 'polished'

import { Table } from 'react-bootstrap'

const customColor = props =>
	props.acceptState ? vars.accept : props.wrongState && vars.wrong

export const Alink = styled.a`
	color: ${vars.orange};
	&:hover {
		color: ${vars.orange};
		cursor: pointer;
	}
`
export const CuntomP = styled.p`
	color: ${vars.orange};
	&:hover {
		color: ${vars.orange};
		cursor: pointer;
	}
`
export const CustomTr = styled.tr`
	background: ${customColor};
	&:hover td {
		background: ${vars.hover};
	}
`
export const CustomTd = styled.td`
	background: ${customColor};
`
const Name = styled.a`
	color: ${props => {
		if (props.score >= 2000) {
			return vars.grandmaster
		} else if (props.score >= 1800) {
			return vars.master
		} else {
			return vars.regular
		}
	}}!important;
`
export const UserTd = props => (
	<td>
		<Name {...props} />
	</td>
)
const CenterTable = styled(Table)`
	text-align: center;
	th,
	a {
		color: ${vars.orange};
		&:hover {
			color: ${vars.orange};
			cursor: pointer;
		}
	}
`
export const CustomTable = props => <CenterTable responsive hover {...props} />
