import {Component} from "react";


export default class CardHistory extends Component{

    getHistory(){
        let historyList = [<ul className="column-names"><li>Card Title</li> <li>Card Description</li> <li>Card Column</li></ul>]
        for(let i=0; i<this.props.history.length; i++){
            historyList.push(<ul><li>{i}: </li><li>{this.props.history[i][0]}</li> <li>{this.props.history[i][1]}</li> <li>{this.props.history[i][2]}</li></ul>)
        }
        return historyList
    }
    render(){
        return(
            <div className="card-history-list">
                    {this.getHistory()}

            </div>
        )
    }
}