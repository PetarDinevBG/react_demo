import './App.css';
import {Component} from "react";

class ColumnView extends Component{
  render() {
      const cardsLength = this.props.cards.length;
      const cards = []
      for(let i=0; i < cardsLength; i++){
        cards.push(<Card name={this.props.cards[i]} />)
      }
      return (
        <div class="column container" style={{background: "red", maxHeight: "300px", overflow: "scroll"}}>
          <h1>{this.props.name}</h1>
            <div class=".grid">
                {cards}
            </div>

        </div>
    )
  }
}

class Card extends Component{
    render() {
        return(
            <div class="item">
                {this.props.name}
            </div>
        )
    }
}

const columns  = [<ColumnView name="Col1" cards={[1,2,3,4]} />,<ColumnView name="Col2" cards={[1]}/>, <ColumnView name="Col3" cards={[1,2,3,4,5,6,7]}/>, <ColumnView name="Col4" cards={[3,4]}/>];

class App extends Component {
  render() {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 }}>
            {columns}
        </div>
    )
  }
}

export default App;
