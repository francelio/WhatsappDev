import React, { Component } from 'react';
import { View, Platform, StyleSheet, TouchableHighlight, Image, BackHandler, FlatList, TextInput, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { setActiveChat, sendMenssage, monitorChatOff, monitorChat, sendImage } from '../actions/ChatActions';
import MensagemItem from '../components/ConversaInterna/MensagemItem';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob'

// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
// window.Blob = Blob;

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob;

export class ConversaInterna extends Component {

	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title,
		headerLeft: (
			<TouchableHighlight onPress={() => { navigation.state.params.voltarFunction() }}
				underlayColor={false}>
				<Image
					style={{ width: 25, height: 25, marginLeft: 20 }}
					source={require('../../node_modules/react-navigation/src/views/assets/back-icon.png')}
				/>
			</TouchableHighlight>
		)
	})

	constructor(props) {
		super(props);
		this.state = {
			inputText: '',
			imagetmp: null
		};
		this.voltar = this.voltar.bind(this);
		this.sendMsg = this.sendMsg.bind(this);
		this.chooseImage = this.chooseImage.bind(this);


	}
	componentDidMount() {
		this.props.navigation.setParams({ voltarFunction: this.voltar });
		// add funcao no botao voltar do hardware
		BackHandler.addEventListener('hardwereBackPress', this.voltar);

		//ao entrar na conversa inicializa o monitorar para novas mensagens
		this.props.monitorChat(this.props.activeChat);
	}

	componentWillMount() {
		// ao sair da tela remover o evento
		BackHandler.removeEventListener('hardwereBackPress', this.voltar);


	}

	voltar() {
		// ao sair da tela de conversa desativa o monitoramento daquele chat	
		this.props.monitorChatOff(this.props.activeChat);


		this.props.setActiveChat('');
		this.props.navigation.goBack();
		return true;// para nao fechar o app
	}

	sendMsg() {
		let txt = this.state.inputText;

		let state = this.state;
		state.inputText = '';
		this.setState(state);

		this.props.sendMenssage('text', txt, this.props.uid, this.props.activeChat);

	}

	chooseImage() {
		const options = {
			title: 'Selecione a foto',
			//customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
		};


		ImagePicker.showImagePicker(options, (response) => {



			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				let uri = response.uri.replace('file://', '');

				RNFetchBlob.fs.readFile(uri, 'base64')
					.then((data) => {
						return RNFetchBlob.polyfill.Blob.build(data, { type: 'image/jpeg;BASE64' });
					})
					.then((blob) => {
						this.props.sendImage(blob, () => { });
					});

				// You can also display the image using data:
				const source = { uri: 'data:image/jpeg;base64,' + response.data };

				this.setState({
					imagetmp: source,
				});
			}
		});
	}

	render() {
		let AreaBehavior = Platform.select({ ios: 'padding', android: null });
		let AreaOffeset = Platform.select({ ios: 64, android: null });

		return (
			// eventos para tratar scroll para enviar ver sempre a ultima mensagem 
			// ref
			// onContentSizeChange
			// onLayout

			<KeyboardAvoidingView style={stylessss.container} behavior={AreaBehavior} keyboardVerticalOffset={AreaOffeset}>
				<FlatList
					ref={(ref) => { this.chatArea = ref }}
					onContentSizeChange={() => { this.chatArea.scrollToEnd({ animated: true }) }}
					onLayout={() => { this.chatArea.scrollToEnd({ animated: true }) }}

					style={stylessss.chatArea}
					data={this.props.activeChatMenssages}
					renderItem={({ item }) => <MensagemItem data={item} me={this.props.uid} />}
				/>
				<View style={stylessss.imageTmp}>
					<Image style={stylessss.imageTmpImage} source={this.state.imagetmp} />
				</View>
				<View style={stylessss.sendArea}>
					<TouchableHighlight style={stylessss.imageButton} underlayColor={false} onPress={this.chooseImage}>
						<Image style={stylessss.imageBtnImage} source={require('../assets/images/new_image.png')} />
					</TouchableHighlight>
					<TextInput style={stylessss.sendInput} value={this.state.inputText} onChangeText={(inputText) => this.setState({ inputText })} />
					<TouchableHighlight style={stylessss.sendButton} underlayColor={false} onPress={this.sendMsg}>
						<Image style={stylessss.sendImage} source={require('../assets/images/send.png')} />
					</TouchableHighlight>
				</View>
			</KeyboardAvoidingView >
		);
	}

}

const stylessss = StyleSheet.create({
	container: {
		flex: 1
	},
	chatArea: {
		flex: 1,
		backgroundColor: '#CCCCCC'

	},
	sendArea: {
		height: 50,
		backgroundColor: '#EEEEEE',
		flexDirection: 'row',
	},
	sendInput: {
		flex: 1
	},
	sendButton: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',

	},
	sendImage: {
		width: 48,
		height: 48,
	},
	imageButton: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	imageBtnImage: {
		width: 48,
		height: 48,
	},
	imageTmp: {
		height: 100,
		backgroundColor: '#DDDDDD'
	},
	imageTmpImage: {
		width: 100,
		height: 100,
	}
});

const mapStateToProps = (state) => {
	return {
		status: state.auth.status,
		uid: state.auth.uid,
		activeChat: state.chat.activeChat,
		activeChatMenssages: state.chat.activeChatMenssages,
	};
};

const ConversaInternaConnect = connect(mapStateToProps, { setActiveChat, sendMenssage, monitorChatOff, monitorChat, sendImage })(ConversaInterna);
export default ConversaInternaConnect;