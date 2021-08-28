import {Component} from "react";
import Draggable from "react-draggable";
// Change test vars

class Card extends Component{

    render(){
        return(
            <Draggable>
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
            </Draggable>
        )
    }
}



export default Card;