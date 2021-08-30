import {Component} from "react";
import Card from "./Card";
import {Button} from "react-bootstrap";
import Draggable from "react-draggable";

export default class Column extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editColName : false,
            colName : this.props.name,
            position : {x:0, y:0}
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleOnStop = this.handleOnStop.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.saveColumnName = this.saveColumnName.bind(this);
    }

    handleClick(){
     this.props.addNewCard(this.state.colName)
    }

    handleDoubleClick(){
        this.setState( {editColName: true});
    }
    //TODO Better transition here
    handleDrag(event){
        this.props.dragColumn(event.pageX, this.props.name)
        this.setState({position : {x:0, y: 0}})
    }

    handleOnStop(){
        this.setState({position : {x:0, y: 0}})
    }
    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    saveColumnName(event){
        if(event.key === "Enter"){
            this.props.changeColName(this.props.name, this.state.colName)
            this.setState( {editColName: false});
        }
    }


    handleColChange(){
        if(this.state.editColName){
            return(<input name="colName" type="text" value={this.state.colName} onChange={this.handleChange} onKeyDown={this.saveColumnName}/>)
        }else{
            return(<Draggable position={this.state.position} axis="x" grid={[100,0]} onStop={this.handleOnStop} onDrag={this.handleDrag}><h1 id="column-handle" onDoubleClick={() => this.handleDoubleClick()}>{this.state.colName}</h1></Draggable>)
        }
    }

    getCards(){
        const cards = []
        for(let i=0; i < this.props.cards.length; i++){
            cards.push(<Card key={this.props.cards[i].cardID} cardInfo={this.props.cards[i]} goToCardView={this.props.goToCardView}
                             deleteCard={(cardID) => this.props.deleteCard(cardID)}
                             moveCard={(cardID, steps) => this.props.moveCard(cardID, steps)}
                             dragCard={(width, cardID) => this.props.dragCard(width, cardID)} />)
        }
        return cards;
    }




    render() {
        return (

            <>
                <div className="column container">
                    <Button variant="primary" onClick={() => this.props.removeColumn(this.state.colName)}>
                        Remove Column
                    </Button>
                        {this.handleColChange()}
                    <div className=".grid">
                        <Button variant="primary" onClick={() => this.handleClick()}>
                            Add Card
                        </Button>
                        {this.getCards()}
                    </div>
                </div>
            </>

        )
    }
}