import {Component} from "react";
import Column from './Column.js'
import {Button, Modal} from "react-bootstrap";
//TODO Change data structure for columns and cards
//TODO fix case with duplicate column names
let colNames = ["To Do", "Progress", "Completed", "Extra"]
let cards = []

export default class Board extends Component {
    constructor(props){
        super(props);
        this.generateTestCards(15)
        console.log(cards)
        this.state = {
            showBoard: false,
            cardTitle: "",
            cardDesc:"",
            cardHistory:"",
            cardColumn: "",
            cardViewed: 0
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleClose(){
        this.setState({
            showBoard: false,
            cardViewed: 0
        });
    }

    handleSave(){
        cards[this.state.cardViewed]["Title"] = this.state.cardTitle
        cards[this.state.cardViewed]["Desc"] = this.state.cardDesc
        cards[this.state.cardViewed]["History"].push([this.state.cardTitle, this.state.cardDesc, this.state.cardColumn])
        this.handleClose()
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    //TODO Fix ugly method
    changeColumnName(column, newName){
       for(let i=0; i<cards.length;i++){
           if(cards[i].column === column) {
               cards[i].column = newName;
           }
           for(let j=0; j<cards[i].History.length;j++){
               console.log(cards[i]["History"][j][2])
               if(cards[i]["History"][j][2] === column){
                   cards[i]["History"][j] = [cards[i]["History"][j][0], cards[i]["History"][j][1], newName];
               }
           }
       }
        colNames[colNames.indexOf(column)] = newName
    }

    generateTestCards(n){
        cards = []
        if(cards.length <= 0){
            for (let i=0; i<n;i++){
                cards.push({"cardID": i,"column": colNames[Math.floor(Math.random() * colNames.length)], "Title": "Card" + i, "Desc": "This is Card"+ i, "History": []})
            }
        }
        return cards
    }

    goToCardView(cardID){
        console.log("Card View - Board" + cardID);
        this.setState({
            showBoard: true,
            cardTitle: cards[cardID]["Title"],
            cardDesc: cards[cardID]["Desc"],
            cardHistory: cards[cardID]["History"],
            cardViewed: cardID,
            cardColumn: cards[cardID]["column"]
        });
    }

    getColCards(colName){
        let colCards = []
        for (let i=0; i<cards.length;i++){
            if(cards[i]["column"] === colName){
                colCards.push(cards[i])
            }
        }
        return colCards;
    }

    getColumns(){
        let columns = []
        for(let i=0; i<colNames.length; i++) {
            columns.push(<Column name={colNames[i]} cards={this.getColCards(colNames[i])} goToCardView={(cardID) => this.goToCardView(cardID)} changeColName={(column, newName) => this.changeColumnName(column, newName)}/>)
        }
        return columns
    }
    render() {
        return (
            <>
            <div className="wrapper-container" style={{ display: !this.state.showBoard ? "block" : "none" }}>
                {this.getColumns()}

            </div>
            <Modal show={this.state.showBoard} onHide={() => this.handleClose()}>
                <Modal.Header>
                    <Modal.Title><input name="cardTitle" type="text" value={this.state.cardTitle} onChange={this.handleChange}/></Modal.Title>
                </Modal.Header>
                <Modal.Body><input name="cardDesc" type="text" value={this.state.cardDesc} onChange={this.handleChange}/></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.handleClose()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => this.handleSave()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
        )
    }
}