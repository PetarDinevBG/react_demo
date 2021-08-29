import {Component} from "react";
import Column from './Column.js'
import {Button, Modal} from "react-bootstrap";

//TODO Change data structure for columns and cards
//TODO fix case with duplicate column names
//TODO separate CardView and Board
let cards = []
let cardCounter = 0

export default class Board extends Component {
    constructor(props){
        super(props);
        this.state = {
            showBoard: false,
            cardTitle: "",
            cardDesc:"",
            cardHistory:"",
            cardColumn: "",
            cardViewed: 0,
            colNames : ["To Do", "Progress", "Completed", "Extra"],
            newCard : false
        }
        this.generateTestCards(15)
        this.handleChange = this.handleChange.bind(this);
    }

    handleClose(){
        this.setState({
            showBoard: false,
            cardViewed: 0
        });
        if(this.state.newCard === true){
            cards.pop()
        }
        this.setState({newCard: false})
    }

    handleSave(){
        if(this.state.newCard === false) {
            cards[this.state.cardViewed]["History"].push([cards[this.state.cardViewed]["Title"], cards[this.state.cardViewed]["Desc"], this.state.cardColumn])
        }
        cards[this.state.cardViewed]["Title"] = this.state.cardTitle
        cards[this.state.cardViewed]["Desc"] = this.state.cardDesc
        this.setState({
            newCard: false,
            showBoard: false,
            cardViewed: 0});
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
       let colNamesCopy = this.state.colNames.slice();
        colNamesCopy[colNamesCopy.indexOf(column)] = newName
       this.setState({
           colNames : colNamesCopy
       })
    }

    generateTestCards(n){
        cards = []
        if(cards.length <= 0){
            for (let i=0; i<n;i++){
                cards.push({"cardID": i,"column": this.state.colNames[Math.floor(Math.random() * this.state.colNames.length)],
                    "Title": "Card" + i, "Desc": "This is Card"+ i, "History": []})
            }
        }
        cardCounter = cards.length
        return cards
    }

    //TODO fix card ID numbering
    addNewCard(column){
        this.setState({newCard: true})
        cards.push({"cardID": cardCounter,"column": column,
            "Title": "New Card " + cardCounter, "Desc": "New Card desc "+ cardCounter, "History": []})
        this.goToCardView(cardCounter)
        cardCounter++;
    }

    deleteCard(cardID){
        //TODO Perhaps move cards into the state or as prop
        cards = cards.filter(e => e.cardID !== cardID);
        this.forceUpdate();
    }

    //TODO fix card ID numbering
    goToCardView(cardID){
        const cardPosition = this.getCardPosition(cardID);
        this.setState({
            cardTitle: cards[cardPosition]["Title"],
            showBoard: true,
            cardDesc: cards[cardPosition]["Desc"],
            cardHistory: cards[cardPosition]["History"],
            cardViewed: cardPosition,
            cardColumn: cards[cardPosition]["column"]
        });
    }

    getCardPosition(cardID){
        for(let i=0; i<cards.length; i++){
            if(cards[i].cardID === cardID){
                return i;
            }
        }
        console.log("Card Doesn't exist, check code!")
        return 0;
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
        for(let i=0; i<this.state.colNames.length; i++) {
            columns.push(<Column key={this.state.colNames[i]} name={this.state.colNames[i]} cards={this.getColCards(this.state.colNames[i])}
                                 goToCardView={(cardID) => this.goToCardView(cardID)}
                                 changeColName={(column, newName) => this.changeColumnName(column, newName)}
                                 addNewCard={(column) => this.addNewCard(column)}
                                 removeColumn={(column) => this.removeColumn(column)}
                                 deleteCard={(cardID) => this.deleteCard(cardID)}/>)
        }
        return columns
    }

    addNewColumn(){
        if(!this.state.colNames.includes("New Column")){
            this.state.colNames.push("New Column")
        }
        this.forceUpdate()
    }

    removeColumn(column){
        let newColumns = this.state.colNames.filter(e => e !== column);
        console.log(newColumns)
        this.setState({colNames: newColumns});
        let newCards = []
        for (let i=0; i<cards.length;i++){
            if(cards[i]["column"] !== column){
                newCards.push(cards[i])
            }
        }
        cards = newCards;
        console.log(this.state.colNames)
    }

    render() {
        return (
            <>
                <div className="wrapper-container" style={{ display: !this.state.showBoard ? "block" : "none" }}>
                    <div className="add-column-wrapper">
                        <Button variant="primary" onClick={() => this.addNewColumn()}>
                            Add Column
                        </Button>
                    </div>
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