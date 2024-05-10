import { Component } from "react";
import "./Welcome.css";

class WelcomeData extends Component{
    render(){
        return(
            <div className={this.props.className}>
                <div className="intro-text">
                    <h2>{this.props.heading}</h2>
                    <p>{this.props.text}</p>
                </div>

                <div className="image">
                    <img src={this.props.img1} alt="fimage" />
                    <img src={this.props.img2} alt="fimage" />
                </div>
            </div>
        )
    }
}

export default WelcomeData;