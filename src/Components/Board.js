import {Component} from "react";
import Column from './Column.js'
import {Button} from "react-bootstrap";
import CardView from "./CardView.js";

//TODO Change data structure for columns and cards
//TODO fix case with duplicate column names

let cards = []
const initialColumns = ["To Do", "In Progress", "Done"]
let cardCounter = 0
//TODO Change hardcoded column width later
let columnWidth = 300

export default class Board extends Component {
    //TODO separate CardView and Board
    constructor(props){
        super(props);
        this.generateTestCards(8);
        this.state = {
            showModal: false,
            cardViewed: 0,
            colNames : initialColumns,
            newCard : false,
            filter : "",
            stateCards: cards,
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleClose(){
        this.setState({
            showModal: false,
            cardViewed: 0
        });
        if(this.state.newCard === true){
            cards.pop()
        }
        this.setState({newCard: false})
    }

    handleSave(Title, Desc, Tags){
        if(this.state.newCard === false) {
            cards[this.state.cardViewed]["History"].push([cards[this.state.cardViewed]["Title"], cards[this.state.cardViewed]["Desc"], this.state.cardColumn])
        }
        cards[this.state.cardViewed]["Title"] = Title
        cards[this.state.cardViewed]["Desc"] = Desc
        cards[this.state.cardViewed]["Tags"] = Tags.split(" ")
        this.setState({
            newCard: false,
            showModal: false,
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
            showModal: false,
            cardViewed: 0,
            stateCards : this.filterCards(this.state.filter)});
    }

    filterCards(filterWord){
        let filteredCards = []
        for(let i=0; i<cards.length; i++){
            if(cards[i].Title.toLowerCase().startsWith(filterWord.toLowerCase())){
                filteredCards.push(cards[i]);
            }else{
                for(let j=0; j<cards[i].Tags.length; j++){
                    if(cards[i].Tags[j].toLowerCase().startsWith(filterWord.toLowerCase())){
                        filteredCards.push(cards[i]);
                    }
                }
            }
        }
        return filteredCards
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value,
            stateCards : this.filterCards(event.target.value)
        });
    }

    //TODO
    dragColumn(width, columnName){
        const newColPosition = width/columnWidth;
        console.log(newColPosition)
        let newColNames = this.state.colNames.filter(e => e !== columnName)
        newColNames.splice(newColPosition, 0, columnName);
        this.setState({colNames : newColNames});
    }

    dragCard(width, cardID){
        const newCardColumnIndex = Math.floor(width/columnWidth)
        const oldCardColumnIndex = this.state.colNames.indexOf(cards[cardID].column)
        const numberOfSteps = newCardColumnIndex - oldCardColumnIndex;
        this.moveCard(cardID, numberOfSteps)
    }

    //TODO Fix ugly method
    changeColumnName(column, newName){
        let i = 1;
        let suffix = ""
        while(this.state.colNames.includes(newName + suffix)){
            suffix = " (" + i + ")"
            i++;
        }
        newName = newName + suffix
       for(let i=0; i<cards.length;i++){
           if(cards[i].column === column) {
               cards[i].column = newName;
           }
           for(let j=0; j<cards[i].History.length;j++){
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
        const randomTags = ["cat", "dog", "mouse"]
        if(cards.length <= 0){
            for (let i=0; i<n;i++){
                cards.push({"cardID": i,"column": initialColumns[Math.floor(Math.random() * initialColumns.length)],
                    "Title": "Test Card " + i, "Desc": "This is a sample description for card "+ i, "History": [], "Tags": [randomTags[i%3]]})
            }
        }
        cardCounter = cards.length
        return cards
    }

    //TODO fix card ID numbering
    addNewCard(column){
        this.setState({newCard: true})
        cards.push({"cardID": cardCounter,"column": column,
            "Title": "New Card " + cardCounter, "Desc": "New Card desc "+ cardCounter, "History": [], "Tags": []})
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
            cardViewed: cardPosition,
            showModal: true,
            cardTags: this.getTagString(cardPosition)
        });
    }

    getCardPosition(cardID){
        for(let i=0; i<cards.length; i++){
            if(cards[i].cardID === cardID){
                return i;
            }
        }
        return 0;
    }

    getTagString(cardPosition){
        let cardTagsString = "";
        for(let i=0; i<cards[cardPosition].Tags.length; i++){
            cardTagsString = cardTagsString + cards[cardPosition].Tags[i] + " ";
        }
        return cardTagsString
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
                                 moveCard={(cardID, steps) => this.moveCard(cardID, steps)}
                                 dragColumn={(width, columnName) => this.dragColumn(width, columnName)}
                                 dragCard={(width, cardID) => this.dragCard(width, cardID)} />)
        }
        return columns
    }

    addNewColumn(){
        let i = 1;
        let suffix = ""
        let colName = "New Column"
        while(this.state.colNames.includes(colName + suffix)){
            suffix = " (" + i + ")"
            i++;
        }
        colName = colName + suffix
        let colNamesCopy = this.state.colNames.slice();
        colNamesCopy.push(colName)
        this.setState({colNames: colNamesCopy})
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
            <div className="body-wrapper" >

                <div className="wrapper-container" style={{ display: !this.state.showModal ? "block" : "none" }}>
                    <header>
                        <h1>Kanban Board</h1>
                    </header>
                    <div className="add-column-wrapper">
                        <Button variant="primary" onClick={() => this.addNewColumn()}>
                            Add Column
                        </Button>
                        Filter:
                        <input name="filter" type="text" value={this.state.filter} onChange={this.handleChange}/>
                    </div>
                    {this.getColumns()}
                    <CardView showModal={this.state.showModal} cardViewed={this.state.cardViewed} cards={cards} noCards={cards.length === 0}
                              handleClose={() => this.handleClose()}
                              handleSave={(Title, Desc, Tags) => this.handleSave(Title, Desc, Tags)}
                              handleUndo={() => this.handleUndo()}/>
                </div>

        </div>
        )
    }
}