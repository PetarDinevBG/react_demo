import {Component} from "react";
// Change test vars

class Card extends Component{

    handleClick(){
        console.log("Button Click");
    }
    render(){
        return(
            <div className="card-wrapper">
                <div className="card-body" onClick={() => this.props.goToCardView(this.props.cardInfo["cardID"])}>
                    <h3>
                        {this.props.cardInfo["Title"]}
                    </h3>
                    <div>
                        {this.props.cardInfo["Desc"]}
                    </div>
                </div>
            </div>
        )
    }
}



export default Card;