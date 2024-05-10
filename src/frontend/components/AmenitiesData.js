import { Component } from "react";
import "./Amenities.css";

class AmenitiesData extends Component {
    render() {
        return (
            <div className={this.props.className}>
                <div className="aintro-text">
                    <h2>{this.props.heading}</h2>
                    <p>{this.props.text}</p>
                    <div className="line">
                    </div>
                </div>

                <div className="aimage">
                    <img src={this.props.img1} alt="fimage" />
                    <img src={this.props.img2} alt="fimage" />
                </div>
            </div>
        )
    }
}

export default AmenitiesData;