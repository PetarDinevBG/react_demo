import {Component} from "react";
import Card from "./Card";
import {Button} from "react-bootstrap";
import Draggable from "react-draggable";

export default class Column extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editColName : false,
            colName : this.props.name
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.saveColumnName = this.saveColumnName.bind(this);
    }

    handleClick(){
     this.props.addNewCard(this.state.colName)
    }

    handleDoubleClick(colName){
        this.setState( {editColName: true});
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
            return(<Draggable axis="x"><h1 id="column-handle" onDoubleClick={() => this.handleDoubleClick()}>{this.state.colName}</h1></Draggable>)
        }
    }

    getCards(){
        const cards = []
        for(let i=0; i < this.props.cards.length; i++){
            cards.push(<Card cardInfo={this.props.cards[i]} goToCardView={this.props.goToCardView}/>)
        }
        return cards;
    }




    render() {
        return (

            <>
                <div class="column container">
                        {this.handleColChange()}
                    <div class=".grid">
                        {this.getCards()}
                        <Button variant="primary" onClick={() => this.handleClick()}>
                            Add Card
                        </Button>
                    </div>
                </div>
            </>

        )
    }
}