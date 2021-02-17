import React from 'react'
import axios from 'axios'
import {Card, Form, Button, Container} from 'react-bootstrap'
import {Navbar, Nav} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Register from './register'

class Login extends React.Component {
    constructor () {
        super();
        this.state = {
            username: "",
            password: "",
            message: "",
            logged: true
        }
    }
    Login = event => {
        const base_url = "http://localhost:2910"
        event.preventDefault()
        let sendData = {
            username: this.state.username,
            password: this.state.password
        }
        let url = base_url + "/login"
        
        axios.post(url, sendData)
        .then(response => {
            this.setState({logged: response.data.logged})
            if (this.state.logged) {
                let user = response.data.data
                let token = response.data.token
                localStorage.setItem("user", JSON.stringify(user))
                localStorage.setItem("token", token)
                this.props.history.push("/")
            } else {
                this.setState({message: response.data.message})
            }
        })
        .catch(error => alert(error))
    }
    render () {
        <Register/>
        return(
            <Container className="container d-flex justify-content-center align-items-center">
                <Card className="col-sm-6 card my-5">
                <Card.Header className="card-header bg-primary text-white text-center">LOGIN</Card.Header>
                <Card.Body>
                    { !this.state.logged ? 
                        (
                            <div className="alert alert-danger mt-1">
                                { this.state.message }
                            </div>
                        ) : null }
                    <Form onSubmit={ev => this.Login(ev)}>
                    <Card.Text>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter Username" value={this.state.username}
                            onChange={ev => this.setState({username: ev.target.value})}/>
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={this.state.password}
                            onChange={ev => this.setState({password: ev.target.value})}
                            autoComplete="false" />
                        </Form.Group>
                    </Card.Text>
                    <Button variant="primary" type="submit">Submit</Button>
                    <Nav.Link><Link to='/register'><strong>Dont have an account? Sign Up</strong></Link></Nav.Link>
                    </Form>
                </Card.Body>
                </Card>
            </Container>
        )
    }
}

export default Login