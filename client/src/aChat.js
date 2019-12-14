import React, {Component} from "react";
import {ActionButton} from "./loginForm";
import axios from "axios";

// gets current site and changes https to wss (exaple: wss://pwa-chat-app.herokuapp.com)
var HOST = window.location.origin.replace(/^https/, 'wss');
var connection = "";
if (process.env.NODE_ENV === 'production') {
    connection = new WebSocket(HOST);
    //console.log("HOST" + HOST);
} else {
    connection = new WebSocket('ws://localhost:5000');
}

export class WebSocketTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: props.email,
            wasSent: false,
        };
    }

    UNSAFE_componentWillMount() {
        connection.onopen = () => {
            //console.log('WebSocket Client Connected');
        };
        connection.onmessage = (message) => {
            //console.log(message.data);
            if (message.data === 'update') {
                this.props.update();
            }
        };
    }

    sendMessageToWs(msg) {
        try {
            connection.send(msg) //send data to the server
        } catch (error) {
            console.log(error) // catch error
        }
    }

    render() {
        if (this.state.wasSent === false && connection.readyState === 1) { //https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
            this.sendMessageToWs(this.props.email);
            this.setState({wasSent: true});
        }

        return (
            <div>
            </div>
        );
    }
}


export class NewChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emails: "",
            chatName: "",
            newchat: props.newchat,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // univerzalni vyhodnoceni toho jakou property vzit
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    closeForm() {
        document.getElementById("myForm").style.display = "none";
    }

    // make POST action ... action="chat/add" method="POST"
    handleSubmit(event) {
        // obezlička na zavření okna po přidání chatu
        let closeFormFunc = this.closeForm;
        let refresh = this.state.newchat;
        event.preventDefault();
        //console.log('Add chat action starting...'.concat(this.state));
        axios.post('/chat/add', this.state)
            .then(function (response) {
                closeFormFunc();
                refresh();
                //alert(response.data);
                //console.log(response.data);
            })
            .catch(function (error) {
                if (error.response) {
                    alert(error.response.data);
                    //console.log(error.response.data);
                }
            });
    }

    render() {
        return (
            <div className="form-popup" id="myForm">
                <form onSubmit={this.handleSubmit} className="form-container">
                    <h1>New chat</h1>

                    <label htmlFor="email"><b>Emails of users</b></label>
                    <input value={this.state.emails} onChange={this.handleChange} type="text"
                           placeholder="email1, email2, ..." name="emails" required/>

                    <label htmlFor="chatName"><b>Chat name</b></label>
                    <input value={this.state.chatName} onChange={this.handleChange} type="text" placeholder="Enter name"
                           name="chatName" required/>

                    <button type="submit" className="btn">Add</button>
                    <button type="button" className="btn cancel" onClick={() => this.closeForm()}>Close</button>
                </form>
            </div>
        )
    };
}

class OutgoingMessage extends React.Component {
    render() {
        return (
            <div className="outgoing_msg">
                <div className="sent_msg">
                    <p>{this.props.message}</p>
                    <span className="time_date">{this.props.dateTime}</span></div>
            </div>
        );
    }
}

class IncomingMessage extends React.Component {
    render() {
        return (
            <div className="incoming_msg">
                <div className="incoming_msg_img"><img
                    src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/></div>
                <div className="received_msg">
                    <div className="received_withd_msg">
                        <p>{this.props.message}</p>
                        <span className="time_date">{this.props.dateTime}</span></div>
                </div>
            </div>
        );
    }
}

class WriteSendMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeChat: props.activeChat,
            sender: props.email,
            message: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    // univerzalni vyhodnoceni toho jakou property vzit
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    sendMessage(event) {
        //console.log('Starting send message...' + this.state.message);
        event.preventDefault();
        let data = {sender: this.state.sender(), message: this.state.message, chatId: this.state.activeChat()}
        //console.log(data);
        axios.post('/message/add', data)
            .then((response) => {
                //console.log(response.data);
                return;
            })
            .catch(function (error) {
                if (error.response) {
                    alert('Send message operation failed: \n' + error.response.data);
                    //console.log(error.response.data);
                }
            });
        this.setState({message: ""});
    }

    render() {
        return (
            <div className="type_msg">
                <form onSubmit={this.sendMessage}>
                    <div className="input_msg_write">
                        <input type="text" name="message" value={this.state.message}
                               onChange={this.handleChange}
                               className="write_msg" placeholder="Type a message"/>
                        <button onClick={this.sendMessage} className="msg_send_btn" type="button"/>
                    </div>
                </form>
            </div>
        );
    }
}


class ChatElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadMessages: props.loadMessages,
            messages: '',
            click: props.click,
            activeChat: props.activeChat,
        };
    }

    render() {
        // the 1st tag is to make it click-able
        return (
            <a href={"/#"} className="active_chat" onClick={() => {
                this.state.click();
                //console.log('AKTIVNI CHAT UVNITR CHAT ELEMENTU: ' + this.state.activeChat());
            }}>
                <div style={{backgroundColor: this.props.chatid === this.state.activeChat() ? "yellow" : ""}}
                     className="chat_list active_chat">
                    <div className="chat_people">
                        <div className="chat_img"><img
                            src="https://ptetutorials.com/images/user-profile.png"
                            alt="profilePic"/></div>
                        <div className="chat_ib" href='/#'>
                            <h5>{this.props.chatname}<span className="chat_date">{this.props.date}</span></h5>
                            <p>{this.props.lastmsg}</p>
                        </div>
                    </div>
                </div>
            </a>
        );
    }
}

// TODO - split parts to make them do what I need
export class aChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: '',
            messages: 'a',
            email: props.email,
            scrollToBottom: true,
            activeChat: ''
        };
        this.loadChats = this.loadChats.bind(this);
        this.loadMessages = this.loadMessages.bind(this);
    }

    getLoadedEmail() {
        return this.state.email;
    }

    click(chatId) {
        //console.log('CLICK... ' + chatId);
        this.setState({activeChat: chatId});
        this.loadMessages(null, chatId);
    }

    getActiveChat() {
        return this.state.activeChat;
    }

    openPopupForm() {
        //console.log('openPopup');
        document.getElementById("myForm").style.display = "block";
    }

    loadMessages(event, chatId) {
        // console.log('load all messages for chatId ' + chatId);
        //  https://stackoverflow.com/questions/41194866/how-to-set-state-of-response-from-axios-in-react
        /*
        * this keyword has a different value depending of where it is called.
        * this in this.setState should refer to the constructor object, and when you call this inside a function,
        *  it refers to the window object. That is why i assigned this to the variable self.
        * */
        var self = this;
        axios.post('/message/getLastFifty', {chatId: chatId})
            .then(function (response) {
                //console.log(JSON.stringify(response.data));
                // automaticke vybrani chatu pri prvnim nacteni
                let activeChat = self.state.activeChat === '' ? chatId : self.state.activeChat;
                self.setState({scrollToBottom: true, messages: response.data, activeChat: activeChat});
                return;
                /**POKUD BYCH POUZIL ARROW FUNKCI Z ES6, je to v pohodě i bez 'var self'
                 *    axios.get('/url')
                 *      .then((response) => {
                 *          console.log(response);
                 *          this.setState({events: response.data})
                 *       })
                 * */
            })
            .catch(function (error) {
                if (error.response) {
                    alert(error.response.data);
                    console.log(error.response.data);
                }
            });
    }

    reloadMessagesIfNotEmpty() {
        if (this.state.activeChat !== '')
            this.loadMessages(null, this.state.activeChat);
    }

    loadChats(event) {
        //console.log('load all chats');
        var self = this;
        axios.get('/chat/getAll', {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.error) {
                console.log(response.error);
                return;
            }
            //console.log(JSON.stringify(response.data));
            if (response.data.length !== self.state.chats.length) {
                self.setState({chats: response.data});
                this.reloadMessagesIfNotEmpty();
                return;
            }

            for (let i = 0; i < response.data.length; ++i) {
                let currChat = response.data[i];
                // console.log( currChat );
                // shoduje se aktualne vybrana polozka s nejakou polozkou chatu co uz mame?
                let savedChat = this.state.chats.find(c => c.id === response.data[i].id);
                // console.log( savedChat  );
                // console.log( JSON.stringify(currChat) === JSON.stringify(savedChat) )

                // pokud se kdykoliv objekty nerovnaji, tak zavolat setState..
                if (JSON.stringify(currChat) !== JSON.stringify(savedChat)) {
                    self.setState({chats: response.data});
                    this.reloadMessagesIfNotEmpty();
                    return;
                }

                // TODO - potom bude jeste problem s refreshem zprav v aktualnim chatu
            }
        });
    }

    render() {
        this.loadChats();
        //console.log('Entering RENDER');

        // jak dosadit v reactu dynamicky elementy do Render metody
        // https://stackoverflow.com/questions/29149169/how-to-loop-and-render-elements-in-react-js-without-an-array-of-objects-to-map
        // ---------------------------- CHATS
        let chatElements = [];
        for (let i = 0; i < this.state.chats.length; i++) {
            //console.log(this.state.chats[i].name + ' ' + this.state.chats[i].lastmsg);
            // pokud ještě VŮBEC nedošlo k načtení message, načti je pro první zobrazený chat
            if (this.state.messages === 'a') {
                this.loadMessages(null, this.state.chats[i].id);
                return null;
            }
            chatElements.push(<ChatElement
                chatname={this.state.chats[i].name}
                date={this.state.chats[i].timestamp}
                lastmsg={this.state.chats[i].lastmsg}
                chatid={this.state.chats[i].id}
                loadMessages={() => this.loadMessages(null, this.state.chats[i].id)}
                key={this.state.chats[i].id} // TOTO JE DULEZITE
                click={this.click.bind(this, this.state.chats[i].id)}
                activeChat={this.getActiveChat.bind(this)}
                // VIZ https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js
                // REACT DIKY TOMU DOKAZE REFRESHNOUT VSE JAK SE PATRI A SLUSI
            />);
        }

        // console.log( 'AKTIVNI CHAT ' + this.state.activeChat);
        // ---------------------------- MESSAGES
        var messageElements = [];
        for (let i = 0; i < this.state.messages.length; i++) {
            if (this.state.messages[i].sender === this.state.email) {
                messageElements.push(<OutgoingMessage
                    message={this.state.messages[i].text}
                    dateTime={this.state.messages[i].time}
                    key={this.state.messages[i].id} // TOTO JE DULEZITE
                    // VIZ https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js
                    // REACT DIKY TOMU DOKAZE REFRESHNOUT VSE JAK SE PATRI A SLUSI
                />);
            } else {
                messageElements.push(<IncomingMessage
                    message={this.state.messages[i].text}
                    dateTime={this.state.messages[i].time}
                    key={this.state.messages[i].id} // TOTO JE DULEZITE
                    // VIZ https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js
                    // REACT DIKY TOMU DOKAZE REFRESHNOUT VSE JAK SE PATRI A SLUSI
                />);
            }
        }

        // SCROLL TO BOTTOM TODO - melo by se predelat dle https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
        const msgWindow = document.getElementById("messageWindow");
        // allow 1px inaccuracy by adding 1
        if (msgWindow !== null) {
            setInterval(() => {
                if (!this.state.scrollToBottom) {
                    const isScrolledToBottom = msgWindow.scrollHeight - msgWindow.clientHeight <= msgWindow.scrollTop;
                    // scroll to bottom if isScrolledToBottom is true
                    if (isScrolledToBottom) {
                        msgWindow.scrollTop = msgWindow.scrollHeight - msgWindow.clientHeight
                    }
                } else {
                    msgWindow.scrollTop = msgWindow.scrollHeight - msgWindow.clientHeight;
                    this.setState({scrollToBottom: false});
                }
            }, 100)
        }

        return (
            <div className="container">
                <h3 className="text-center">aChat</h3>
                <div className="messaging">
                    <div className="inbox_msg">
                        <div className="inbox_people">
                            <div className="headind_srch">
                                <div className="recent_heading">
                                    <h4>{this.props.name}</h4>
                                </div>
                                <ActionButton
                                    onClick={() => this.openPopupForm()}
                                    text={'New chat'}
                                />
                            </div>
                            <div className="inbox_chat">
                                {chatElements}
                            </div>
                        </div>
                        <div className="mesgs">
                            <div className="msg_history" id="messageWindow">
                                {messageElements}
                            </div>
                            <WriteSendMessage
                                activeChat={this.getActiveChat.bind(this)}
                                email={this.getLoadedEmail.bind(this)}
                            />
                        </div>
                    </div>
                    <ActionButton
                        onClick={() => this.props.logout()}
                        text={'Logout'}
                    />
                    <NewChat
                        id="myForm"
                        newchat={this.loadChats}
                    />
                </div>
                <WebSocketTest
                    email={this.state.email}
                    update={() => this.forceUpdate()}
                />
            </div>
        );
    }

}