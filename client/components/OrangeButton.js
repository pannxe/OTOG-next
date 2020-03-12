import vars from '../styles/vars'
import styled from 'styled-components'
import { Button } from 'react-bootstrap'
import { darken, lighten } from 'polished'

export default styled(Button)`
    color: white;
    background: ${vars.orange};
    border: none;
    &:hover {
        background: ${lighten(0.05, vars.orange)};
    }
    &:active, &:focus {
        background: ${darken(0.1, vars.orange)}!important; 
    }
`