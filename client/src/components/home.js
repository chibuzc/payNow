import React,{Component} from 'react';
import './../index.css';
import axios from 'axios';
import { isLoggedIn } from '../helpers/loggedInUser';

class Home extends Component{
    constructor(props){
        super(props)
        this.state = {user: null }
    }

    async componentDidMount(){
    const user = await isLoggedIn()
    this.setState({user})
    }

    render(){
        return(
            <div className = "homepage">
                <h2 className= "bounceIn"> Welcome To PayNow </h2>
            </div>
        )
    }
}

export default Home