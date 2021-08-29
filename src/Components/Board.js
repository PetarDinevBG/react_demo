import {Component} from "react";
import Column from './Column.js'
import {Button, Modal} from "react-bootstrap";

//TODO Change data structure for columns and cards
//TODO fix case with duplicate column names

let cards = []
const initialColumns = ["To Do", "Progress", "Completed", "Extra"]
let cardCounter = 0

export default class Board extends Component {
    //TODO separate CardView and Board
    constructor(props){
        super(props);
        this.generateTestCards(15);
        this.state = {
            showBoard: false,
            cardTitle: "",
            cardDesc:"",
            cardHistory:"",
            cardColumn: "",
            cardViewed: 0,
            colNames : initialColumns,
            newCard : false,
            filter : "",
            stateCards: cards
        }
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
            cardViewed: 0,
            stateCards : this.filterCards(this.state.filter)});
    }

    handleUndo(){
        if(this.state.newCard === true){
            this.handleClose()
        }else if(cards[this.state.cardViewed].History.length !== 0){
            const [title, desc, column] = cards[this.state.cardViewed]["History"].pop()
            cards[this.state.cardViewed]["Title"] = title
            cards[this.state.cardViewed]["Desc"] = desc
            cards[this.state.cardViewed]["column"] = column
        }
        console.log(cards)
        this.setState({
            newCard: false,
            showBoard: false,
            cardViewed: 0,
            stateCards : this.filterCards(this.state.filter)});
    }

    filterCards(filterWord){
        return cards.filter(e => e.Title.startsWith(filterWord));
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value,
            stateCards : this.filterCards(event.target.value)
        });

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
                cards.push({"cardID": i,"column": initialColumns[Math.floor(Math.random() * initialColumns.length)],
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
        this.setState({stateCards : cards});
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
        for (let i=0; i<this.state.stateCards.length;i++){
            if(this.state.stateCards[i]["column"] === colName){
                colCards.push(this.state.stateCards[i])
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
                                 deleteCard={(cardID) => this.deleteCard(cardID)}
                                 moveCard={(cardID, steps) => this.moveCard(cardID, steps)}/>)
        }
        return columns
    }

    addNewColumn(){
        if(!this.state.colNames.includes("New Column")){
            let colNamesCopy = this.state.colNames.slice();
            colNamesCopy.push("New Column")
            this.setState({colNames: colNamesCopy})
        }
    }

    removeColumn(column){
        let newColumns = this.state.colNames.filter(e => e !== column);
        this.setState({colNames: newColumns});
        let newCards = []
        for (let i=0; i<cards.length;i++){
            if(cards[i]["column"] !== column){
                newCards.push(cards[i])
            }
        }
        cards = newCards;
    }

    moveCard(cardID, steps){
        let cardIndex =0;
        for(let i=0; i<cards.length; i++){
            if(cards[i].cardID === cardID){
                cardIndex = i;
            }
        }
        const oldColumnPosition = this.state.colNames.indexOf(cards[cardIndex].column)
        let newColumnPosition = oldColumnPosition + steps;
        if(newColumnPosition >= 0 && newColumnPosition <= this.state.colNames.length - 1){
            cards[cardIndex].column = this.state.colNames[newColumnPosition];
            cards[cardIndex]["History"].push([cards[cardIndex]["Title"], cards[cardIndex]["Desc"], this.state.colNames[oldColumnPosition]])
        }
        this.setState({stateCards : this.filterCards(this.state.filter)});
    }

    render() {
        return (
            <>
                <div className="wrapper-container" style={{ display: !this.state.showBoard ? "block" : "none" }}>
                    <div className="add-column-wrapper">
                        <Button variant="primary" onClick={() => this.addNewColumn()}>
                            Add Column
                        </Button>
                        Filter:
                        <input name="filter" type="text" value={this.state.filter} onChange={this.handleChange}/>
                    </div>
                    {this.getColumns()}

                </div>
            <Modal show={this.state.showBoard} onHide={() => this.handleClose()}>
                <Modal.Header>
                    <Modal.Title><input  name="cardTitle" type="text" value={this.state.cardTitle} onChange={this.handleChange}/></Modal.Title>
                </Modal.Header>
                <Modal.Body><textarea name="cardDesc" type="text" value={this.state.cardDesc} onChange={this.handleChange}/></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.handleClose()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => this.handleSave()}>
                        Save Changes
                    </Button>
                    <Button variant="primary" onClick={() => this.handleUndo()}>
                        Undo Last Change
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
        )
    }
}