import React, { Component } from 'react';
import { View, Text, StyleSheet,Button } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { signOut } from '../actions/AuthActions';


export class Config extends Component {

	static navigationOptions = {
        title:'',
        tabBarLabel:'Config',
		header:null
	}

	constructor(props) {
		super(props);
		this.state = {};
		this.sair = this.sair.bind(this);
	}
	sair(){
		this.props.signOut();
		// navegando para a tela principal depois de deslogar o usuario
		window.globalNavigator.navigate('Home');

	}
	render() {
		return (
			<View style={styles.container}>
				<Text>Pagina Config </Text>
				<Button title="Sair" onPress={this.sair}/>
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
		status:state.auth.status,
		uid:state.auth.uid
	};
};

const ConfigConnect = connect(mapStateToProps, {signOut  })(Config);
export default ConfigConnect;



