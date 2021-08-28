import {Component} from "react";
// Change test vars

class Card extends Component{

    render(){
        return(
            <div className="card-wrapper">
                <div className="card-body" onDoubleClick={() => this.props.goToCardView(this.props.cardInfo["cardID"])}>
                    <h3>
                        {this.props.cardInfo["Title"]}
                    </h3>
                    <div>
                        {this.props.cardInfo["Desc"]}
                    </div>
                    <div>
                        {this.props.cardInfo.History}
                    </div>
                </div>
            </div>
        )
    }
}



export default Card;