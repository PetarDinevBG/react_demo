import {Component} from "react";
import Card from "./Card";

export default class Column extends Component{

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
                <h1>{this.props.name}</h1>
                <div class=".grid">
                    {this.getCards()}
                </div>

            </div>
        )
    }
}