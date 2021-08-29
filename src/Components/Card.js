import {Component} from "react";
import Draggable from "react-draggable";
import {Button} from "react-bootstrap";

class Card extends Component{
    constructor(props) {
        super(props);
        this.state = {
            position : {x:0, y:0}
        }
    }

    //TODO Max height for description div
    render(){
        return(
            <Draggable position={this.state.position}>
                <div className="card-wrapper">
                    <div className="card-body" onDoubleClick={() => this.props.goToCardView(this.props.cardInfo["cardID"])}>
                        <h3>
                            {this.props.cardInfo["Title"]}
                        </h3>
                        <div style={{whiteSpace: "pre-wrap"}}>
                            {this.props.cardInfo["Desc"]}
                        </div>

                        <div>
                            Tags:
                            <strong>{this.props.cardInfo.Tags}</strong>
                        </div>

                        <Button variant="primary" onClick={() => this.props.moveCard(this.props.cardInfo.cardID, -1)}>
                            Move Left
                        </Button>
                        <Button variant="primary" onClick={() => this.props.deleteCard(this.props.cardInfo.cardID)}>
                            Delete
                        </Button>
                        <Button variant="primary" onClick={() => this.props.moveCard(this.props.cardInfo.cardID, 1)}>
                            Move Right
                        </Button>
                    </div>
                </div>
            </Draggable>
        )
    }
}



export default Card;