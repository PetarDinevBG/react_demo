import {Component} from "react";
import {Button, Modal} from "react-bootstrap";

export default class CardHistory extends Component{
    constructor(props) {
        super(props);
        this.state = {
            cardViewed: props.cardViewed,
            card: props.cards[props.cardViewed],
            cardTitle: props.cards[props.cardViewed].Title,
            cardDesc:props.cards[props.cardViewed].Desc,
            cardHistory:props.cards[props.cardViewed].History,
            cardColumn: props.cards[props.cardViewed].column,
            cardTags: this.getTagString(),
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    //TODO Find a better solution to this
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            cardViewed: nextProps.cardViewed,
            card: nextProps.cards[nextProps.cardViewed],
            cardTitle: nextProps.cards[nextProps.cardViewed].Title,
            cardDesc:nextProps.cards[nextProps.cardViewed].Desc,
            cardHistory:nextProps.cards[nextProps.cardViewed].History,
            cardColumn: nextProps.cards[nextProps.cardViewed].column,
            cardTags: this.getTagString(), });

    }

    getTagString(){
        let cardTagsString = "";
        for(let i=0; i<this.props.cards[this.props.cardViewed].Tags.length; i++){
            cardTagsString = cardTagsString + this.props.cards[this.props.cardViewed].Tags[i] + " ";
        }
        return cardTagsString
    }

    render(){
        return(
            <Modal show={this.props.showModal} onHide={() => this.handleClose()}>
                <div style={{textAlign: "center"}}>
                    <Modal.Header>
                        <header>
                            <h1>Card View</h1>
                        </header>
                        <Modal.Title>Card Title: <br/><input  name="cardTitle" value={this.state.cardTitle} onChange={this.handleChange}/></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Card Description: <br/><textarea name="cardDesc" value={this.state.cardDesc} onChange={this.handleChange}/>                        <div>
                        Card History:
                        <br/>
                        {this.props.noCards && <CardHistory history={this.state.card.History}/>}
                        <br/>
                        <div>
                            Card Tags:
                            <br/>
                            <textarea name="cardTags" value={this.state.cardTags} onChange={this.handleChange}/>
                        </div>
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.handleClose()}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => this.props.handleSave(this.state.cardTitle, this.state.cardDesc, this.state.cardTags)}>
                            Save Changes
                        </Button>
                        <Button variant="primary" onClick={() => this.props.handleUndo()}>
                            Undo Last Change
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        )
    }
}