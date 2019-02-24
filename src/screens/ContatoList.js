import React, { Component } from 'react';
import { View, Text, StyleSheet,FlatList, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { getContactList, createChat,setActiveChat } from '../actions/ChatActions';
import ContatoItem from '../components/ContatoList/ContatoItem';


export class ContatoList extends Component {

	static navigationOptions = {
        title:'',
        tabBarLabel:'Contatos',
		header:null
		
	}

	constructor(props) {
		super(props);
		this.state = {
			loading:true
		};
		this.props.getContactList(this.props.uid,()=>{
			this.setState({loading:false});	
		});
		this.contatoClick = this.contatoClick.bind(this);
	}

	contatoClick(item){
		let found = false;
		let chatFound = '';
		//alert('QT:'+this.props.chats.lenght);
		for(let i in this.props.chats){
			if (this.props.chats[i].other == item.key){
				found = true;
				chatFound = this.props.chats[i].key;
			}
		}
		if (found == false){
			//cria o chat 
			this.props.createChat( this.props.uid, item.key );
			// manda para a tela de lista de chat
			this.props.navigation.navigate('ConversasStack');
	
		} else {
			this.props.setActiveChat(chatFound);
		}
	
	}

	render() {
		return (
			<View style={styles.container}>
				{this.state.loading && <ActivityIndicator size="large"/> }
				<FlatList 
					data={this.props.contacts}
					renderItem={({item}) => <ContatoItem data={item} onPress={this.contatoClick} />}
				/>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container:{
		margin:10
	}
});

const mapStateToProps = (state) => {
	return {
		uid:state.auth.uid,
		contacts:state.chat.contacts,
		chats:state.chat.chats
	};
};

const ContatoListConnect = connect(mapStateToProps, {getContactList, createChat, setActiveChat })(ContatoList);
export default ContatoListConnect;



