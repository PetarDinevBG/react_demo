import {Component} from "react";
import Card from "./Card";

export default class Column extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editColName : false,
            colName : this.props.name
        }

        this.handleChange = this.handleChange.bind(this);
        this.saveColumnName = this.saveColumnName.bind(this);
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
            this.forceUpdate()
        }
    }


    handleColChange(){
        if(this.state.editColName){
            return(<input name="colName" type="text" value={this.state.colName} onChange={this.handleChange} onKeyDown={this.saveColumnName}/>)
        }else{
            return(<h1 onDoubleClick={() => this.handleDoubleClick()}>{this.state.colName}</h1>)
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
            <div class="column container">
                {this.handleColChange()}
                <div class=".grid">
                    {this.getCards()}
                </div>

            </div>
        )
    }
}